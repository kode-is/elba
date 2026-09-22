// Which of a product page's tables each sub-category pill covers — the data
// behind the pressable pills on /produkter/<kategori>
// (components/produkter/SubnavFilter.tsx). Hand-maintained: lib/produkter.ts
// is generated from the scrape and carries only the pill labels.
//
// On live elba.no, and in the Framer source project, the pills are inert
// labels with the first one drawn as selected. Read against the page content,
// that first pill is the sub-type of every table on the page, and the other
// pills are sub-types whose articles were never published. Per page:
//   snittringmatur  — every row's Type column is "WE …", drawing is a 90° elbow
//   lynfittings     — the only table is headed 'Lynfittings 0° rett "GE"'
//   fylleutstyr     — the page's own caption: "Fyllepresse til sentralsmøreanlegg …"
//   rørender        — all nine drawings are straight tube ends
//   forlengere      — one straight-extension drawing over all three tables
//   skottgjennomføring — straight bulkhead union, compression nut both ends
//   banjokoblinger  — one banjo-coupling drawing (hollow bolt + side outlet)
//   slanger         — reinforced black hose, "NLGI 2 / tom" prefill column
//   fyllenippler    — no independent evidence; follows the first-pill rule only
// tests/subnav.test.ts locks the first three to the data they were read from.
// A pill missing from this map has no articles on the site: its button shows
// a "ta kontakt" panel instead of tables.
import type { Product } from "@/lib/produkter";
import { normalize } from "@/lib/catalog";

export type SubnavTables = Record<string, Record<string, number[]>>;

export const SUBNAV_TABLES: SubnavTables = {
  banjokoblinger: { Banjokobling: [0] },
  forlengere: { "Forlenger rett": [0, 1, 2] },
  fyllenippler: { "Fyllenippel for stuss": [0, 1, 2, 3] },
  fylleutstyr: { Fyllepresse: [0, 1] },
  lynfittings: { 'Rett "GE"': [0] },
  rørender: { "Rørender rette": [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  skottgjennomføring: { Skottgjennomføring: [0, 1] },
  slanger: { Høytrykkslange: [0] },
  snittringmatur: { 'Vinkel "WE"': [0, 1] },
};

export type SubnavPill = { label: string; slug: string; tables: number[] };

/** `90° "WE" dreibar` → `90-we-dreibar` — the pill's `?type=` value. */
export const pillSlug = (label: string) =>
  normalize(label)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Every pill on a product page, in page order, with the tables it covers (empty = nothing published). */
export function pillsFor(product: Product, subnav: SubnavTables = SUBNAV_TABLES): SubnavPill[] {
  const map = subnav[product.id] ?? {};
  return product.subnav.map((label) => ({ label, slug: pillSlug(label), tables: map[label] ?? [] }));
}
