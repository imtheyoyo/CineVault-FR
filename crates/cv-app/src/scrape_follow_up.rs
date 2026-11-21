//! What follows a scrape from any metadata provider: the NFO and the artwork.
//!
//! A scrape from TMDB, OFDb, TVmaze or any other provider ends in the same steps, in this order:
//!
//! 1. the provider IDs are completed (done by the scrape itself, before this runs);
//! 2. a movie whose video sits loose (directly in a library folder, or in a folder shared with
//!    other movies) gets its own folder first, when `library.folder-loose-files` is on: the
//!    folder is created from the folder pattern of the naming profile, and the video and its
//!    companions are moved into it by the renamer's planner, executor and journal (one batch, so
//!    History can undo it). The video is not renamed. When that cannot be done (a file in use, a
//!    folder that belongs to another title, no permission) the scrape is not undone: the steps
//!    below write next to the video as before and Activity says why;
//! 3. the NFO is written by the NFO settings (`metadata.nfo-format`, ...),
//!    next to the video (in its new folder when step 2 moved it), so the title is readable by
//!    Kodi, Jellyfin and Emby at once;
//! 4. the empty artwork types are filled from the enabled artwork providers by the IDs the title
//!    has now (any ID an artwork provider understands, such as an IMDb ID, is enough). When no
//!    artwork provider knows the title, the artwork step outcome says "No artwork provider knows
//!    this title." and Activity shows it as a notice naming the title, as it does a failed
//!    artwork step and an NFO that could not be written.
//!
//! The Undo of a scrape takes step 2 back too ([`ScrapeFollowUp::undo_placement`]): the move is
//! undone through the renamer's journal (its History entry reads "Undone"), the NFO and artwork
//! the scrape wrote into the new folder go to the bin, and the folder goes when it is empty.
//!
//! The steps run in the background and never delay or fail the scrape. The returned task ends
//! when both are over, so the rename step, which moves the folder, can wait for it. A locked
//! title is never scraped, so it never gets here.
//!
//! # The artwork job
//!
//! Once the app has given it its job manager ([`ScrapeFollowUp::set_jobs`]), the artwork step of
//! the titles a scrape writes within a short window is one background job, named in Activity as
//! "Downloading artwork for 8 titles" (spec `job-system`), with its progress, the title being
//! fetched, pause and cancel. Each title's task waits for its own item of that job, so the pin
//! and the order of the steps are as before: the NFO first, then the artwork, then (when renaming
//! is automatic) the rename. A cancelled job leaves the titles it had not started without new
//! artwork and lets their tasks go on; nothing waits forever on a job that is over. A title the
//! job had started finishes its run (in a task of its own that holds the title), so no rename
//! or move of it starts while one of its images is still being written.

use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Arc, Mutex, OnceLock, PoisonError};
use std::time::Duration;

use cv_db::repo::get_item;
use cv_db::repo::step_outcome::step_outcome;
use cv_domain::{Item, ItemDetail, ItemId};
use cv_jobs::{ItemControl, ItemError, ItemWork, JobManager, JobSpec, LaneId};
use tokio::sync::{oneshot, watch};
use tokio::task::JoinHandle;

use crate::app_settings::SettingsService;
use crate::artwork::ArtworkService;
use crate::changes::{ChangeHub, ChangePart, Changes};
use crate::nfo::settings::NfoSettings;
use crate::nfo::{NfoScope, NfoService};
use crate::notices::{AppNotice, NoticeHub, NoticeLevel};
use crate::organize::{
    AppliedStatus, ApplyRequest, OrganizeService, PreviewRequest, RowStatus, Scope,
};
use crate::step_outcomes::{STEP_ARTWORK, StepStatus, now_ms};

/// What the folder step did for one title (see [`ScrapeFollowUp::place_in_folder`]).
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum FolderStep {
    /// Nothing to do: the switch is off, "Metadata only" is on, the title is no movie, or its
    /// video already has a folder of its own.
    NotNeeded,
    /// The movie's own folder was made and its files moved into it. `batch_id` is the journal
    /// batch of the move (History undoes it); `folder` is the new folder, relative to the
    /// library folder, and `location` the same folder as an absolute path.
    Placed {
        batch_id: String,
        folder: String,
        location: PathBuf,
    },
    /// The folder could not be made or the files not moved; nothing moved. The reason is in
    /// plain words and has been told to Activity.
    Failed(String),
}

/// Whether `item` is a movie whose video sits loose: directly in a library folder or in a folder
/// shared with other movies, not a disc, not locked, and in a data source. This is the one
/// criterion of the folder step ([`ScrapeFollowUp::place_in_folder`]); the Scrape preview asks it
/// too, so what it announces is what the step does.
#[must_use]
pub fn is_loose_movie(item: &Item) -> bool {
    !item.core.locked
        && !item.core.data_source.trim().is_empty()
        && matches!(&item.detail, ItemDetail::Movie(movie)
            if movie.multi_movie_dir && !movie.is_disc)
}

