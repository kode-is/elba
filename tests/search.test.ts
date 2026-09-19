import { describe, it, expect } from "vitest";
import { produkter } from "@/lib/produkter";
import { artikler } from "@/lib/artikler";
import { ROUTES } from "@/lib/routes";
import { buildSearchIndex, highlight, searchIndex } from "@/lib/search";

const index = buildSearchIndex({ products: produkter, articles: artikler });
const rows = produkter.reduce((n, p) => n + p.tables.reduce((m, t) => m + t.rows.length, 0), 0);
const group = (q: string, type: string) => searchIndex(index, q).groups.find((g) => g.type === type);

describe("buildSearchIndex", () => {
  it("indexes every page, category, product row and article", () => {
    const count = (type: string) => index.filter((i) => i.type === type).length;
    expect(count("kategori")).toBe(produkter.length);
    expect(count("produkt")).toBe(rows);
    expect(count("artikkel")).toBe(artikler.length);
    expect(count("side")).toBeGreaterThanOrEqual(9);
  });
  it("only links to real routes (product rows deep-link into the /produkter catalog)", () => {
    for (const item of index) {
      const path = decodeURI(item.href.split("?")[0]);
      expect(ROUTES, item.href).toContain(path);
      if (item.type === "produkt") expect(item.href).toMatch(/^\/produkter\?/);
    }
  });
  it("gives every product row a readable title and its specs as subtitle", () => {
    const item = index.find((i) => i.type === "produkt" && i.title === "Art.nr. 0401 4701 013")!;
    expect(item.subtitle).toBe("Skottgjennomføring · Syrefast (316 / V4A) · D 6 · Serie L · SW 17 · SW1 14 · L 48");
    // 23 rows have no article number ("på forespørsel") — they are named after their category instead.
    const onRequest = index.filter((i) => i.type === "produkt" && !i.title.startsWith("Art.nr."));
    expect(onRequest.length).toBeGreaterThan(0);
    for (const i of onRequest) expect(i.title).toMatch(/ – på forespørsel$/);
  });
});

describe("searchIndex", () => {
  it("returns nothing for an empty query", () => {
    expect(searchIndex(index, "   ")).toEqual({ groups: [], total: 0 });
  });
  it("ranks an exact article number first, typed with or without its spaces", () => {
    for (const q of ["0401 4701 013", "04014701013"]) {
      const result = searchIndex(index, q);
      expect(result.groups[0].type).toBe("produkt");
      expect(result.groups[0].items[0].title).toBe("Art.nr. 0401 4701 013");
    }
  });
  it("puts the category above its thirty rows when the category is what was typed", () => {
    const result = searchIndex(index, "rorender");
    expect(result.groups[0].type).toBe("kategori");
    expect(result.groups[0].items[0].href).toBe("/produkter/rørender");
    expect(group("rorender", "produkt")!.total).toBe(30);
  });
  it("caps each group but reports the full count", () => {
    const produkt = group("forsinket", "produkt")!;
    expect(produkt.items).toHaveLength(6);
    expect(produkt.total).toBeGreaterThan(100);
    expect(searchIndex(index, "forsinket", 3).groups.find((g) => g.type === "produkt")!.items).toHaveLength(3);
  });
  it("requires every word", () => {
    const produkt = group("forlengere messing", "produkt")!;
    expect(produkt.total).toBe(16);
    expect(searchIndex(index, "forlengere xyzzy").total).toBe(0);
  });
  it("finds articles by body text and pages by keyword", () => {
    expect(group("eierskap", "artikkel")!.items[0].href).toBe("/artikler/nytt-eierskap");
    expect(group("overvåking", "artikkel")!.items.map((i) => i.href)).toContain("/artikler/passiv-og-aktiv-overvaaking");
    expect(group("telefon", "side")!.items[0].href).toBe("/kontakt-oss");
    expect(group("etikk", "side")!.items[0].href).toBe("/etikk-og-ansvar");
  });
  it("prefers a title that starts with the query over one that merely mentions it", () => {
    const sider = group("produkter", "side")!;
    expect(sider.items[0].href).toBe("/produkter");
  });
});

describe("highlight", () => {
  const marked = (text: string, q: string) =>
    highlight(text, q)
      .map((s) => (s.match ? `[${s.text}]` : s.text))
      .join("");
  it("marks each matching word, ignoring case and Norwegian letters", () => {
    expect(marked("Rørender", "ror")).toBe("[Rør]ender");
    expect(marked("Skottgjennomføring · Syrefast", "syre skott")).toBe("[Skott]gjennomføring · [Syre]fast");
  });
  it("marks a match that was typed without the text's spaces", () => {
    expect(marked("Art.nr. 0401 4701 013", "04014701013")).toBe("Art.nr. [0401 4701 013]");
    expect(marked("G M 10 x 1 · L 18", "m10x1")).toBe("G [M 10 x 1] · L 18");
  });
  it("returns the text untouched when nothing matches or the query is empty", () => {
    expect(highlight("Fett", "xyz")).toEqual([{ text: "Fett", match: false }]);
    expect(highlight("Fett", "")).toEqual([{ text: "Fett", match: false }]);
  });
  it("merges overlapping matches", () => {
    expect(marked("Forlengere", "forl leng")).toBe("[Forleng]ere");
  });
});
