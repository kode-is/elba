#!/usr/bin/env node
// Generates lib/artikler.ts from docs/scrape/artikler__*.json (per-article
// block dumps) and docs/scrape/artikler.json (the index page, whose link
// order and card images this generator mirrors). Run: npm run gen-artikler
//
// Every article page's blocks follow one pattern after the site logo:
//   hero image, H1 title, breadcrumb (a link with text "Artikle" — sic,
//   verbatim live copy, kept as-is — pointing at ../artikler, then a text
//   block that just repeats the title), a second H1 immediately after (the
//   subtitle line — verbatim identical to the title on nytt-design, a
//   distinct sentence on the other four; always present, kept either way),
//   then body content (text/heading/image/link blocks) until the closing
//   H2 "Send oss en forespørsel" + "Kontakt oss" link that every article
//   ends with, which `<ContactCta />` renders instead of ArticleBlock
//   content.
//
// The live scrape currently carries no `bold`/`list` annotations on any
// artikler route's text blocks — scripts/scrape-formatting.mjs did find
// list/strong candidates on the live HTML (see docs/scrape/formatting.json),
// but a later scrape.mjs re-run (fixing footer detection) regenerated
// docs/scrape/artikler__*.json's blocks fresh, after formatting.json was
// written, so the annotations were never merged back in (verified: the
// artikler__*.json mtimes postdate formatting.json's generatedAt, and no
// block below carries a `bold`/`list` key). This generator still reads
// them defensively, same as gen-produkter does for produkter, but they
// never fire today — every text block renders as a plain paragraph.
//
// No article shows a visible publish date on live (Framer's own <time>
// element renders empty on every one of the five routes) — Article.date
// is intentionally never set.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRAPE = join(ROOT, "docs/scrape");

const SITE_LOGO = "/images/home/00-d1c05434.png";
const CTA_HEADING = "Send oss en forespørsel";
const strip = (s) => s.replace(/​/g, "").trim();
const img = (b) => ({ src: b.local, alt: b.alt || "", width: b.width, height: b.height });

// nytt-eierskap's scrape glues three pull-quotes' closing quote mark
// directly onto their attribution with no separating whitespace (e.g.
// `…selskapene."sier Villi…`) — a scraper DOM-flattening artifact, not
// real copy: a fresh capture of the live page (scripts/verify.mjs) shows
// a space there instead. One of the three instead glues on a "- Name,
// role" byline (`…service"- Ronny, daglig leder`); live renders that
// byline as its own line, not just a space-separated run, so that one
// case splits into two blocks instead of gaining a space. Matches a
// closing quote (" or ”) preceded by a non-space, non-opening-quote
// character (so “Elba's own opening quote, always immediately followed
// by a letter, is never touched) and immediately followed by another
// non-space character.
const GLUED_QUOTE = /^(.*[^\s"“])(["”])([^\s].*)$/s;
function splitGluedQuote(text) {
  const m = GLUED_QUOTE.exec(text);
  if (!m) return [text];
  const [, before, quote, after] = m;
  return after.startsWith("-") ? [`${before}${quote}`, after] : [`${before}${quote} ${after}`];
}

// Card images + index order come from the /artikler index page: each
// article is a [link(./artikler/<slug>), image, heading(3), text] group
// (docs/scrape/artikler.json blocks 4-23).
const indexJson = JSON.parse(readFileSync(join(SCRAPE, "artikler.json"), "utf8"));
const order = [];
const cardImages = {};
indexJson.blocks.forEach((b, i) => {
  if (b.type !== "link" || !b.href?.startsWith("./artikler/")) return;
  const id = b.href.slice("./artikler/".length);
  const imageBlock = indexJson.blocks[i + 1];
  if (imageBlock?.type !== "image") throw new Error(`artikler.json: expected an image block right after the "${id}" link`);
  order.push(id);
  cardImages[id] = img(imageBlock);
});

