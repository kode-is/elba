#!/usr/bin/env node
// Generates lib/sturtuvagnar.ts from the 30 docs/scrape/sturtuvagnar__*.json
// scrape files (5 wagon-group pages + 25 wagon/product pages — the
// docs/scrape/sturtuvagnar.json category page itself is handled directly by
// app/sturtuvagnar/page.tsx, not by this script).
//
// Every one of those 30 files shares one exact block layout (confirmed by
// inspecting all 30):
//   [0]           logo image (role "logo")
//   [1]           hero image (role "content", 1440x1440 usually)
//   [2]           H1 (the page title)
//   [3..7]        breadcrumb: link "Forsíða", text ">", link <parent title>,
//                 text ">", text <current crumb — duplicates the H1 text>
//   [8 .. -3]     the page's actual body content, verbatim and in order —
//                 for a group page: H2 "Um X" + 1-3 paragraphs, H2 "Tegundir
//                 í boði", then repeating (image, H3 product name, text
//                 blurb) triples; for a product page: just two H2s
//                 (the group title, then "Tegundir í boði") with nothing
//                 under either.
//   [-2, -1]      the ContactCta band: H3 "Sendu okkur fyrirspurn" + link
//                 "Hafa samband" — dropped here since <ContactCta /> renders
//                 that itself.
//
// So the body slice blocks.slice(8, -2) is split into `images` (all
// "image" blocks, in order) and `blocks` (all "heading"/"text" blocks, in
// order) — no per-slug special-casing needed. A product's `groupId` is
// derived from its first H2, which is always exactly the owning group's H1
// text (confirmed against every product file).
//
// Product-page mockup 1 additionally needs, per group, its "Um X" paragraphs
// (`about`) and its "Tegundir í boði" cards matched to products (`products`,
// slugs in card order); and per product, the matching card's blurb/image
// (`blurb`/`cardImage`) — see extractGroupContent(). It also needs the seven
// "Af hverju hjólagröfuvagn frá Gigant?" feature tiles, which live only on
// docs/scrape/sturtuvagnar.json and apply only to the hjólagröfuvagnar group
// — see parseGroupFeatures() and the exported `groupFeatures`.
//
// Run: node scripts/gen-sturtuvagnar.mjs  (or `npm run gen-sturtuvagnar`)

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRAPE_DIR = join(ROOT, "docs/scrape");
const OUT_FILE = join(ROOT, "lib/sturtuvagnar.ts");

// Order matches docs/scrape/sturtuvagnar.json's "Aðrar vagntegundir" card
// order, which app/sturtuvagnar/page.tsx reuses for its own group cards.
const GROUP_SLUGS = [
  "fjorhjola-minigrofuvagnar",
  "verktakavagnar",
  "landbunadarvagnar",
  "hjolagrofuvagnar",
  "velaflutningavagnar",
];

const CTA_HEADING = "Sendu okkur fyrirspurn";
const CARDS_HEADING = "Tegundir í boði";
const FEATURES_HEADING = "Af hverju hjólagröfuvagn frá Gigant?";

function toImg(block) {
  return { src: block.local, alt: block.alt || "", width: block.width, height: block.height };
}

// A group page's body (parsed.blocks/parsed.images, see parseFile below) is
// always: H2 "Um X" + 1-3 paragraphs, H2 "Tegundir í boði", then N repeating
// (image, H3 product title, text blurb) triples — one per product in that
// group, confirmed across all 5 group scrape files. This splits that into
// the "Um X" paragraphs and the per-product cards (title/blurb/image).
function extractGroupContent(file, blocks, images) {
  const firstH2 = blocks.findIndex((b) => b.type === "heading" && b.level === 2);
  if (firstH2 === -1) throw new Error(`${file}: expected an "Um X" H2 in the group body`);
  const cardsH2 = blocks.findIndex(
    (b, i) => i > firstH2 && b.type === "heading" && b.level === 2 && b.text === CARDS_HEADING,
  );
  if (cardsH2 === -1) throw new Error(`${file}: expected H2 "${CARDS_HEADING}" in the group body`);

  const about = blocks
    .slice(firstH2 + 1, cardsH2)
    .filter((b) => b.type === "text")
    .map((b) => b.text);

  const cardBlocks = blocks.slice(cardsH2 + 1);
  if (cardBlocks.length !== images.length * 2) {
    throw new Error(
      `${file}: "${CARDS_HEADING}" has ${cardBlocks.length} heading/text blocks but ${images.length} images (expected a 1:1 image+H3+text triple per product)`,
    );
  }
  const cards = [];
  for (let i = 0; i < cardBlocks.length; i += 2) {
    const heading = cardBlocks[i];
    const text = cardBlocks[i + 1];
    if (!(heading.type === "heading" && heading.level === 3 && text.type === "text")) {
      throw new Error(`${file}: expected a (H3, text) pair at card index ${i / 2}`);
    }
    cards.push({ title: heading.text, blurb: text.text, image: images[i / 2] });
  }

  return { about, cards };
}

