// Shared normalization rules for scraped page data (see
// .superpowers/sdd/2026-09-07-skralli-website-recreation/task-2-report.md,
// "Fix round 1" -- reviewer-mandated dedup pass for scripts/scrape.mjs output).
//
// Both functions are pure: they return new arrays, never mutate their input,
// preserve block order, and never alter surviving text.

/**
 * Removes two kinds of duplicate blocks produced by the DOM walker in
 * scripts/scrape.mjs, in this order:
 *
 * 1. A `text` block that duplicates the visible text of an immediately
 *    adjacent `link` block (the walker independently records the anchor as
 *    a `link` block and its inner text node/span as a `text` block). A
 *    `text` block is dropped when either its immediately preceding OR its
 *    immediately following block (in the pre-dedup order) is a `link` block
 *    whose trimmed `text` equals this block's trimmed `text`.
 * 2. A consecutive `image` block that repeats the immediately preceding
 *    block's `src` (same visible image walked twice, e.g. once as a
 *    foreground `<img>` and once as a CSS background on a wrapping element).
 *    The first occurrence is kept; if the dropped block had
 *    `role: "content"` and the kept block had `role: "background"`, the
 *    kept block's role is promoted to `"content"`.
 *
 * Nothing else is changed: no block is reordered, and no surviving block's
 * text/src/etc. is modified (aside from the role promotion above).
 */
export function normalizeBlocks(blocks) {
  const input = Array.isArray(blocks) ? blocks : [];

  // Pass 1: drop text blocks that duplicate an adjacent link's text.
  // Adjacency is evaluated against the original array so that removing one
  // duplicate never changes which blocks count as "adjacent" for another.
  const isDupeText = (i) => {
    const b = input[i];
    if (!b || b.type !== "text") return false;
    const t = (b.text ?? "").trim();
    const matchesLink = (o) => o && o.type === "link" && (o.text ?? "").trim() === t;
    return matchesLink(input[i - 1]) || matchesLink(input[i + 1]);
  };
  const afterTextDedup = input.filter((_, i) => !isDupeText(i));

  // Pass 2: drop an image block whose src repeats the immediately preceding
  // (surviving) block's src, keeping the first occurrence.
  const result = [];
  for (const block of afterTextDedup) {
    const prev = result[result.length - 1];
    if (
      block.type === "image" &&
      prev &&
      prev.type === "image" &&
      prev.src === block.src
    ) {
      if (block.role === "content" && prev.role === "background") {
        prev.role = "content";
      }
      continue; // drop the duplicate
    }
    result.push(block);
  }
  return result;
}

/**
 * Cleans up a `nav` array: drops entries whose trimmed `text` is empty
 * (e.g. a logo `<a>` that wraps only an `<img>`, no text), then dedupes
 * identical `{ text, href }` pairs, keeping the first occurrence. Order of
 * surviving entries is preserved.
 */
export function normalizeNav(nav) {
  const input = Array.isArray(nav) ? nav : [];
  const seen = new Set();
  const result = [];
  for (const entry of input) {
    const text = (entry?.text ?? "").trim();
    if (!text) continue;
    const key = `${text} ${entry.href ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(entry);
  }
  return result;
}