/// Whether a Scrape of `item` gives it a folder of its own first: the switch `library.folder-loose-files`
/// is on (and "Metadata only" is not) and the movie is loose. The folder pattern may still keep
/// the step from running when it is applied (a folder that belongs to another title, a file in
/// use); the files are then written next to the video.
#[must_use]
pub fn folder_step_applies(
    values: &std::collections::BTreeMap<String, serde_json::Value>,
    item: &Item,
) -> bool {
    crate::rename_settings::folder_loose_files(values) && is_loose_movie(item)
}

/// What the folder step of a scrape did for a title, kept so the Undo of that scrape can take
/// it back (see [`ScrapeFollowUp::undo_placement`]).
#[derive(Debug, Clone)]
struct Placement {
    /// The journal batch of the move (the renamer's planner, executor and journal).
    batch_id: String,
    /// The movie's new folder, absolute.
    location: PathBuf,
}

/// What undoing the folder step of a scrape did (see [`ScrapeFollowUp::undo_placement`]).
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PlacementUndo {
    /// The scrape moved nothing, or its move is taken back already.
    NothingToUndo,
    /// The video and its companions are back where they were. The NFO and artwork the scrape
    /// wrote into the new folder went to the Recycle Bin / Trash (or CineVault's trash folder)
    /// and the new folder was removed when it was empty.
    Undone,
    /// Nothing was taken back, or only part of it, and nothing was lost: the reason is in plain
    /// words and has been told to Activity. The title's History entry for the move still offers
    /// its own Undo.
    Left(String),
}

/// A follow-up in progress, from [`ScrapeFollowUp::hold`]; it ends when this is dropped.
#[must_use = "the follow-up ends when the hold is dropped"]
pub struct FollowUpHold(Arc<ScrapeFollowUp>);

impl Drop for FollowUpHold {
    fn drop(&mut self) {
        self.0
            .running
            .send_modify(|count| *count = count.saturating_sub(1));
    }
}

/// How long the artwork step waits for more titles of the same scrape before it starts their
/// job, so a batch scrape is one "Downloading artwork for N titles" and not one job per title.
const ARTWORK_BATCH_WINDOW: Duration = Duration::from_millis(400);

/// The lane the artwork jobs run on: a lane of their own, so they never wait behind a scrape.
const ARTWORK_LANE: &str = "artwork";

/// Titles the artwork job fetches at once (the artwork service bounds the downloads further).
const ARTWORK_PARALLELISM: usize = 4;

/// The titles whose artwork step waits for the next job, and who waits for each.
#[derive(Default)]
struct ArtworkBatch {
    items: Vec<ItemId>,
    waiters: HashMap<ItemId, Vec<oneshot::Sender<()>>>,
    /// A job for the batch is about to be submitted.
    scheduled: bool,
}

/// The steps after a scrape, over the app's NFO and artwork services.
pub struct ScrapeFollowUp {
    nfo: Arc<NfoService>,
    artwork: Arc<ArtworkService>,
    settings: Arc<SettingsService>,
    changes: Changes,
    /// Where a step that found nothing or failed is told to Activity, once the app has set it.
    notices: Mutex<Option<Arc<NoticeHub>>>,
    /// How many titles are in their steps now.
    running: watch::Sender<usize>,
    /// The job manager the artwork step runs its jobs on; without one it runs in each title's
    /// own task.
    jobs: OnceLock<JobManager>,
    batch: Mutex<ArtworkBatch>,
    /// The renamer that moves a loose movie into its own folder; without one (set by the app),
    /// a plain one over the library.
    organize: Mutex<Option<Arc<OrganizeService>>>,
    /// The move the folder step made for each title, until its scrape is undone or the title is
    /// scraped again. In memory only, like the copies the Undo of a scrape works from; the
    /// journal batch itself lives on, so History can still undo the move after a restart.
    placed: Mutex<HashMap<ItemId, Placement>>,
    /// Where the files the scrape wrote into a folder it made go when that folder is given up.
    bin: Mutex<Arc<dyn crate::library_ops::SystemBin>>,
}

impl ScrapeFollowUp {
    #[must_use]
    pub fn new(
        nfo: Arc<NfoService>,
        artwork: Arc<ArtworkService>,
        settings: Arc<SettingsService>,
    ) -> Arc<Self> {
        Arc::new(Self {
            nfo,
            artwork,
            settings,
            changes: Changes::default(),
            notices: Mutex::new(None),
            running: watch::channel(0).0,
            jobs: OnceLock::new(),
            batch: Mutex::new(ArtworkBatch::default()),
            organize: Mutex::new(None),
            placed: Mutex::new(HashMap::new()),
            bin: Mutex::new(Arc::new(crate::library_ops::FolderOnly)),
        })
    }