// The seven feature tiles ("Af hverju hjólagröfuvagn frá Gigant?") live only
// on docs/scrape/sturtuvagnar.json (the /sturtuvagnar category page), not on
// any of the __-prefixed group/product files, and apply only to the
// hjólagröfuvagnar group.
function parseGroupFeatures() {
  const file = "sturtuvagnar.json";
  const { blocks } = JSON.parse(readFileSync(join(SCRAPE_DIR, file), "utf8"));
  const headingIndex = blocks.findIndex(
    (b) => b.type === "heading" && b.level === 2 && b.text === FEATURES_HEADING,
  );
  if (headingIndex === -1) {
    throw new Error(`${file}: expected H2 "${FEATURES_HEADING}"`);
  }
  const items = [];
  for (let i = headingIndex + 1; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "heading" && b.level === 3) {
      items.push(b.text);
    } else {
      break;
    }
  }
  if (items.length !== 7) {
    throw new Error(`${file}: expected 7 feature H3s after "${FEATURES_HEADING}", found ${items.length}`);
  }
  return { hjolagrofuvagnar: { heading: blocks[headingIndex].text, items } };
}

function parseFile(file) {
  const json = JSON.parse(readFileSync(join(SCRAPE_DIR, file), "utf8"));
  const { blocks } = json;

  const heroBlock = blocks[1];
  const h1 = blocks[2];
  const ctaHeading = blocks[blocks.length - 2];
  const ctaLink = blocks[blocks.length - 1];

  if (heroBlock.type !== "image") {
    throw new Error(`${file}: expected hero image at blocks[1]`);
  }
  if (!(h1.type === "heading" && h1.level === 1)) {
    throw new Error(`${file}: expected H1 at blocks[2]`);
  }
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

  const body = blocks.slice(8, -2);
  const wagonBlocks = body
    .filter((b) => b.type === "heading" || b.type === "text")
    .map((b) => (b.type === "heading" ? { type: "heading", level: b.level, text: b.text } : { type: "text", text: b.text }));
  const images = body.filter((b) => b.type === "image").map(toImg);

  return {
    title: h1.text,
    pageTitle: json.title,
    description: json.description,
    heroImage: toImg(heroBlock),
    blocks: wagonBlocks,
    images,
  };
}

const files = readdirSync(SCRAPE_DIR)
  .filter((f) => f.startsWith("sturtuvagnar__") && f.endsWith(".json"))
  .sort();

const groupsBySlug = new Map();
const productEntries = [];

for (const file of files) {
  const slug = file.slice("sturtuvagnar__".length, -".json".length);
  const parsed = parseFile(file);
  if (GROUP_SLUGS.includes(slug)) {
    groupsBySlug.set(slug, {
      id: slug,
      slug,
      title: parsed.title,
      pageTitle: parsed.pageTitle,
      description: parsed.description,
      heroImage: parsed.heroImage,
      blocks: parsed.blocks,
      images: parsed.images,
    });
  } else {
    productEntries.push({ slug, parsed });
  }
}

const missingGroups = GROUP_SLUGS.filter((slug) => !groupsBySlug.has(slug));
if (missingGroups.length) {
  throw new Error(`Missing group scrape file(s) for: ${missingGroups.join(", ")}`);
}

const wagonGroups = GROUP_SLUGS.map((slug) => groupsBySlug.get(slug));
const titleToGroupId = new Map(wagonGroups.map((g) => [g.title, g.slug]));

