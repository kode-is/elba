import { describe, it, expect } from "vitest";
import { artikler, articleBySlug } from "@/lib/artikler";
import { ARTIKKEL_SLUGS } from "@/lib/routes";

describe("artikler", () => {
  it("has one record per article, in the /artikler index's link order", () => {
    expect(artikler.map((a) => a.id)).toEqual(ARTIKKEL_SLUGS);
  });

  it("every article has a title and a non-empty body", () => {
    for (const a of artikler) {
      expect(a.title).toBeTruthy();
      expect(a.body.length).toBeGreaterThan(0);
    }
  });

  it("metaTitle always ends with ' — Elba' and never carries the live 'Skralli' suffix", () => {
    for (const a of artikler) {
      expect(a.metaTitle.endsWith(" — Elba")).toBe(true);
      expect(a.metaTitle).not.toContain("Skralli");
    }
  });

  it("nytt-eierskap's subtitle is the live page's second H1", () => {
    expect(articleBySlug("nytt-eierskap")!.subtitle).toBe(
      "Daglig leder kjøper opp Elba sammen med islendinger"
    );
  });
});
