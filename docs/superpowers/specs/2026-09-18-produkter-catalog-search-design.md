# Produkter as its own item, with catalog search — design spec

Date: 2026-09-18
Status: design approved by Einar in chat, 2026-09-18, with the skralli-v2
breadcrumb added at his request.

## Why

Hlynur (project manager, e-mail 2026-09-16): Produkter is not a service and
should not sit under "Våre tjenester"; it should be its own item at the top
of the site, with a search bar and better filtering that search and filter
**all products at the same time**.

Until now the repo was a verified 1:1 copy of live elba.no. This is the first
deliberate departure from live, so the checks that lock us to live
(`tests/nav.test.ts`, `scripts/verify.mjs`) are updated as part of the work and
the change is recorded under "Deviations from live (approved)" in
`docs/handover.md`.

## 1. Information architecture

- `lib/site.ts` `nav`: `Hjem · Om oss · Artikler · Tjenester · Produkter`.
  `servicesMenu.columns`: Anlegg, Industri only. Footer "Selskapet" column
  gains `Produkter` after `Tjenester`.
- `components/ServiceCards.tsx`: the Produkter card is removed; the grid is two
  cards (`md:grid-cols-2`) on the home page and `/tjenester`.
- Home page: a new `components/home/ProductsSection.tsx` at the top, directly
  under the hero and industry strip ("efst á síðunni") — heading "Produkter", the existing line "Alt du trenger
  til installasjon, vedlikehold og drift", a search form (GET →
  `/produkter?q=…`) and a "Se alle produkter" link.
- `MobileMenu` needs no structural change: it renders `nav` and expands
  `servicesMenu` under Tjenester, so both follow the data.

## 2. Catalog search on `/produkter`

### Data — `lib/catalog.ts` (pure, unit-tested)

`lib/produkter.ts` is generated and stays untouched. `lib/catalog.ts` derives
from it:

```ts
type CatalogItem = {
  key: string;            // `${categoryId}:${tableIndex}:${rowIndex}` — Art.Nr. is not unique
  categoryId: string;     // "rørender"
  categoryTitle: string;  // "Rørender"
  tableIndex: number;
  heading: string | null; // the table's H3, e.g. "Syrefast (316 / V4A)"
  headers: string[];
  cells: string[];
  artNr: string;          // the "Art.Nr." / "Art.Nr" column, "" if absent
  material: Material | null;
  haystack: string;       // normalised search text
};
type Material = "forsinket" | "syrefast" | "messing";
```

- `catalogItems`: one item per table row — 215 today.
- **Material** comes from the table heading, else the row's `Material` column:
  starts with "Forsinket" → `forsinket` ("Forsinket stål"), starts with
  "Syrefast" → `syrefast`, "Messing" → `messing`, otherwise `null`.
