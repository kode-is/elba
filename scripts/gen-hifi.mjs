#!/usr/bin/env node
// Generates lib/hifi.ts from the 8 docs/scrape/hifi-festibunadur__*.json
// sub-page scrape files (hifikedjur, bindikedjur-strekkjarar, stroffur,
// stroffur__hringstroffur, stroffur__flatstroffur, stroffur__drattastroffur,
// aukabunadur, bordastrekkjarar) plus docs/scrape/tables.json for the spec
// tables. The /hifi-festibunadur index page itself is not generated here —
// its content lives directly in app/hifi-festibunadur/page.tsx, matching
// the precedent set by scripts/gen-sturtuvagnar.mjs for /sturtuvagnar.
//
// Every sub-page scrape file shares one block layout (confirmed by
// inspecting all 8):
//   [0]        logo image
//   [1]        hero image
//   [2]        H1 (page title)
//   [3]        OPTIONAL H1 subtitle text — present only on hifikedjur,
//              bindikedjur-strekkjarar and aukabunadur (confirmed against
//              their reference screenshots); every other page's breadcrumb
//              starts immediately at [3].
//   breadcrumb "Forsíða" link, ">", one or two parent link/">" pairs, then
//              the current-page crumb text — ends right before the first
//              "image" or "heading" block.
//   [.. -3)    body content, verbatim and in order.
//   [-2, -1]   ContactCta band (H3 "Sendu okkur fyrirspurn" + link) — dropped
//              since <ContactCta /> renders that itself.
//
// Within the body, docs/scrape/tables.json's per-route tables were captured
// by a separate <table>-aware pass; the *same* cell text also appears as
// flat "text" blocks (row-major, header cells `bold: true`) in the body —
// this script finds that contiguous run by matching cell values (not
// position) and lifts it into a `tables[]` entry, keyed to the heading it
// sits under (`precedingHeading`). Two routes need special handling that
// this generic matching handles without per-route branches:
//  - hifikedjur's live page repeats its 28-row "Tveggja arma hífikeðjur"
//    table a second time with typo'd headers ("Vorunumer"/"Voruheiti") plus
//    a "Page 1 of 1" pagination line — a duplicate rendering of the same
//    widget via a Framer "Table" component (search box, column filters,
//    "Export CSV", Previous/Next pagination). This widget IS visible at
//    1440px — confirmed against both docs/reference/
//    hifi-festibunadur__hifikedjur.desktop.jpg (below the real table) and
//    its .mobile.jpg — but is deliberately not reproduced here (a Framer
//    template widget wrapped around already-rendered data, not unique
//    content; see scripts/verify.mjs's matching comment for the
//    IGNORE_MISSING entries its chrome/header labels require). Every
//    occurrence *after* the first is dropped entirely (data verified
//    identical to the first), including a trailing "Page N of M" line.
//  - hifikedjur's tables.json also lists a second "table" with headers
//    Name/Email/Role/Status — Framer's Table component's built-in demo
//    dataset, left on the live page unconfigured. It never appears in this
//    route's blocks.json at all. Excluded here by its distinctive header
//    signature, not by a hardcoded route/index, so the same rule would
//    catch it anywhere else too.
//
// aukabunadur's five product-spec tables (Keðjutalíur, H-lás, Öryggiskrókur,
// Kranakrókur lokaður, Ásuðukrókur) each sit beside a single product photo
// in a two-column, alternating image-left/image-right layout (confirmed
// against docs/reference/hifi-festibunadur__aukabunadur.desktop.jpg). Each
// photo is a plain "image" block sitting either immediately before the
// table's own heading (used when the *next* table wants image-left) or
// immediately after the table's last row (used when *this* table wants
// image-right). A gap between two tables can hold up to 2 such images (one
// trailing the earlier table, one leading the later one) — see
// collectTableImages() below.
//
// Several routes pair a bare "… í boði" / "(WLL)" H3 heading with an
// interactive min/max range-slider widget (e.g. hifikedjur's "Lengdir í
// boði" shows "2 metrar" — "6 metrar") — see RANGE_LABELS below for how
// their endpoint labels are sourced.
//
// Run: node scripts/gen-hifi.mjs  (or `npm run gen-hifi`)

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRAPE_DIR = join(ROOT, "docs/scrape");
const OUT_FILE = join(ROOT, "lib/hifi.ts");

