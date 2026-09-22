// scripts/scrape-subnav.mjs
// Captures every sub-category tab of the product pages.
//
// The pill row above a product's tables ("Rørender rette / 90 grader / 45
// grader") is a Framer tab control: an <a> with no href that swaps the tables,
// drawings and photos below it. The original scrape only ever recorded the
// first tab, so lib/produkter.ts is missing every other sub-type — 63 tables
// across the nine pill pages against the 24 we shipped.
//
// Source is the Framer project, not www.elba.no: since the DNS switch that
// domain serves this rebuild, so the Framer URL is the only copy of the
// original site left.
//
// Output: docs/scrape/subnav.json — per route, the pills in order, each with
// its groups (images + optional heading + table). Images are recorded by their
// framerusercontent URL; scripts/fetch-subnav-images.mjs downloads them.
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES, livePath } from "./routes.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FRAMER = process.env.FRAMER || "https://global-curiosity-381133.framer.app";
const PRODUCT_ROUTES = ROUTES.filter((r) => r.startsWith("/produkter/"));

/** Pill labels, in order, de-duplicated across Framer's desktop/mobile copies. */
const readPills = (page) =>
  page.evaluate(() => {
    const seen = new Set();
    const out = [];
    for (const a of document.querySelectorAll('[data-framer-name="Subnav"] a')) {
      const label = a.textContent.replace(/​/g, "").trim();
      if (!label || seen.has(label)) continue;
      seen.add(label);
      out.push(label);
    }
    return out;
  });

/**
 * The visible content of the current tab, in document order: each table with
 * the heading above it and the drawings/photos gathered since the previous
 * table — the same grouping the site renders.
 */
const readGroups = (page) =>
  page.evaluate(() => {
    const clean = (s) => s.replace(/\s+/g, " ").trim();
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const main = document.querySelector("main") ?? document.body;
    const nodes = [...main.querySelectorAll("img, table, h1, h2, h3, h4, h5, h6")].filter(visible);

    const groups = [];
    let images = [];
    let heading = null;
    // Everything up to and including the page title — the site logo, the hero
    // photo, the breadcrumb — sits above the product content and belongs to no
    // table.
    let started = false;
    for (const node of nodes) {
      if (!started) {
        if (node.tagName === "H1") started = true;
        continue;
      }
      if (node.tagName === "IMG") {
        const src = node.currentSrc || node.src;
        // Skip the hero and logo: only the framerusercontent images inside the
        // table area are product drawings/photos.
        if (!/framerusercontent/.test(src)) continue;
        images.push({ url: src.split("?")[0], alt: node.getAttribute("alt") ?? "", width: node.naturalWidth, height: node.naturalHeight });
      } else if (node.tagName === "TABLE") {
        const headers = [...node.querySelectorAll("thead th, thead td")].map((c) => clean(c.textContent));
        const rows = [...node.querySelectorAll("tbody tr")].map((tr) => [...tr.querySelectorAll("td, th")].map((c) => clean(c.textContent)));
        if (headers.join("|") === "Name|Email|Role|Status") continue; // the widget's demo table
        // Framer renders a desktop and a mobile copy of each image.
        const unique = images.filter((img, i) => images.findIndex((o) => o.url === img.url) === i);
        groups.push({ heading, headers, rows, images: unique });
        images = [];
        heading = null;
      } else if (/^H[3-6]$/.test(node.tagName)) {
        // A table's heading is the small variant title ("Forsinket stål
        // (Zn-Ni)"). The page title is an H1 and the CTA below the tables an
        // H2, so neither can be mistaken for one.
        const text = clean(node.textContent);
        if (text) heading = text;
      }
    }
    return groups;
  });

/** Page 1 holds ten rows at most; click every enabled "Next" and merge by table position. */
async function readAllPages(page) {
  const snapshots = [await readGroups(page)];
  for (let i = 0; i < 25; i++) {
    const next = page.locator("button:has-text('Next'):not([disabled]), [role=button]:has-text('Next'):not([aria-disabled='true'])");
    const clickable = [];
    for (let n = 0; n < (await next.count()); n++) if (await next.nth(n).isEnabled().catch(() => false)) clickable.push(n);
    if (clickable.length === 0) break;
    for (const n of clickable) await next.nth(n).click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(700);
    snapshots.push(await readGroups(page));
  }
  const base = snapshots[0].map((g) => ({ ...g, rows: [...g.rows] }));
  for (const snapshot of snapshots.slice(1)) {
    if (snapshot.length !== base.length) break; // never merge across a changed layout
    snapshot.forEach((g, i) => {
      for (const row of g.rows) if (!base[i].rows.some((r) => JSON.stringify(r) === JSON.stringify(row))) base[i].rows.push(row);
    });
  }
  return base;
}

async function scrapeRoute(browser, route) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(FRAMER + livePath(route), { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(3500);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  const labels = await readPills(page);
  const tabs = [];
  if (labels.length === 0) {
    tabs.push({ label: null, groups: await readAllPages(page) });
  } else {
    for (const label of labels) {
      const pill = page.locator('[data-framer-name="Subnav"] a').filter({ hasText: label }).last();
      await pill.click({ timeout: 10000 });
      await page.waitForTimeout(1600);
      tabs.push({ label, groups: await readAllPages(page) });
    }
  }
  await page.close();
  const tables = tabs.reduce((n, t) => n + t.groups.length, 0);
  const rows = tabs.reduce((n, t) => n + t.groups.reduce((m, g) => m + g.rows.length, 0), 0);
  console.log(`${route.padEnd(34)} ${tabs.length} tab(s), ${tables} tables, ${rows} rows`);
  return { route, tabs };
}

const browser = await chromium.launch();
const only = process.argv.slice(2);
const routes = only.length ? only : PRODUCT_ROUTES;
const out = [];
for (const route of routes) {
  try {
    out.push(await scrapeRoute(browser, route));
  } catch (e) {
    console.error(`${route}: FAILED — ${e.message.split("\n")[0]}`);
    process.exitCode = 1;
  }
}
await browser.close();
await mkdir(join(ROOT, "docs/scrape"), { recursive: true });
await writeFile(join(ROOT, "docs/scrape/subnav.json"), JSON.stringify({ source: FRAMER, scrapedAt: new Date().toISOString(), routes: out }, null, 2) + "\n");
console.log(`\nwrote docs/scrape/subnav.json — ${out.length} routes`);