    /// Sets the renamer the folder step moves loose movies with, so the app's poster index and
    /// organize-state cache follow the move (see [`OrganizeService::with_path_observer`]). Without
    /// one the step uses a plain renamer over the library and Settings › Deleted files.
    pub fn set_organize(&self, organize: Arc<OrganizeService>) {
        *self.organize.lock().unwrap_or_else(PoisonError::into_inner) = Some(organize);
    }

    /// Sets the bin the NFO and artwork of an undone folder step go to (the app gives the one of
    /// Settings › Deleted files). Without one, the library folder's trash folder is used.
    pub fn set_bin(&self, bin: Arc<dyn crate::library_ops::SystemBin>) {
        *self.bin.lock().unwrap_or_else(PoisonError::into_inner) = bin;
    }

    fn bin(&self) -> Arc<dyn crate::library_ops::SystemBin> {
        Arc::clone(&self.bin.lock().unwrap_or_else(PoisonError::into_inner))
    }

    fn organize(&self) -> Arc<OrganizeService> {
        let mut slot = self.organize.lock().unwrap_or_else(PoisonError::into_inner);
        Arc::clone(slot.get_or_insert_with(|| {
            Arc::new(
                OrganizeService::new(Arc::clone(&self.nfo.db))
                    .with_choice(Arc::clone(&self.settings)
                        as Arc<dyn crate::deleted_files::DeletedFilesSource>),
            )
        }))
    }

    /// Runs the artwork step of the scraped titles as named background jobs on `jobs`, so
    /// Activity shows "Downloading artwork for 8 titles". Set once, by the app.
    pub fn set_jobs(&self, jobs: JobManager) {
        let _ = self.jobs.set(jobs);
    }

    /// Connects the follow-up to the hub that announces what changed to open pages.
    pub fn set_changes(&self, hub: Arc<ChangeHub>) {
        self.changes.set(hub);
    }

    /// Connects the follow-up to Activity: a step that found nothing or failed is a notice.
    pub fn set_notices(&self, hub: Arc<NoticeHub>) {
        *self.notices.lock().unwrap_or_else(PoisonError::into_inner) = Some(hub);
    }

    fn notify(&self, notice: AppNotice) {
        let hub = self
            .notices
            .lock()
            .unwrap_or_else(PoisonError::into_inner)
            .clone();
        if let Some(hub) = hub {
            hub.publish(notice);
        }
    }

    /// The name Activity uses for the title: "Heat (1995)".
    async fn name_of(&self, item: ItemId) -> String {
        let db = Arc::clone(&self.nfo.db);
        let found = tokio::task::spawn_blocking(move || db.read(|conn| get_item(conn, item))).await;
        match found {
            Ok(Ok(Some(found))) if found.core.year > 0 => {
                format!("{} ({})", found.core.title, found.core.year)
            }
            Ok(Ok(Some(found))) => found.core.title,
            _ => format!("title {}", item.0),
        }
    }

    /// Tells Activity when this run's artwork step found nothing or failed.
    async fn note_artwork(&self, item: ItemId, since_ms: i64) {
        let db = Arc::clone(&self.nfo.db);
        let read = tokio::task::spawn_blocking(move || {
            db.read(|conn| step_outcome(conn, item, STEP_ARTWORK))
        })
        .await;
        let Ok(Ok(Some(outcome))) = read else {
            return;
        };
        // An outcome of an earlier run (the step is off now) says nothing about this one.
        if outcome.at_ms < since_ms {
            return;
        }
        let title = match outcome.status {
            StepStatus::NotFound => "No artwork found after the scrape",
            StepStatus::Failed => "The artwork download after the scrape failed",
            _ => return,
        };
        let name = self.name_of(item).await;
        self.notify(
            AppNotice::new(NoticeLevel::Warning, format!("{title}: {name}"))
                .detail(outcome.reason)
                .source("Artwork"),
        );
    }

    /// Starts the steps for a title a scrape was written into and returns their task. Must be
    /// called inside a tokio runtime.
    pub fn after_match_task(self: &Arc<Self>, item: ItemId) -> JoinHandle<()> {
        let follow_up = Arc::clone(self);
        // Counted before the task starts, so `idle` cannot look over while this title is queued.
        follow_up.running.send_modify(|count| *count += 1);
        // Pinned before the task starts too: no rename or move of the title starts while it is
        // queued or in its steps, since a write would land in the old place or an artwork
        // download would make the old folder again (see `title_guard`). The steps' own writes
        // still hold the title one at a time; the pin only keeps moves and renames out, so the
        // steps never wait on it. A rename or move asking meanwhile is told the title is busy.
        let pin = crate::title_guard::pin(&self.nfo.db, [item]);
        cv_jobs::spawn(async move {
            let show = follow_up.pin_show_of(item).await;
            follow_up.run(item).await;
            drop(show);
            drop(pin);
            follow_up
                .running
                .send_modify(|count| *count = count.saturating_sub(1));
        })
    }

