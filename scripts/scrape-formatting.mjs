// scripts/scrape-formatting.mjs
// Adds list/bold semantics to the scraped text blocks, from the live server-rendered HTML.
import { readFile, writeFile } from "node:fs/promises";
import { ROUTES, LIVE, routeToFile } from "./routes.mjs";

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ");
const strip = (html) => decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/[ \t]+/g, " ").trim();
const norm = (s) => s.replace(/ /g, " ").replace(/\s+/g, " ").trim();

async function fetchHtml(route) {
  const res = await fetch(LIVE + route, { headers: { "User-Agent": "Mozilla/5.0" } });
  return res.text(); // /404 returns status 404 but still has the page HTML
}

const out = { generatedAt: new Date().toISOString(), routes: [] };
for (const route of ROUTES) {
  const html = await fetchHtml(route);
  // lists: each <ul>/<ol> → array of <li> texts
  const lists = [...html.matchAll(/<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => [...m[2].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((li) => strip(li[1])).filter(Boolean)).filter((l) => l.length);
  // strong/b: full text of each element
  const strong = [...html.matchAll(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => strip(m[2])).filter((t) => t.length > 1);
  // annotate the route JSON
  const file = `docs/scrape/${routeToFile(route)}.json`;
  const data = JSON.parse(await readFile(file, "utf8"));
  let nList = 0, nBold = 0;
  const listIndex = new Map(); // normalized li text -> list group index
  lists.forEach((items, gi) => items.forEach((t) => listIndex.set(norm(t), gi)));
  const strongSet = new Set(strong.map(norm));
  for (const b of [...data.blocks, ...(data.footer || [])]) {
    if (b.type !== "text") continue;
    const key = norm(b.text);
    if (listIndex.has(key)) { b.list = listIndex.get(key); nList++; }
    if (strongSet.has(key)) { b.bold = true; nBold++; }
  }
  await writeFile(file, JSON.stringify(data, null, 2));
  out.routes.push({ route, lists, strong, annotated: { list: nList, bold: nBold } });
  if (lists.length || strong.length) console.log(`${route}: lists=${lists.length} (${lists.flat().length} items) strong=${strong.length} → annotated list=${nList} bold=${nBold}`);
}
await writeFile("docs/scrape/formatting.json", JSON.stringify(out, null, 2) + "\n");
console.log(`done: ${out.routes.filter((r) => r.lists.length || r.strong.length).length} routes with formatting`);
