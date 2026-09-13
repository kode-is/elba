#!/usr/bin/env node
// Generates lib/produkter.ts from docs/scrape/produkter__*.json (per-product
// block dumps) and docs/scrape/tables.json (hydrated spec tables, in
// document order, desktop/mobile duplicates already removed). Run:
// npm run gen-produkter
//
// Every product page's blocks follow one pattern after the site logo:
//   hero image, H1 title, breadcrumb ("Produkter" link + title text),
//   optional sub-navigation (`link` blocks with href: null), then repeated
//   groups of [one or more `image` blocks] [optional H3 heading] [a run of
//   `text` blocks that are the table's header/cell strings].
// The live scraper mislabels the product hero `role: "logo"` (a wrapper
// artifact), so the hero is found by path — the first image block whose
// `local` is NOT the shared site logo — not by role.
//
// Tables are paired to docs/scrape/tables.json purely by document order:
// the k-th run of table text in blocks is the k-th table.json entry for
// that route (verified by hand for all 11 routes — the counts match). A
// text block is recognised as belonging to a table by membership in that
// route's set of tables.json header/cell strings (trimmed); once a run has
// started, any other text block (live's "Page X of Y" pager, stray
// captions) is consumed as part of the same run and discarded — the actual
// header/row data always comes from tables.json, never from this scrape.
//
// Images since the previous flush all attach to the next table (verified
// against docs/reference screenshots + a live image-count check: capping
// at two, as the brief's prose suggests, undercounts skruhylser's first
// group (3 images) and fylleutstyr's first group (4 images) and would fail
// scripts/verify.mjs's image-count assertion) — so every pending image is
// kept, and the array is reset after each flush (extras are never carried
// over to the next table).
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRAPE = join(ROOT, "docs/scrape");
const tablesByRoute = Object.fromEntries(
  JSON.parse(readFileSync(join(SCRAPE, "tables.json"), "utf8")).routes.map((r) => [r.route, r.tables])
);

const SITE_LOGO = "/images/home/00-d1c05434.png";
const strip = (s) => s.replace(/​/g, "").trim();
const img = (b) => ({ src: b.local, alt: b.alt || "", width: b.width, height: b.height });

const products = [];
for (const file of readdirSync(SCRAPE).filter((f) => f.startsWith("produkter__") && f.endsWith(".json")).sort()) {
  const j = JSON.parse(readFileSync(join(SCRAPE, file), "utf8"));
  const route = j.route;
  const blocks = j.blocks;
  const id = strip(route.slice("/produkter/".length));

  const h1Index = blocks.findIndex((b) => b.type === "heading" && b.level === 1);
  if (h1Index === -1) throw new Error(`${route}: no H1 found`);
  const title = strip(blocks[h1Index].text);

  const heroBlock = blocks.find((b) => b.type === "image" && b.local !== SITE_LOGO);
  if (!heroBlock) throw new Error(`${route}: no non-logo hero image found`);
  const hero = img(heroBlock);

  // Skip the breadcrumb right after the H1: the "Produkter" link (a real
  // href) and the text block that just repeats the title.
  let i = h1Index + 1;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === "link" && b.href) { i++; continue; }
    if (b.type === "text" && strip(b.text) === title) { i++; continue; }
    break;
  }
  const body = blocks.slice(i);

  const liveTables = tablesByRoute[route] ?? [];
  const memberSet = new Set();
  for (const t of liveTables) {
    for (const h of t.headers) memberSet.add(h.trim());
    for (const row of t.rows) for (const c of row) memberSet.add(c.trim());
  }

  const subnav = [];
  const intro = [];
  const tables = [];
  let pendingImages = [];
  let pendingHeading = null;
  let inRun = false;
  let sawContent = false; // true once the first image or subnav link appears

  for (const b of body) {
    if (b.type === "link" && b.href === null) {
      subnav.push(strip(b.text));
      sawContent = true;
      inRun = false;
      continue;
    }
    if (b.type === "image") {
      pendingImages.push(img(b));
      sawContent = true;
      inRun = false;
      continue;
    }
    if (b.type === "heading" && b.level === 3) {
      pendingHeading = strip(b.text);
      inRun = false;
      continue;
    }
    if (b.type === "text") {
      if (!sawContent) { intro.push(b.text); continue; }
      const isMember = memberSet.has(b.text.trim());
      if (isMember && !inRun) {
        const t = liveTables[tables.length];
        if (!t) throw new Error(`${route}: found a ${tables.length + 1}th table text-run but tables.json only has ${liveTables.length} tables`);
        tables.push({ heading: pendingHeading, headers: t.headers, rows: t.rows, images: pendingImages });
        pendingHeading = null;
        pendingImages = [];
        inRun = true;
      }
      continue; // non-member text (pager, stray captions) is discarded either way
    }
    // H1/H2 headings and real-href links (e.g. the "Kontakt oss" CTA) carry
    // no product content; ignored.
  }

  if (tables.length !== liveTables.length) {
    throw new Error(`${route}: consumed ${tables.length} table text-runs but tables.json has ${liveTables.length} tables`);
  }

  products.push({
    id,
    title,
    hero,
    subnav,
    intro,
    tables,
    metaTitle: j.title,
    metaDescription: j.description,
  });
}

const ts = `// GENERATED by scripts/gen-produkter.mjs from docs/scrape — do not edit by hand.
import type { Img } from "@/lib/types";

export type ProductTable = { heading: string | null; headers: string[]; rows: string[][]; images: Img[] };
export type Product = {
  id: string;
  /** Reserved for the later Zirius (ERP) integration; unset today. */
  erpId?: string;
  title: string;
  hero: Img;
  /** Static sub-navigation pills (not links on the live site) above the tables. Empty on routes without them. */
  subnav: string[];
  intro: string[];
  tables: ProductTable[];
  metaTitle: string;
  metaDescription: string;
};

export const produkter: Product[] = ${JSON.stringify(products, null, 2)};

export const productBySlug = (slug: string): Product | undefined => produkter.find((p) => p.id === slug);
`;
writeFileSync(join(ROOT, "lib/produkter.ts"), ts);
console.log(
  `wrote lib/produkter.ts: ${products.length} products, ${products.reduce((n, p) => n + p.tables.length, 0)} tables, ${products.filter((p) => p.subnav.length > 0).length} with subnav`
);
for (const p of products) {
  console.log(`  ${p.id}: ${p.tables.length} table(s), subnav=${p.subnav.length}, images/table=[${p.tables.map((t) => t.images.length).join(",")}]`);
}
