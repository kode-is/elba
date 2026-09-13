import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { ROUTES, LIVE, routeToFile } from "./routes.mjs";
import { normalizeBlocks, normalizeNav } from "./lib/normalize.mjs";
import { expandAccordions } from "./lib/accordion.mjs";

const OUT_JSON = "docs/scrape";
const OUT_REF = "docs/reference";
const manifest = [];
const seenImages = new Map(); // originalUrl -> { local, error }

const stripParams = (u) => u.split("?")[0];
const extOf = (u) => (path.extname(new URL(u).pathname) || ".jpg").toLowerCase();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAndSave(url, routeDir, idx) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`download ${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 8);
  const local = `/images/${routeDir}/${String(idx).padStart(2, "0")}-${hash}${extOf(url)}`;
  await mkdir(path.join("public", path.dirname(local)), { recursive: true });
  await writeFile(path.join("public", local), buf);
  return local;
}

// Downloads an image, retrying once after 2s on failure. Never throws: a
// permanent failure is recorded as { local: null, error } so one bad asset
// never aborts the run.
async function download(url, routeDir, idx) {
  const clean = stripParams(url);
  if (seenImages.has(clean)) return seenImages.get(clean);

  let result;
  try {
    result = { local: await fetchAndSave(clean, routeDir, idx) };
  } catch (firstErr) {
    await sleep(2000);
    try {
      result = { local: await fetchAndSave(clean, routeDir, idx) };
    } catch (secondErr) {
      result = { local: null, error: String(secondErr.message || secondErr) };
      console.error(`  ! image failed after retry: ${clean} — ${result.error}`);
    }
  }
  seenImages.set(clean, result);
  return result;
}

async function extractPage(page) {
  return page.evaluate(() => {
    const isVisible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
    // Text content that keeps explicit <br> line breaks (textContent drops
    // them entirely, e.g. Framer's two-line hero H1 becomes one glued word).
    // This only honors real <br> elements, never CSS-driven wrapping.
    const textOf = (el) => {
      let out = "";
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) out += node.textContent;
        else if (node.nodeType === Node.ELEMENT_NODE) out += node.tagName === "BR" ? "\n" : textOf(node);
      }
      return out.trim();
    };

    // Framer's export has no <header>/<footer> tags and nothing named
    // "Nav"/"Header"/"Footer" — try the semantic selectors first, then fall
    // back to page structure: every route's [data-framer-root] renders the
    // shared nav as its first child, and (when the page has one) the shared
    // footer as its last child, identifiable by the company kennitala it
    // always carries.
    const root = document.querySelector("[data-framer-root]");
    let header = document.querySelector("header, [data-framer-name*='Nav' i], [data-framer-name*='Header' i]");
    if (!header && root) header = root.firstElementChild;
    let footer = document.querySelector("footer, [data-framer-name*='Footer' i]");
    if (!footer && root) {
      const last = root.lastElementChild;
      if (last && last !== header && /Kt\.\s*\d{6}-\d{4}/.test(last.textContent)) footer = last;
    }

    const inChrome = (el) => (header && header.contains(el)) || (footer && footer.contains(el));
    const blocks = []; const footerBlocks = []; const nav = [];
    const push = (b, el) => (footer && footer.contains(el) ? footerBlocks : blocks).push(b);
    const toHex = (rgb) => { const m = rgb.match(/\d+(\.\d+)?/g); if (!m || m.length < 3) return null; if (m[3] !== undefined && Number(m[3]) === 0) return null; return "#" + m.slice(0, 3).map(n => Number(n).toString(16).padStart(2, "0")).join(""); };
    const colors = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let el;
    while ((el = walker.nextNode())) {
      if (!isVisible(el)) continue;
      const bg = toHex(getComputedStyle(el).backgroundColor); if (bg && bg !== "#ffffff") colors.add(bg);
      const tag = el.tagName.toLowerCase();
      if (header && header.contains(el) && tag === "a") { nav.push({ text: textOf(el), href: el.getAttribute("href") }); continue; }
      if (/^h[1-6]$/.test(tag)) { push({ type: "heading", level: Number(tag[1]), text: textOf(el) }, el); continue; }
      if (tag === "p" || (tag === "span" && el.parentElement && !/^(p|h[1-6]|a|button)$/i.test(el.parentElement.tagName) && el.children.length === 0)) {
        const t = textOf(el); if (t && !inChrome(el) || (footer && footer.contains(el) && t)) push({ type: "text", text: t }, el); continue;
      }
      if (tag === "a" && !inChrome(el)) { const t = textOf(el); if (t) push({ type: "link", text: t, href: el.getAttribute("href") }, el); continue; }
      if (tag === "img") { const src = el.currentSrc || el.src; if (src && src.includes("framerusercontent")) push({ type: "image", src: src.split("?")[0], alt: el.alt || "", width: el.naturalWidth, height: el.naturalHeight, role: header && header.contains(el) || footer && footer.contains(el) ? "logo" : "content" }, el); continue; }
      const bgi = getComputedStyle(el).backgroundImage; const m = bgi && bgi.match(/url\("?(https:\/\/framerusercontent[^")]+)/);
      if (m) push({ type: "image", src: m[1].split("?")[0], alt: "", width: 0, height: 0, role: "background" }, el);
    }
    const dedupNav = []; for (const n of nav) if (!dedupNav.some(d => d.text === n.text && d.href === n.href)) dedupNav.push(n);
    return { title: document.title, description: document.querySelector("meta[name=description]")?.content || "", blocks, footer: footerBlocks, nav: dedupNav, colors: [...colors] };
  });
}

async function scrapeRoute(browser, route) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: "is" });
  const page = await ctx.newPage();
  try {
    await page.goto(LIVE + route, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(800);
    // trigger lazy content
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await expandAccordions(page);

    const data = await extractPage(page);
    // Drop duplicate text/link and consecutive same-src image blocks (the
    // walker independently records an anchor's own `link` block and its
    // inner text node's `text` block, and sometimes the same image both as
    // a foreground <img> and a CSS background), and empty-text nav entries
    // (e.g. the logo link), before downloading images or writing JSON — see
    // scripts/lib/normalize.mjs.
    data.blocks = normalizeBlocks(data.blocks);
    data.footer = normalizeBlocks(data.footer);
    data.nav = normalizeNav(data.nav);

    // download images (blocks + footer), rewrite local paths
    const routeDir = routeToFile(route);
    let idx = 0;
    for (const b of [...data.blocks, ...data.footer]) {
      if (b.type !== "image") continue;
      const { local, error } = await download(b.src, routeDir, idx++);
      b.local = local;
      manifest.push({ route, originalUrl: b.src, localPath: local, width: b.width, height: b.height, alt: b.alt, role: b.role, ...(error ? { error } : {}) });
    }

    await mkdir(OUT_REF, { recursive: true });
    const desktop = `${OUT_REF}/${routeDir}.desktop.jpg`;
    await page.screenshot({ path: desktop, fullPage: true, type: "jpeg", quality: 70 });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    const mobile = `${OUT_REF}/${routeDir}.mobile.jpg`;
    await page.screenshot({ path: mobile, fullPage: true, type: "jpeg", quality: 70 });

    await mkdir(OUT_JSON, { recursive: true });
    await writeFile(`${OUT_JSON}/${routeDir}.json`, JSON.stringify({ route, ...data, screenshots: { desktop, mobile } }, null, 2));
    console.log(`${route}: ${data.blocks.length} blocks, ${idx} images`);
  } finally {
    await ctx.close();
  }
}

const browser = await chromium.launch();
for (const r of ROUTES) {
  try {
    await scrapeRoute(browser, r);
  } catch (err) {
    console.error(`${r}: FAILED once (${err.message || err}), retrying...`);
    try {
      await scrapeRoute(browser, r);
    } catch (err2) {
      console.error(`${r}: FAILED after retry, skipping — ${err2.message || err2}`);
    }
  }
}
await browser.close();
await writeFile("docs/asset-manifest.json", JSON.stringify(manifest, null, 2));
console.log(`done: ${manifest.length} image refs, ${seenImages.size} unique files`);
