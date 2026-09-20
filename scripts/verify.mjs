import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES, LIVE, livePath } from "./routes.mjs";
import { expandAccordions } from "./lib/accordion.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const LOCAL = process.env.LOCAL || "http://localhost:3000";
const only = process.argv.slice(2);
const routes = only.length ? only : ROUTES;

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const exact = (s) => new RegExp(`^${escapeRe(s)}$`);

// Framer's Table widget chrome (search box, pager, CSV export, column
// filters) is not reproduced locally — SpecTable renders every row of the
// table instead — so its strings are never "missing" content.
const WIDGET_CHROME = [exact("Search..."), exact("Previous"), exact("Next"), exact("Export CSV"), /^Page \d+ of \d+$/i, /^All .+$/];
// Stat counters on the home page and /anlegg hydrate to animated values.
const IGNORE_MISSING = Object.fromEntries(ROUTES.map((r) => [r, r.startsWith("/produkter/") ? WIDGET_CHROME : []]));
// Task 6 (home): the live page's own count-up animation for the four
// "_Metric item" stats (live's 184 / 14 / 10984 / 5984; lib/stats.ts now
// ships ELBA's confirmed 200 / 30 / 11000 / 6000 instead) doesn't
// always finish easing to its target within this script's capture window;
// confirmed by diffing the live SSR HTML (which bakes in a lower rounded
// baseline, e.g. 10980) against a settled capture, which lands 2 short of
// the true target (10982, 5982) both times, reproducibly — a live
// animation-timing artifact, not missing content. \d{1,3} only covered the
// two smaller stats; widened to \d{1,5} to cover all four.
IGNORE_MISSING["/"] = [/^\d{1,5}$/];
// Task 8 (/om-oss): the same four stat counters, mid-animation (see StatsSection).
IGNORE_MISSING["/om-oss"] = [/^\d{1,5}$/];
// The live submit button reads "Senda!" (a leftover Icelandic string on
// elba.no's own contact form); this rebuild's button reads "Send" instead —
// approved deviation, not a missing-content bug.
IGNORE_MISSING["/kontakt-oss"] = [exact("Senda!")];
// Produkter is no longer a "Våre tjenester" card (products are not a service —
// docs/superpowers/specs/2026-09-18-produkter-catalog-search-design.md), so
// the card's line of copy is gone from /tjenester. The home page keeps the
// same line in its own Produkter section, so nothing is missing there.
IGNORE_MISSING["/tjenester"] = [exact("Alt du trenger til installasjon, vedlikehold og drift")];
// …and that card's photo went with it, on both routes that showed the cards.
const EXPECTED_FEWER_IMAGES = { "/": 1, "/tjenester": 1 };

// Every regex here is a *local-only* line of visible text (present locally,
// not on live) that a human ruling has already approved — derived from the
// `extra` lines in docs/verify-report.md as of this task. Anything not
// covered here (or by `isTableText` below) makes a route FAIL, even if
// `missing` is 0.
const ALLOWED_EXTRA = [
  // The "Gå til innhold" skip link, added on every route for keyboard/screen
  // reader accessibility; live has none (docs/handover.md "Deviations from
  // live").
  exact("Gå til innhold"),
  // sr-only <label> text for the contact form's fields (ContactForm.tsx), on
  // both `/` and `/kontakt-oss` — live's Framer form has no equivalent
  // labels (docs/handover.md "Deviations from live").
  exact("Navn"),
  exact("E-post"),
  exact("Selskap"),
  exact("Melding"),
  exact("Nettside (ikke fyll ut)"),
  // The submit button reads "Send" on both `/` and `/kontakt-oss`; live's
  // own button still carries the Icelandic template string "Senda!" —
  // approved deviation #1 in docs/handover.md.
  exact("Send"),
  // Home hero's industry marquee (IndustryStrip.tsx) renders a "•" between
  // industry names as literal text; docs/scrape/home.json's blocks for that
  // marquee (Task 6) contain no separate bullet block, so live renders its
  // separator as a non-text glyph (background image/icon) instead.
  exact("•"),
  // The four stat-counter values (lib/stats.ts). These are ELBA's own
  // confirmed round figures and intentionally differ from live's
  // (184 / 14 / 10984 / 5984), which resolves docs/handover.md "Still needs
  // you or Hlynur" #11 — so they are local-only text by design, on top of
  // the live count-up animation artifact described in the
  // IGNORE_MISSING["/"] comment above.
  exact("200"),
  exact("30"),
  exact("11000"),
  exact("6000"),
  // /anlegg's FAQ answer to "Hvor driftssikkert er systemet?"
  // (docs/scrape/anlegg.json) is real live copy — Faq.tsx's rows open
  // independently precisely so a scripted click-through leaves every answer
  // visible locally (see that file's comment) — but on live itself,
  // stepping through all three questions in sequence with
  // scripts/lib/accordion.mjs reproducibly leaves this one specific answer
  // re-collapsed by the time the pass finishes (confirmed directly against
  // https://www.elba.no/anlegg), while the other two stay open. A capture
  // artifact of automating live's own accordion, not missing/extra content.
  exact(
    "Systemene er dimensjonert for krevende miljøer og kontinuerlig drift. Komponentene er robuste og tilpasset nordiske forhold. Elektronisk overvåking kan integreres for varsling ved avvik.",
  ),
  // Approved deviations 6-8 in docs/handover.md (spec:
  // docs/superpowers/specs/2026-09-18-produkter-catalog-search-design.md).
  // The skralli-v2 breadcrumb band: a "Hjem" text crumb and "›" separators in
  // place of live's house icon and chevrons.
  exact("Hjem"),
  exact("›"),
  // Produkter as its own nav item, footer link and home section.
  exact("Produkter"),
  exact("Se alle produkter"),
  // The catalog search: its heading/label and submit button (home,
  // /produkter, every /produkter/<kategori>), the two filter rows, and the
  // chip / home-pill labels — the three materials and the eleven categories.
  exact("Søk i alle produkter"),
  exact("Søk"),
  exact("Kategori"),
  exact("Materiale"),
  exact("Forsinket stål"),
  exact("Syrefast"),
  exact("Messing"),
  ...[
    "Banjokoblinger", "Fett", "Forlengere", "Fyllenippler", "Fylleutstyr", "Lynfittings",
    "Rørender", "Skottgjennomføring", "Skruhylser", "Slanger", "Snittringmatur",
  ].map(exact),
];

