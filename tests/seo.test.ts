import { describe, expect, it } from "vitest";
import { PAGE_META, productMeta, ARTICLE_DESCRIPTIONS } from "@/lib/seo-meta";
import { produkter } from "@/lib/produkter";
import { artikler } from "@/lib/artikler";
import { ROUTES } from "@/lib/routes";
import { siteJsonLd, jsonLdString } from "@/lib/seo";
import { servicesMenu, yearsInBusiness } from "@/lib/site";
import { stats } from "@/lib/stats";

const SLOGAN = "I INDUSTRIENS TJENESTE";

const all = [
  ...Object.values(PAGE_META),
  ...produkter.map((p) => productMeta(p.id, p.title)),
  ...artikler.map((a) => ({ title: a.metaTitle, description: ARTICLE_DESCRIPTIONS[a.id] ?? a.metaDescription, path: `/artikler/${a.id}` })),
];

describe("search metadata", () => {
  it("covers every static route", () => {
    for (const r of ROUTES.filter((r) => !r.startsWith("/produkter/") && !r.startsWith("/artikler/"))) {
      expect(PAGE_META, r).toHaveProperty([r]);
    }
  });

  it("gives every page its own title and description", () => {
    expect(new Set(all.map((m) => m.title)).size).toBe(all.length);
    expect(new Set(all.map((m) => m.description)).size).toBe(all.length);
  });

  it("never falls back to the old slogan-only title", () => {
    for (const m of all) expect(m.title.toUpperCase(), m.path).not.toContain(SLOGAN);
  });

  it("calls the company ELBA, not ELBA AS, in titles and descriptions", () => {
    for (const m of all) expect(`${m.title} ${m.description}`, m.path).not.toMatch(/\bELBA AS\b/i);
  });

  it("has a title and description for every service page in the Tjenester menu", () => {
    for (const { href } of servicesMenu.columns.flat()) expect(PAGE_META, href).toHaveProperty([href]);
  });

  it("has a written description for every article", () => {
    for (const a of artikler) expect(ARTICLE_DESCRIPTIONS, a.id).toHaveProperty([a.id]);
  });

  it("emits parseable JSON-LD naming ELBA AS and its org number", () => {
    const parsed = JSON.parse(jsonLdString(siteJsonLd));
    const org = parsed["@graph"].find((n: { "@type": string }) => n["@type"] === "LocalBusiness");
    expect(org.legalName).toBe("ELBA AS");
    expect(org.taxID).toBe("859772382");
  });
});

describe("years of experience", () => {
  it("counts from the 1991 founding date", () => {
    const expected = new Date().getFullYear() - 1991 - (new Date() < new Date(new Date().getFullYear(), 0, 2) ? 1 : 0);
    expect(yearsInBusiness).toBe(expected);
    expect(stats.find((s) => s.label === "Års erfaring")?.value).toBe(String(expected));
  });
});