- `normalize(s)`: lower-case, strip diacritics (NFD; `ø→o`, `æ→ae`, `å→a`
  handled explicitly since `ø`/`æ` don't decompose), unify `,`→`.` and `×`→`x`,
  collapse whitespace.
- `haystack` = normalised category title + heading + every cell, **plus** a
  whitespace-free copy of each cell, so `0401 4701 013` is found by
  `04014701013` and `M 10x1` by `M10x1`.
- `searchCatalog(items, { q, categories, materials })`: `q` is split on
  whitespace, every token must occur in `haystack` (AND); `categories` and
  `materials` are OR within a facet, AND across facets; an item with
  `material: null` is excluded only while a material filter is active.
- `groupResults(items)`: category → table, preserving catalog order, for
  rendering.

### UI — `components/produkter/ProductCatalog.tsx` (client)

- Sits directly under the breadcrumb band on `/produkter`. The existing "Et
  bredt produktspekter" and "Vi leverer" blocks move below it, copy unchanged.
- Search input (`type="search"`, label "Søk i alle produkter", placeholder
  "Art.nr., gjenge, dimensjon, materiale …"), then two chip rows: **Kategori**
  (11, multi-select, `aria-pressed` buttons) and **Materiale** (3).
- **Idle** (no query, no filter): today's eleven category cards
  (`ProductLinkList`). **Active**: the cards are replaced by results — a
  `role="status"` line "Viser N av 215 produkter", a "Nullstill" button, then
  per category an H2 linking to `/produkter/<slug>` and per table its H3 +
  `SpecTable` with the matching rows only. No match: "Ingen treff" + a line
  pointing to `/kontakt-oss`.
- State lives in the URL: `?q=…&kategori=a,b&materiale=x,y`, read with
  `useSearchParams`, written with `window.history.replaceState` (integrates
  with the Next router per `node_modules/next/dist/docs/…/04-linking-and-navigating.md`).
  The component is wrapped in `<Suspense>` whose fallback is the idle view, so
  the prerendered HTML still carries the eleven category links.
- `/produkter/[slug]` pages get a compact search form
  (`components/produkter/CatalogSearchForm.tsx`, shared with the home section)
  that submits to `/produkter?q=…`.
- All 215 rows ship to the client; no server, no new dependency.

## 3. Breadcrumb — same as kode-is/skralli-v2

skralli-v2's `PageHero` renders the breadcrumb itself: a full-width cream band
directly under the hero with a bottom rule; a text trail `Forsíða › … › current`,
`text-sm` muted, links turn the brand colour on hover, the current page is
medium-weight ink. Elba's equivalent:

- `components/Breadcrumb.tsx` is rewritten to that band: `bg-surface`,
  `border-b border-line`, trail inside `Container`, first crumb the word
  **Hjem** (link to `/`), `›` separators (`aria-hidden`), `text-ink-muted`,
  `hover:text-brand`, current crumb `font-medium text-black`. The house and
  chevron SVGs go away. `aria-label="Brødsmulesti"` stays.
- `PageHero` gains a `crumbs?: BreadcrumbItem[]` prop and renders the band
  under the hero, as skralli-v2 does. All ten pages pass `crumbs` to their
  `PageHero` and drop their in-column `<Breadcrumb>` (and the wrapper padding
  that existed only for it).
- Applies site-wide, not only to Produkter — it is one shared component.

## 4. Checks

- `tests/catalog.test.ts` (written first): item count equals total rows, keys
  unique, material derivation, normalisation (`ø`, spaces, comma decimals),
  AND tokens, facet logic, grouping order.
- `tests/nav.test.ts`: new nav, services panel and footer expectations.
- `scripts/verify.mjs`: the Produkter card's two strings become ignorable
  "missing" on `/` and `/tjenester`; the new UI strings ("Hjem", "Produkter"
  nav/footer/section text, search labels, chip labels) are added to
  `ALLOWED_EXTRA`. Verify needs network access to live; if it can't be run
  here that is stated in the handover rather than claimed.
- `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, and a
  browser pass of `/`, `/tjenester`, `/produkter` (idle, query, filter, no
  match, deep link) and one category page at 1440 and 390 wide.

## 5. Site-wide search palette (added 2026-09-19, at Einar's request)

"A search feature like Totus has, just better." kode-is/totus has a header
search icon that opens a ⌘K dialog over a client-side index of its pages,
categories and products, grouped by type. Elba's version
(`components/SearchPalette.tsx`, `lib/search.ts`):

- **Index:** pages (with search-only keywords), the 11 categories, all 215
  rows (sharing `lib/catalog.ts`'s haystack, so it matches exactly what
  `/produkter` matches) and the 5 articles including body text. Built on the
  server, prerendered at `/search-index.json`, fetched on first open — Totus
  bundles its index into every page.
- **Ranking:** every word must match; an exact Art.Nr. scores highest, then
  title-starts-with, word-start, title-contains, body-only. Groups are ordered
  by their best hit; six hits per group with the full count shown.
- **Keyboard and a11y:** native modal `<dialog>`; combobox + listbox with
  `aria-activedescendant`; ↑ ↓ Home End Enter; ⌘K / Ctrl+K toggles, `/` opens,
  Esc closes. Totus has no result navigation and a hand-rolled overlay.
- **Extras:** matched words highlighted (space-blind for codes, so `m10x1`
  marks `M 10 x 1`); shortcuts (categories + pages) before typing; the product
  group links on to `/produkter?q=…`; a product row opens the catalog filtered
  to that row.

## New Norwegian strings (for Hlynur to review)

Produkter · Se alle produkter · Søk i alle produkter · Art.nr., gjenge,
dimensjon, materiale … · Søk · Kategori · Materiale · Forsinket stål ·
Syrefast · Messing · Viser N av 215 produkter · Nullstill · Ingen treff ·
Finner du ikke det du leter etter? Ta kontakt, så hjelper vi deg. · Hjem

## Out of scope

Prices, cart, Zirius/ERP, pager, CSV export, dimension-specific facets
(D / G / SW — free text covers them), server-side search, new product photos.
