//! NFO and artwork after any scraper: a scrape from a provider that is not TMDB
//! (OFDb-like, knowing only an IMDb ID) writes the NFO next to the video and fills the missing
//! artwork through an artwork provider by that IMDb ID. When no artwork provider knows the title,
//! the NFO is still written and the artwork step says so. Mock providers, no network.

mod support;

use std::fs;
use std::io::Cursor;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

use async_trait::async_trait;
use cv_app::app_settings::SettingsService;
use cv_app::artwork::ArtworkService;
use cv_app::match_service::{MatchService, ScrapeApply};
use cv_app::nfo::NfoService;
use cv_app::notices::NoticeHub;
use cv_app::organize::OrganizeService;
use cv_app::provider_credentials::ProviderCredentialsService;
use cv_app::scrape_follow_up::{FolderStep, PlacementUndo, ScrapeFollowUp};
use cv_app::step_outcomes::{STEP_ARTWORK, StepStatus};
use cv_artwork::download::fetch::StaticFetcher;
use cv_artwork::thumb::ThumbCache;
use cv_db::repo::step_outcome::step_outcome;
use cv_domain::{Item, ItemDetail, ItemId, MediaFile, MediaFileType, ProviderIds, Trailer};
use cv_providers::model::{
    ArtworkCandidate, Capabilities, MediaKind, RequestOptions, SearchHit, SearchQuery,
};
use cv_providers::{
    ArtworkProvider, CredentialResolver, MemoryUserCredentials, MetadataProvider, Provider,
    ProviderError, ProviderRegistry,
};
use image::{ImageFormat, Rgb, RgbImage};
use support::Lab;

fn jpeg(seed: u8) -> Vec<u8> {
    let image = RgbImage::from_pixel(40, 60, Rgb([seed, 200, 10]));
    let mut out = Cursor::new(Vec::new());
    image.write_to(&mut out, ImageFormat::Jpeg).unwrap();
    out.into_inner()
}

/// A German-database-like scraper: it knows its own ID and gives the IMDb ID, nothing else.
struct OfdbLike;

#[async_trait]
impl Provider for OfdbLike {
    fn id(&self) -> &'static str {
        "ofdb"
    }
    fn name(&self) -> &'static str {
        "OFDb"
    }
}

#[async_trait]
impl MetadataProvider for OfdbLike {
    fn capabilities(&self) -> Capabilities {
        Capabilities {
            movies: true,
            shows: false,
            orderings: Vec::new(),
            lookup_ids: vec!["ofdb"],
            best_effort: false,
        }
    }

    async fn search(
        &self,
        _query: &SearchQuery,
        _options: &RequestOptions,
    ) -> Result<Vec<SearchHit>, ProviderError> {
        Ok(Vec::new())
    }

    async fn lookup(
        &self,
        _kind: MediaKind,
        _ids: &ProviderIds,
        _options: &RequestOptions,
    ) -> Result<Option<SearchHit>, ProviderError> {
        Ok(None)
    }

    async fn details(
        &self,
        _kind: MediaKind,
        ids: &ProviderIds,
        _options: &RequestOptions,
    ) -> Result<Item, ProviderError> {
        let mut item = Item::movie("Das Boot");
        item.core.year = 1981;
        item.core.plot = "Ein U-Boot im Atlantik.".to_owned();
        item.core
            .ids
            .set("ofdb", ids.get("ofdb").unwrap_or_default());
        if ids.get("ofdb") == Some("1") {
            item.core.ids.set("imdb", "tt0082096");
        }
        if ids.get("ofdb") == Some("kw") {
            // A provider that returns keywords as tags, as TMDB does.
            item.core.ids.set("imdb", "tt0082096");
            for keyword in ["u-boat", "submarine", "world war ii", "claustrophobia"] {
                item.core.tags.add(keyword);
            }
        }
        if ids.get("ofdb") == Some("yt") {
            // A scrape that found a YouTube video, as the TMDB and TheTVDB scrapes do.
            item.core.ids.set("imdb", "tt0082096");
            if let ItemDetail::Movie(movie) = &mut item.detail {
                movie.trailers.push(Trailer {
                    id: "v1".to_owned(),
                    name: "Official Trailer".to_owned(),
                    url: "https://www.youtube.com/watch?v=abc123XYZ_-".to_owned(),
                    quality: "1080p".to_owned(),
                    language: "de".to_owned(),
                    provider: "ofdb".to_owned(),
                    in_nfo: true,
                    ..Trailer::default()
                });
            }
        }
        Ok(item)
    }
}

/// An artwork provider that knows titles by their IMDb ID only, posing as Fanart.tv, whose key the
/// rig sets.
struct ByImdb;

#[async_trait]
impl Provider for ByImdb {
    fn id(&self) -> &'static str {
        "fanart"
    }
    fn name(&self) -> &'static str {
        "Fanart.tv"
    }
}

#[async_trait]
impl ArtworkProvider for ByImdb {
    async fn artwork(
        &self,
        _kind: MediaKind,
        ids: &ProviderIds,
        _options: &RequestOptions,
    ) -> Result<Vec<ArtworkCandidate>, ProviderError> {
        if ids.get("imdb") != Some("tt0082096") {
            return Err(ProviderError::NotFound("Fanart.tv".to_owned()));
        }
        Ok(vec![ArtworkCandidate {
            kind: MediaFileType::Poster,
            url: "https://img.test/boot-poster.jpg".to_owned(),
            language: Some("de".to_owned()),
            width: 2000,
            height: 3000,
            score: 8.0,
            popularity: cv_providers::model::Popularity::Unknown,
        }])
    }
}

/// [`ByImdb`] with a poster, a fanart and a banner for the same title.
struct Gallery;

#[async_trait]
impl Provider for Gallery {
    fn id(&self) -> &'static str {
        "fanart"
    }
    fn name(&self) -> &'static str {
        "Fanart.tv"
    }
}

