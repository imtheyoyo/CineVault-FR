import { useEffect } from "react";

import { activeLanguage } from "../../i18n/catalog";
import { LANGUAGE_SYSTEM, resolveLanguage, saveLanguagePreference } from "../../i18n/language";
import { useLocaleStore } from "../../i18n/locale";
import type { SizeBase } from "../../i18n/locale";
import { useSetting, useSettingsStore } from "./settingsStore";

/** Reloads the page so every screen is drawn again from the new catalogue. Tests replace it. */
export const languageReload = {
  run: (): void => window.location.reload(),
};

/**
 * Applies the interface language (`general.language`), the regional format (`general.locale`)
 * and the file size units (`advanced.size-units`) as they change, so every date, number and
 * size in the app follows them at once. The catalogue is chosen when the page loads, so a
 * language that differs from the one in use is saved for the next start and the page reloads.
 */
export function useLocaleSettings(): void {
  const language = useSetting<string>("general.language");
  const locale = useSetting<string>("general.locale");
  const sizeUnits = useSetting<SizeBase>("advanced.size-units");
  const ready = useSettingsStore((state) => state.status === "ready");
  const setPreference = useLocaleStore((state) => state.setPreference);
  const setSizeBase = useLocaleStore((state) => state.setSizeBase);

  useEffect(() => {
    // Before the settings file is read the value is the default, which must not replace the
    // preference the last session saved.
    if (!ready) return;
    const preference = language ?? LANGUAGE_SYSTEM;
    saveLanguagePreference(preference);
    const wanted = resolveLanguage(preference);
    document.documentElement.lang = wanted;
    if (wanted !== activeLanguage()) languageReload.run();
  }, [language, ready]);

  useEffect(() => {
    setPreference(locale);
  }, [locale, setPreference]);

  useEffect(() => {
    setSizeBase(sizeUnits);
  }, [sizeUnits, setSizeBase]);
}