const bySlug = {};
for (const file of readdirSync(SCRAPE).filter((f) => f.startsWith("artikler__") && f.endsWith(".json"))) {
  const j = JSON.parse(readFileSync(join(SCRAPE, file), "utf8"));
  const blocks = j.blocks;
  const id = strip(j.route.slice("/artikler/".length));

  const h1Index = blocks.findIndex((b) => b.type === "heading" && b.level === 1);
  if (h1Index === -1) throw new Error(`${j.route}: no H1 found`);
  const title = strip(blocks[h1Index].text);

  // The scraper mislabels the shared site logo image the same way it does
  // on produkter — found by path, not by role. It always precedes the H1.
  const heroBlock = blocks.find((b) => b.type === "image" && b.local !== SITE_LOGO);
  if (!heroBlock) throw new Error(`${j.route}: no non-logo hero image found`);
  const hero = img(heroBlock);

  // Breadcrumb right after the title: the "Artikle" link and a text block
  // that just repeats the title.
  let i = h1Index + 1;
  if (blocks[i]?.type !== "link") throw new Error(`${j.route}: expected the breadcrumb link right after the title`);
  i++;
  if (!(blocks[i]?.type === "text" && strip(blocks[i].text) === title)) {
    throw new Error(`${j.route}: expected the breadcrumb's repeated-title text at index ${i}`);
  }
  i++;

  // A second H1 always follows — the subtitle line. Rendered even when it
  // repeats the title verbatim (nytt-design), matching live.
  let subtitle;
  if (blocks[i]?.type === "heading" && blocks[i].level === 1) {
    subtitle = strip(blocks[i].text);
    i++;
  } else {
    throw new Error(`${j.route}: expected a second H1 (subtitle) at index ${i}`);
  }

  // Body runs from here to the closing CTA heading (every article ends
  // with "Send oss en forespørsel" + a "Kontakt oss" link).
  const ctaIndex = blocks.findIndex((b, idx) => idx >= i && b.type === "heading" && strip(b.text) === CTA_HEADING);
  if (ctaIndex === -1) throw new Error(`${j.route}: no closing "${CTA_HEADING}" heading found`);
  const bodySource = blocks.slice(i, ctaIndex);

  const body = [];
  for (let k = 0; k < bodySource.length; k++) {
    const b = bodySource[k];
    if (b.type === "heading") {
      if (b.level !== 2 && b.level !== 3 && b.level !== 4) throw new Error(`${j.route}: unexpected body heading level ${b.level}`);
      body.push({ type: "heading", level: b.level, text: strip(b.text) });
      continue;
    }
    if (b.type === "text") {
      const parts = splitGluedQuote(strip(b.text));
      for (const text of parts) {
        const block = { type: "text", text };
        if (b.bold) block.bold = true;
        if (typeof b.list === "number") block.list = b.list;
        body.push(block);
      }
      continue;
    }
    if (b.type === "image") {
      // An image followed immediately by a text block: that text is the
      // image's caption (e.g. nytt-eierskap's "Fra venstre, …" under the
      // owners' photo) — folded in rather than emitted as its own block.
      const block = { type: "image", image: img(b) };
      const next = bodySource[k + 1];
      if (next?.type === "text") {
        block.caption = strip(next.text);
        k++;
      }
      body.push(block);
      continue;
    }
    if (b.type === "link") {
      const href = b.href.startsWith("../") ? `/${b.href.slice(3)}` : b.href;
      body.push({ type: "link", text: strip(b.text), href });
      continue;
    }
    throw new Error(`${j.route}: unhandled body block type "${b.type}"`);
  }
  if (body.length === 0) throw new Error(`${j.route}: empty body`);

  const cardImage = cardImages[id];
  if (!cardImage) throw new Error(`${j.route}: no card image found for "${id}" on the /artikler index`);

  bySlug[id] = {
    id,
    title,
    subtitle,
    hero,
    cardImage,
    body,
    metaTitle: j.title.replace(/ — Skralli$/, " — Elba"),
    metaDescription: j.description,
  };
}

const artikler = order.map((id) => {
  const a = bySlug[id];
  if (!a) throw new Error(`artikler.json references "${id}" but docs/scrape/artikler__${id}.json was not found`);
  return a;
});

for (const a of artikler) {
  if (a.metaTitle.includes("Skralli")) throw new Error(`${a.id}: metaTitle still contains "Skralli": ${a.metaTitle}`);
  if (!a.metaTitle.endsWith(" — Elba")) throw new Error(`${a.id}: metaTitle doesn't end with " — Elba": ${a.metaTitle}`);
}

const ts = `// GENERATED by scripts/gen-artikler.mjs from docs/scrape — do not edit by hand.
import type { Img } from "@/lib/types";

export type ArticleBlock =
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "text"; text: string; bold?: boolean; list?: number }
  | { type: "image"; image: Img; caption?: string }
  | { type: "link"; text: string; href: string };

export type Article = {
  id: string;
  title: string;
  /** Live's second H1. Sometimes verbatim identical to \`title\` (nytt-design) — rendered either way, matching live. */
  subtitle?: string;
  /** No article shows a visible publish date on live (Framer's <time> renders empty) — never set. */
  date?: string;
  /** The article page's own hero image. Differs from \`cardImage\` (docs/scrape/artikler__<id>.json). */
  hero: Img;
  /** The listing image used by the /artikler index and home page cards (docs/scrape/artikler.json). */
  cardImage: Img;
  body: ArticleBlock[];
  metaTitle: string;
  metaDescription: string;
};

export const artikler: Article[] = ${JSON.stringify(artikler, null, 2)};

export const articleBySlug = (slug: string): Article | undefined => artikler.find((a) => a.id === slug);
`;
writeFileSync(join(ROOT, "lib/artikler.ts"), ts);
console.log(`wrote lib/artikler.ts: ${artikler.length} articles`);
for (const a of artikler) {
  const kinds = a.body.reduce((acc, b) => ((acc[b.type] = (acc[b.type] || 0) + 1), acc), {});
  const subtitleNote = a.subtitle === a.title ? "same-as-title" : "distinct";
  console.log(
    `  ${a.id}: subtitle=${subtitleNote} body=${a.body.length} blocks ${JSON.stringify(kinds)} hero=${a.hero.width}x${a.hero.height} cardImage=${a.cardImage.width}x${a.cardImage.height}`
  );
}