#[async_trait]
impl ArtworkProvider for Gallery {
    async fn artwork(
        &self,
        _kind: MediaKind,
        ids: &ProviderIds,
        _options: &RequestOptions,
    ) -> Result<Vec<ArtworkCandidate>, ProviderError> {
        if ids.get("imdb") != Some("tt0082096") {
            return Err(ProviderError::NotFound("Fanart.tv".to_owned()));
        }
        let candidate = |kind, url: &str, width, height| ArtworkCandidate {
            kind,
            url: url.to_owned(),
            language: Some("de".to_owned()),
            width,
            height,
            score: 8.0,
            popularity: cv_providers::model::Popularity::Unknown,
        };
        Ok(vec![
            candidate(
                MediaFileType::Poster,
                "https://img.test/boot-poster.jpg",
                2000,
                3000,
            ),
            candidate(
                MediaFileType::Fanart,
                "https://img.test/boot-fanart.jpg",
                3840,
                2160,
            ),
            candidate(
                MediaFileType::Banner,
                "https://img.test/boot-banner.jpg",
                1000,
                185,
            ),
        ])
    }
}

/// [`ByImdb`] that takes its time to answer, so a test can cancel the artwork job mid-run.
struct SlowByImdb(std::time::Duration);

#[async_trait]
impl Provider for SlowByImdb {
    fn id(&self) -> &'static str {
        "fanart"
    }
    fn name(&self) -> &'static str {
        "Fanart.tv"
    }
}

#[async_trait]
impl ArtworkProvider for SlowByImdb {
    async fn artwork(
        &self,
        kind: MediaKind,
        ids: &ProviderIds,
        options: &RequestOptions,
    ) -> Result<Vec<ArtworkCandidate>, ProviderError> {
        tokio::time::sleep(self.0).await;
        ByImdb.artwork(kind, ids, options).await
    }
}

struct Rig {
    lab: Lab,
    settings: Arc<SettingsService>,
    follow_up: Arc<ScrapeFollowUp>,
    matching: Arc<MatchService>,
    handles: Arc<Mutex<Vec<tokio::task::JoinHandle<()>>>>,
    library: PathBuf,
    /// The notices the follow-up raised.
    notices: Arc<Mutex<Vec<cv_app::notices::AppNotice>>>,
}

fn rig() -> Rig {
    rig_with(Arc::new(ByImdb))
}

fn rig_with(artwork_provider: Arc<dyn ArtworkProvider>) -> Rig {
    let lab = Lab::new();
    let mut registry = ProviderRegistry::new();
    registry.register_metadata(Arc::new(OfdbLike));
    registry.register_artwork(artwork_provider);
    let resolver = CredentialResolver::new(Arc::new(MemoryUserCredentials::default()));
    let providers = Arc::new(ProviderCredentialsService::with_resolver(
        resolver, registry,
    ));
    providers.set("fanart", "api_key", "a-key").unwrap();
    let settings = Arc::new(SettingsService::in_memory(""));
    let matching = MatchService::new(
        Arc::clone(&lab.db),
        lab.manager.clone(),
        Arc::clone(&providers),
        Arc::clone(&settings),
        Arc::new(NoticeHub::new()),
    );
    let fetcher = Arc::new(StaticFetcher::new());
    fetcher.insert("https://img.test/boot-poster.jpg", jpeg(1));
    fetcher.insert("https://img.test/boot-fanart.jpg", jpeg(2));
    fetcher.insert("https://img.test/boot-banner.jpg", jpeg(3));
    let thumbs = Arc::new(ThumbCache::open(&lab.dir.path().join("cache"), None).unwrap());
    let artwork = ArtworkService::with_fetcher(
        Arc::clone(&lab.db),
        providers,
        Arc::clone(&settings),
        thumbs,
        fetcher,
    );
    let nfo = Arc::new(NfoService::new(
        Arc::clone(&lab.db),
        lab.dir.path().join("nfo-undo"),
    ));
    let follow_up = ScrapeFollowUp::new(nfo, artwork, Arc::clone(&settings));
    let follow_up_kept = Arc::clone(&follow_up);
    let hub = Arc::new(NoticeHub::new());
    let notices: Arc<Mutex<Vec<cv_app::notices::AppNotice>>> = Arc::default();
    {
        let notices = Arc::clone(&notices);
        hub.subscribe(move |notice| {
            notices.lock().unwrap().push(notice.clone());
            true
        });
    }
    follow_up.set_notices(hub);
    {
        let follow_up = Arc::clone(&follow_up);
        matching.set_after_undo(Arc::new(move |item| follow_up.after_undo(item)));
    }
    {
        // As in the app: History's Undo of a match entry takes the folder step's move back first.
        let follow_up = Arc::clone(&follow_up);
        matching.set_before_undo(Arc::new(move |item| {
            let follow_up = Arc::clone(&follow_up);
            Box::pin(async move {
                let _ = follow_up.undo_placement(item).await;
            })
        }));
    }
    // As in the app: the artwork step runs as a named job.
    follow_up.set_jobs(lab.manager.clone());
    let handles: Arc<Mutex<Vec<tokio::task::JoinHandle<()>>>> = Arc::default();
    {
        let handles = Arc::clone(&handles);
        matching.set_after_match(Arc::new(move |item| {
            handles
                .lock()
                .unwrap()
                .push(follow_up.after_match_task(item));
        }));
    }
    let library = lab.dir.path().join("Filme");
    Rig {
        lab,
        settings,
        follow_up: follow_up_kept,
        matching,
        handles,
        library,
        notices,
    }
}

impl Rig {
    fn movie(&self) -> (ItemId, PathBuf) {
        let folder = self.library.join("Das Boot (1981)");
        fs::create_dir_all(&folder).unwrap();
        fs::write(folder.join("Das Boot (1981).mkv"), b"video").unwrap();
        let mut item = Item::movie("Das Boot");
        item.core.path = folder.to_string_lossy().into_owned();
        item.core.data_source = self.library.to_string_lossy().into_owned();
        item.core.media_files.push(MediaFile::new(
            MediaFileType::Video,
            folder.to_string_lossy(),
            "Das Boot (1981).mkv",
        ));
        (self.lab.add(item), folder)
    }

    async fn scrape(&self, item: ItemId, provider_id: &str) {
        self.start_scrape(item, provider_id).await;
        self.follow_ups_done().await;
    }