    /// The pin of the show, when `item` is a season or an episode: a title is held by its show.
    async fn pin_show_of(&self, item: ItemId) -> Option<crate::title_guard::TitleGuard> {
        let db = Arc::clone(&self.nfo.db);
        let title =
            tokio::task::spawn_blocking(move || crate::title_guard::title_of(&db, item)).await;
        match title {
            Ok(Ok(title)) if title != item => Some(crate::title_guard::pin(&self.nfo.db, [title])),
            _ => None,
        }
    }

    /// After an undone scrape put the title back in the library: writes its NFO again from the
    /// library, once the steps of the undone scrape (which write the NFO of the other title) are
    /// over, so the file ends up describing the title the library holds. Returns at once; works
    /// from any thread.
    pub fn after_undo(self: &Arc<Self>, item: ItemId) {
        let follow_up = Arc::clone(self);
        cv_jobs::spawn(async move {
            // The steps of the scrape being undone may still be writing; they go first.
            for _ in 0..600 {
                if !follow_up.is_writing(item) {
                    break;
                }
                tokio::time::sleep(std::time::Duration::from_millis(100)).await;
            }
            // The video goes back where the scrape found it first, so the NFO below is written
            // next to it; a move that cannot be taken back leaves everything where it is.
            let _ = follow_up.undo_placement(item).await;
            let pin = crate::title_guard::pin(&follow_up.nfo.db, [item]);
            follow_up.write_nfo(item).await;
            drop(pin);
        });
    }

