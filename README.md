# Elba

Static Next.js recreation of elba.no (Elba AS, Norway). Bootstrapped from kode-is/skralli.

## Development

```bash
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run test     # run vitest unit tests
npm run lint     # eslint
```

`docs/handover.md` is the place to start: what still needs a human, where the
site deliberately differs from live, and what each task built.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

- `RESEND_API_KEY` — API key for sending contact-form email via Resend
- `EMAIL_FROM` — from address used for outgoing contact-form email
- `CONTACT_TO` — inbox that receives contact-form submissions

Without them the contact form still validates input and shows a friendly
failure message; nothing is sent.

## Verifying against the live site

`npm run verify` renders each local route with Playwright/Chromium and diffs its
visible text against the **live** www.elba.no (not a local fixture), so it needs:

1. The site running locally on `:3000` (`npm run dev` or `npm run build && npm start`).
2. Chromium installed for Playwright: `npx playwright install chromium`.
3. A network path to the live site (it fetches `https://www.elba.no` directly).

```bash
npm run verify                          # every route in scripts/routes.mjs
npm run verify -- / /kontakt-oss        # only the listed routes
```

Output per route is `OK`, or a diff of `missing` (text present live but not locally)
and `extra` (text present locally but not live). The full per-route diff is written
to `docs/verify-report.md` (gitignored). `missing=0` on all 26 routes is the bar;
the `extra` lines are the approved additions listed in `docs/handover.md`.

## Measuring typography and colour against live

`scripts/measure.mjs` dumps the computed font family, weight, size, line-height
and colours of every visible text element on a page, which is how the type scale
and colour tokens in `app/globals.css` were derived:

```bash
node scripts/measure.mjs > docs/measure.txt          # live, the default six routes
node scripts/measure.mjs /anlegg /industri           # live, specific routes
node scripts/measure.mjs --local /anlegg             # the same pass against :3000
```

`docs/measure.txt` is the committed live measurement; diff a `--local` run against
it when changing type or colour.

## Regenerating scraped content

The site's copy, images and tables are captured from the live site into
`docs/scrape/*.json` (page text/blocks/nav) and `docs/reference/*.jpg`
(full-page screenshots at 1440 and 390, used as the visual source of truth),
plus `docs/asset-manifest.json` (every downloaded image's original URL → local
path). These are the **inputs** re-run to regenerate generated pages — edit the
scrape data, not the generated `lib/*.ts` files, when live content changes:

```bash
npm run scrape              # page text/blocks/nav + reference screenshots + images
npm run scrape-svg          # inline <svg> icons per route
npm run scrape-formatting   # list/bold semantics for scraped text blocks
npm run scrape-tables       # the product spec tables behind /produkter/*
npm run scrape-mobile-diff  # text visible only on mobile or only on desktop, live site
npm run normalize-scrape    # one-off cleanup pass over already-scraped docs/scrape/*.json
npm run gen-produkter       # regenerates lib/produkter.ts from docs/scrape/produkter__*.json
npm run gen-artikler        # regenerates lib/artikler.ts from docs/scrape/artikler__*.json
```

All scrape scripts talk to the **live** www.elba.no directly (no local server
needed); `gen-produkter`/`gen-artikler` instead read the already-scraped JSON
files and write local `lib/*.ts` data. Re-running `npm run scrape` rewrites the
page JSON, so re-run `npm run scrape-formatting` after it or the articles lose
their bullet-list and bold annotations.

## Routes

`scripts/routes.mjs` (and its TypeScript mirror `lib/routes.ts`, kept identical
by `tests/routes.test.ts`) is the single list of the 26 routes: the seven top
level pages, `/produkter` plus eleven product pages, `/artikler` plus five
articles, and `/404`. `app/sitemap.ts` emits all of them except `/404`.