    /// The scrape alone: its follow-up runs on in the background.
    async fn start_scrape(&self, item: ItemId, provider_id: &str) {
        self.matching
            .scrape_apply(
                item,
                &ScrapeApply {
                    provider: "ofdb".to_owned(),
                    provider_id: provider_id.to_owned(),
                    language: "de".to_owned(),
                    fields: cv_domain::all_fields()
                        .iter()
                        .map(|f| f.key().to_owned())
                        .collect(),
                    do_not_overwrite: false,
                    second_version: false,
                },
            )
            .await
            .expect("scrape");
    }

    async fn follow_ups_done(&self) {
        let handles: Vec<_> = self.handles.lock().unwrap().drain(..).collect();
        for handle in handles {
            handle.await.unwrap();
        }
    }

    fn artwork_outcome(&self, item: ItemId) -> (StepStatus, String) {
        let outcome = self
            .lab
            .db
            .read(|c| step_outcome(c, item, STEP_ARTWORK))
            .unwrap()
            .expect("the artwork step left an outcome");
        (outcome.status, outcome.reason)
    }
}

fn names(folder: &std::path::Path) -> Vec<String> {
    let mut names: Vec<String> = fs::read_dir(folder)
        .unwrap()
        .flatten()
        .map(|e| e.file_name().to_string_lossy().into_owned())
        .collect();
    names.sort();
    names
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn a_scrape_from_a_non_tmdb_provider_writes_the_nfo_and_fetches_artwork_by_imdb_id() {
    let rig = rig();
    let (item, folder) = rig.movie();

    rig.scrape(item, "1").await;

    assert_eq!(
        names(&folder),
        [
            "Das Boot (1981)-poster.jpg",
            "Das Boot (1981).mkv",
            "Das Boot (1981).nfo"
        ]
    );
    let nfo = fs::read_to_string(folder.join("Das Boot (1981).nfo")).unwrap();
    assert!(
        nfo.contains("Das Boot") && nfo.contains("tt0082096"),
        "{nfo}"
    );
    assert_eq!(rig.lab.item(item).core.ids.get("tmdb"), None, "no TMDB ID");
    assert_eq!(rig.artwork_outcome(item).0, StepStatus::Done);
}

/// Which files to write: with default settings a scrape always writes the NFO and the
/// artwork of every type the providers have, under the names of the preset.
#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn a_scrape_with_default_settings_writes_the_nfo_and_every_artwork_type() {
    let rig = rig_with(Arc::new(Gallery));
    let (item, folder) = rig.movie();

    rig.scrape(item, "1").await;

    assert_eq!(
        names(&folder),
        [
            "Das Boot (1981)-banner.jpg",
            "Das Boot (1981)-fanart.jpg",
            "Das Boot (1981)-poster.jpg",
            "Das Boot (1981).mkv",
            "Das Boot (1981).nfo"
        ]
    );
}

/// Provider keywords become tags (spec metadata-providers): a scrape adds them to the tags a
/// title has, so the "Criterion" tag from its NFO stays and the rewritten NFO lists both.
#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn a_scrape_adds_the_keywords_to_the_tags_of_the_nfo() {
    let rig = rig();
    let (item, folder) = rig.movie();
    let mut stored = rig.lab.item(item);
    stored.core.tags.add("Criterion");
    rig.lab
        .db
        .write(move |tx| cv_db::repo::update_item(tx, &stored))
        .unwrap();

    rig.scrape(item, "kw").await;

    let nfo = fs::read_to_string(folder.join("Das Boot (1981).nfo")).unwrap();
    assert_eq!(nfo.matches("<tag>").count(), 5, "{nfo}");
    assert!(nfo.contains("<tag>Criterion</tag>"), "{nfo}");
    assert!(nfo.contains("<tag>submarine</tag>"), "{nfo}");
    let tags: Vec<String> = rig
        .lab
        .item(item)
        .core
        .tags
        .iter()
        .map(str::to_owned)
        .collect();
    assert_eq!(
        tags,
        [
            "Criterion",
            "u-boat",
            "submarine",
            "world war ii",
            "claustrophobia"
        ]
    );
}

/// A trailer a scrape found stays in the library and is written to the NFO as the plug-in address
/// Kodi, Jellyfin and Emby play, although CineVault itself no longer downloads trailers.
#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn a_scraped_youtube_trailer_is_written_to_the_nfo_as_a_plugin_address() {
    let rig = rig();
    let (item, folder) = rig.movie();

    rig.scrape(item, "yt").await;

    let nfo = fs::read_to_string(folder.join("Das Boot (1981).nfo")).unwrap();
    assert!(
        nfo.contains("<trailer>plugin://plugin.video.youtube/play/?video_id=abc123XYZ_-</trailer>"),
        "{nfo}"
    );
    let stored = rig.lab.item(item);
    let ItemDetail::Movie(movie) = &stored.detail else {
        panic!("not a movie");
    };
    assert_eq!(
        movie.trailers.len(),
        1,
        "the trailer is kept in the library"
    );
}