    /// Takes back what the folder step of the title's last scrape did: the video and its
    /// companions go back to where they were (through the renamer's journal, so the History
    /// entry of the move reads "Undone" too), then the NFO and artwork the scrape wrote into
    /// the new folder go to the Recycle Bin / Trash (or the library folder's trash folder), and
    /// the new folder is removed when it is empty. Waits for the steps of the scrape to be over
    /// first. Nothing is ever deleted: a file that cannot go back, or that changed since, stops
    /// the undo with the reason (told to Activity) and everything stays where it is.
    ///
    /// Safe to call again: a move taken back already, or never made, is [`PlacementUndo::NothingToUndo`].
    /// The Undo of a scrape calls this after it put the title's fields back (see
    /// `MatchService::set_after_undo`), and the Undo of a match entry in History before it
    /// takes the entry back (`MatchService::set_before_undo`).
    pub async fn undo_placement(self: &Arc<Self>, item: ItemId) -> PlacementUndo {
        let Some(placement) = self
            .placed
            .lock()
            .unwrap_or_else(PoisonError::into_inner)
            .remove(&item)
        else {
            return PlacementUndo::NothingToUndo;
        };
        // The steps of the scrape being undone go first: the move is recorded when they begin.
        for _ in 0..600 {
            if !self.is_writing(item) {
                break;
            }
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
        let db = Arc::clone(&self.nfo.db);
        let organize = self.organize();
        let bin = self.bin();
        let kept = placement.clone();
        let result =
            tokio::task::spawn_blocking(move || undo_placed(&db, &organize, &bin, item, &kept))
                .await
                .unwrap_or_else(|error| Err(format!("The undo of the folder stopped: {error}")));
        match result {
            Ok(PlacementUndo::NothingToUndo) => PlacementUndo::NothingToUndo,
            Ok(done) => {
                self.changes.publish_one(item, &[ChangePart::Files]);
                done
            }
            Err(reason) => {
                // Kept, so a later undo can try again.
                self.placed
                    .lock()
                    .unwrap_or_else(PoisonError::into_inner)
                    .insert(item, placement);
                tracing::warn!(item = item.0, %reason, "the folder of a scrape was not given up");
                let name = self.name_of(item).await;
                self.notify(
                    AppNotice::new(
                        NoticeLevel::Warning,
                        format!(
                            "The video of {name} stays in the folder the scrape made for it; \
                             nothing was lost"
                        ),
                    )
                    .detail(format!(
                        "{reason} The move is still listed in History, where it can be undone once this is \
                         settled."
                    ))
                    .source("Scrape"),
                );
                PlacementUndo::Left(reason)
            }
        }
    }

    /// Whether the steps of `item` are queued or run now (its title is pinned): its folder is
    /// not renamed or moved until they are over.
    #[must_use]
    pub fn is_writing(&self, item: ItemId) -> bool {
        crate::title_guard::is_pinned(&self.nfo.db, item)
    }

    /// Counts as one title in its steps until the hold is dropped: a batch waits for it like for
    /// any follow-up, and a rename does not start meanwhile. For other work that writes NFO or
    /// artwork after a scrape, and for tests that need a follow-up that is still writing.
    pub fn hold(self: &Arc<Self>) -> FollowUpHold {
        self.running.send_modify(|count| *count += 1);
        FollowUpHold(Arc::clone(self))
    }

    /// Whether no title is in its NFO or artwork step now.
    #[must_use]
    pub fn is_idle(&self) -> bool {
        *self.running.borrow() == 0
    }

    /// Waits until no title is in its NFO or artwork step. A batch waits for this after its
    /// scrape, before steps that move folders and before it ends.
    pub async fn idle(&self) {
        let mut running = self.running.subscribe();
        let _ = running.wait_for(|count| *count == 0).await;
    }

    /// Runs the steps for one title and waits for them.
    pub async fn run(self: &Arc<Self>, item: ItemId) {
        // The folder first: the NFO and the artwork read the title's paths when they run, so
        // they land in the new folder.
        let _ = self.place_in_folder(item).await;
        self.write_nfo(item).await;
        let since = now_ms();
        self.fill_artwork(item).await;
        self.note_artwork(item, since).await;
    }

    /// Step 2: gives a loose movie its own folder. A movie is loose when its video sits directly
    /// in a library folder or in a folder shared with other movies. The folder is named by the
    /// folder pattern of the active naming profile, rendered with the scraped details; the video
    /// and its companions (subtitles, an NFO and artwork already there) move into it through the
    /// renamer, so the move is journaled, keeps the library paths right and can be undone from
    /// History. The video keeps its name (Rename after Scrape renames it afterwards when it is
    /// on).
    ///
    /// A problem never fails the scrape: the files stay where they were, the next steps write
    /// next to the video as before, and Activity gets a notice with the reason.
    pub async fn place_in_folder(self: &Arc<Self>, item: ItemId) -> FolderStep {
        // What an earlier scrape of the title moved is not this scrape's to undo.
        self.placed
            .lock()
            .unwrap_or_else(PoisonError::into_inner)
            .remove(&item);
        let values = self.settings.snapshot().values;
        if !crate::rename_settings::folder_loose_files(&values) {
            return FolderStep::NotNeeded;
        }
        let db = Arc::clone(&self.nfo.db);
        let loose = tokio::task::spawn_blocking(move || {
            db.read(|conn| get_item(conn, item))
                .map(|found| found.is_some_and(|found| is_loose_movie(&found)))
        })
        .await;
        if !matches!(loose, Ok(Ok(true))) {
            return FolderStep::NotNeeded;
        }
        let organize = self.organize();
        let request = {
            let mut profile = crate::rename_settings::active_profile_from_values(&values);
            // The folder is made even when the profile leaves folders alone, and the video keeps
            // its name: the name is Rename's business.
            profile.movie.rename_folder = true;
            profile.movie.rename_files = false;
            // Subtitles keep the language they are named with: the files are moved, not renamed.
            profile.movie.subtitle_language_style = cv_rename::SubtitleLanguageStyle::Original;
            PreviewRequest {
                scope: Scope::Items(vec![item]),
                profile,
                choices: std::collections::BTreeMap::new(),
            }
        };
        let id = item.0.to_string();
        let outcome = tokio::task::spawn_blocking(move || place(&organize, request, &id)).await;
        let step = match outcome {
            Ok(step) => step,
            Err(error) => FolderStep::Failed(format!("The folder step stopped: {error}")),
        };
        if let FolderStep::Placed {
            batch_id, location, ..
        } = &step
        {
            self.placed
                .lock()
                .unwrap_or_else(PoisonError::into_inner)
                .insert(
                    item,
                    Placement {
                        batch_id: batch_id.clone(),
                        location: location.clone(),
                    },
                );
        }
        if let FolderStep::Failed(reason) = &step {
            tracing::warn!(item = item.0, %reason, "no folder was made for a loose movie");
            let name = self.name_of(item).await;
            self.notify(
                AppNotice::new(
                    NoticeLevel::Warning,
                    format!(
                        "No folder was made for {name}; its NFO and artwork stay next to the video"
                    ),
                )
                .detail(reason.clone())
                .source("Scrape"),
            );
        }
        step
    }

    /// Step 4: fills the title's empty artwork types, as an item of the artwork job when the app
    /// gave one, and waits for it. Returns at once when the after-scrape artwork is off (tests only).
    async fn fill_artwork(self: &Arc<Self>, item: ItemId) {
        if !self.artwork.after_scrape_enabled() {
            return;
        }
        let Some(jobs) = self.jobs.get().cloned() else {
            let _ = self.artwork.fill_after_scrape(item).await;
            return;
        };
        let (done, wait) = oneshot::channel();
        let start = {
            let mut batch = self.batch.lock().unwrap_or_else(PoisonError::into_inner);
            if !batch.items.contains(&item) {
                batch.items.push(item);
            }
            batch.waiters.entry(item).or_default().push(done);
            !std::mem::replace(&mut batch.scheduled, true)
        };
        if start {
            let follow_up = Arc::clone(self);
            cv_jobs::spawn(async move { follow_up.run_artwork_job(jobs).await });
        }
        // Resolves when the job has fetched this title, or when the job is over without it
        // (cancelled): either way the title's other steps go on.
        let _ = wait.await;
    }

    /// Collects the titles of the window, then fetches their artwork as one job and lets every
    /// waiting title go once the job is over.
    async fn run_artwork_job(self: Arc<Self>, jobs: JobManager) {
        tokio::time::sleep(ARTWORK_BATCH_WINDOW).await;
        let (items, waiters) = {
            let mut batch = self.batch.lock().unwrap_or_else(PoisonError::into_inner);
            batch.scheduled = false;
            (
                std::mem::take(&mut batch.items),
                std::mem::take(&mut batch.waiters),
            )
        };
        if items.is_empty() {
            return;
        }
        let db = Arc::clone(&self.nfo.db);
        let ids = items.clone();
        let names = tokio::task::spawn_blocking(move || {
            db.read(|conn| cv_db::repo::lifecycle::lifecycle_rows(conn, &ids))
        })
        .await
        .ok()
        .and_then(Result::ok)
        .unwrap_or_default();
        let titles: Vec<ArtworkTitle> = items
            .iter()
            .map(|id| ArtworkTitle {
                id: *id,
                name: names.get(id).map_or_else(String::new, |row| {
                    if row.year > 0 {
                        format!("{} ({})", row.title, row.year)
                    } else {
                        row.title.clone()
                    }
                }),
            })
            .collect();
        let work = ArtworkJob {
            artwork: Arc::clone(&self.artwork),
            waiters: Arc::new(Mutex::new(waiters)),
            saved: Arc::new(AtomicUsize::new(0)),
        };
        let spec = JobSpec::new(
            crate::wording::job::downloading_artwork(titles.len()),
            LaneId::provider(ARTWORK_LANE),
        )
        .concurrency(ARTWORK_PARALLELISM);
        let waiting = Arc::clone(&work.waiters);
        let job = jobs.submit(spec, work, titles);
        job.wait().await;
        // Whatever the job did not reach (it was cancelled) is let go: its senders are dropped.
        waiting
            .lock()
            .unwrap_or_else(PoisonError::into_inner)
            .clear();
    }

    /// Step 3: writes the title's NFO when the NFO settings want it. A problem is logged; it
    /// never stops the artwork step.
    async fn write_nfo(&self, item: ItemId) {
        let settings = NfoSettings::from_values(&self.settings.snapshot().values);
        let nfo = Arc::clone(&self.nfo);
        let written = tokio::task::spawn_blocking(move || {
            nfo.rewrite(&NfoScope::Items(vec![item]), &settings)
        })
        .await;
        match written {
            Ok(Ok(report)) => {
                if report.totals.changed > 0 {
                    self.changes.publish_one(item, &[ChangePart::Files]);
                }
            }
            Ok(Err(error)) => {
                tracing::warn!(item = item.0, %error, "the NFO was not written after a scrape");
                let name = self.name_of(item).await;
                self.notify(
                    AppNotice::new(
                        NoticeLevel::Warning,
                        format!("The NFO was not written after the scrape: {name}"),
                    )
                    .detail(error.to_string())
                    .source("NFO"),
                );
            }
            Err(error) => tracing::warn!(item = item.0, %error, "the NFO task stopped"),
        }
    }
}

/// Takes the move of `placement` back (blocking): the journal batch first, then the files the
/// scrape wrote into the folder. `Err` carries the reason when something stayed where it was.
fn undo_placed(
    db: &Arc<cv_db::Database>,
    organize: &OrganizeService,
    bin: &Arc<dyn crate::library_ops::SystemBin>,
    item: ItemId,
    placement: &Placement,
) -> Result<PlacementUndo, String> {
    use crate::history::{HistoryService, UndoState};

    let history = HistoryService::new(Arc::clone(db))
        .with_bin(Arc::clone(bin))
        .with_organize(organize.clone());
    // The move is a History entry of its own ("Renamed"): undoing it there marks the entry
    // undone, so it does not offer an Undo for files that are back already.
    let mut taken_back = false;
    match history
        .entry_for_batch(&placement.batch_id)
        .map_err(|e| e.to_string())?
    {
        Some(entry) => {
            let state = history.entry(entry).map_err(|e| e.to_string())?.undo_state;
            if matches!(state, UndoState::Undone) {
                // Undone from History already (or by an earlier try of this).
            } else {
                let report = history.undo(entry).map_err(|e| e.to_string())?;
                if let Some(left) = report.left.first() {
                    return Err(left.reason.clone());
                }
                taken_back = true;
            }
        }
        None => {
            let outcome = organize
                .undo(&placement.batch_id)
                .map_err(|e| e.to_string())?;
            if let Some(problem) = outcome.not_restorable.iter().chain(&outcome.failed).next() {
                return Err(if problem.path.is_empty() {
                    problem.reason.clone()
                } else {
                    format!("{}: {}", problem.path, problem.reason)
                });
            }
            taken_back = true;
        }
    }
    let binned = bin_written_files(db, bin.as_ref(), item, &placement.location)?;
    // Only an empty folder goes; anything else in it (a file the library does not list) stays.
    let removed = std::fs::remove_dir(&placement.location).is_ok();
    Ok(if taken_back || binned > 0 || removed {
        PlacementUndo::Undone
    } else {
        PlacementUndo::NothingToUndo
    })
}

/// Sends the NFO and artwork the library lists inside `folder` to the bin and drops their rows:
/// the scrape wrote them there, and the video is not there any more. Returns how many files went.
fn bin_written_files(
    db: &Arc<cv_db::Database>,
    bin: &dyn crate::library_ops::SystemBin,
    item: ItemId,
    folder: &std::path::Path,
) -> Result<usize, String> {
    use crate::history::snapshot::is_match_file;
    use crate::title_guard::{WRITE_WAIT, Work};

    let _held = crate::title_guard::hold(db, [item], Work::Write, WRITE_WAIT)
        .map_err(|busy| busy.to_string())?;
    let Some(current) = db
        .read(move |conn| get_item(conn, item))
        .map_err(|e| e.to_string())?
    else {
        return Ok(0);
    };
    let paths: Vec<PathBuf> = current
        .core
        .media_files
        .iter()
        .filter(|file| is_match_file(file) && file.path().parent() == Some(folder))
        .map(cv_domain::MediaFile::path)
        .filter(|path| path.symlink_metadata().is_ok())
        .collect();
    if paths.is_empty() {
        return Ok(0);
    }
    let root = PathBuf::from(current.core.data_source.trim());
    let label = format!(
        "scrape-undo-{}-{}",
        item.0,
        crate::library_ops::now_millis()
    );
    let binned = match crate::library_ops::send_or_fallback(bin, &paths, &root, &label) {
        Ok(binned) => binned,
        Err(error) => {
            // What went already comes back; the folder keeps all it had.
            if !error.sent.is_empty() {
                let _ = crate::library_ops::restore_all(bin, &error.sent);
            }
            return Err(error.reason);
        }
    };
    let gone = paths.clone();
    let written = db.write(move |tx| {
        if let Some(mut stored) = get_item(tx, item)? {
            stored
                .core
                .media_files
                .retain(|file| !gone.contains(&file.path()));
            cv_db::repo::update_item(tx, &stored)?;
        }
        Ok(())
    });
    if let Err(error) = written {
        // The files are in the bin but the library still lists them: put them back, so the
        // library and the disk agree.
        let _ = crate::library_ops::restore_all(bin, &binned.items);
        return Err(error.to_string());
    }
    Ok(paths.len())
}

/// Plans the move of the movie `id` into its own folder and runs it when the plan is a clean
/// change; blocking.
fn place(organize: &OrganizeService, request: PreviewRequest, id: &str) -> FolderStep {
    if !cv_rename::pattern::is_folder_pattern_unique(&request.profile.movie.folder_pattern) {
        return FolderStep::Failed(
            "The folder pattern in Settings › Naming does not name each movie differently (it \
             needs the title and the year, or an ID), so it cannot give this movie a folder of \
             its own."
                .to_owned(),
        );
    }
    let preview = match organize.preview(&request) {
        Ok(preview) => preview,
        Err(error) => return FolderStep::Failed(error.to_string()),
    };
    if !preview.problems.is_empty() {
        let problems: Vec<&str> = preview
            .problems
            .iter()
            .map(|p| p.message.as_str())
            .collect();
        return FolderStep::Failed(format!(
            "The naming templates have a problem: {}.",
            problems.join("; ")
        ));
    }
    // A title the plan has nothing to say about is tidy: it has its folder already.
    let Some(row) = preview.rows.iter().find(|row| row.id == id) else {
        return FolderStep::NotNeeded;
    };
    match &row.status {
        RowStatus::Change => {}
        RowStatus::Conflict => {
            return FolderStep::Failed(format!(
                "The folder “{}” already exists and holds another title or file, so nothing was \
                 merged into it.",
                row.after
            ));
        }
        RowStatus::Unplanned(why) => return FolderStep::Failed(why.clone()),
        RowStatus::MediaUnread => {
            return FolderStep::Failed(format!("{}.", cv_rename::MEDIA_HELD_REASON));
        }
        RowStatus::Skipped | RowStatus::Unscraped => return FolderStep::NotNeeded,
    }
    let folder = row.after.clone();
    let made_here = std::path::Path::new(&row.root).join(&row.after);
    let existed = made_here.exists();
    let step = apply_folder_step(organize, request, id, folder, made_here.clone());
    // A move that failed leaves nothing behind: the folder this step made for it goes again,
    // when it is empty (one that was there before is never touched).
    if matches!(step, FolderStep::Failed(_)) && !existed {
        let _ = std::fs::remove_dir(&made_here);
    }
    step
}

/// Runs the planned move of the movie `id` and says what came of it.
fn apply_folder_step(
    organize: &OrganizeService,
    request: PreviewRequest,
    id: &str,
    folder: String,
    location: PathBuf,
) -> FolderStep {
    let applied = match organize.apply_under_pin(&ApplyRequest {
        preview: request,
        include: vec![id.to_owned()],
    }) {
        Ok(applied) => applied,
        Err(error) => return FolderStep::Failed(error.to_string()),
    };
    if let Some(busy) = applied.busy.iter().find(|busy| busy.id == id) {
        return FolderStep::Failed(busy.reason.clone());
    }
    match applied.items.iter().find(|done| done.id == id) {
        Some(done) => match &done.status {
            AppliedStatus::Done => match applied.batch_id {
                Some(batch_id) => FolderStep::Placed {
                    batch_id,
                    folder,
                    location,
                },
                None => FolderStep::NotNeeded,
            },
            AppliedStatus::Failed(why) => FolderStep::Failed(why.clone()),
            AppliedStatus::Canceled => FolderStep::Failed("The move was canceled.".to_owned()),
        },
        None => FolderStep::Failed("The plan changed before the folder could be made.".to_owned()),
    }
}

/// One title of an artwork job, shown by its name as the job's current item.
struct ArtworkTitle {
    id: ItemId,
    name: String,
}

impl std::fmt::Display for ArtworkTitle {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if self.name.is_empty() {
            write!(f, "title {}", self.id.0)
        } else {
            f.write_str(&self.name)
        }
    }
}

