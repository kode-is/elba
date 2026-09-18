# Produkter Catalog Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Produkter its own top-level item, add one search + filter across all 215 product rows on `/produkter`, and replace the breadcrumb with the skralli-v2 band.

**Architecture:** Pure search logic in `lib/catalog.ts` (no runtime import of the generated product data, so it is safe in client bundles); the server page builds the items and hands them to a client `ProductCatalog` whose state lives in the URL (`useSearchParams` to read, `history.replaceState` to write). The breadcrumb becomes a full-width band rendered by `PageHero` via a `crumbs` prop, as in kode-is/skralli-v2.

**Tech Stack:** Next.js 16.3 App Router (read `node_modules/next/dist/docs/` before using an API — AGENTS.md), React 19, Tailwind 4 `@theme` tokens, Vitest (node env, `tests/**/*.test.ts`).

**Spec:** `docs/superpowers/specs/2026-09-18-produkter-catalog-search-design.md`

## Global Constraints

- `lib/produkter.ts` is generated — never edit it.
- Existing scraped copy is never reworded; only moved or removed. New UI strings are exactly those in the spec's "New Norwegian strings" list.
- No new dependencies.
- No raw hex outside `app/globals.css` `@theme`; use the existing tokens (`brand`, `surface`, `surface-cool`, `line`, `ink-muted`, `ink-faint`).
- Buttons: `rounded-[10px] bg-brand … hover:opacity-50` (live's button style, no hover colour).
- URL params: `q`, `kategori` (comma list of product ids), `materiale` (comma list of `forsinket|syrefast|messing`).
- Commit after every task; commit messages end with the Claude co-author line.

## File Structure

| File | Responsibility |
|---|---|
| `lib/catalog.ts` (new) | Types, `normalize`, `buildCatalog`, `searchCatalog`, `groupResults`, `parseQuery`, `toSearchString`, `isActive` |
| `tests/catalog.test.ts` (new) | Unit tests for all of the above against the real product data |
| `lib/site.ts`, `tests/nav.test.ts` | Nav / services panel / footer data and its lock |
| `components/ServiceCards.tsx` | Two service cards |
| `components/Breadcrumb.tsx`, `components/PageHero.tsx` | skralli-v2 band + `crumbs` prop |
| 10 pages under `app/(site)/` | Pass `crumbs` to `PageHero`, drop in-column `<Breadcrumb>` |
| `components/produkter/CatalogSearchForm.tsx` (new) | GET form → `/produkter?q=` (home + category pages) |
| `components/produkter/ProductCatalog.tsx` (new, client) | Search input, chips, results / idle cards |
| `components/home/ProductsSection.tsx` (new) | Home "Produkter" section |
| `scripts/verify.mjs`, `docs/handover.md` | Approved-deviation bookkeeping |

---

### Task 1: Catalog search logic (TDD)

**Files:** Create `lib/catalog.ts`, `tests/catalog.test.ts`.

**Interfaces — produces:**

```ts
export type Material = "forsinket" | "syrefast" | "messing";
export const MATERIALS: { id: Material; label: string }[];
export type CatalogItem = { key: string; categoryId: string; categoryTitle: string; tableIndex: number;
  heading: string | null; headers: string[]; cells: string[]; artNr: string; material: Material | null; haystack: string };
export type CatalogQuery = { q: string; categories: string[]; materials: Material[] };
export const EMPTY_QUERY: CatalogQuery;
export type CatalogGroup = { categoryId: string; categoryTitle: string; count: number;
  tables: { tableIndex: number; heading: string | null; headers: string[]; rows: string[][] }[] };
export function normalize(s: string): string;
export function buildCatalog(products: Product[]): CatalogItem[];
export function searchCatalog(items: CatalogItem[], query: CatalogQuery): CatalogItem[];
export function groupResults(items: CatalogItem[]): CatalogGroup[];
export function parseQuery(params: { get(name: string): string | null }): CatalogQuery;
export function toSearchString(query: CatalogQuery): string; // "" or "?q=…&kategori=…&materiale=…"
export function isActive(query: CatalogQuery): boolean;
```

- [ ] **Step 1: Write the failing tests** — `tests/catalog.test.ts`:

```ts
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
```

- [ ] **Step 2:** `npx vitest run tests/catalog.test.ts` → FAIL (cannot resolve `@/lib/catalog`).
- [ ] **Step 3: Implement `lib/catalog.ts`:**

```ts
// Search and filter logic for the cross-category product catalog on
// /produkter (docs/superpowers/specs/2026-09-18-produkter-catalog-search-design.md).
// Pure functions only: `Product` is a type-only import, so a client component
// can import this file without pulling the generated lib/produkter.ts data
// into its bundle — the server page calls buildCatalog() and passes the items
// down as props.
import type { Product } from "@/lib/produkter";

export type Material = "forsinket" | "syrefast" | "messing";

export const MATERIALS: { id: Material; label: string }[] = [
  { id: "forsinket", label: "Forsinket stål" },
  { id: "syrefast", label: "Syrefast" },
  { id: "messing", label: "Messing" },
];

export type CatalogItem = {
  /** `${categoryId}:${tableIndex}:${rowIndex}` — Art.Nr. repeats across tables, so it can't be the key. */
  key: string;
  categoryId: string;
  categoryTitle: string;
  tableIndex: number;
  heading: string | null;
  headers: string[];
  cells: string[];
  artNr: string;
  material: Material | null;
  /** Normalised text a query token is matched against — see buildCatalog. */
  haystack: string;
};

export type CatalogQuery = { q: string; categories: string[]; materials: Material[] };

export const EMPTY_QUERY: CatalogQuery = { q: "", categories: [], materials: [] };

export type CatalogGroup = {
  categoryId: string;
  categoryTitle: string;
  count: number;
  tables: { tableIndex: number; heading: string | null; headers: string[]; rows: string[][] }[];
};

/** Lower-case, fold Norwegian letters and diacritics, unify `,`/`.` and `×`/`x`, collapse whitespace. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ø/g, "o")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/,/g, ".")
    .replace(/×/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

function materialOf(text: string | null | undefined): Material | null {
  const t = normalize(text ?? "");
  if (t.startsWith("forsinket")) return "forsinket";
  if (t.startsWith("syrefast")) return "syrefast";
  if (t.startsWith("messing")) return "messing";
  return null;
}

/**
 * One item per table row. The haystack holds the category title, the table
 * heading and every cell, normalised — plus a whitespace-free copy of each, so
 * "0401 4701 013" is found by "04014701013" and "M 10x1" by "M10x1". Column
 * headers stay out of it: "SW" or "L" would match nearly every row.
 */
export function buildCatalog(products: Product[]): CatalogItem[] {
  const items: CatalogItem[] = [];
  for (const product of products) {
    product.tables.forEach((table, tableIndex) => {
      const artIndex = table.headers.findIndex((h) => /^art\.?\s*nr\.?$/i.test(h.trim()));
      const materialIndex = table.headers.findIndex((h) => /^material/i.test(h.trim()));
      table.rows.forEach((cells, rowIndex) => {
        const parts = [product.title, table.heading ?? "", ...cells].map(normalize).filter(Boolean);
        const haystack = [...new Set([...parts, ...parts.map((p) => p.replace(/ /g, ""))])].join(" ");
        items.push({
          key: `${product.id}:${tableIndex}:${rowIndex}`,
          categoryId: product.id,
          categoryTitle: product.title,
          tableIndex,
          heading: table.heading,
          headers: table.headers,
          cells,
          artNr: artIndex >= 0 ? (cells[artIndex] ?? "") : "",
          material: materialOf(table.heading) ?? (materialIndex >= 0 ? materialOf(cells[materialIndex]) : null),
          haystack,
        });
      });
    });
  }
  return items;
}

/** Tokens AND; values OR within a facet; facets AND. An item without a material only drops out while a material filter is on. */
export function searchCatalog(items: CatalogItem[], query: CatalogQuery): CatalogItem[] {
  const tokens = normalize(query.q).split(" ").filter(Boolean);
  return items.filter(
    (item) =>
      (query.categories.length === 0 || query.categories.includes(item.categoryId)) &&
      (query.materials.length === 0 || (item.material !== null && query.materials.includes(item.material))) &&
      tokens.every((token) => item.haystack.includes(token)),
  );
}

/** Category → table, in the order the items arrive (catalog order). */
export function groupResults(items: CatalogItem[]): CatalogGroup[] {
  const groups: CatalogGroup[] = [];
  for (const item of items) {
    let group = groups.at(-1);
    if (!group || group.categoryId !== item.categoryId) {
      group = { categoryId: item.categoryId, categoryTitle: item.categoryTitle, count: 0, tables: [] };
      groups.push(group);
    }
    let table = group.tables.at(-1);
    if (!table || table.tableIndex !== item.tableIndex) {
      table = { tableIndex: item.tableIndex, heading: item.heading, headers: item.headers, rows: [] };
      group.tables.push(table);
    }
    table.rows.push(item.cells);
    group.count += 1;
  }
  return groups;
}

const list = (value: string | null) =>
  (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export function parseQuery(params: { get(name: string): string | null }): CatalogQuery {
  return {
    q: params.get("q") ?? "",
    categories: list(params.get("kategori")),
    materials: list(params.get("materiale")).filter((m): m is Material => MATERIALS.some((known) => known.id === m)),
  };
}

export function toSearchString(query: CatalogQuery): string {
  const params = new URLSearchParams();
  if (query.q.trim()) params.set("q", query.q);
  if (query.categories.length) params.set("kategori", query.categories.join(","));
  if (query.materials.length) params.set("materiale", query.materials.join(","));
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const isActive = (query: CatalogQuery): boolean =>
  query.q.trim() !== "" || query.categories.length > 0 || query.materials.length > 0;
```

- [ ] **Step 4:** `npx vitest run tests/catalog.test.ts` → PASS. Then `npx tsc --noEmit`.
- [ ] **Step 5:** Commit `Add catalog search logic across all product tables`.

---

### Task 2: Produkter out of Tjenester (nav, services panel, footer, cards)

**Files:** Modify `tests/nav.test.ts`, `lib/site.ts`, `components/ServiceCards.tsx`, `components/ServicesMenu.tsx` (comment only), `components/FeatureCard.tsx` (comment + `sizes`).

- [ ] **Step 1: Update the lock first** — in `tests/nav.test.ts` replace the first three tests' expectations:

```ts
  it("has the five nav links and the CTA", () => {
    expect(nav.map((n) => n.text)).toEqual(["Hjem", "Om oss", "Artikler", "Tjenester", "Produkter"]);
    expect(nav.find((n) => n.text === "Produkter")?.href).toBe("/produkter");
    expect(navCta).toEqual({ text: "Kontakt oss", href: "/kontakt-oss" });
  });
  it("Tjenester panel lists Anlegg and Industri — Produkter is its own nav item", () => {
    expect(servicesMenu.heading).toBe("Tjenester");
    expect(servicesMenu.description).toBe("Utforsk løsninger tilpasset din bransje og bruk");
    expect(servicesMenu.columns.flat().map((l) => l.href)).toEqual(["/anlegg", "/industri"]);
  });
  it("footer Selskapet column links to the six pages, Artikler fixed", () => {
    const links = footerColumns[0].links;
    expect(footerColumns[0].heading).toBe("Selskapet");
    expect(links.map((l) => l.text)).toEqual(["Hjem", "Om oss", "Artikler", "Tjenester", "Produkter", "Etikk og ansvar"]);
    expect(links.find((l) => l.text === "Artikler")?.href).toBe("/artikler");
    for (const l of links) expect(ROUTES).toContain(l.href);
  });
```

- [ ] **Step 2:** `npx vitest run tests/nav.test.ts` → FAIL.
- [ ] **Step 3:** `lib/site.ts`: header comment notes the approved deviation (Produkter is top-level; spec path); add `{ text: "Produkter", href: "/produkter" }` to `nav` and to the footer column after Tjenester; remove it from `servicesMenu.columns`.
- [ ] **Step 4:** `components/ServiceCards.tsx`: delete the Produkter entry from `SERVICE_CARDS`; grid → `md:grid-cols-2`; update the two comments (two cards; Produkter moved out per the spec). `FeatureCard` `sizes` → `(min-width: 768px) 50vw, 100vw`, comment "Anlegg / Industri". `ServicesMenu.tsx` comment "One column (Anlegg, Industri)".
- [ ] **Step 5:** `npx vitest run` → all PASS; `npm run lint`; `npx tsc --noEmit`.
- [ ] **Step 6:** Commit `Make Produkter its own nav item, outside Tjenester`.

---

### Task 3: skralli-v2 breadcrumb band

**Files:** Modify `components/Breadcrumb.tsx`, `components/PageHero.tsx`, `app/globals.css` (eyebrow token comment/line-height), and the ten pages that render `<Breadcrumb>`.

- [ ] **Step 1:** Rewrite `components/Breadcrumb.tsx`:

```tsx
import Link from "next/link";
import { Container } from "./Container";

export type BreadcrumbItem = { text: string; href?: string };

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

/**
 * The breadcrumb band from kode-is/skralli-v2's PageHero: a full-width cream
 * strip directly under the hero, closed by a rule, holding a plain text trail
 * — "Hjem › Produkter › Rørender" — in muted ink, links turning brand red on
 * hover and the current page in medium-weight black. Rendered by PageHero
 * (its `crumbs` prop), not by the pages themselves. An approved deviation
 * from live's red house-icon trail (docs/handover.md).
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Brødsmulesti" className="border-b border-line bg-surface">
      <Container>
        <ol className="flex flex-wrap items-center gap-2 py-4 font-ui text-eyebrow text-ink-muted">
          <li>
            <Link href="/" className="transition hover:text-brand">
              Hjem
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.text} className="flex items-center gap-2">
                <span aria-hidden="true">›</span>
                {item.href && !isLast ? (
                  <Link href={item.href} className="transition hover:text-brand">
                    {item.text}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-black">
                    {item.text}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
```

- [ ] **Step 2:** `app/globals.css`: `--text-eyebrow: 14px; /* breadcrumb trail in the band under a hero */` and `--text-eyebrow--line-height: 1.4;` (the token's only user is the breadcrumb).
- [ ] **Step 3:** `components/PageHero.tsx`: import `Breadcrumb, type BreadcrumbItem`; add prop

```ts
  /** Breadcrumb trail, rendered as a band directly under the hero (as in kode-is/skralli-v2). Omit for no band (not-found). */
  crumbs?: BreadcrumbItem[];
```

  and wrap the return in a fragment: the existing hero `<div>` followed by `{crumbs ? <Breadcrumb items={crumbs} /> : null}`.
- [ ] **Step 4:** In each page pass `crumbs={…}` to `<PageHero>` with exactly the items it gives `<Breadcrumb>` today, delete the `<Breadcrumb>` element and its import, and remove the spacing that only existed to clear it:
  - `om-oss`, `industri`, `anlegg`: the sibling `<div className="mt-10 md:mt-14">` loses its `mt-*` (unwrap it if it then has no classes).
  - `kontakt-oss`: `mx-auto mt-10 max-w-xl md:mt-14` → `mx-auto max-w-xl`. `artikler`: `mt-10 grid … md:mt-14 …` → drop both `mt`s. `etikk-og-ansvar`: drop `mt-10` / `md:mt-14` from the `divide-y` div. `tjenester`: `<ServiceCardsGrid className="mt-10" />` → no className.
  - `produkter/[slug]` and `artikler/[slug]`: delete the whole `<div className="bg-white pt-6">…</div>` wrapper; keep the `"Artikle"` (sic, live copy) comment next to the `crumbs` prop.
  - `produkter/page.tsx`: only the `crumbs` prop + delete `<Breadcrumb>` here; the page is restructured in Task 5.
- [ ] **Step 5:** `npm run lint && npx tsc --noEmit && npx vitest run`; start the dev server (`preview_start` name `elba-dev`) and check `/om-oss`, `/produkter/rørender`, `/artikler/nytt-eierskap` at 1440 and 390: band sits flush under the hero, trail reads `Hjem › …`, last crumb bold black, long article title wraps inside the band.
- [ ] **Step 6:** Commit `Adopt the skralli-v2 breadcrumb band under every hero`.

---

### Task 4: Catalog UI components

**Files:** Create `components/produkter/CatalogSearchForm.tsx`, `components/produkter/ProductCatalog.tsx`.

**Interfaces — consumes** everything Task 1 produces. **Produces:**

```tsx
export function CatalogSearchForm(props: { id: string; className?: string }): JSX.Element;         // server-safe
export function ProductCatalog(props: { items: CatalogItem[]; categories: { id: string; title: string }[];
  children: ReactNode /* idle view: the category cards */ }): JSX.Element;                           // "use client"
```

- [ ] **Step 1:** `CatalogSearchForm.tsx` — `next/form` (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/form.md`): client-side navigation to `/produkter?q=…`, plain GET without JS.

```tsx
import Form from "next/form";

type CatalogSearchFormProps = {
  /** Unique per page — wires the sr-only label to the input. */
  id: string;
  className?: string;
};

/**
 * Compact "search all products" form for pages other than /produkter (the
 * home page's Produkter section, every /produkter/<kategori> page): submits
 * `q` to /produkter, where ProductCatalog reads it from the URL.
 */
export function CatalogSearchForm({ id, className }: CatalogSearchFormProps) {
  return (
    <Form action="/produkter" role="search" className={`flex gap-3${className ? ` ${className}` : ""}`}>
      <label htmlFor={id} className="sr-only">
        Søk i alle produkter
      </label>
      <input
        id={id}
        name="q"
        type="search"
        autoComplete="off"
        placeholder="Art.nr., gjenge, dimensjon, materiale …"
        className="min-w-0 flex-1 rounded-[10px] border border-line bg-white px-5 py-4 font-ui text-body-lg text-black placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-brand"
      />
      <button
        type="submit"
        className="rounded-[10px] bg-brand px-[30px] py-4 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50"
      >
        Søk
      </button>
    </Form>
  );
}
```

- [ ] **Step 2:** `ProductCatalog.tsx`. State model (keep this comment in the file): the URL is the single source of truth — read with `useSearchParams` (hence the `Suspense`, whose fallback is the same view with an empty query so the prerendered HTML carries the category cards), written with `window.history.replaceState`. Next applies that write inside a transition, so a *controlled* input fed from it would lag and drop characters; the text input is therefore uncontrolled (`defaultValue`), and an effect copies the URL's `q` back into it only while it is not focused — which is what makes "Nullstill" and a click on the header's Produkter link clear it.

```tsx
"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { SpecTable } from "@/components/SpecTable";
import {
  EMPTY_QUERY, MATERIALS, groupResults, isActive, parseQuery, searchCatalog, toSearchString,
  type CatalogItem, type CatalogQuery,
} from "@/lib/catalog";

type Category = { id: string; title: string };

type ProductCatalogProps = {
  items: CatalogItem[];
  categories: Category[];
  /** The idle view — the category cards — shown until a search or filter is active. */
  children: ReactNode;
};

export function ProductCatalog(props: ProductCatalogProps) {
  return (
    <Suspense fallback={<CatalogView {...props} query={EMPTY_QUERY} onChange={() => {}} />}>
      <CatalogFromUrl {...props} />
    </Suspense>
  );
}

function CatalogFromUrl(props: ProductCatalogProps) {
  const query = parseQuery(useSearchParams());
  return (
    <CatalogView
      {...props}
      query={query}
      onChange={(next) => window.history.replaceState(null, "", `${window.location.pathname}${toSearchString(next)}`)}
    />
  );
}

const toggle = <T extends string>(values: T[], value: T): T[] =>
  values.includes(value) ? values.filter((v) => v !== value) : [...values, value];

type CatalogViewProps = ProductCatalogProps & { query: CatalogQuery; onChange: (next: CatalogQuery) => void };

function CatalogView({ items, categories, children, query, onChange }: CatalogViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement !== input && input.value !== query.q) input.value = query.q;
  }, [query.q]);

  // The input owns its text (see the file comment), so facet changes take `q` from the DOM, not from the URL.
  const current = (): CatalogQuery => ({ ...query, q: inputRef.current?.value ?? query.q });
  const active = isActive(query);
  const results = active ? searchCatalog(items, query) : [];
  const groups = groupResults(results);

  return (
    <div>
      <h2 id="katalog-sok" className="text-section font-semibold text-black md:text-section-lg">
        Søk i alle produkter
      </h2>
      <form role="search" className="mt-6" onSubmit={(event) => event.preventDefault()}>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-ink-faint" />
          <input
            ref={inputRef}
            type="search"
            name="q"
            aria-labelledby="katalog-sok"
            autoComplete="off"
            defaultValue={query.q}
            onChange={(event) => onChange({ ...query, q: event.target.value })}
            placeholder="Art.nr., gjenge, dimensjon, materiale …"
            className="w-full rounded-[10px] border border-line bg-white py-4 pr-5 pl-14 font-ui text-body-lg text-black placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-brand"
          />
        </div>
      </form>

      <div className="mt-6 space-y-4">
        <ChipRow label="Kategori">
          {categories.map((category) => (
            <Chip
              key={category.id}
              pressed={query.categories.includes(category.id)}
              onClick={() => onChange({ ...current(), categories: toggle(query.categories, category.id) })}
            >
              {category.title}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow label="Materiale">
          {MATERIALS.map((material) => (
            <Chip
              key={material.id}
              pressed={query.materials.includes(material.id)}
              onClick={() => onChange({ ...current(), materials: toggle(query.materials, material.id) })}
            >
              {material.label}
            </Chip>
          ))}
        </ChipRow>
      </div>

      <div className="mt-10 md:mt-12">
        {active ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
              <p role="status" className="font-ui text-body-lg text-ink-muted">
                Viser {results.length} av {items.length} produkter
              </p>
              <button
                type="button"
                onClick={() => onChange(EMPTY_QUERY)}
                className="font-ui text-body-lg font-medium text-brand transition hover:opacity-50"
              >
                Nullstill
              </button>
            </div>
            {groups.length === 0 ? (
              <div className="py-14 text-center">
                <h3 className="text-[23px] leading-[1.3] font-semibold text-black">Ingen treff</h3>
                <p className="mt-3 font-ui text-body-lg text-ink-muted">
                  Finner du ikke det du leter etter?{" "}
                  <Link href="/kontakt-oss" className="text-brand underline underline-offset-4">
                    Ta kontakt, så hjelper vi deg.
                  </Link>
                </p>
              </div>
            ) : (
              <div className="mt-10 space-y-14">
                {groups.map((group) => (
                  <section key={group.categoryId} aria-labelledby={`katalog-${group.categoryId}`}>
                    <h3 id={`katalog-${group.categoryId}`} className="text-[23px] leading-[1.3] font-semibold text-black md:text-[36px]">
                      <Link href={`/produkter/${group.categoryId}`} className="transition hover:text-brand">
                        {group.categoryTitle}
                      </Link>{" "}
                      <span className="font-ui text-body-lg font-normal text-ink-faint">({group.count})</span>
                    </h3>
                    <div className="mt-6 space-y-8">
                      {group.tables.map((table) => {
                        const headingId = table.heading ? `katalog-${group.categoryId}-${table.tableIndex}` : undefined;
                        return (
                          <div key={table.tableIndex}>
                            {table.heading ? (
                              <h4 id={headingId} className="mb-3 font-ui text-label font-semibold text-black md:text-label-lg">
                                {table.heading}
                              </h4>
                            ) : null}
                            <SpecTable headers={table.headers} rows={table.rows} ariaLabelledBy={headingId} />
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
```

  plus, in the same file, `ChipRow` (`<div role="group" aria-label={label}>` with a small label and a `flex flex-wrap gap-2` row), `Chip` (`<button type="button" aria-pressed>`; pressed `border-brand bg-brand text-white`, idle `border-line bg-white text-ink-muted hover:border-brand hover:text-brand`; `rounded-full border px-4 py-2 font-ui text-[14px] leading-[1.4] font-medium transition`) and `SearchIcon` (24×24 stroke magnifier, `aria-hidden`).
  `SpecTable` sits on white inside a white section here, so give the results wrapper tables a visible edge: pass nothing new to `SpecTable`; wrap each in `rounded-[12px] border border-line`.

- [ ] **Step 3:** `npm run lint && npx tsc --noEmit`. (Rendered check happens in Task 5 where the component is mounted.)
- [ ] **Step 4:** Commit `Add the product catalog search UI`.

---

### Task 5: Mount it — `/produkter`, category pages, home section

**Files:** Modify `app/(site)/produkter/page.tsx`, `app/(site)/produkter/[slug]/page.tsx`, `app/(site)/page.tsx`; create `components/home/ProductsSection.tsx`.

- [ ] **Step 1:** `/produkter`: after `<PageHero … crumbs=…/>` add

```tsx
      <section className="bg-white py-12 md:py-16">
        <Container>
          <ProductCatalog items={CATALOG} categories={CATEGORIES}>
            <ProductLinkList items={PRODUCTS} />
          </ProductCatalog>
        </Container>
      </section>
```

  with module constants `const CATALOG = buildCatalog(produkter);` and `const CATEGORIES = PRODUCTS.map((p) => ({ id: p.href.slice("/produkter/".length), title: p.text }));` (card order = chip order). Then the existing "Vi leverer" section (`bg-surface`), then the existing "Et bredt produktspekter" block (white), then `ContactCta`. Remove the old bottom `ProductLinkList` block. Copy untouched.
- [ ] **Step 2:** Category page: inside the `<section className="bg-white py-12 md:py-16">`, first child of `Container`: `<CatalogSearchForm id="produkt-sok" className="mb-10 max-w-xl" />`.
- [ ] **Step 3:** `components/home/ProductsSection.tsx` — white section holding one `bg-surface-cool` rounded card: H2 "Produkter", the existing line "Alt du trenger til installasjon, vedlikehold og drift", `CatalogSearchForm id="hjem-produkt-sok"`, a row of eleven category pill links (`produkter.map` → `/produkter/${p.id}`, white `rounded-full` pills) and a "Se alle produkter" brand button to `/produkter`. Mount it in `app/(site)/page.tsx` directly after `<ServicesSection />`.
- [ ] **Step 4:** Browser pass (dev server `elba-dev`), 1440 and 390: `/` (section, form submits to `/produkter?q=…` and shows results), `/tjenester` (two cards), `/produkter` idle → type `04014701013` (1 row) → `rorender` (30) → chips → `Nullstill` → nonsense (`Ingen treff`) → reload a deep link `?q=M10x1&materiale=syrefast` → click header "Produkter" while filtered (clears, input empties); `/produkter/fett` form. Header at 768–1024 px with five items: no wrap/overlap (tighten the `md` gaps or move the desktop nav to `lg` if it does). Console clean.
- [ ] **Step 5:** `npm run lint && npx tsc --noEmit && npx vitest run && npm run build` (the build proves the `Suspense`/`useSearchParams` prerender contract).
- [ ] **Step 6:** Commit `Put catalog search on /produkter, category pages and the home page`.

---

### Task 6: Deviation bookkeeping

**Files:** Modify `scripts/verify.mjs`, `docs/handover.md`, `README.md` (only if it describes nav/breadcrumb).

- [ ] **Step 1:** `scripts/verify.mjs`:
  - `IGNORE_MISSING["/"]` and `["/tjenester"]` gain `exact("Alt du trenger til installasjon, vedlikehold og drift")` only where that string is no longer on the page (home keeps it in the Produkter section — check before adding).
  - `ALLOWED_EXTRA` gains, under one comment citing the spec: `Hjem`, `›`, `Produkter`, `Se alle produkter`, `Søk i alle produkter`, `Søk`, `Kategori`, `Materiale`, `Forsinket stål`, `Syrefast`, `Messing`, and the eleven category titles (home pills / chips).
  - Image count: `const EXPECTED_FEWER_IMAGES = { "/": 1, "/tjenester": 1 };` (the removed Produkter card photo) and `imgOk = local.images + (EXPECTED_FEWER_IMAGES[r] ?? 0) >= live.images`.
- [ ] **Step 2:** Run `npm run build && npm start` + `npm run verify` if live elba.no is reachable; fix what it reports. If it can't run here, say so in the handover instead of claiming a pass.
- [ ] **Step 3:** `docs/handover.md`: new entries under "Deviations from live (approved)" — (6) Produkter is its own nav item, two service cards, home Produkter section; (7) catalog search on `/produkter` + page order; (8) skralli-v2 breadcrumb band. Replace "Still needs you or Hlynur" #4 (table search box) with "review the new Norwegian UI strings" listing them. Remove the now-stale "Breadcrumb indent" known-difference bullet.
- [ ] **Step 4:** Commit `Record the Produkter/catalog/breadcrumb deviations`.
