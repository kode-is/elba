// One-off cleanup pass over the already-scraped docs/scrape/*.json files
// (committed as 33550b4, before scripts/scrape.mjs applied normalization on
// write). Applies the same rules scripts/scrape.mjs now applies on every
// future run, in place, without re-scraping the live site.
//
// Usage: node scripts/normalize-scrape.mjs
// (wired up as `npm run normalize-scrape`)

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeBlocks, normalizeNav } from "./lib/normalize.mjs";

const DIR = "docs/scrape";

const countByType = (blocks, type) =>
  (Array.isArray(blocks) ? blocks : []).filter((b) => b.type === type).length;

async function main() {
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".json")).sort();

  const totals = {
    textDropped: 0,
    imageDropped: 0,
    navDropped: 0,
    filesChanged: 0,
  };

  for (const file of files) {
    const file_path = path.join(DIR, file);
    const raw = await readFile(file_path, "utf8");
    const data = JSON.parse(raw);

    const beforeBlocksText = countByType(data.blocks, "text");
    const beforeBlocksImage = countByType(data.blocks, "image");
    const beforeFooterText = countByType(data.footer, "text");
    const beforeFooterImage = countByType(data.footer, "image");
    const beforeNavLen = Array.isArray(data.nav) ? data.nav.length : 0;

    const newBlocks = normalizeBlocks(data.blocks);
    const newFooter = normalizeBlocks(data.footer);
    const newNav = normalizeNav(data.nav);

    const afterBlocksText = countByType(newBlocks, "text");
    const afterBlocksImage = countByType(newBlocks, "image");
    const afterFooterText = countByType(newFooter, "text");
    const afterFooterImage = countByType(newFooter, "image");
    const afterNavLen = newNav.length;

    // normalizeBlocks only ever removes `text` blocks (rule 1: dup of an
    // adjacent link's text) or `image` blocks (rule 2: consecutive same-src
    // duplicate) and never touches any other block type or reorders
    // survivors — so the drop in each type's count *is* that rule's count.
    const textDropped =
      (beforeBlocksText - afterBlocksText) + (beforeFooterText - afterFooterText);
    const imageDropped =
      (beforeBlocksImage - afterBlocksImage) + (beforeFooterImage - afterFooterImage);
    const navDropped = beforeNavLen - afterNavLen;

    totals.textDropped += textDropped;
    totals.imageDropped += imageDropped;
    totals.navDropped += navDropped;

    const changed = textDropped > 0 || imageDropped > 0 || navDropped > 0;
    if (changed) {
      totals.filesChanged++;
      data.blocks = newBlocks;
      data.footer = newFooter;
      data.nav = newNav;
      // Match scripts/scrape.mjs's own writeFile call exactly: 2-space
      // indent, no trailing newline appended.
      await writeFile(file_path, JSON.stringify(data, null, 2));
    }

    console.log(
      `${file}: text-dup -${textDropped}, image-dup -${imageDropped}, nav -${navDropped}` +
        (changed ? "" : " (unchanged)")
    );
  }

  console.log("---");
  console.log(`files scanned: ${files.length}, files changed: ${totals.filesChanged}`);
  console.log(`total text/link duplicates removed: ${totals.textDropped}`);
  console.log(`total consecutive same-src image duplicates removed: ${totals.imageDropped}`);
  console.log(`total empty/duplicate nav entries removed: ${totals.navDropped}`);
}

await main();