/// Spec `job-system`, "Job named in plain words": the after-scrape artwork step is a job that
/// Activity names "Downloading artwork for N titles", one for the titles of a scrape.
#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn the_artwork_step_is_one_job_named_in_plain_words() {
    let rig = rig();
    let (first, folder) = rig.movie();
    let second_folder = rig.library.join("Das Boot 2 (1981)");
    fs::create_dir_all(&second_folder).unwrap();
    fs::write(second_folder.join("Das Boot 2 (1981).mkv"), b"video").unwrap();
    let mut item = Item::movie("Das Boot 2");
    item.core.path = second_folder.to_string_lossy().into_owned();
    item.core.data_source = rig.library.to_string_lossy().into_owned();
    item.core.media_files.push(MediaFile::new(
        MediaFileType::Video,
        second_folder.to_string_lossy(),
        "Das Boot 2 (1981).mkv",
    ));
    let second = rig.lab.add(item);

    rig.start_scrape(first, "1").await;
    rig.start_scrape(second, "1").await;
    rig.follow_ups_done().await;

    // The follow-up returns once the work is done; the job manager records the end a moment later.
    let artwork_jobs = || -> Vec<_> {
        rig.lab
            .manager
            .list()
            .into_iter()
            .filter(|job| job.name.starts_with("Downloading artwork"))
            .collect()
    };
    for _ in 0..300 {
        if artwork_jobs().iter().all(|job| job.state.is_terminal()) {
            break;
        }
        tokio::time::sleep(std::time::Duration::from_millis(30)).await;
    }
    let jobs = artwork_jobs();
    assert_eq!(
        jobs.len(),
        1,
        "one job for the titles of the scrape: {jobs:?}"
    );
    assert_eq!(jobs[0].name, "Downloading artwork for 2 titles");
    assert!(jobs[0].state.is_terminal());
    // Its step in the run history says what it produced.
    assert_eq!(jobs[0].result.as_deref(), Some("artwork for 2"));
    assert!(folder.join("Das Boot (1981)-poster.jpg").exists());
    assert_eq!(rig.artwork_outcome(first).0, StepStatus::Done);
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn the_follow_up_keeps_renames_out_until_its_writes_are_done_and_never_waits_on_itself() {
    use cv_app::title_guard::{self, Work};
    use std::time::{Duration, Instant};

    let rig = rig();
    let (item, folder) = rig.movie();
    // Another short write (a subtitle, say) holds the title, so the follow-up's NFO step waits.
    let subtitle = title_guard::hold(&rig.lab.db, [item], Work::Write, Duration::ZERO).unwrap();

    rig.start_scrape(item, "1").await;
    assert!(
        title_guard::is_pinned(&rig.lab.db, item),
        "pinned from the moment the follow-up is queued"
    );
    // A rename asking now waits for the short write (holding nothing); once that is over it
    // meets the follow-up's pin and is told at once, with the reason, instead of waiting for
    // the NFO and the artwork.
    let db = Arc::clone(&rig.lab.db);
    let rename = std::thread::spawn(move || {
        let asked = Instant::now();
        let refused = title_guard::hold(&db, [item], Work::Rename, title_guard::MOVE_WAIT)
            .map(drop)
            .expect_err("the title is pinned while its NFO and artwork are written");
        (refused, asked.elapsed())
    });
    std::thread::sleep(Duration::from_millis(200));
    drop(subtitle);
    let released = Instant::now();
    let (refused, waited) = rename.join().unwrap();
    assert_eq!(refused.work, Work::Scrape, "{refused}");
    assert!(
        waited < title_guard::MOVE_WAIT,
        "told at once, waited {waited:?}"
    );
    rig.follow_ups_done().await;

    // Its own NFO and artwork writes went ahead under the pin (a write waits up to 10 s for
    // another holder, so a follow-up waiting on itself would take that long).
    assert!(
        released.elapsed() < title_guard::WRITE_WAIT,
        "took {:?}",
        released.elapsed()
    );
    assert!(folder.join("Das Boot (1981).nfo").exists());
    assert!(folder.join("Das Boot (1981)-poster.jpg").exists());
    assert!(!title_guard::is_pinned(&rig.lab.db, item), "the pin ends");
    assert!(title_guard::hold(&rig.lab.db, [item], Work::Rename, Duration::ZERO).is_ok());
}

