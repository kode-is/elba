import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES, LIVE } from "./routes.mjs";
import { expandAccordions } from "./lib/accordion.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOCAL = process.env.LOCAL || "http://localhost:3000";
const only = process.argv.slice(2);
const routes = only.length ? only : ROUTES;

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const exact = (s) => new RegExp(`^${escapeRe(s)}$`);
// Icelandic "ö"/"ú" -> "o"/"u": the mangled duplicate header row on
// /hifi-festibunadur/hifikedjur (see below) drops exactly these diacritics.
const stripDiacritics = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const hifiTables = JSON.parse(readFileSync(join(ROOT, "docs/scrape/tables.json"), "utf8")).routes;
const hifiTable = (route, index) => hifiTables.find((r) => r.route === route)?.tables?.[index];

// docs/scrape/tables.json's /hifi-festibunadur/hifikedjur entry lists a
// second "table" (index 1) with headers Name/Email/Role/Status — Framer's
// Table component's built-in demo dataset (Mason Carter, Olivia Lee, ...),
// left on the live page unconfigured. It's a template placeholder, not real
// content (see lib/hifi.ts / scripts/gen-hifi.mjs, which excludes it from
// the generated page data for the same reason), so it's intentionally not
// rendered locally. Every header and cell string of that table is read
// from tables.json at runtime (nothing hardcoded here) and turned into an
// exact, anchored regex so verify doesn't flag them as missing.
const hifikedjurPlaceholderPatterns = (() => {
  const placeholder = hifiTable("/hifi-festibunadur/hifikedjur", 1);
  if (!placeholder || JSON.stringify(placeholder.headers) !== JSON.stringify(["Name", "Email", "Role", "Status"])) {
    throw new Error("hifikedjur placeholder table (Name/Email/Role/Status) not found in tables.json as expected");
  }
  return [...placeholder.headers, ...placeholder.rows.flat()].map(exact);
})();

// hifikedjur's live page *also* renders its real 28-row "Tveggja arma
// hífikeðjur" table a second time as a Framer "Table" widget (search box,
// column filters, "Export CSV", Previous/Next pagination) with the same
// data but two header labels stripped of their Icelandic diacritics
// ("Vörunúmer" -> "Vorunumer", "Vöruheiti" -> "Voruheiti"). This widget IS
// visible at 1440px — confirmed against both docs/reference/
// hifi-festibunadur__hifikedjur.desktop.jpg (below the real table) and its
// .mobile.jpg — but is deliberately not reproduced here, being a Framer
// template widget wrapped around already-rendered data, not unique content
// (scripts/gen-hifi.mjs drops this duplicate's row data entirely — see that
// script's module comment). The row *data* never shows up as missing here
// since it's identical to the real table's, already rendered once; only the
// widget's own header labels and fixed chrome do. Every string below is
// either derived from the real table's headers (nothing hardcoded) or is
// generic UI chrome inherent to this Framer widget, not scraped content.
const hifikedjurWidgetPatterns = (() => {
  const real = hifiTable("/hifi-festibunadur/hifikedjur", 0);
  const headerVariants = real.headers.flatMap((h) => [h, stripDiacritics(h)]);
  return [
    ...new Set(headerVariants),
    ...new Set(headerVariants.map((h) => `All ${h}`)),
    "Export CSV",
    "Previous",
    "Next",
  ].map(exact).concat(/^Page \d+ of \d+$/i);
})();

// Framer's scroll-triggered stat counters on these two routes hydrate to
// nondeterministic live values (e.g. 482/132) that drift from the canonical
// server-rendered numbers baked into our static recreation (480/130), so a
// bare short-number line should not be treated as "missing" there.
//
// Several /hifi-festibunadur/* routes pair a bare "X í boði" heading with an
// interactive min/max range slider widget (e.g. "Lengdir í boði" showing
// "2 metrar" — "6 metrar"). Their endpoint labels are now rendered directly
// (components/hifi/HifiSections.tsx's PillRow, sourced from lib/hifi.ts's
// per-heading `range` — see scripts/gen-hifi.mjs's RANGE_LABELS for how
// those verbatim strings were read off the live page), so none of them need
// an IGNORE_MISSING entry any more (Task 12 fix round 1).
// product-redesign task: every sturtuvagnar product/group page now renders
// PageHero's hero-edge breadcrumb (Breadcrumb variant="hero"), which uses
// "›" as its separator instead of the plain breadcrumb's "&gt;" (>) — see
// components/Breadcrumb.tsx. The live site (and our own other 13 routes
// using the plain variant) still uses ">", so it now shows up as "missing"
// on these 30 routes even though the breadcrumb itself is fully present,
// just with a different, intentionally redesigned glyph.
const sturtuvagnarHeroBreadcrumbIgnored = Object.fromEntries(
  ROUTES.filter((r) => r.startsWith("/sturtuvagnar/")).map((r) => [r, [exact(">")]]),
);