const CTA_HEADING = "Sendu okkur fyrirspurn";
// Framer's Table component ships with this exact demo dataset by default;
// any tables.json table with these headers is that unconfigured placeholder
// on the live site, not real product data — never rendered anywhere.
const PLACEHOLDER_HEADERS = JSON.stringify(["Name", "Email", "Role", "Status"]);
// Children of /hifi-festibunadur/stroffur, in on-page card order.
const STROFFUR_CHILDREN = ["hringstroffur", "flatstroffur", "drattastroffur"];

// The min/max endpoint labels of each route's "… í boði" / "(WLL)" range
// sliders (module comment above). These numbers are drawn by an interactive
// Framer widget and never appear as scrape text anywhere in docs/scrape/
// hifi-festibunadur__*.json, so they can't be extracted the way the rest of
// this script's data is. Rather than add a network fetch to the build
// (fragile: depends on the live site staying reachable and unchanged at
// build time), this is a static map of the verbatim strings, each sourced
// once by fetching that route's own SSR HTML —
//   curl -sL -A "Mozilla/5.0" https://skralli.is/hifi-festibunadur/<route>
// — and reading the two `white-space:nowrap` label <div>s that immediately
// follow the heading's slider markup in the response (min label, then max).
// Verified 2026-09-08; see task-12-report.md's "Fix round 1" section for
// the exact curl output each value was read from. Keyed by route (not
// heading text alone) since "Þyngdarþol í boði" / "Lengd í boði" repeat
// across routes with different values.
const RANGE_LABELS = {
  "/hifi-festibunadur/hifikedjur": {
    "Lengdir í boði": { min: "2 metrar", max: "6 metrar" },
    "Leyfilegt vinnuálag (WLL)": { min: "2.8 tonn", max: "10.6 tonn" },
  },
  "/hifi-festibunadur/bindikedjur-strekkjarar": {
    "Þyngdarþol í boði": { min: "4 tonn", max: "21 tonn" },
    "Stærðir í boði": { min: "6 mm", max: "16 mm" },
    "Breidd í boði": { min: "6 mm", max: "13 mm" },
    "Lengd í boði": { min: "2 metrar", max: "6 metrar" },
    "Leyfilegt vinnuálag (WLL)": { min: "4.0 tonn", max: "21.6 tonn" },
  },
  "/hifi-festibunadur/stroffur/hringstroffur": {
    "Þyngdarþol í boði": { min: "1 tonn", max: "10 tonn" },
    "Lengd í boði": { min: "0.5 metrar", max: "10 metrar" },
  },
  "/hifi-festibunadur/stroffur/flatstroffur": {
    "Þyngdarþol í boði": { min: "1 tonn", max: "8 tonn" },
    "Lengd í boði": { min: "1 metrar", max: "14 metrar" },
  },
};

function toImg(block) {
  return { src: block.local, alt: block.alt || "", width: block.width, height: block.height };
}

/** Every occurrence of `needle` (array of strings) as a contiguous run of
 * `text`-type blocks (matched by .text value, ignoring `bold`) in `blocks`,
 * scanned left to right and non-overlapping. */