/// Review 14.7: cancelling the artwork job never lets a rename or move of a title start while
/// that title's artwork run is still at work. The job drops an item that overruns its grace
/// period, and with it the run's hold on the title, while an image write it started on a
/// blocking thread goes on (and makes missing folders); the title's steps then ended and its pin
/// with them, so a rename could move the folder under that write.
#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn a_cancelled_artwork_job_keeps_the_title_until_its_artwork_run_is_over() {
    use cv_app::title_guard;
    use std::time::{Duration, Instant};

    let rig = rig_with(Arc::new(SlowByImdb(Duration::from_secs(3))));
    let (item, folder) = rig.movie();
    rig.start_scrape(item, "1").await;

    // The artwork job is at work on the title: cancel it.
    let deadline = Instant::now() + Duration::from_secs(10);
    let job =
        loop {
            let running =
                rig.lab.manager.list().into_iter().find(|job| {
                    job.name.starts_with("Downloading artwork") && !job.current.is_empty()
                });
            if let Some(job) = running {
                break job;
            }
            assert!(Instant::now() < deadline, "the artwork job did not start");
            tokio::time::sleep(Duration::from_millis(20)).await;
        };
    tokio::time::sleep(Duration::from_millis(200)).await;
    assert!(rig.lab.manager.cancel(job.id));
    loop {
        let state = rig
            .lab
            .manager
            .list()
            .into_iter()
            .find(|j| j.id == job.id)
            .map(|j| j.state);
        if state.is_some_and(|s| s.is_terminal()) {
            break;
        }
        assert!(Instant::now() < deadline, "the job did not end");
        tokio::time::sleep(Duration::from_millis(20)).await;
    }

    // The job is over, the title's artwork run is not: the title stays out of reach of a
    // rename or move until it is.
    assert!(
        title_guard::is_pinned(&rig.lab.db, item),
        "the title's steps are not over while its artwork run still goes on"
    );
    assert!(title_guard::holder(&rig.lab.db, item).is_some());
    rig.follow_ups_done().await;
    assert!(!title_guard::is_pinned(&rig.lab.db, item), "the pin ends");
    assert_eq!(title_guard::holder(&rig.lab.db, item), None);
    // What was under way when the job was cancelled is written whole, in the title's folder.
    assert!(folder.join("Das Boot (1981)-poster.jpg").exists());
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn when_no_artwork_provider_knows_the_title_the_nfo_is_still_written_and_the_reason_is_recorded()
 {
    let rig = rig();
    let (item, folder) = rig.movie();

    // This title has no IMDb ID, so the artwork provider has nothing to look up.
    rig.scrape(item, "2").await;

    assert_eq!(
        names(&folder),
        ["Das Boot (1981).mkv", "Das Boot (1981).nfo"]
    );
    assert_eq!(
        rig.artwork_outcome(item),
        (
            StepStatus::NotFound,
            "No artwork provider knows this title.".to_owned()
        )
    );
    // Activity says so too, naming the title.
    let notices = rig.notices.lock().unwrap().clone();
    let artwork: Vec<_> = notices
        .iter()
        .filter(|n| n.source.as_deref() == Some("Artwork"))
        .collect();
    assert_eq!(artwork.len(), 1, "{notices:?}");
    assert!(artwork[0].title.contains("Das Boot"), "{:?}", artwork[0]);
    assert_eq!(
        artwork[0].detail.as_deref(),
        Some("No artwork provider knows this title.")
    );
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn undoing_a_scrape_writes_the_nfo_of_the_restored_title_again() {
    let rig = rig();
    let (item, folder) = rig.movie();
    let nfo = folder.join("Das Boot (1981).nfo");

    let token = rig.matching.keep_scrape_snapshot(item).expect("a snapshot");
    rig.scrape(item, "1").await;
    let scraped = fs::read_to_string(&nfo).unwrap();
    assert!(scraped.contains("Ein U-Boot im Atlantik."), "{scraped}");

    rig.matching.undo_scrape(token).unwrap();
    // The NFO is written again in the background, from the restored library row.
    let deadline = std::time::Instant::now() + std::time::Duration::from_secs(20);
    loop {
        let text = fs::read_to_string(&nfo).unwrap_or_default();
        if !text.contains("Ein U-Boot im Atlantik.") && !text.contains("tt0082096") {
            break;
        }
        assert!(
            std::time::Instant::now() < deadline,
            "the NFO still describes the undone scrape: {text}"
        );
        tokio::time::sleep(std::time::Duration::from_millis(50)).await;
    }
    assert_eq!(rig.lab.item(item).core.plot, "");
}

// ---- the folder step: a loose movie gets its own folder before its NFO and artwork --------------

impl Rig {
    /// A movie whose files sit loose directly in the library folder (the scan marks such a movie
    /// as living in a multi-movie folder).
    fn loose_movie(&self) -> ItemId {
        fs::create_dir_all(&self.library).unwrap();
        fs::write(self.library.join("Das Boot.mkv"), b"video").unwrap();
        fs::write(self.library.join("Das Boot.en.srt"), b"subtitle").unwrap();
        let mut item = Item::movie("Das Boot");
        item.core.path = self.library.to_string_lossy().into_owned();
        item.core.data_source = self.library.to_string_lossy().into_owned();
        if let ItemDetail::Movie(movie) = &mut item.detail {
            movie.multi_movie_dir = true;
        }
        for (kind, name) in [
            (MediaFileType::Video, "Das Boot.mkv"),
            (MediaFileType::Subtitle, "Das Boot.en.srt"),
        ] {
            item.core
                .media_files
                .push(MediaFile::new(kind, self.library.to_string_lossy(), name));
        }
        self.lab.add(item)
    }

    fn notice_titles(&self) -> Vec<String> {
        self.notices
            .lock()
            .unwrap()
            .iter()
            .map(|n| n.title.clone())
            .collect()
    }
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn a_loose_movie_gets_its_own_folder_and_the_nfo_and_artwork_are_written_there() {
    let rig = rig();
    let item = rig.loose_movie();

    rig.scrape(item, "1").await;

    // The folder pattern of the naming profile, rendered with the scraped title; the video is
    // moved, not renamed.
    let folder = rig.library.join("Das Boot (1981)");
    assert_eq!(
        names(&folder),
        [
            "Das Boot-poster.jpg",
            "Das Boot.en.srt",
            "Das Boot.mkv",
            "Das Boot.nfo"
        ]
    );
    assert_eq!(
        names(&rig.library),
        ["Das Boot (1981)"],
        "nothing is left loose in the library folder"
    );
    let nfo = fs::read_to_string(folder.join("Das Boot.nfo")).unwrap();
    assert!(nfo.contains("tt0082096"), "{nfo}");
    // The library follows the move without a rescan.
    let stored = rig.lab.item(item);
    assert_eq!(
        PathBuf::from(&stored.core.path),
        folder,
        "the title's folder is the new one"
    );
    for file in &stored.core.media_files {
        assert_eq!(PathBuf::from(&file.directory), folder, "{}", file.filename);
    }
    assert!(
        stored
            .core
            .media_files
            .iter()
            .any(|f| f.kind == MediaFileType::Nfo),
        "the NFO is a file of the title in its new folder"
    );
    assert!(
        !rig.notice_titles()
            .iter()
            .any(|title| title.contains("No folder")),
        "{:?}",
        rig.notice_titles()
    );
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn the_folder_is_made_and_the_video_moved_before_any_nfo_or_artwork_is_written() {
    let rig = rig();
    // No follow-up runs by itself: the test calls the steps one by one.
    rig.matching.set_after_match(Arc::new(|_| {}));
    let item = rig.loose_movie();
    rig.start_scrape(item, "1").await;
    assert!(rig.library.join("Das Boot.mkv").is_file(), "still loose");
    assert!(!rig.library.join("Das Boot.nfo").exists());

    let step = rig.follow_up.place_in_folder(item).await;

    // Only the folder step ran: the video and its subtitle are in their own folder, and no NFO or
    // artwork exists anywhere yet.
    let FolderStep::Placed { folder, .. } = step else {
        panic!("{step:?}");
    };
    assert_eq!(folder, "Das Boot (1981)");
    let own = rig.library.join(&folder);
    assert_eq!(names(&own), ["Das Boot.en.srt", "Das Boot.mkv"]);
    assert_eq!(names(&rig.library), ["Das Boot (1981)"]);
    // The steps that follow read the path after the move, so they write into the new folder.
    rig.follow_up.run(item).await;
    assert_eq!(
        names(&own),
        [
            "Das Boot-poster.jpg",
            "Das Boot.en.srt",
            "Das Boot.mkv",
            "Das Boot.nfo"
        ]
    );
    assert_eq!(names(&rig.library), ["Das Boot (1981)"]);
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn a_movie_that_has_its_own_folder_is_left_where_it_is() {
    let rig = rig();
    let (item, folder) = rig.movie();

    rig.scrape(item, "1").await;

    assert_eq!(
        rig.follow_up.place_in_folder(item).await,
        FolderStep::NotNeeded
    );
    assert_eq!(
        names(&rig.library),
        ["Das Boot (1981)"],
        "no folder was made inside or beside it"
    );
    assert_eq!(PathBuf::from(rig.lab.item(item).core.path), folder);
    assert!(folder.join("Das Boot (1981).nfo").is_file());
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn with_the_switch_off_a_loose_movie_is_scraped_in_place_as_before() {
    let rig = rig();
    rig.settings
        .set("library.folder-loose-files", serde_json::json!(false))
        .unwrap();
    let item = rig.loose_movie();

    rig.scrape(item, "1").await;

    assert_eq!(
        names(&rig.library),
        [
            "Das Boot-poster.jpg",
            "Das Boot.en.srt",
            "Das Boot.mkv",
            "Das Boot.nfo"
        ]
    );
    assert_eq!(
        rig.follow_up.place_in_folder(item).await,
        FolderStep::NotNeeded
    );
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn metadata_only_keeps_a_loose_movie_where_it_is() {
    let rig = rig();
    rig.settings
        .set("renamer.metadata-only", serde_json::json!(true))
        .unwrap();
    let item = rig.loose_movie();

    rig.scrape(item, "1").await;

    assert!(rig.library.join("Das Boot.mkv").is_file());
    assert!(rig.library.join("Das Boot.nfo").is_file());
    assert!(!rig.library.join("Das Boot (1981)").exists());
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn a_move_that_fails_does_not_fail_the_scrape_and_the_nfo_goes_next_to_the_video() {
    use cv_rename::exec::fault::{Fault, FaultFs, Op, Rule};
    let rig = rig();
    // The video is held by another program: it cannot be moved.
    let disk = FaultFs::new();
    disk.rule(Rule::on(&[Op::Rename, Op::Copy], Fault::PermissionDenied).named("Das Boot.mkv"));
    rig.follow_up.set_organize(Arc::new(
        OrganizeService::new(Arc::clone(&rig.lab.db)).with_disk(Arc::new(disk)),
    ));
    let item = rig.loose_movie();

    rig.scrape(item, "1").await;

    // The scrape happened.
    assert!(!rig.lab.item(item).core.last_scraper_id.is_empty());
    // The video and its subtitle stay loose, and no half-made folder holds any of them.
    assert!(rig.library.join("Das Boot.mkv").is_file());
    assert!(rig.library.join("Das Boot.en.srt").is_file());
    assert!(
        rig.library.join("Das Boot.nfo").is_file(),
        "{:?}",
        names(&rig.library)
    );
    assert!(rig.library.join("Das Boot-poster.jpg").is_file());
    let moved_somewhere = names(&rig.library)
        .iter()
        .any(|name| rig.library.join(name).is_dir() && name != ".deletedByCineVault");
    assert!(!moved_somewhere, "{:?}", names(&rig.library));
    assert_eq!(
        PathBuf::from(&rig.lab.item(item).core.path),
        rig.library,
        "the library row was not changed"
    );
    // Activity says why.
    let notices = rig.notices.lock().unwrap();
    let notice = notices
        .iter()
        .find(|n| {
            n.title
                .starts_with("No folder was made for Das Boot (1981)")
        })
        .unwrap_or_else(|| panic!("{:?}", notices.iter().map(|n| &n.title).collect::<Vec<_>>()));
    assert_eq!(notice.level, cv_app::notices::NoticeLevel::Warning);
    assert!(notice.detail.is_some());
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn a_folder_that_holds_another_title_is_not_merged_into() {
    let rig = rig();
    // Another movie of the library already lives in the folder the scrape would make.
    let taken = rig.library.join("Das Boot (1981)");
    fs::create_dir_all(&taken).unwrap();
    fs::write(taken.join("Other.mkv"), b"other").unwrap();
    let mut other = Item::movie("Das Boot Directors Cut");
    other.core.year = 1981;
    other.core.path = taken.to_string_lossy().into_owned();
    other.core.data_source = rig.library.to_string_lossy().into_owned();
    other.core.media_files.push(MediaFile::new(
        MediaFileType::Video,
        taken.to_string_lossy(),
        "Other.mkv",
    ));
    let other = rig.lab.add(other);
    let item = rig.loose_movie();

    rig.scrape(item, "1").await;

    assert_eq!(names(&taken), ["Other.mkv"], "nothing was merged into it");
    assert!(rig.library.join("Das Boot.mkv").is_file());
    assert!(rig.library.join("Das Boot.nfo").is_file());
    assert_eq!(
        PathBuf::from(&rig.lab.item(other).core.path),
        taken,
        "the other title is untouched"
    );
    assert!(
        rig.notice_titles()
            .iter()
            .any(|title| title.starts_with("No folder was made for Das Boot (1981)")),
        "{:?}",
        rig.notice_titles()
    );
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn undoing_the_folder_step_puts_the_video_back_where_it_was() {
    let rig = rig();
    let item = rig.loose_movie();
    rig.scrape(item, "1").await;
    let folder = rig.library.join("Das Boot (1981)");
    assert!(folder.join("Das Boot.mkv").is_file());

    // The folder step is a journaled rename batch of its own: History lists it with its Undo.
    let organize = OrganizeService::new(Arc::clone(&rig.lab.db));
    let batch = organize
        .journal()
        .unwrap()
        .into_iter()
        .next()
        .expect("the move was journaled");
    let outcome = organize.undo(&batch.batch_id).unwrap();
    assert!(
        outcome.not_restorable.is_empty() && outcome.failed.is_empty(),
        "{outcome:?}"
    );

    assert!(rig.library.join("Das Boot.mkv").is_file());
    assert!(rig.library.join("Das Boot.en.srt").is_file());
    let stored = rig.lab.item(item);
    let video = stored
        .core
        .media_files
        .iter()
        .find(|f| f.kind == MediaFileType::Video)
        .unwrap();
    assert_eq!(PathBuf::from(&video.directory), rig.library);
    assert_eq!(
        PathBuf::from(&stored.core.path),
        rig.library,
        "the title is back in the library folder"
    );
    // What the steps after the move wrote is not part of that batch: the NFO and the artwork stay
    // in the folder, and the library still lists them there.
    assert_eq!(names(&folder), ["Das Boot-poster.jpg", "Das Boot.nfo"]);
    for kind in [MediaFileType::Nfo, MediaFileType::Poster] {
        let file = stored
            .core
            .media_files
            .iter()
            .find(|f| f.kind == kind)
            .unwrap();
        assert!(file.path().is_file(), "{}", file.path().display());
    }
}

// ---- what the Scrape preview announces ------------------------------------------------------

fn candidate() -> cv_app::match_service::PreviewCandidate {
    cv_app::match_service::PreviewCandidate {
        provider: "ofdb".to_owned(),
        provider_id: "1".to_owned(),
        title: "Das Boot".to_owned(),
        year: Some(1981),
        runtime_minutes: Some(149),
        overview: None,
    }
}

impl Rig {
    fn announces_folder(&self, item: ItemId) -> bool {
        self.matching
            .scrape_preview_stream(item, &candidate(), "de")
            .expect("a preview")
            .folder_step
    }
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn the_preview_announces_the_folder_step_for_a_loose_movie_only() {
    let rig = rig();
    let loose = rig.loose_movie();
    let (own, _) = rig.movie();

    assert!(rig.announces_folder(loose), "a loose movie gets a folder");
    assert!(
        !rig.announces_folder(own),
        "a movie with a folder of its own keeps it"
    );

    // The preview asks the same test as the step, so what it announces is what the step does.
    assert_eq!(
        rig.follow_up.place_in_folder(own).await,
        FolderStep::NotNeeded
    );
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn what_the_preview_announces_is_what_the_scrape_does() {
    let rig = rig();
    let loose = rig.loose_movie();
    assert!(rig.announces_folder(loose));
    rig.scrape(loose, "1").await;
    assert!(
        rig.library
            .join("Das Boot (1981)")
            .join("Das Boot.mkv")
            .is_file()
    );
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn the_preview_announces_no_folder_with_the_switch_off_or_metadata_only() {
    let rig = rig();
    let loose = rig.loose_movie();
    assert!(rig.announces_folder(loose));

    rig.settings
        .set("library.folder-loose-files", serde_json::json!(false))
        .unwrap();
    assert!(!rig.announces_folder(loose), "the switch is off");

    rig.settings
        .set("library.folder-loose-files", serde_json::json!(true))
        .unwrap();
    rig.settings
        .set("renamer.metadata-only", serde_json::json!(true))
        .unwrap();
    assert!(!rig.announces_folder(loose), "Metadata only moves nothing");
}

// ---- undoing a scrape takes the folder step back too -----------------------------------------

/// The files directly in `folder`, without CineVault's own trash folder.
fn visible(folder: &std::path::Path) -> Vec<String> {
    names(folder)
        .into_iter()
        .filter(|name| name != ".deletedByCineVault")
        .collect()
}

/// What CineVault's trash folder of the library holds, by file name.
fn trashed(rig: &Rig) -> Vec<String> {
    fn walk(dir: &std::path::Path, out: &mut Vec<String>) {
        let Ok(entries) = fs::read_dir(dir) else {
            return;
        };
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                walk(&path, out);
            } else {
                out.push(entry.file_name().to_string_lossy().into_owned());
            }
        }
    }
    let mut out = Vec::new();
    walk(&rig.library.join(".deletedByCineVault"), &mut out);
    out.sort();
    out
}

async fn until(what: &str, mut ready: impl FnMut() -> bool) {
    let deadline = std::time::Instant::now() + std::time::Duration::from_secs(30);
    while !ready() {
        assert!(std::time::Instant::now() < deadline, "timed out: {what}");
        tokio::time::sleep(std::time::Duration::from_millis(50)).await;
    }
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn undoing_a_scrape_puts_the_video_and_subtitle_back_and_gives_up_the_empty_folder() {
    let rig = rig();
    let item = rig.loose_movie();
    let folder = rig.library.join("Das Boot (1981)");
    let token = rig.matching.keep_scrape_snapshot(item).expect("a snapshot");
    rig.scrape(item, "1").await;
    assert_eq!(
        names(&folder),
        [
            "Das Boot-poster.jpg",
            "Das Boot.en.srt",
            "Das Boot.mkv",
            "Das Boot.nfo"
        ]
    );

    rig.matching.undo_scrape(token).unwrap();

    // The fields are back at once; the move is taken back in the background.
    until("the folder is given up", || !folder.exists()).await;
    let root = visible(&rig.library);
    assert!(root.contains(&"Das Boot.mkv".to_owned()), "{root:?}");
    assert!(root.contains(&"Das Boot.en.srt".to_owned()), "{root:?}");
    assert_eq!(
        fs::read(rig.library.join("Das Boot.mkv")).unwrap(),
        b"video"
    );
    assert_eq!(
        fs::read(rig.library.join("Das Boot.en.srt")).unwrap(),
        b"subtitle"
    );
    // The poster and the NFO the scrape wrote into the folder went to CineVault's trash folder,
    // not to nowhere.
    let bin = trashed(&rig);
    assert!(bin.contains(&"Das Boot-poster.jpg".to_owned()), "{bin:?}");
    assert!(bin.contains(&"Das Boot.nfo".to_owned()), "{bin:?}");
    // The library follows: the title is in the library folder, every file it lists exists, and
    // none is listed in the folder that is gone.
    let stored = rig.lab.item(item);
    assert_eq!(PathBuf::from(&stored.core.path), rig.library);
    assert_eq!(
        stored.core.plot, "",
        "the fields are the ones before the scrape"
    );
    for file in &stored.core.media_files {
        assert!(file.path().is_file(), "{}", file.path().display());
        assert_ne!(PathBuf::from(&file.directory), folder);
    }
    assert!(
        stored
            .core
            .media_files
            .iter()
            .any(|f| f.kind == MediaFileType::Video)
    );
    assert!(
        !rig.notice_titles()
            .iter()
            .any(|title| title.contains("stays in the folder")),
        "{:?}",
        rig.notice_titles()
    );
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn the_move_of_an_undone_scrape_reads_undone_in_history() {
    use cv_app::history::{HistoryService, UndoState};
    let rig = rig();
    let item = rig.loose_movie();
    let token = rig.matching.keep_scrape_snapshot(item).expect("a snapshot");
    rig.scrape(item, "1").await;
    let history = HistoryService::new(Arc::clone(&rig.lab.db));
    let entries = history.for_title(item, 10).unwrap();
    assert_eq!(entries.len(), 1, "the move is the one entry of the title");
    assert_eq!(entries[0].undo_state, UndoState::Available);

    rig.matching.undo_scrape(token).unwrap();
    until("the move is taken back", || {
        history.for_title(item, 10).unwrap()[0].undo_state == UndoState::Undone
    })
    .await;
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn an_undo_after_the_video_was_renamed_by_hand_leaves_everything_and_can_be_tried_again() {
    let rig = rig();
    let item = rig.loose_movie();
    let folder = rig.library.join("Das Boot (1981)");
    let token = rig.matching.keep_scrape_snapshot(item).expect("a snapshot");
    rig.scrape(item, "1").await;
    // The user renames the video inside its new folder.
    fs::rename(folder.join("Das Boot.mkv"), folder.join("Das Boot HD.mkv")).unwrap();
    let before = names(&folder);

    rig.matching.undo_scrape(token).unwrap();

    until("the reason is told", || {
        rig.notice_titles().iter().any(|title| {
            title.starts_with("The video of Das Boot") && title.contains("stays in the folder")
        })
    })
    .await;
    // Nothing moved, nothing was lost: every file is where it was, in the folder.
    assert_eq!(names(&folder), before);
    assert_eq!(fs::read(folder.join("Das Boot HD.mkv")).unwrap(), b"video");
    assert_eq!(trashed(&rig), Vec::<String>::new());
    // Asking again says the same, still without touching a file.
    assert!(matches!(
        rig.follow_up.undo_placement(item).await,
        PlacementUndo::Left(_)
    ));
    assert_eq!(names(&folder), before);

    // Once the name is back the same undo goes through.
    fs::rename(folder.join("Das Boot HD.mkv"), folder.join("Das Boot.mkv")).unwrap();
    assert_eq!(
        rig.follow_up.undo_placement(item).await,
        PlacementUndo::Undone
    );
    assert!(rig.library.join("Das Boot.mkv").is_file());
    assert!(rig.library.join("Das Boot.en.srt").is_file());
    assert!(!folder.exists());
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn undoing_the_folder_step_twice_or_without_one_changes_nothing() {
    {
        let rig = rig();
        let (plain, plain_folder) = rig.movie();
        rig.scrape(plain, "1").await;
        let before = names(&plain_folder);
        assert_eq!(
            rig.follow_up.undo_placement(plain).await,
            PlacementUndo::NothingToUndo,
            "a movie that had its folder was not moved"
        );
        assert_eq!(names(&plain_folder), before);
    }

    let rig = rig();
    let item = rig.loose_movie();
    rig.scrape(item, "1").await;
    assert_eq!(
        rig.follow_up.undo_placement(item).await,
        PlacementUndo::Undone
    );
    let root = visible(&rig.library);
    assert_eq!(
        rig.follow_up.undo_placement(item).await,
        PlacementUndo::NothingToUndo
    );
    assert_eq!(visible(&rig.library), root, "the second undo moved nothing");
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn an_undo_after_the_move_was_undone_in_history_still_gives_up_the_folder() {
    use cv_app::history::HistoryService;
    let rig = rig();
    let item = rig.loose_movie();
    rig.scrape(item, "1").await;
    let folder = rig.library.join("Das Boot (1981)");
    // The user undoes "Renamed" in History first: the video is back, the NFO and the poster stay.
    let history = HistoryService::new(Arc::clone(&rig.lab.db));
    let entry = history.for_title(item, 10).unwrap()[0].id;
    let report = history.undo(entry).unwrap();
    assert!(report.left.is_empty(), "{report:?}");
    assert_eq!(names(&folder), ["Das Boot-poster.jpg", "Das Boot.nfo"]);

    // Undoing the scrape then does not try to move the files again, and loses none: the NFO and
    // the poster go to the trash folder and the empty folder goes.
    assert_eq!(
        rig.follow_up.undo_placement(item).await,
        PlacementUndo::Undone
    );
    assert!(!folder.exists());
    assert!(rig.library.join("Das Boot.mkv").is_file());
    assert_eq!(
        trashed(&rig),
        ["Das Boot-poster.jpg", "Das Boot.nfo"],
        "the files the scrape wrote are in the trash folder"
    );
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn the_history_undo_of_a_change_of_match_takes_the_move_back_first() {
    use cv_app::history::{HistoryKind, HistoryService, UndoState};
    let rig = rig();
    let item = rig.loose_movie();
    // The title is linked to another entry of the database already, so scraping it with this one
    // is a change of match: History records an entry for it.
    rig.lab
        .db
        .write(move |tx| {
            let mut stored = cv_db::repo::get_item(tx, item)?.unwrap();
            stored.core.ids.set("ofdb", "9");
            stored.core.ids.set("imdb", "tt0000009");
            cv_db::repo::update_item(tx, &stored)
        })
        .unwrap();
    let (_, entry) = rig
        .matching
        .scrape_apply_recorded(
            item,
            &ScrapeApply {
                provider: "ofdb".to_owned(),
                provider_id: "1".to_owned(),
                language: "de".to_owned(),
                fields: cv_domain::all_fields()
                    .iter()
                    .map(|f| f.key().to_owned())
                    .collect(),
                do_not_overwrite: false,
                second_version: false,
            },
        )
        .await
        .expect("scrape");
    let entry = entry.expect("a change of match is a History entry");
    rig.follow_ups_done().await;
    let folder = rig.library.join("Das Boot (1981)");
    assert!(folder.join("Das Boot.mkv").is_file());

    let report = rig.matching.undo_entry(entry, None).await.unwrap();

    assert!(report.left.is_empty(), "{report:?}");
    assert!(rig.library.join("Das Boot.mkv").is_file());
    assert!(rig.library.join("Das Boot.en.srt").is_file());
    assert!(!folder.exists(), "{:?}", names(&rig.library));
    // Both entries of the title read Undone: the scrape and the move it made.
    let history = HistoryService::new(Arc::clone(&rig.lab.db));
    let entries = history.for_title(item, 10).unwrap();
    assert_eq!(entries.len(), 2, "{entries:?}");
    assert!(
        entries.iter().all(|e| e.undo_state == UndoState::Undone),
        "{entries:?}"
    );
    assert!(entries.iter().any(|e| e.kind == HistoryKind::Match));
    assert!(entries.iter().any(|e| e.kind == HistoryKind::Rename));
}
