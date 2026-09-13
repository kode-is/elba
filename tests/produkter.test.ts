import { describe, it, expect } from "vitest";
import { produkter, productBySlug } from "@/lib/produkter";
import { PRODUKT_SLUGS } from "@/lib/routes";

describe("produkter", () => {
  it("has one record per product route with at least one table", () => {
    expect(produkter.map((p) => p.id).sort()).toEqual([...PRODUKT_SLUGS].sort());
    for (const p of produkter) {
      expect(p.title).toBeTruthy();
      expect(p.tables.length).toBeGreaterThan(0);
      for (const t of p.tables) {
        expect(t.headers.length).toBeGreaterThan(1);
        expect(t.rows.length).toBeGreaterThan(0);
        expect(t.headers).not.toEqual(["Name", "Email", "Role", "Status"]);
      }
      expect(p.erpId).toBeUndefined();
    }
  });

  it("fett has the live table", () => {
    const fett = productBySlug("fett")!;
    expect(fett.tables[0].headers).toEqual([
      "Forpakning", "NLGI", "Fortykker", "Tilsats", "Belastning", "Tilkobling", "Temp", "Art.Nr.",
    ]);
    expect(fett.tables[0].rows).toHaveLength(7);
  });

  it("rørender has nine variant tables", () => {
    expect(productBySlug("rørender")!.tables).toHaveLength(9);
  });

  it("rørender's subnav matches the live sub-navigation labels", () => {
    expect(productBySlug("rørender")!.subnav).toEqual(["Rørender rette", "Rørender 90 grader", "Rørender 45 grader"]);
  });

  it("never carries a stray zero-width space into subnav or title", () => {
    for (const p of produkter) {
      expect(p.title).not.toContain("​");
      for (const label of p.subnav) expect(label).not.toContain("​");
    }
  });
});