function findAllOccurrences(blocks, needle) {
  const found = [];
  let from = 0;
  while (from <= blocks.length - needle.length) {
    let matchAt = -1;
    for (let i = from; i <= blocks.length - needle.length; i++) {
      let ok = true;
      for (let k = 0; k < needle.length; k++) {
        const b = blocks[i + k];
        if (!b || b.type !== "text" || b.text !== needle[k]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        matchAt = i;
        break;
      }
    }
    if (matchAt === -1) break;
    found.push(matchAt);
    from = matchAt + needle.length;
  }
  return found;
}

/** Each kept table's adjacent product photo(s) (see module doc comment
 * above). `tableRanges` is aligned with the tables list and given in
 * document order. A gap of images between two tables is split 1/1 (first
 * image trails the earlier table, the rest lead the later one) so an image
 * is never attributed to two tables at once; the gaps before the first
 * table and after the last are simple contiguous scans since nothing else
 * competes for them. */
function collectTableImages(body, tableRanges) {
  const imagesFor = tableRanges.map(() => []);
  if (tableRanges.length === 0) return imagesFor;

  {
    const out = [];
    let i = tableRanges[0].headingIdx - 1;
    while (i >= 0 && body[i].type === "image") {
      out.unshift(body[i]);
      i--;
    }
    imagesFor[0].push(...out);
  }

  for (let i = 0; i < tableRanges.length - 1; i++) {
    const gap = [];
    for (let j = tableRanges[i].end + 1; j < tableRanges[i + 1].headingIdx; j++) {
      if (body[j].type === "image") gap.push(body[j]);
    }
    if (gap.length >= 2) {
      imagesFor[i].push(gap[0]);
      imagesFor[i + 1].push(...gap.slice(1));
    } else if (gap.length === 1) {
      imagesFor[i + 1].push(gap[0]);
    }
  }

  {
    const last = tableRanges[tableRanges.length - 1];
    const out = [];
    let i = last.end + 1;
    while (i < body.length && body[i].type === "image") {
      out.push(body[i]);
      i++;
    }
    imagesFor[tableRanges.length - 1].push(...out);
  }

  return imagesFor;
}

function parseFile(file) {
  const raw = JSON.parse(readFileSync(join(SCRAPE_DIR, file), "utf8"));
  const blocks = raw.blocks;

  const heroBlock = blocks[1];
  const h1 = blocks[2];
  if (heroBlock.type !== "image") throw new Error(`${file}: expected hero image at blocks[1]`);
  if (!(h1.type === "heading" && h1.level === 1)) throw new Error(`${file}: expected H1 at blocks[2]`);

  const ctaHeading = blocks[blocks.length - 2];
  const ctaLink = blocks[blocks.length - 1];
  if (
    !(
      ctaHeading.type === "heading" &&
      ctaHeading.level === 3 &&
      ctaHeading.text === CTA_HEADING &&
      ctaLink.type === "link"
    )
  ) {
    throw new Error(`${file}: expected trailing ContactCta blocks ("${CTA_HEADING}" + link)`);
  }

  // The breadcrumb always opens with a "Forsíða" *link*; a bare text block
  // sitting before that is the H1's subtitle line (hifikedjur,
  // bindikedjur-strekkjarar, aukabunadur only).
  let idx = 3;
  let subtitle;
  if (blocks[idx].type === "text") {
    subtitle = blocks[idx].text;
    idx++;
  }
  if (blocks[idx].type !== "link") throw new Error(`${file}: expected "Forsíða" breadcrumb link at blocks[${idx}]`);
  idx++;
  // Then repeating [">", crumb] pairs — a `link` crumb is a parent, a bare
  // `text` crumb is the current page and always terminates the breadcrumb.
  // Scanning by this exact shape (rather than "until the next image or
  // heading") matters because a page's first *body* block can itself be a
  // `link` (stroffur's child cards each open with one), which would
  // otherwise be mistaken for another breadcrumb parent.
  for (;;) {
    if (!(blocks[idx].type === "text" && blocks[idx].text === ">")) {
      throw new Error(`${file}: expected ">" breadcrumb separator at blocks[${idx}]`);
    }
    idx++;
    const isFinalCrumb = blocks[idx].type === "text";
    idx++;
    if (isFinalCrumb) break;
  }
  const bodyStart = idx;

  const body = blocks.slice(bodyStart, blocks.length - 2);

  const route = raw.route; // e.g. "/hifi-festibunadur/stroffur/hringstroffur"
  const path = route.replace(/^\/hifi-festibunadur\/?/, "").split("/").filter(Boolean);
  const routeTables = (tablesByRoute.get(route) || []).filter(
    (t) => JSON.stringify(t.headers) !== PLACEHOLDER_HEADERS,
  );

  // --- Locate + strip every table's cell text out of `body`, in the order
  // tables.json lists them (already document order) -----------------------
  const removalRanges = []; // {start, end} inclusive, to delete from body
  const tableRanges = []; // {end, headingIdx} for kept (first) occurrences, aligned with `tables`
  const tables = [];

  for (const t of routeTables) {
    const flat = t.rows.flat();
    const occurrences = findAllOccurrences(body, flat);
    if (occurrences.length === 0) {
      throw new Error(`${file}: table "${t.precedingHeading}" (${t.headers.join("/")}) not found in blocks`);
    }

    const [firstRowStart, ...dupRowStarts] = occurrences;
    const headerStart = firstRowStart - t.headers.length;
    if (headerStart < 0 || !body.slice(headerStart, firstRowStart).every((b) => b.type === "text")) {
      throw new Error(`${file}: table "${t.precedingHeading}" has no matching header row`);
    }
    const headingIdx = (() => {
      for (let i = headerStart - 1; i >= 0; i--) {
        if (body[i].type === "heading" && body[i].text === t.precedingHeading) return i;
      }
      throw new Error(`${file}: no heading "${t.precedingHeading}" precedes its table`);
    })();

    const end = firstRowStart + flat.length - 1;
    removalRanges.push({ start: headerStart, end });
    tableRanges.push({ end, headingIdx });
    tables.push({ heading: t.precedingHeading, headers: t.headers, rows: t.rows });

    for (const dupStart of dupRowStarts) {
      const dupHeaderStart = dupStart - t.headers.length;
      let dupEnd = dupStart + flat.length - 1;
      while (body[dupEnd + 1] && body[dupEnd + 1].type === "text" && /^Page \d+ of \d+$/i.test(body[dupEnd + 1].text)) {
        dupEnd++;
      }
      removalRanges.push({ start: Math.max(dupHeaderStart, 0), end: dupEnd });
    }
  }

  // Attach each kept table's adjacent product photo(s), if any.
  const tableImageLists = collectTableImages(body, tableRanges);
  tables.forEach((t, i) => {
    if (tableImageLists[i]?.length) t.images = tableImageLists[i].map(toImg);
  });

  // Delete every removed range (headers+rows for the kept table, and the
  // full duplicate runs) from `body`, back-to-front so indices stay valid.
  removalRanges
    .sort((a, b) => b.start - a.start)
    .forEach(({ start, end }) => body.splice(start, end - start + 1));

  // The only `link` blocks left in the body at this point are stroffur's
  // three child-page cards (breadcrumb and ContactCta links were already
  // sliced off above). Their scraped hrefs are relative to /hifi-festibunadur/
  // itself (e.g. "./stroffur/hringstroffur"), matching a static export where
  // each route is a sibling file one level up from a nested page — resolve
  // them to real root-relative site paths.
  const routeRangeLabels = RANGE_LABELS[route] || {};
  const hifiBlocks = body
    .filter((b) => b.type === "heading" || b.type === "text" || b.type === "link")
    .map((b) =>
      b.type === "link"
        ? { type: "link", text: b.text, href: b.href.replace(/^\.\//, "/hifi-festibunadur/") }
        : b.type === "heading"
          ? {
              type: "heading",
              level: b.level,
              text: b.text,
              ...(routeRangeLabels[b.text] ? { range: routeRangeLabels[b.text] } : {}),
            }
          : { type: "text", text: b.text },
    );
  const images = body.filter((b) => b.type === "image").map(toImg);

  return {
    id: path[path.length - 1],
    path,
    title: h1.text,
    ...(subtitle ? { subtitle } : {}),
    description: raw.description,
    heroImage: toImg(heroBlock),
    blocks: hifiBlocks,
    images,
    ...(tables.length ? { tables } : {}),
    ...(path.length === 1 && path[0] === "stroffur" ? { children: STROFFUR_CHILDREN } : {}),
  };
}

// --- Load tables.json once, indexed by route ------------------------------
const tablesJson = JSON.parse(readFileSync(join(SCRAPE_DIR, "tables.json"), "utf8"));
const tablesByRoute = new Map(tablesJson.routes.map((r) => [r.route, r.tables]));

const files = readdirSync(SCRAPE_DIR)
  .filter((f) => f.startsWith("hifi-festibunadur__") && f.endsWith(".json"))
  .sort();

const hifiPages = files.map(parseFile).sort((a, b) => a.path.join("/").localeCompare(b.path.join("/")));

// Sanity-check the numbers the controller derived from the scrape by hand.
const totalTables = hifiPages.reduce((n, p) => n + (p.tables?.length ?? 0), 0);
const totalRows = hifiPages.reduce((n, p) => n + (p.tables?.reduce((m, t) => m + t.rows.length, 0) ?? 0), 0);
if (totalTables !== 10 || totalRows !== 189) {
  throw new Error(`Expected 10 tables / 189 rows total, got ${totalTables} tables / ${totalRows} rows`);
}

// Every RANGE_LABELS[route][heading] must have actually matched a heading
// block on that route, or it's a stale/typo'd entry silently doing nothing.
for (const [route, headings] of Object.entries(RANGE_LABELS)) {
  const page = hifiPages.find((p) => `/hifi-festibunadur/${p.path.join("/")}` === route);
  if (!page) throw new Error(`RANGE_LABELS has unknown route "${route}"`);
  for (const heading of Object.keys(headings)) {
    const found = page.blocks.some((b) => b.type === "heading" && b.text === heading && b.range);
    if (!found) throw new Error(`RANGE_LABELS["${route}"]["${heading}"] never matched a heading block`);
  }
}

const banner = `// GENERATED FILE — do not edit by hand.
// Run \`npm run gen-hifi\` (scripts/gen-hifi.mjs) to regenerate from
// docs/scrape/hifi-festibunadur__*.json (8 sub-page files) and
// docs/scrape/tables.json. See that script for the parsing rules. The
// /hifi-festibunadur index page itself is not generated here — its content
// lives directly in app/hifi-festibunadur/page.tsx.

import type { Img } from "./types";

export type HifiBlock =
  | {
      type: "heading";
      level: number;
      text: string;
      /** Min/max endpoint labels of the live page's range-slider widget for
       * this heading (see RANGE_LABELS in scripts/gen-hifi.mjs) — present
       * only on the handful of "… í boði" / "(WLL)" headings that have one. */
      range?: { min: string; max: string };
    }
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

/** A product-spec table (docs/scrape/tables.json), keyed to the heading
 * (H2 or H3) it sits under in \`blocks\`. \`images\`, when present, are the
 * product photo(s) shown alongside this table on the live page (aukabunadur's
 * five tables and bordastrekkjarar's own table all have one; the others don't). */
export type HifiTable = {
  heading: string;
  headers: string[];
  rows: string[][];
  images?: Img[];
};

export type HifiPage = {
  id: string;
  /** Route segments after /hifi-festibunadur/, e.g. ["stroffur","hringstroffur"]. */
  path: string[];
  /** H1 / display title. */
  title: string;
  /** H1 subtitle line — hifikedjur, bindikedjur-strekkjarar, aukabunadur only. */
  subtitle?: string;
  /** Scraped <meta description> (the <title> is site-wide, set directly by the page). */
  description: string;
  heroImage?: Img;
  /** Body content (verbatim), excluding the H1, breadcrumb, table cells and ContactCta blocks. */
  blocks: HifiBlock[];
  /** Content images (verbatim, in order), excluding the hero image. */
  images: Img[];
  tables?: HifiTable[];
  /** Slugs of child pages (stroffur only), in on-page card order. */
  children?: string[];
};

`;

const body = `export const hifiPages: HifiPage[] = ${JSON.stringify(hifiPages, null, 2)};
`;

writeFileSync(OUT_FILE, banner + body);
console.log(
  `Wrote ${OUT_FILE.replace(ROOT + "/", "")}: ${hifiPages.length} pages, ${totalTables} tables, ${totalRows} rows.`,
);
