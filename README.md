# Skralli

Static Next.js recreation of skralli.is (Icelandic B2B site). Typography matches
the live site: Figtree (site default), Inter (card/table/footer text), and
Satoshi (the animated stat numbers), all self-hosted via `next/font` — see
`app/fonts.ts`. The client's NowAlt font files remain in `assets/fonts/` for
reference/brand use but are no longer wired into the site.

## Development

```bash
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run test     # run vitest unit tests
npm run lint     # eslint
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

- `RESEND_API_KEY` — API key for sending contact-form email via Resend
- `EMAIL_FROM` — from address used for outgoing contact-form email
- `CONTACT_TO` — inbox that receives contact-form submissions

## Verifying against the live site

`npm run verify` renders each local route with Playwright/Chromium and diffs its
visible text against the **live** skralli.is (not a local fixture), so it needs:

1. The site running locally on `:3000` (`npm run dev` or `npm run build && npm start`).
2. Chromium installed for Playwright: `npx playwright install chromium`.
3. A network path to the live site (it fetches `https://skralli.is` directly).

```bash
npm run verify                          # every route in scripts/routes.mjs
npm run verify -- / /hafa-samband       # only the listed routes
```
Output per route is `OK`, or a diff of `missing` (text present live but not locally)
and `extra` (text present locally but not live).

## Regenerating scraped content

The site's copy, images and tables are captured from the live site into
`docs/scrape/*.json` (page text/blocks/nav) and `docs/reference/*.jpg`
(full-page screenshots used as the visual source of truth), plus
`docs/asset-manifest.json` (every downloaded image's original URL → local
path). These are the **inputs** re-run to regenerate generated pages —
edit the scrape data, not the generated `lib/*.ts` files, when live content
changes:

```bash
npm run scrape              # page text/blocks/nav + reference screenshots + images
npm run scrape-svg          # inline <svg> icons per route
npm run scrape-formatting   # list/bold semantics for scraped text blocks
npm run scrape-tables       # <table> structures (e.g. hifi-festibunadur spec tables)
npm run scrape-mobile-diff  # text visible only on mobile or only on desktop, live site
npm run normalize-scrape    # one-off cleanup pass over already-scraped docs/scrape/*.json
npm run gen-sturtuvagnar    # regenerates lib/sturtuvagnar.ts from docs/scrape/sturtuvagnar__*.json
npm run gen-hifi            # regenerates lib/hifi.ts from docs/scrape/hifi-festibunadur__*.json + tables.json
```

All scrape scripts talk to the **live** skralli.is directly (no local server
needed); `gen-sturtuvagnar`/`gen-hifi` instead read the already-scraped JSON
files and write local `lib/*.ts` data.