// docs/scrape/tables.json's per-route header/cell strings. SpecTable renders
// every row of a table (Task 12), but live's Framer "Table" widget only ever
// shows its pager's current page server-side, so most rows past page 1 are
// real content that simply isn't in this particular live capture — verified
// against tables.json (the same hydrated-table scrape gen-produkter.mjs
// builds lib/produkter.ts from) rather than allowed by a broad regex.
const tablesByRoute = Object.fromEntries(
  JSON.parse(readFileSync(join(ROOT, "docs/scrape/tables.json"), "utf8")).routes.map((r) => [r.route, r.tables]),
);
const TABLE_CELLS = Object.fromEntries(
  Object.entries(tablesByRoute).map(([route, tables]) => {
    const cells = new Set();
    for (const t of tables) {
      for (const h of t.headers) cells.add(h.trim());
      for (const row of t.rows) {
        const trimmed = row.map((c) => c.trim());
        for (const c of trimmed) cells.add(c);
        cells.add(trimmed.join("\t"));
      }
    }
    return [route, cells];
  }),
);
const isTableText = (route, text) => TABLE_CELLS[route]?.has(text.trim()) ?? false;

// A browser's innerText joins adjacent cells of a real <table> row with a
// tab character (spec behavior for display:table-cell boxes) — components/
// SpecTable.tsx (Task 12) is this site's first actual <table>, and the live
// site's own spec tables are Framer div-grids with one line of text per
// cell, not per row. Treating a tab the same as a newline here (before the
// old space-collapsing logic, which would otherwise flatten "A\tB\tC" into
// "A B C" and turn a whole table row into one incomparable blob) keeps both
// sides comparable cell-by-cell without touching any non-table route, since
// nothing else on the site renders a real table.
// /produkter's live "Skottgjennomføring"/"Lynfittings" links carry a
// leading U+200B (zero-width space) that this rebuild's clean copy doesn't
// reproduce (not visible content) — stripped here so both sides compare
// equal.
const norm = (s) =>
  s
    .replace(/​/g, "")
    .replace(/ /g, " ")
    .replace(/\t/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();

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
  const live = await capture(page, LIVE + livePath(r));
  const local = await capture(page, LOCAL + r);
  const a = new Set(norm(live.text).split("\n")), b = new Set(norm(local.text).split("\n"));
  const missingAll = [...a].filter(x => !b.has(x)); const extra = [...b].filter(x => !a.has(x));
  const ignorePatterns = IGNORE_MISSING[r] || [];
  const missing = missingAll.filter(x => !ignorePatterns.some(re => re.test(x)));
  const ignored = missingAll.length - missing.length;
  const imgOk = local.images + (EXPECTED_FEWER_IMAGES[r] ?? 0) >= live.images;
  const disallowedExtra = extra.filter((x) => !ALLOWED_EXTRA.some((re) => re.test(x)) && !isTableText(r, x));
  const ok = missing.length === 0 && imgOk && disallowedExtra.length === 0;
  if (!ok) failures++;
  rows.push(`## ${r} ${ok ? "OK" : "FAIL"}\n- images live/local: ${live.images}/${local.images}${imgOk ? "" : " (missing)"}\n${missing.length ? "- missing text:\n" + missing.map(m => `  - ${m}`).join("\n") : ""}${extra.length ? "\n- extra text:\n" + extra.map(m => `  - ${m}`).join("\n") : ""}${disallowedExtra.length ? "\n- disallowed extra text:\n" + disallowedExtra.map(m => `  - ${m}`).join("\n") : ""}\n`);
  console.log(`${ok ? "OK  " : "FAIL"} ${r} missing=${missing.length} extra=${extra.length} disallowed=${disallowedExtra.length} img=${live.images}/${local.images} ignored=${ignored}`);
}
await browser.close();
await writeFile("docs/verify-report.md", `# Verify report ${new Date().toISOString()}\n\n${rows.join("\n")}`);
process.exit(failures ? 1 : 0);
