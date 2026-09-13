// scripts/scrape-mobile-diff.mjs
// Captures visible text of every LIVE route at a phone viewport and a desktop viewport
// and records lines that appear on only one of them. Live site only; no local server needed.
import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
import { ROUTES, LIVE } from "./routes.mjs";
import { expandAccordions } from "./lib/accordion.mjs";

const norm = (s) => s.replace(/ /g, " ").replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();

async function captureText(browser, url, viewport) {
  const ctx = await browser.newContext({ viewport, locale: "is", isMobile: viewport.width < 768, hasTouch: viewport.width < 768 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(3000); // let animated counters settle
  await expandAccordions(page);
  await page.waitForTimeout(400);
  const text = await page.evaluate(() => document.body.innerText);
  await ctx.close();
  return new Set(norm(text).split("\n").filter(Boolean));
}

const browser = await chromium.launch();
const out = { generatedAt: new Date().toISOString(), routes: [] };
for (const route of ROUTES) {
  try {
    const mobile = await captureText(browser, LIVE + route, { width: 390, height: 844 });
    const desktop = await captureText(browser, LIVE + route, { width: 1440, height: 900 });
    const mobileOnly = [...mobile].filter((l) => !desktop.has(l));
    const desktopOnly = [...desktop].filter((l) => !mobile.has(l));
    out.routes.push({ route, mobileOnly, desktopOnly });
    if (mobileOnly.length || desktopOnly.length) console.log(`${route}: mobileOnly=${mobileOnly.length} desktopOnly=${desktopOnly.length}`);
  } catch (e) {
    console.log(`${route}: ERROR ${e.message}`);
    out.routes.push({ route, mobileOnly: [], desktopOnly: [], error: e.message });
  }
}
await browser.close();
await writeFile("docs/scrape/mobile-only.json", JSON.stringify(out, null, 2) + "\n");
const hits = out.routes.filter((r) => r.mobileOnly.length);
console.log(`done: ${hits.length} routes with mobile-only text; ${out.routes.filter((r) => r.desktopOnly.length).length} with desktop-only text`);
