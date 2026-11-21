import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { setCatalogueLanguage } from "../../i18n/catalog";
import { ChangeCard } from "./CandidateDetails";
import { NowAfterCard } from "./NowAfterCard";
import { hitOfCandidate } from "./scrapeBackend";
import type { TitleSubject } from "./titleSubject";

/**
 * "What will change" says what happens to the folder: it stays until Rename, or, for a loose movie
 * with the folder switch on, a folder of its own is created and the file moved into it before the
 * NFO and artwork are written (spec `title-matching`, "Scrape page evidence and what will change").
 */

const CREATED_EN =
  "A folder of its own is created for this movie and the file moved into it first, then the NFO and artwork are written there";
const CREATED_FR =
  "Un dossier propre au film est créé et le fichier y est déplacé d’abord, puis le NFO et les illustrations y sont écrits";

const hit = hitOfCandidate(
  {
    provider: "tmdb",
    providerId: "949",
    title: "Heat",
    originalTitle: null,
    year: 1995,
    director: "Michael Mann",
    runtimeMinutes: 170,
    language: null,
    overview: null,
    posterKey: null,
    confidence: 0.9,
    rank: 0.9,
    evidence: [],
    breakdown: { similarity: 0.9, yearPenalty: 0, posterPenalty: 0, evidence: 0 },
  },
  "test",
);

const subject: TitleSubject = {
  id: "1",
  kind: "movie",
  title: "heat dvdrip",
  year: 0,
  ids: [],
  lifecycle: null,
  poster: null,
  backdrop: null,
  folder: "F:\\Movies",
  runtimeMinutes: 0,
  directors: [],
  plot: "",
  availability: "",
  fileName: "heat dvdrip.mkv",
  fileBytes: null,
  durationSeconds: null,
  metadataFiles: 0,
};

const change = (folderStep: boolean | null) => (
  <ChangeCard
    nowName="heat dvdrip.mkv"
    hit={hit}
    kind="movie"
    fromNew
    artworkCount={3}
    folderStep={folderStep}
  />
);

afterEach(() => setCatalogueLanguage("en"));

describe("the folder line of What will change", () => {
  it("says the folder stays until Rename for a movie that has its own folder", () => {
    render(change(false));
    expect(screen.getByTestId("change-folder")).toHaveTextContent("stays as is until you Rename");
  });

  it("says the folder is made and the file moved first for a loose movie", () => {
    render(change(true));
    expect(screen.getByTestId("change-folder")).toHaveTextContent(CREATED_EN);
    expect(screen.queryByText(/stays as is/)).toBeNull();
  });

  it("claims nothing about the folder until the preview has answered", () => {
    render(change(null));
    expect(screen.getByTestId("change-folder")).toHaveTextContent("Checking…");
    expect(screen.queryByText(/stays as is/)).toBeNull();
  });

  it("says each of the three in French", () => {
    setCatalogueLanguage("fr");
    const { rerender } = render(change(false));
    expect(screen.getByTestId("change-folder")).toHaveTextContent(
      "reste inchangé jusqu’au prochain renommage",
    );
    rerender(change(true));
    expect(screen.getByTestId("change-folder")).toHaveTextContent(CREATED_FR);
    rerender(change(null));
    expect(screen.getByTestId("change-folder")).toHaveTextContent("Vérification…");
  });
});

describe("the Folder row of the Now and After comparison", () => {
  const card = (folderStep: boolean | null) => (
    <NowAfterCard subject={subject} hit={hit} sameMatch={false} folderStep={folderStep} />
  );

  it("keeps the next Rename wording for a movie that has its own folder", () => {
    render(card(false));
    const region = screen.getByRole("region", { name: "What will change" });
    expect(within(region).getByText("at next Rename")).toBeInTheDocument();
  });

  it("says the folder is made first for a loose movie, in English and in French", () => {
    const { rerender } = render(card(true));
    const region = screen.getByRole("region", { name: "What will change" });
    expect(within(region).getByText(CREATED_EN)).toBeInTheDocument();
    expect(within(region).queryByText("at next Rename")).toBeNull();
    setCatalogueLanguage("fr");
    rerender(card(true));
    expect(
      within(screen.getByRole("region", { name: "Ce qui va changer" })).getByText(CREATED_FR),
    ).toBeInTheDocument();
  });
});
