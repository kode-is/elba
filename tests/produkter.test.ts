import { describe, it, expect } from "vitest";
import { produkter, productBySlug } from "@/lib/produkter";
import { PRODUKT_SLUGS } from "@/lib/routes";

const allTables = (id: string) => productBySlug(id)!.tabs.flatMap((t) => t.tables);
const rowsOf = (id: string) => allTables(id).reduce((n, t) => n + t.rows.length, 0);

describe("produkter", () => {
  it("has one record per product route, every tab holding real tables", () => {
    expect(produkter.map((p) => p.id).sort()).toEqual([...PRODUKT_SLUGS].sort());
    for (const p of produkter) {
      expect(p.title).toBeTruthy();
      expect(p.tabs.length).toBeGreaterThan(0);
      for (const tab of p.tabs) {
        expect(tab.tables.length, `${p.id}/${tab.label}`).toBeGreaterThan(0);
        for (const t of tab.tables) {
          expect(t.headers.length).toBeGreaterThan(1);
          expect(t.rows.length).toBeGreaterThan(0);
          expect(t.headers).not.toEqual(["Name", "Email", "Role", "Status"]);
          for (const row of t.rows) expect(row).toHaveLength(t.headers.length);
        }
      }
      expect(p.erpId).toBeUndefined();
    }
  });

  it("gives a labelled tab a slug and an unlabelled one none", () => {
    for (const p of produkter) {
      const labelled = p.tabs.filter((t) => t.label !== null);
      expect(labelled.map((t) => t.slug).every(Boolean)).toBe(true);
      expect(new Set(p.tabs.map((t) => t.slug)).size).toBe(p.tabs.length);
      // A product either has pills on every tab, or is a single unnamed tab.
      if (p.tabs.length === 1) expect(p.tabs[0].label === null || labelled.length === 1).toBe(true);
      else expect(labelled).toHaveLength(p.tabs.length);
    }
    expect(productBySlug("fett")!.tabs).toEqual([expect.objectContaining({ label: null, slug: "" })]);
  });

  // The sub-category tabs were missed by the original scrape: the site shows
  // 77 tables across these pages where the first release shipped 24.
  it("carries every sub-category tab, not just the first", () => {
    const rørender = productBySlug("rørender")!;
    expect(rørender.tabs.map((t) => t.label)).toEqual(["Rørender rette", "Rørender 90 grader", "Rørender 45 grader"]);
    expect(rørender.tabs.map((t) => t.tables.length)).toEqual([9, 5, 3]);
    expect(rowsOf("rørender")).toBe(69);

    expect(productBySlug("snittringmatur")!.tabs.map((t) => t.label)).toEqual([
      'Vinkel "WE"', 'Rett "GE"', 'Sammenkobling "G"', 'Sammenkobling "W"', "T-stykke", "Muttere", "Snittringer",
    ]);
    expect(rowsOf("snittringmatur")).toBe(157);

    expect(produkter.reduce((n, p) => n + p.tabs.reduce((m, t) => m + t.tables.length, 0), 0)).toBe(77);
    expect(produkter.reduce((n, p) => n + p.id.length * 0 + p.tabs.flatMap((t) => t.tables).reduce((m, t) => m + t.rows.length, 0), 0)).toBe(495);
  });

  it("the 90-degree tabs carry their own H dimension and their own article numbers", () => {
    const straight = productBySlug("rørender")!.tabs[0].tables[0];
    const bent = productBySlug("rørender")!.tabs[1].tables[0];
    expect(straight.headers).toEqual(["D", "For Slange", "L", "L1", "SW", "Art.Nr."]);
    expect(bent.headers).toEqual(["D", "For Slange", "H", "L", "SW", "Art.Nr."]);
    const artNrs = (t: typeof bent) => t.rows.map((r) => r[r.length - 1]);
    expect(artNrs(straight).some((a) => artNrs(bent).includes(a))).toBe(false);
  });

  it("fett has the live table", () => {
    const fett = productBySlug("fett")!.tabs[0].tables[0];
    expect(fett.headers).toEqual(["Forpakning", "NLGI", "Fortykker", "Tilsats", "Belastning", "Tilkobling", "Temp", "Art.Nr."]);
    expect(fett.rows).toHaveLength(7);
  });

  it("never carries a stray zero-width space into a tab label or title", () => {
    for (const p of produkter) {
      expect(p.title).not.toContain("​");
      for (const tab of p.tabs) expect(tab.label ?? "").not.toContain("​");
    }
  });

  it("every table image resolves to a file in public/images", () => {
    for (const p of produkter) {
      for (const t of p.tabs.flatMap((tab) => tab.tables)) {
        for (const image of t.images) {
          expect(image.src, `${p.id}`).toMatch(/^\/images\/produkter__/);
          expect(image.width).toBeGreaterThan(0);
          expect(image.height).toBeGreaterThan(0);
        }
      }
    }
  });
});