/// The work of an artwork job: the after-scrape artwork step of each title, then the title's
/// task is told it may go on.
struct ArtworkJob {
    artwork: Arc<ArtworkService>,
    waiters: Arc<Mutex<HashMap<ItemId, Vec<oneshot::Sender<()>>>>>,
    /// Titles that got at least one image.
    saved: Arc<AtomicUsize>,
}

impl ItemWork for ArtworkJob {
    type Item = ArtworkTitle;

    /// `artwork for 190`: the titles that got images, as the job's step in the run history.
    fn result(&self) -> Option<String> {
        let saved = self.saved.load(Ordering::Relaxed);
        Some(if saved == 0 {
            "no new artwork".to_owned()
        } else {
            format!("artwork for {saved}")
        })
    }

    async fn process(&self, item: &ArtworkTitle, _control: &ItemControl) -> Result<(), ItemError> {
        // The title's run goes on in a task of its own, which holds the title and lets the
        // title's steps go on only once it is over: a cancelled job drops this future after its
        // grace period, and dropping the run itself would let go of the title while an image
        // write it started on a blocking thread still goes on (making missing folders), so a
        // rename could move the folder under it. A started run therefore always ends; the
        // titles the job did not start get no new artwork.
        let waiting = self
            .waiters
            .lock()
            .unwrap_or_else(PoisonError::into_inner)
            .remove(&item.id);
        let artwork = Arc::clone(&self.artwork);
        let saved = Arc::clone(&self.saved);
        let id = item.id;
        let run = cv_jobs::spawn(async move {
            // A problem is logged and left as the title's step outcome; it never fails the job.
            if artwork.fill_after_scrape(id).await {
                saved.fetch_add(1, Ordering::Relaxed);
            }
            for done in waiting.into_iter().flatten() {
                let _ = done.send(());
            }
        });
        let _ = run.await;
        Ok(())
    }
}

impl std::fmt::Debug for ScrapeFollowUp {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("ScrapeFollowUp")
    }
}
