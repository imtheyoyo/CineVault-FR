/** The interface languages that have a message catalogue. */
export const LANGUAGES = ["en", "fr"] as const;
export type Language = (typeof LANGUAGES)[number];

/** The language preference that follows the operating system. */
export const LANGUAGE_SYSTEM = "system";

/** Used when the system language has no catalogue. */
export const FALLBACK_LANGUAGE: Language = "en";

/**
 * The language preference kept in local storage so the next start loads the right catalogue
 * before the settings file has been read (the catalogue is chosen once, when the page loads).
 * The settings stay the source of truth and overwrite it once loaded.
 */
export const LANGUAGE_KEY = "cv.language";

/** Whether `value` is a language that has a catalogue. */
export function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && (LANGUAGES as readonly string[]).includes(value);
}

/** The first system language (BCP 47 tags, most wanted first) that has a catalogue. */
function systemLanguage(tags: readonly string[]): Language {
  for (const tag of tags) {
    const primary = tag.trim().toLowerCase().split(/[-_]/)[0];
    if (isLanguage(primary)) return primary;
  }
  return FALLBACK_LANGUAGE;
}

/** The tags the webview reports for the operating system. */
function navigatorLanguages(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  return [...(navigator.languages ?? []), navigator.language].filter(
    (tag): tag is string => typeof tag === "string" && tag !== "",
  );
}

/** The catalogue language for a stored preference: `system`, or a language code. */
export function resolveLanguage(
  preference: string,
  systemTags: readonly string[] = navigatorLanguages(),
): Language {
  return isLanguage(preference) ? preference : systemLanguage(systemTags);
}

/** The preference saved by the last session, or `system` on a first start or without storage. */
export function readLanguagePreference(): string {
  try {
    const value = window.localStorage.getItem(LANGUAGE_KEY);
    return value !== null && (value === LANGUAGE_SYSTEM || isLanguage(value))
      ? value
      : LANGUAGE_SYSTEM;
  } catch {
    return LANGUAGE_SYSTEM;
  }
}

/** Remembers the preference for the next start. Storage that refuses the write is ignored. */
export function saveLanguagePreference(preference: string): void {
  try {
    window.localStorage.setItem(LANGUAGE_KEY, preference);
  } catch {
    // Without storage the next start follows the system language until the settings load.
  }
}