const IGNORE_MISSING = {
  "/": [/^\d{1,3}$/],
  "/um-okkur": [/^\d{1,3}$/],
  "/hifi-festibunadur/hifikedjur": [...hifikedjurPlaceholderPatterns, ...hifikedjurWidgetPatterns],
  "/hifi-festibunadur/bindikedjur-strekkjarar": [
    // The live breadcrumb's current-page crumb reads "Hífikeðjur" — a
    // copy-paste leftover from the hífikeðjur page this one was cloned
    // from (docs/scrape/hifi-festibunadur__bindikedjur-strekkjarar.json
    // block 8 scrapes this exact text). The [...slug] page derives the
    // breadcrumb from the real page title instead of reproducing the bug.
    exact("Hífikeðjur"),
  ],
  ...sturtuvagnarHeroBreadcrumbIgnored,
};

// A browser's innerText joins adjacent cells of a real <table> row with a
// tab character (spec behavior for display:table-cell boxes) — components/
// SpecTable.tsx (Task 12) is this site's first actual <table>, and the live
// site's own spec tables are Framer div-grids with one line of text per
// cell, not per row. Treating a tab the same as a newline here (before the
// old space-collapsing logic, which would otherwise flatten "A\tB\tC" into
// "A B C" and turn a whole table row into one incomparable blob) keeps both
// sides comparable cell-by-cell without touching any non-table route, since
// nothing else on the site renders a real table.
const norm = (s) =>
  s.replace(/ /g, " ").replace(/\t/g, "\n").replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();

async function capture(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } });
  // Framer's stat counters animate on scroll-into-view; give them time to settle.
  await page.waitForTimeout(3000);
  // expand accordions the same way as scrape.mjs
  await expandAccordions(page);
  await page.waitForTimeout(400);
  return page.evaluate(() => ({
    text: document.body.innerText,
    // Count unique visible image sources, not raw <img> tags: Framer renders
    // some photos twice (e.g. a hover-crossfade layer stacked on the base
    // image, or marquee tracks that duplicate their items for a seamless
    // loop) — those duplicates are never additional content, so counting
    // raw tags makes the live page's count drift from an equivalent,
    // non-duplicating local recreation. A plain `src.split("?")[0]` is not
    // enough to key on, though: Next.js's built-in image optimizer proxies
    // every local raster image through the same "/_next/image" path and
    // encodes the real file in a `url` query param, so a naive query-strip
    // collapsed every local image to that one path (verified: it dropped
    // e.g. "/" from img=22/22 raw tags to img=22/6 unique-by-path-only,
    // while the live/Framer CDN already puts the real filename in the path
    // and only varies size via query params). Unwrap that proxy first.
    images: new Set(
      [...document.images]
        .filter(i => i.getBoundingClientRect().width > 0)
        .map(i => {
          const src = i.currentSrc || i.src;
          try {
            const u = new URL(src, location.href);
            if (u.pathname === "/_next/image" && u.searchParams.has("url")) {
              return decodeURIComponent(u.searchParams.get("url"));
            }
            return u.origin + u.pathname;
          } catch {
            return src.split("?")[0];
          }
        })
    ).size,
  }));
}

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const rows = []; let failures = 0;
for (const r of routes) {
  const live = await capture(page, LIVE + r);
  const local = await capture(page, LOCAL + r);
  const a = new Set(norm(live.text).split("\n")), b = new Set(norm(local.text).split("\n"));
  const missingAll = [...a].filter(x => !b.has(x)); const extra = [...b].filter(x => !a.has(x));
  const ignorePatterns = IGNORE_MISSING[r] || [];
  const missing = missingAll.filter(x => !ignorePatterns.some(re => re.test(x)));
  const ignored = missingAll.length - missing.length;
  const imgOk = local.images >= live.images;
  const ok = missing.length === 0 && imgOk;
  if (!ok) failures++;
  rows.push(`## ${r} ${ok ? "OK" : "FAIL"}\n- images live/local: ${live.images}/${local.images}${imgOk ? "" : " (missing)"}\n${missing.length ? "- missing text:\n" + missing.map(m => `  - ${m}`).join("\n") : ""}${extra.length ? "\n- extra text:\n" + extra.map(m => `  - ${m}`).join("\n") : ""}\n`);
  console.log(`${ok ? "OK  " : "FAIL"} ${r} missing=${missing.length} extra=${extra.length} img=${live.images}/${local.images} ignored=${ignored}`);
}
await browser.close();
await writeFile("docs/verify-report.md", `# Verify report ${new Date().toISOString()}\n\n${rows.join("\n")}`);
process.exit(failures ? 1 : 0);
