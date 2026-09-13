// Dev tool: dumps computed typography/colour for every visible text element on a
// set of routes, so the rebuild's fonts, sizes and colours can be matched to the
// live site by measurement rather than by eye. Defaults to the live site; pass
// `--local` to point the same run at http://localhost:3000 and diff the two.
import { chromium } from "playwright";
import { LIVE, livePath } from "./routes.mjs";

const args = process.argv.slice(2);
const local = args.includes("--local");
const routes = args.filter((a) => !a.startsWith("--"));
const list = routes.length
  ? routes
  : ["/", "/om-oss", "/anlegg", "/produkter/fett", "/artikler/nytt-eierskap", "/kontakt-oss"];
const base = local ? "http://localhost:3000" : LIVE;

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
for (const r of list) {
  await page.goto(base + (local ? r : livePath(r)), { waitUntil: "networkidle" });
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,button,th,td,li")]
      .filter((e) => e.getBoundingClientRect().width > 0)
      .slice(0, 400)
      .map((e) => {
        const s = getComputedStyle(e);
        return [
          e.tagName,
          s.fontFamily.split(",")[0],
          s.fontWeight,
          s.fontSize,
          s.lineHeight,
          s.color,
          s.backgroundColor,
          (e.textContent || "").trim().slice(0, 40),
        ].join(" | ");
      }),
  );
  console.log(`\n## ${r} (${base})\n` + [...new Set(rows)].join("\n"));
}
await browser.close();
