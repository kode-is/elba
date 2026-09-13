import type { Wagon, WagonGroup } from "./sturtuvagnar";

// Product-redesign fact strip (design.dc.html 1a/1d "Staðreyndastrimill"):
// every value here is either fixed (true for all 25 products — the same
// text already shown in ProductIntro's pills) or derived by regex from
// data lib/sturtuvagnar.ts already carries. Nothing is invented, and a
// fact whose source text doesn't match is simply omitted rather than
// guessed — see tests/product-facts.test.ts for the two real cases (a
// product with both Stærð and Sturtuhalli, and one with neither).
export type ProductFact = { label: string; value: string; tone?: "green" };

const SIZE_RE = /(\d+)\s*x\s*(\d+)\s*x\s*(\d+)\s*sm/i;
const ANGLE_RE = /(\d+)\s*gráðu sturtuhalla/;

/**
 * Extracts a "150x100x35 sm"-style size out of a product blurb, e.g.
 * `"Nettari útgáfan af Gigant ... 150x100x35 sm. Sterkbyggður ..."` ->
 * `"150×100×35 sm"` (× U+00D7). Only 2 of the 25 wagon blurbs currently
 * match; returns null for the rest — callers must omit the fact rather
 * than invent a size.
 */
export function productSize(blurb: string): string | null {
  const match = SIZE_RE.exec(blurb);
  if (!match) return null;
  const [, a, b, c] = match;
  return `${a}×${b}×${c} sm`;
}

/**
 * Derives the fact-strip cells for one product, in display order (Stærð,
 * Flokkur, Framleiðandi, Framleitt í, Ábyrgð, Sturtuhalli) — present ones
 * only. `Framleiðandi`/`Framleitt í`/`Ábyrgð` are true of every product
 * (the existing pills' text); `Sturtuhalli` is read off the owning
 * group's "Um X" paragraphs, since it's a property of the product line,
 * not any one product's own blurb.
 */
export function productFacts(product: Wagon, group: WagonGroup): ProductFact[] {
  const facts: ProductFact[] = [];

  const size = productSize(product.blurb);
  if (size) facts.push({ label: "Stærð", value: size });

  facts.push({ label: "Flokkur", value: group.title });
  facts.push({ label: "Framleiðandi", value: "Gigant" });
  facts.push({ label: "Framleitt í", value: "Noregi" });
  facts.push({ label: "Ábyrgð", value: "5 ára", tone: "green" });

  const angleMatch = ANGLE_RE.exec(group.about.join(" "));
  if (angleMatch) {
    facts.push({ label: "Sturtuhalli", value: `u.þ.b. ${angleMatch[1]}°` });
  }

  return facts;
}