const wagons = productEntries
  .map(({ slug, parsed }) => {
    const firstH2 = parsed.blocks.find((b) => b.type === "heading" && b.level === 2);
    if (!firstH2) throw new Error(`sturtuvagnar__${slug}.json: product has no group H2`);
    const groupId = titleToGroupId.get(firstH2.text);
    if (!groupId) {
      throw new Error(
        `sturtuvagnar__${slug}.json: first H2 "${firstH2.text}" doesn't match any group title`,
      );
    }
    return {
      id: slug,
      slug,
      title: parsed.title,
      groupId,
      pageTitle: parsed.pageTitle,
      description: parsed.description,
      heroImage: parsed.heroImage,
      blocks: parsed.blocks,
      images: parsed.images,
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

// Extend every group with its "Um X" paragraphs and its "Tegundir í boði"
// products (in card order), and every wagon with the blurb + card image
// taken from its group's card of the same title. Fails loudly if a card
// can't be matched to a product or vice versa, per group.
const groupContentBySlug = new Map(
  wagonGroups.map((group) => [
    group.slug,
    extractGroupContent(`sturtuvagnar__${group.slug}.json`, group.blocks, group.images),
  ]),
);

for (const group of wagonGroups) {
  const { cards } = groupContentBySlug.get(group.slug);
  group.products = cards.map((card) => {
    const wagon = wagons.find((w) => w.groupId === group.slug && w.title === card.title);
    if (!wagon) {
      throw new Error(
        `sturtuvagnar__${group.slug}.json: "${CARDS_HEADING}" card "${card.title}" doesn't match any product with groupId "${group.slug}"`,
      );
    }
    return wagon.slug;
  });
  group.about = groupContentBySlug.get(group.slug).about;
}

for (const wagon of wagons) {
  const { cards } = groupContentBySlug.get(wagon.groupId);
  const card = cards.find((c) => c.title === wagon.title);
  if (!card) {
    throw new Error(
      `sturtuvagnar__${wagon.slug}.json: no "${CARDS_HEADING}" card titled "${wagon.title}" found in group "${wagon.groupId}"`,
    );
  }
  wagon.blurb = card.blurb;
  wagon.cardImage = card.image;
}

const groupFeatures = parseGroupFeatures();

const banner = `// GENERATED FILE — do not edit by hand.
// Run \`npm run gen-sturtuvagnar\` (scripts/gen-sturtuvagnar.mjs) to
// regenerate from docs/scrape/sturtuvagnar__*.json (30 files: 5 wagon
// groups + 25 wagon/product pages). See that script for the parsing rules.
// The /sturtuvagnar category page itself is not generated here — its
// content lives directly in app/sturtuvagnar/page.tsx.

import type { Img } from "./types";

export type WagonBlock = { type: "heading" | "text"; level?: number; text: string };

export type WagonGroup = {
  id: string;
  slug: string;
  /** H1 / display title. */
  title: string;
  /** Scraped <title>, e.g. "Hjólagröfuvagnar - Skralli - Þinn samstarfsaðili". */
  pageTitle: string;
  /** Scraped <meta description>. */
  description: string;
  heroImage: Img;
  /** Body content (verbatim), excluding the H1, breadcrumb and ContactCta blocks. */
  blocks: WagonBlock[];
  /** Content images (verbatim, in order), excluding the hero image. */
  images: Img[];
  /** The group's "Um X" paragraphs (verbatim, in order). */
  about: string[];
  /** Slugs of this group's Wagons, in "Tegundir í boði" card order. */
  products: string[];
};

export type Wagon = {
  id: string;
  slug: string;
  /** H1 / display title. */
  title: string;
  /** Owning WagonGroup's \`slug\`/\`id\`, derived from this page's first H2. */
  groupId: string;
  /** Scraped <title>, e.g. "GW-100 - Skralli - Þinn samstarfsaðili". */
  pageTitle: string;
  /** Scraped <meta description>. */
  description: string;
  heroImage: Img;
  /** Body content (verbatim): the group-title H2 and the "Tegundir í boði" H2. */
  blocks: WagonBlock[];
  images: Img[];
  /** Blurb text from this product's card on its group's "Tegundir í boði" section. */
  blurb: string;
  /** Card image from this product's card on its group's "Tegundir í boði" section. */
  cardImage: Img;
};

export type GroupFeatures = { heading: string; items: string[] };

`;

const body = `export const wagonGroups: WagonGroup[] = ${JSON.stringify(wagonGroups, null, 2)};

export const wagons: Wagon[] = ${JSON.stringify(wagons, null, 2)};

// The seven feature tiles from docs/scrape/sturtuvagnar.json's "Af hverju
// hjólagröfuvagn frá Gigant?" section — only the hjólagröfuvagnar group has
// these on the live site, so this is keyed by group slug/id and every other
// group is simply absent (no invented features for the other four groups).
export const groupFeatures: Record<string, GroupFeatures> = ${JSON.stringify(groupFeatures, null, 2)};
`;

writeFileSync(OUT_FILE, banner + body);
console.log(
  `Wrote ${OUT_FILE.replace(ROOT + "/", "")}: ${wagonGroups.length} groups, ${wagons.length} wagons.`,
);
