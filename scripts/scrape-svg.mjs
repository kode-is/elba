// scripts/scrape-svg.mjs
// Extracts inline <svg> elements from the server-rendered HTML of every route.
// No browser needed: Framer renders these icons server-side.
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { ROUTES, LIVE } from "./routes.mjs";

const OUT_DIR = "docs/scrape/svg";
const SVG_RE = /<svg\b[^>]*>[\s\S]*?<\/svg>/gi;
const attr = (svg, name) => { const m = svg.match(new RegExp(`\\s${name}="([^"]*)"`, "i")); return m ? m[1] : null; };
const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

async function fetchHtml(route) {
  const res = await fetch(LIVE + route, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${route} -> ${res.status}`);
  return res.text();
}

await mkdir(OUT_DIR, { recursive: true });
const unique = new Map(); // hash -> { file, usedOn: Set }
const routes = [];
for (const route of ROUTES) {
  let html;
  try {
    html = await fetchHtml(route);
  } catch (err) {
    console.log(`${route}: fetch failed (${err.message})`);
    routes.push({ route, svgs: [] });
    continue;
  }
  const svgs = [];
  let m;
  while ((m = SVG_RE.exec(html))) {
    const svg = m[0];
    const hash = createHash("sha1").update(svg).digest("hex").slice(0, 8);
    const file = `${OUT_DIR}/${hash}.svg`;
    if (!unique.has(hash)) { await writeFile(file, svg + "\n"); unique.set(hash, { file, usedOn: new Set() }); }
    unique.get(hash).usedOn.add(route);
    // 200 chars of visible text after the svg, as a hint for which section it belongs to
    const after = strip(html.slice(m.index + svg.length, m.index + svg.length + 1200)).slice(0, 200);
    svgs.push({ file, hash, viewBox: attr(svg, "viewBox"), width: attr(svg, "width"), height: attr(svg, "height"), ariaLabel: attr(svg, "aria-label"), nearbyText: after });
  }
  routes.push({ route, svgs });
  console.log(`${route}: ${svgs.length} inline svg`);
}
const index = { generatedAt: new Date().toISOString(), routes, unique: [...unique.entries()].map(([hash, v]) => ({ hash, file: v.file, usedOn: [...v.usedOn] })) };
await writeFile("docs/scrape/inline-svg.json", JSON.stringify(index, null, 2) + "\n");
console.log(`done: ${index.unique.length} unique svg across ${routes.filter(r => r.svgs.length).length} routes`);
