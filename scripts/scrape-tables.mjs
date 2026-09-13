// scripts/scrape-tables.mjs
// Extracts <table> structures from the live server-rendered HTML of every route.
import { writeFile } from "node:fs/promises";
import { ROUTES, LIVE } from "./routes.mjs";

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ");
const cellText = (html) => decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
const cells = (rowHtml, tag) => [...rowHtml.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"))].map((m) => cellText(m[1]));

async function fetchHtml(route) {
  const res = await fetch(LIVE + route, { headers: { "User-Agent": "Mozilla/5.0" } });
  return res.text(); // /404 returns status 404 but still has page HTML
}

const out = { generatedAt: new Date().toISOString(), routes: [] };
for (const route of ROUTES) {
  let html;
  try { html = await fetchHtml(route); } catch (e) { console.log(`${route}: fetch failed ${e.message}`); out.routes.push({ route, tables: [] }); continue; }
  const tables = [];
  const re = /<table\b[^>]*>([\s\S]*?)<\/table>/gi;
  let m, index = 0;
  while ((m = re.exec(html))) {
    const before = html.slice(0, m.index);
    const headings = [...before.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];
    const precedingHeading = headings.length ? cellText(headings[headings.length - 1][2]) : null;
    const rowsHtml = [...m[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((r) => r[1]);
    let headers = [];
    const rows = [];
    for (const r of rowsHtml) {
      const th = cells(r, "th");
      const td = cells(r, "td");
      if (th.length && !td.length && !headers.length) headers = th;
      else if (td.length) rows.push(th.length ? [...th, ...td] : td);
    }
    tables.push({ index: index++, headers, rows, precedingHeading });
  }
  out.routes.push({ route, tables });
  if (tables.length) console.log(`${route}: ${tables.length} table(s) — ${tables.map((t) => `${t.headers.length} cols × ${t.rows.length} rows`).join(", ")}`);
}
await writeFile("docs/scrape/tables.json", JSON.stringify(out, null, 2) + "\n");
console.log(`done: ${out.routes.filter((r) => r.tables.length).length} routes with tables`);
