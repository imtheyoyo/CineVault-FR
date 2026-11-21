import { afterEach, describe, expect, it } from "vitest";

import { catalogueOf, setCatalogueLanguage, t } from "./catalog";
import { resolveLanguage } from "./language";

const en = catalogueOf("en");
const fr = catalogueOf("fr");

/** The `{name}` parameters a template inserts, ignoring the words inside plural branches. */
function parameters(template: string): string[] {
  const names = new Set<string>();
  let depth = 0;
  let start = -1;
  for (let i = 0; i < template.length; i += 1) {
    const ch = template[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        const body = template.slice(start + 1, i);
        names.add(body.split(",")[0]?.trim() ?? "");
      }
    }
  }
  return [...names].sort();
}

describe("the French catalogue", () => {
  it("has exactly the keys of the English one", () => {
    expect(Object.keys(fr).sort()).toEqual(Object.keys(en).sort());
  });

  it("is never empty or left as the English text for a sentence", () => {
    for (const [key, text] of Object.entries(fr)) {
      expect(text.trim(), key).not.toBe("");
    }
  });

  it("inserts the same parameters as the English message", () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(parameters(fr[key]), key).toEqual(parameters(en[key]));
    }
  });

  it("gives every plural an `other` branch", () => {
    for (const [key, text] of Object.entries(fr)) {
      if (text.includes(", plural,")) expect(text, key).toMatch(/other\s*\{/);
    }
  });

  it("has no unbalanced braces", () => {
    for (const [key, text] of Object.entries(fr)) {
      let depth = 0;
      for (const ch of text) depth += ch === "{" ? 1 : ch === "}" ? -1 : 0;
      expect(depth, key).toBe(0);
    }
  });
});

describe("the interface language", () => {
  afterEach(() => setCatalogueLanguage("en"));

  it("follows the system language when it has a catalogue, English otherwise", () => {
    expect(resolveLanguage("system", ["fr-FR", "en-US"])).toBe("fr");
    expect(resolveLanguage("system", ["de-DE", "fr-FR"])).toBe("fr");
    expect(resolveLanguage("system", ["de-DE"])).toBe("en");
    expect(resolveLanguage("system", [])).toBe("en");
  });

  it("honours an explicit choice over the system language", () => {
    expect(resolveLanguage("en", ["fr-FR"])).toBe("en");
    expect(resolveLanguage("fr", ["en-US"])).toBe("fr");
    expect(resolveLanguage("klingon", ["fr-FR"])).toBe("fr");
  });

  it("renders French messages with French plural rules and number formats", () => {
    setCatalogueLanguage("fr");
    expect(t("library.scan")).toBe(fr["library.scan"]);
    expect(t("library.scan")).not.toBe(en["library.scan"]);
    setCatalogueLanguage("en");
    expect(t("library.scan")).toBe("Scan folders now");
  });
});
