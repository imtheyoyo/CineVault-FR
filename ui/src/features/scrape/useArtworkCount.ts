import { useMemo, useState } from "react";

import { useSetting } from "../settings/settingsStore";
import { useDebounced } from "../workspaces/useDebounced";
import { useProviderStream } from "../workspaces/useProviderStream";
import { currentScrapeBackend } from "./scrapeBackend";
import type { ScrapeFieldDiff, ScrapeStreamHit } from "./scrapeBackend";
import { mergeDiffRows } from "./scrapeModel";

/** How long the choice rests before its details are asked for (arrowing through the list is free). */
const REST_MS = 450;

/** The preview of scraping with one candidate, and what the preview says about the title itself. */
export interface CandidatePreview {
  /** Every field the provider has; `null` until the details have arrived. */
  rows: ScrapeFieldDiff[] | null;
  /**
   * Scraping gives the movie a folder of its own first (a loose movie, with the switch on), so
   * the folder is created and the video moved before the NFO and artwork are written. `null`
   * until the preview has answered: nothing is claimed about the folder before that.
   */
  folderStep: boolean | null;
}

/**
 * Every field the provider has for `hit`, as the preview of scraping with it, and whether the
 * scrape would first give the movie a folder of its own. The rows are `null` until the details
 * have arrived (and while the choice is still moving), empty when the provider had none. The
 * preview writes nothing.
 */
export function useCandidatePreviewState(
  itemId: string,
  hit: ScrapeStreamHit | null,
  enabled = true,
): CandidatePreview {
  const backend = currentScrapeBackend();
  const language = useSetting<string>("metadata.language");
  // What the preview said about this title: it does not depend on the candidate, so it stays
  // while the choice moves and is forgotten only when another title opens.
  const [told, setTold] = useState<{ itemId: string; folderStep: boolean } | null>(null);
  const transport = useMemo(
    () => backend.previewTransport((start) => setTold({ itemId, folderStep: start.folderStep })),
    [backend, itemId],
  );
  const settled = useDebounced(hit?.id ?? "", REST_MS);
  const ready = enabled && hit !== null && settled === hit.id;
  const candidate = useMemo(
    () =>
      hit === null
        ? ""
        : JSON.stringify({
            provider: hit.candidate.provider,
            providerId: hit.candidate.providerId,
            title: hit.candidate.title,
            year: hit.candidate.year,
            runtimeMinutes: hit.candidate.runtimeMinutes,
            overview: hit.candidate.overview,
          }),
    [hit],
  );
  const preview = useProviderStream({
    transport,
    query: ready ? settled : "",
    params: { itemId, language, candidate },
    enabled: ready,
  });
  const rows = useMemo(() => mergeDiffRows(preview.items), [preview.items]);
  const done = ready && !preview.searching;
  // A preview that ended without saying (the call failed) claims no folder step.
  const known = told?.itemId === itemId ? told.folderStep : done ? false : null;
  return { rows: done ? rows : null, folderStep: known };
}

/** The rows of [`useCandidatePreviewState`]: `null` until the details have arrived. */
export function useCandidatePreview(
  itemId: string,
  hit: ScrapeStreamHit | null,
  enabled = true,
): ScrapeFieldDiff[] | null {
  return useCandidatePreviewState(itemId, hit, enabled).rows;
}

/** How many artwork files scraping would write, from the preview `rows`; `null` until they arrive. */
export function artworkCountOf(rows: readonly ScrapeFieldDiff[] | null): number | null {
  if (rows === null || rows.length === 0) return null;
  return rows.filter((row) => row.group === "artwork" && row.incoming !== null).length;
}

/** How many artwork files scraping with `hit` would write: `null` until the details arrive. */
export function useArtworkCount(
  itemId: string,
  hit: ScrapeStreamHit | null,
  enabled = true,
): number | null {
  return artworkCountOf(useCandidatePreview(itemId, hit, enabled));
}
