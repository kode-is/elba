// scripts/fetch-subnav-images.mjs
// Downloads the drawings and photos that only appear on the sub-category tabs
// captured by scripts/scrape-subnav.mjs.
//
// Images already in the repo are reused: every docs/scrape/*.json image block
// carries both its framerusercontent `src` and the `local` path it was saved
// to, so only URLs missing from that map are fetched. New files follow the
// existing convention — public/images/produkter__<slug>/NN-<hash>.<ext>,
// numbering continuing after the files already there.
//
// Output: docs/scrape/subnav-images.json, a url → { local, width, height } map
// for scripts/gen-produkter.mjs.
import { createHash } from "node:crypto";
import { access, readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRAPE = join(ROOT, "docs/scrape");

/** Intrinsic size from the file itself — the CDN can serve a resized variant. */
function dimensions(buf) {
  if (buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }; // PNG IHDR
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    for (let i = 2; i < buf.length - 9; ) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) }; // SOFn
      }
      i += 2 + len;
    }
  }
  return null;
}

const known = new Map();
for (const file of (await readdir(SCRAPE)).filter((f) => f.endsWith(".json"))) {
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === "object") {
      if (typeof node.src === "string" && typeof node.local === "string") {
        known.set(node.src.split("?")[0], { local: node.local, width: node.width, height: node.height });
      }
      Object.values(node).forEach(walk);
    }
  };
  walk(JSON.parse(await readFile(join(SCRAPE, file), "utf8")));
}
// Anything this script downloaded on an earlier run, so re-running it is a
// no-op rather than a second copy under a new number.
const previous = await readFile(join(SCRAPE, "subnav-images.json"), "utf8").then(JSON.parse).catch(() => ({}));
for (const [url, entry] of Object.entries(previous)) known.set(url, entry);
console.log(`${known.size} images already in the repo`);

const subnav = JSON.parse(await readFile(join(SCRAPE, "subnav.json"), "utf8"));
const map = {};
let fetched = 0;
for (const route of subnav.routes) {
  const slug = decodeURIComponent(route.route.slice("/produkter/".length));
  const folder = `produkter__${slug}`;
  const dir = join(ROOT, "public/images", folder);
  await mkdir(dir, { recursive: true });
  let next = (await readdir(dir).catch(() => [])).reduce((max, f) => Math.max(max, Number.parseInt(f, 10) || 0), 0);

  for (const tab of route.tabs) {
    for (const group of tab.groups) {
      for (const image of group.images) {
        if (map[image.url]) continue;
        const hit = known.get(image.url);
        // Trust a known entry only while its file is actually on disk.
        if (hit && (await access(join(ROOT, "public", hit.local)).then(() => true).catch(() => false))) {
          map[image.url] = hit;
          continue;
        }
        const response = await fetch(image.url);
        if (!response.ok) {
          console.error(`  ! ${image.url} → ${response.status}`);
          continue;
        }
        const buf = Buffer.from(await response.arrayBuffer());
        const ext = image.url.split(".").pop().toLowerCase();
        const hash = createHash("sha256").update(buf).digest("hex").slice(0, 8);
        const existing = (await readdir(dir).catch(() => [])).find((f) => f.endsWith(`-${hash}.${ext}`));
        const name = existing ?? `${String((next += 1)).padStart(2, "0")}-${hash}.${ext}`;
        if (!existing) await writeFile(join(dir, name), buf);
        const size = dimensions(buf) ?? { width: image.width, height: image.height };
        map[image.url] = { local: `/images/${folder}/${name}`, ...size };
        if (!existing) fetched += 1;
        console.log(`  ${existing ? "=" : "+"} ${folder}/${name}  ${size.width}x${size.height}`);
      }
    }
  }
}
await writeFile(join(SCRAPE, "subnav-images.json"), JSON.stringify(map, null, 2) + "\n");
console.log(`\ndownloaded ${fetched} new images; wrote docs/scrape/subnav-images.json (${Object.keys(map).length} entries)`);
