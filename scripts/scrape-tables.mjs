// scripts/scrape-tables.mjs
// Reads every <table> AFTER Framer hydrates the page. The server HTML of
// elba.no's product pages only contains the Table widget's demo rows
// (Name / Email / Role / Status); the real spec rows are rendered
// client-side, paginated ("Page 1 of N") and duplicated once for the
// desktop and once for the mobile layout. This script clicks through the
// pager, then drops exact-duplicate tables.
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { ROUTES, LIVE, livePath } from "./routes.mjs";

const PLACEHOLDER = JSON.stringify(["Name", "Email", "Role", "Status"]);

async function readTables(page) {
  return page.evaluate(() => {
    const clean = (s) => s.replace(/\s+/g, " ").trim();
    const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const out = [];
    for (const table of document.querySelectorAll("table")) {
      if (!visible(table)) continue;
      const headers = [...table.querySelectorAll("thead th, thead td")].map((c) => clean(c.textContent));
      const rows = [...table.querySelectorAll("tbody tr")].map((tr) => [...tr.querySelectorAll("td, th")].map((c) => clean(c.textContent)));
      let heading = null;
      let node = table;
      while (node && !heading) {
        let sib = node.previousElementSibling;
        while (sib && !heading) { const h = sib.matches("h1,h2,h3,h4,h5,h6") ? sib : sib.querySelector("h1,h2,h3,h4,h5,h6"); if (h) heading = clean(h.textContent); sib = sib.previousElementSibling; }
        node = node.parentElement;
      }
      out.push({ headers, rows, precedingHeading: heading });
    }
    return out;
  });
}

async function scrapeRoute(browser, route) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(LIVE + livePath(route), { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } });
  await page.waitForTimeout(1500);
  // Collect page 1 of every widget, then click every enabled "Next" until none is enabled.
  const pages = [await readTables(page)];
  for (let i = 0; i < 20; i++) {
    const next = page.locator("button:has-text('Next'):not([disabled]), [role=button]:has-text('Next'):not([aria-disabled='true'])");
    if ((await next.count()) === 0) break;
    await next.first().click();
    await page.waitForTimeout(600);
    pages.push(await readTables(page));
  }
  // Merge by DOM position: table i of every snapshot is the same widget
  // (clicking "Next" never adds or removes tables), so later snapshots only
  // contribute rows not seen yet. Never merge by heading — rørender repeats
  // the same variant heading over several distinct tables.
  const base = pages[0].map((t) => ({ ...t, rows: [...t.rows] }));
  for (const snapshot of pages.slice(1)) {
    if (snapshot.length !== base.length) { console.warn(`  ! table count changed between pager clicks (${base.length} → ${snapshot.length}); keeping page 1 only`); break; }
    snapshot.forEach((t, i) => { for (const row of t.rows) if (!base[i].rows.some((r) => JSON.stringify(r) === JSON.stringify(row))) base[i].rows.push(row); });
  }
  // Drop the widget's demo table and the exact desktop/mobile duplicates.
  const seen = new Set();
  const out = [];
  for (const t of base) {
    if (JSON.stringify(t.headers) === PLACEHOLDER) continue;
    const key = JSON.stringify([t.precedingHeading, t.headers, t.rows]);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  await page.context().close();
  return out.map((t, index) => ({ index, ...t }));
}

const browser = await chromium.launch();
const out = { generatedAt: new Date().toISOString(), routes: [] };
for (const route of ROUTES) {
  try {
    const tables = await scrapeRoute(browser, route);
    out.routes.push({ route, tables });
    if (tables.length) console.log(`${route}: ${tables.length} table(s) — ${tables.map((t) => `${t.headers.length} cols × ${t.rows.length} rows`).join(", ")}`);
  } catch (e) {
    console.error(`${route}: FAILED ${e.message}`);
    out.routes.push({ route, tables: [] });
  }
}
await browser.close();
await mkdir("docs/scrape", { recursive: true });
await writeFile("docs/scrape/tables.json", JSON.stringify(out, null, 2) + "\n");
console.log(`done: ${out.routes.filter((r) => r.tables.length).length} routes with tables`);
