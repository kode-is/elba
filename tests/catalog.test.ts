import { describe, it, expect } from "vitest";
import { produkter } from "@/lib/produkter";
import {
  EMPTY_QUERY, buildCatalog, groupResults, isActive, normalize, parseQuery, searchCatalog, toSearchString,
} from "@/lib/catalog";

const items = buildCatalog(produkter);
const search = (q: Partial<typeof EMPTY_QUERY>) => searchCatalog(items, { ...EMPTY_QUERY, ...q });

describe("buildCatalog", () => {
  it("has one item per table row, with unique keys", () => {
    const rows = produkter.reduce((n, p) => n + p.tables.reduce((m, t) => m + t.rows.length, 0), 0);
    expect(items).toHaveLength(rows);
    expect(new Set(items.map((i) => i.key)).size).toBe(rows);
  });
  it("reads Art.Nr. from either spelling of the column", () => {
    expect(items.filter((i) => i.categoryId === "skruhylser").every((i) => i.artNr !== "")).toBe(true); // "Art.Nr"
    expect(items.filter((i) => i.categoryId === "fett").every((i) => i.artNr !== "")).toBe(true); // "Art.Nr."
  });
  it("derives material from the table heading, else the Material column", () => {
    const of = (categoryId: string, heading: string | null) =>
      new Set(items.filter((i) => i.categoryId === categoryId && i.heading === heading).map((i) => i.material));
    expect(of("forlengere", "Forsinket stål (Zn-Ni)")).toEqual(new Set(["forsinket"]));
    expect(of("forlengere", "Syrefast (316 / V4A)")).toEqual(new Set(["syrefast"]));
    expect(of("forlengere", "Messing")).toEqual(new Set(["messing"]));
    expect(of("rørender", "Forsinket (svart)")).toEqual(new Set(["forsinket"]));
    expect(of("fett", null)).toEqual(new Set([null]));
    const skruhylser = items.filter((i) => i.categoryId === "skruhylser");
    expect(new Set(skruhylser.map((i) => i.material))).toEqual(new Set(["forsinket", "syrefast"]));
  });
});

describe("normalize", () => {
  it("lower-cases, strips Norwegian letters and diacritics, unifies separators", () => {
    expect(normalize("  Rørender  ")).toBe("rorender");
    expect(normalize("Skottgjennomføring")).toBe("skottgjennomforing");
    expect(normalize("Forsinket stål")).toBe("forsinket stal");
    expect(normalize("Ø 8,6")).toBe("o 8.6");
    expect(normalize("M 10×1")).toBe("m 10x1");
  });
});

describe("searchCatalog", () => {
  it("finds an article number with or without its spaces", () => {
    expect(search({ q: "0401 4701 013" }).map((i) => i.artNr)).toEqual(["0401 4701 013"]);
    expect(search({ q: "04014701013" }).map((i) => i.artNr)).toEqual(["0401 4701 013"]);
  });
  it("matches category names without diacritics", () => {
    const all = items.filter((i) => i.categoryId === "rørender");
    expect(search({ q: "rorender" })).toEqual(all);
    expect(search({ q: "RØRENDER" })).toEqual(all);
  });
  it("matches a thread size typed without the space", () => {
    const hits = search({ q: "M10x1" });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((i) => i.cells.includes("M 10x1"))).toBe(true);
  });
  it("requires every token (AND)", () => {
    const hits = search({ q: "forlengere messing" });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((i) => i.categoryId === "forlengere" && i.material === "messing")).toBe(true);
  });
  it("filters by category (OR within the facet)", () => {
    const hits = search({ categories: ["fett", "slanger"] });
    expect(new Set(hits.map((i) => i.categoryId))).toEqual(new Set(["fett", "slanger"]));
    expect(hits).toHaveLength(items.filter((i) => i.categoryId === "fett" || i.categoryId === "slanger").length);
  });
  it("hides items without a material only while a material filter is on", () => {
    expect(search({ categories: ["fett"] }).length).toBeGreaterThan(0);
    expect(search({ categories: ["fett"], materials: ["syrefast"] })).toEqual([]);
    expect(search({ materials: ["syrefast"] }).every((i) => i.material === "syrefast")).toBe(true);
  });
  it("combines facets with AND", () => {
    const hits = search({ categories: ["rørender"], materials: ["syrefast"], q: "8.6" });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((i) => i.categoryId === "rørender" && i.material === "syrefast")).toBe(true);
  });
  it("returns nothing for nonsense", () => {
    expect(search({ q: "xyzzy-finnes-ikke" })).toEqual([]);
  });
});

describe("groupResults", () => {
  it("groups by category then table, in catalog order, keeping every row", () => {
    const groups = groupResults(items);
    expect(groups.map((g) => g.categoryId)).toEqual(produkter.map((p) => p.id));
    const rørender = groups.find((g) => g.categoryId === "rørender")!;
    expect(rørender.tables).toHaveLength(9);
    expect(rørender.count).toBe(rørender.tables.reduce((n, t) => n + t.rows.length, 0));
    expect(groups.reduce((n, g) => n + g.count, 0)).toBe(items.length);
  });
  it("omits tables and categories with no matching rows", () => {
    const groups = groupResults(search({ q: "04014701013" }));
    expect(groups).toHaveLength(1);
    expect(groups[0].tables).toHaveLength(1);
    expect(groups[0].tables[0].rows).toHaveLength(1);
  });
});

describe("URL state", () => {
  it("round-trips a query", () => {
    const query = { q: "M10x1 syrefast", categories: ["rørender", "fett"], materials: ["syrefast" as const] };
    const s = toSearchString(query);
    expect(s.startsWith("?")).toBe(true);
    expect(parseQuery(new URLSearchParams(s))).toEqual(query);
  });
  it("serialises the empty query to an empty string", () => {
    expect(toSearchString(EMPTY_QUERY)).toBe("");
    expect(toSearchString({ ...EMPTY_QUERY, q: "   " })).toBe("");
    expect(parseQuery(new URLSearchParams(""))).toEqual(EMPTY_QUERY);
  });
  it("drops unknown materials", () => {
    expect(parseQuery(new URLSearchParams("materiale=gull,messing")).materials).toEqual(["messing"]);
  });
  it("isActive", () => {
    expect(isActive(EMPTY_QUERY)).toBe(false);
    expect(isActive({ ...EMPTY_QUERY, q: "  " })).toBe(false);
    expect(isActive({ ...EMPTY_QUERY, q: "a" })).toBe(true);
    expect(isActive({ ...EMPTY_QUERY, categories: ["fett"] })).toBe(true);
    expect(isActive({ ...EMPTY_QUERY, materials: ["messing"] })).toBe(true);
  });
});
