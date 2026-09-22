import { describe, it, expect } from "vitest";
import { produkter, productBySlug } from "@/lib/produkter";
import { SUBNAV_TABLES, pillSlug, pillsFor } from "@/lib/subnav";

describe("SUBNAV_TABLES", () => {
  it("only names real products, real pill labels and real tables", () => {
    for (const [id, map] of Object.entries(SUBNAV_TABLES)) {
      const p = productBySlug(id);
      expect(p, id).toBeDefined();
      for (const [label, tables] of Object.entries(map)) {
        expect(p!.subnav, `${id}: ${label}`).toContain(label);
        expect(new Set(tables).size, `${id}: ${label}`).toBe(tables.length);
        for (const t of tables) {
          expect(t).toBeGreaterThanOrEqual(0);
          expect(t).toBeLessThan(p!.tables.length);
        }
      }
    }
  });

  it("covers every product that has pills, with the first pill holding every table on the page", () => {
    for (const p of produkter.filter((p) => p.subnav.length > 0)) {
      expect(SUBNAV_TABLES[p.id], p.id).toBeDefined();
      expect(pillsFor(p)[0].tables, p.id).toEqual(p.tables.map((_, i) => i));
    }
  });
});

// The mapping is hand-maintained; these lock it to the data it was read from,
// so a re-scrape that changes the tables fails here instead of silently
// putting products under the wrong pill.
describe("the evidence behind the mapping", () => {
  it("snittringmatur's rows are all WE (vinkel) fittings", () => {
    const p = productBySlug("snittringmatur")!;
    for (const t of p.tables) {
      const type = t.headers.indexOf("Type");
      expect(type).toBeGreaterThanOrEqual(0);
      // One row is typed 'We 5LLR 1/8" ZN' in the source data — same fitting.
      for (const row of t.rows) expect(row[type]).toMatch(/^WE /i);
    }
  });
  it("lynfittings' only table is the straight GE fitting", () => {
    const p = productBySlug("lynfittings")!;
    expect(p.tables).toHaveLength(1);
    expect(p.tables[0].heading).toContain('rett "GE"');
  });
  it("fylleutstyr's own caption names the fyllepresse", () => {
    expect(productBySlug("fylleutstyr")!.intro.join(" ")).toContain("Fyllepresse");
  });
});

describe("pillsFor", () => {
  it("returns every label in order, with unique slugs, and no tables for unpublished sub-types", () => {
    for (const p of produkter) {
      const pills = pillsFor(p);
      expect(pills.map((x) => x.label)).toEqual(p.subnav);
      expect(new Set(pills.map((x) => x.slug)).size).toBe(pills.length);
    }
    expect(pillsFor(productBySlug("rørender")!).map((x) => [x.slug, x.tables.length])).toEqual([
      ["rorender-rette", 9],
      ["rorender-90-grader", 0],
      ["rorender-45-grader", 0],
    ]);
  });
  it("returns nothing for a product without pills", () => {
    expect(pillsFor(productBySlug("fett")!)).toEqual([]);
  });
});

describe("pillSlug", () => {
  it("folds Norwegian letters, degree signs and quotes into a URL-safe slug", () => {
    expect(pillSlug('90° "WE" dreibar')).toBe("90-we-dreibar");
    expect(pillSlug("Høytrykkslange")).toBe("hoytrykkslange");
    expect(pillSlug("Banjokobling utv./innv.")).toBe("banjokobling-utv-innv");
    expect(pillSlug("Skottgjennomføring 90 grader")).toBe("skottgjennomforing-90-grader");
  });
});
