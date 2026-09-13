# Elba.no recreation — design spec

Date: 2026-09-13
Status: approach and the four open decisions approved by Einar (Kode Solutions) in chat, 2026-09-13; spec text pending his review.

## Goal

Recreate elba.no, currently a Framer site, as a self-hosted Next.js site owned
by Kode/Elba AS. The new site must look and read the same as the live site:
every page, every piece of text verbatim, every image, video, document and
logo. The contact form must send email through Resend. The codebase must
leave room for a later customer login backed by Elba's ERP (Zirius) with
online payment, but that work is explicitly out of scope here.

The site is Norwegian (Bokmål). It is the same Framer template family as
skralli.is, which Kode already rebuilt in `kode-is/skralli`; this repo was
bootstrapped from that tree (commit `e21130a`) so the scrape/verify pipeline,
the Resend contact flow, the fonts and the shared components carry over.

## Non-goals

- Redesigning or "improving" copy, layout, or imagery. This is a faithful copy,
  with exactly two deviations listed under *Deviations from live*.
- Customer login, Zirius integration, prices, payments, webshop (later project).
- CMS. Content lives in typed data files in the repo.
- Moving the elba.no domain. Production and DNS are a separate step.

## Source of truth

| Item | Source |
|---|---|
| Page list | `https://www.elba.no/sitemap.xml` (26 URLs) plus any nav/footer link not in it (none found) |
| Text | Live HTML of each page, extracted verbatim by the Playwright scraper |
| Images | `framerusercontent.com/images/...` URLs in the live HTML, downloaded at full resolution (strip Framer resize query params) |
| Video | `framerusercontent.com/assets/QPvkdzMib7zEzxuEgjVLWCd0e4.mp4` (home hero) |
| Documents | `framerusercontent.com/assets/77tNNLfbWmUiQnPLVWnCArstbbo.pdf` (Code of Conduct on /etikk-og-ansvar) |
| Elba logo + favicon | Einar's Drive folder "ELBA AS" → `Logo/` (folder `15LaBv5SLWBI4rth_hbU2an7-2p_tgmLm`): `ELBA_SVG_Logo_White_BG_H_TM.svg` (red wordmark, viewBox 600×600, fill `#c11e31`), `Elba logo.png` (65×65), `img-b51138c7…png` (163×52), `ELBA - Logo Cheatsheet.pdf`; `Logo/Favicon/` (folder `1yfrNcsndSMaKBViPwyhJI2TpuNy2ihOt`): `favicon.ico`, `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`, `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png`, `site.webmanifest`. Already downloaded to the session scratchpad and copied into the repo in the first task. |
| Higher-res photos | Same Drive root → `Mynda album/` (folder `19yuCLJy3vGOx91B-qCM7yE-11vA5LgpO`): `Myndir/Anlegg`, `Myndir/Industri`, `Industri Carousel`, `Myndir af produkter`, `Logo frá birgjum`. Swap in only where a Drive file is clearly the same photo at higher resolution than the live-site copy. |
| Logo variants not in Drive | Any all-white or other logo variant the live site renders (header over dark hero, footer) is taken from the live site's own image files. |
| Fonts | Figtree (site default) and Inter (Framer token font), both already wired through `next/font/google` in `app/fonts.ts`. Satoshi stays only if the live stat counters measure as Satoshi; otherwise it and the NowAlt files are removed. |
| Brand colours | ELBA RED `#c11e31` (C17 M100 Y87 K7), white, black, from the cheatsheet. The exact value used on each element comes from the live computed CSS, as the scraper records it. |

## Page inventory (26 routes)

- `/` home
- `/om-oss`, `/tjenester`, `/anlegg`, `/industri`, `/etikk-og-ansvar`, `/kontakt-oss`
- `/produkter` index and 11 product pages:
  `/produkter/{rørender, forlengere, fylleutstyr, fyllenippler, skottgjennomføring, snittringmatur, banjokoblinger, lynfittings, slanger, fett, skruhylser}`
- `/artikler` index and 5 articles:
  `/artikler/{nytt-design, nytt-eierskap, passiv-og-aktiv-overvaaking, hvorfor-smoresystem-industri, velge-system}`
- `/404` → Next.js `not-found.tsx`

Slugs keep their Norwegian letters (`rørender`, `skottgjennomføring`); Next.js
serves them percent-encoded exactly as the live site does. Two live slugs carry
a leading zero-width space (`/produkter/​skottgjennomføring`,
`/produkter/​lynfittings`, U+200B). The new site serves the clean slugs and
adds permanent redirects from the U+200B variants so existing links and search
results keep working.

## Architecture

**Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
(`@theme` tokens in `app/globals.css`), `next/font` (Google fonts self-hosted
at build), `next/image` for all imagery, `resend`. Playwright and Vitest as dev
dependencies. Node 22. Deployed on Vercel from `github.com/kode-is/elba`
(private).

**Rendering:** Everything is static (`generateStaticParams` for product and
article pages). No database. The only server code is the contact-form server
action.

**Layout of the repo:**

```
app/
  layout.tsx            root layout (lang="nb"): fonts, Header, Footer, metadata
  page.tsx              home
  not-found.tsx         404 copy from the live /404 page
  sitemap.ts, robots.ts
  actions.ts            submitContact server action
  om-oss/  tjenester/  anlegg/  industri/  etikk-og-ansvar/  kontakt-oss/
  produkter/page.tsx    produkter/[slug]/page.tsx
  artikler/page.tsx     artikler/[slug]/page.tsx
components/             Header, MobileMenu, ServicesMenu (Tjenester hover panel),
                        Footer, Container, PageHero, Breadcrumb, ContactForm,
                        ContactCta, SpecTable, Carousel, StatCounter, StatsSection,
                        StepCard, FeatureCard, IndustryStrip (marquee), plus one
                        folder per page for sections used on that page only
lib/
  site.ts               company details, nav, Tjenester panel, footer columns
  produkter.ts          11 product records: title, intro, images, tables
  artikler.ts           5 article records: title, subtitle, date, body blocks, images
  routes.ts             TS mirror of scripts/routes.mjs (test asserts equality)
  seo.ts                per-route title/description from the live <head>
  email/client.ts       lazy Resend client (unchanged from skralli)
  email/contact.ts      Norwegian payload type, validation, email builder
  email/send-contact.ts injectable send flow (unchanged shape)
scripts/
  routes.mjs            LIVE = https://www.elba.no, the 26 routes above
  scrape.mjs            page text/blocks/nav + reference screenshots + images,
                        extended to download videos and PDFs under
                        framerusercontent.com/assets and to record them in
                        docs/asset-manifest.json
  scrape-svg.mjs  scrape-formatting.mjs  scrape-tables.mjs  scrape-mobile-diff.mjs
  normalize-scrape.mjs  verify.mjs (skralli-specific exceptions removed)
  gen-produkter.mjs     docs/scrape/produkter__*.json + tables.json → lib/produkter.ts
  gen-artikler.mjs      docs/scrape/artikler__*.json → lib/artikler.ts
public/
  logos/                Elba SVG + PNG variants, brand/supplier logos from the live site
  favicon.ico, icon.svg, apple-icon.png, manifest icons   from the Drive favicon set
  images/<route>/…      downloaded assets, hashed filenames as the scraper names them
  video/hero.mp4
  docs/<name>.pdf       Code of Conduct
assets/brand/           ELBA-Logo-Cheatsheet.pdf (reference only)
docs/scrape/  docs/reference/  docs/asset-manifest.json   scrape outputs (committed)
docs/superpowers/specs/ this file;  docs/superpowers/plans/ implementation plan
docs/handover.md        running log of what needs Einar or Hlynur
```

Everything Skralli-specific in the bootstrap commit (its page routes, `lib`
data files, page component folders, generators, tests over its data, logos and
fonts it alone used) is deleted in the first implementation task, before any
Elba content is added.

**Data flow:** Page components import from `lib/*.ts` and render. Product and
article pages are one template each plus a data record generated from the
scrape JSON. Every product record carries `id` (its slug) and an empty
`erpId?: string` slot so the later Zirius work has a place to attach item
numbers without reshaping the data.

**Page templates** (from the live site's structure, confirmed by a per-route
outline of the live HTML on 2026-09-13):

- *Home*: hero with looping video, H1 "Velkommen til ELBA", tagline, email and
  phone pills; red industry marquee (Landbruk, Sagbruk, Offshore, …); three
  step cards ("Få fast pris i dag"); "Våre tjenester" with Anlegg / Industri /
  Produkter cards; "Faglig rådgivning" block; stat counters; "Nyeste artikler"
  three article cards; a mini contact form (same four fields, button `Send`);
  footer.
- *Content page* (tjenester, anlegg, industri, etikk-og-ansvar, produkter
  index): image hero with H1, breadcrumb, then that page's own sections built
  in scrape-block order from the shared components (feature tiles, cards, FAQ,
  image grids). The produkter index lists the 11 product links and ends with
  a "Send oss en forespørsel" call-to-action linking to /kontakt-oss (no form
  of its own); etikk-og-ansvar links the PDF.
- *About* (om-oss): story, key points, team grid. The live markup renders each
  team card twice for responsive breakpoints; the scrape's normalize step
  de-duplicates them.
- *Contact* (kontakt-oss): hero, breadcrumb, "Send oss en forespørsel" with
  the full contact form, company details.
- *Article* (5): title, subtitle, published date, body blocks, images with
  captions, links back to `/artikler`. Articles and products share one Framer
  collection-item template on the live site.
- *Product page* (11): hero, breadcrumb `Hjem > Produkter > {title}`, intro
  text, then one or more spec tables, each with up to two images above it,
  followed by the "Send oss en forespørsel" call-to-action (link, not a form).
  On the live site each table is Framer's Table widget, rendered client-side
  with a search box and a "Previous / Page 1 of 1 / Next" pager; the server
  HTML only contains the widget's demo rows (Name / Email / Role / Status).
  The scraper therefore reads tables after hydration (Playwright, as
  `scrape-tables.mjs` already does), and `SpecTable` renders every row as a
  plain static table with the live column headers. The widget's search box
  and pager are not reproduced; their strings are excluded in `verify.mjs`.
  If Hlynur wants the search box back it is a small client-side filter, noted
  in the handover.
- *404*: header, the live page's copy, no footer and no call-to-action, as on
  the live site; any unknown path renders the same way.

The scrape's per-route `blocks` are the authority on section order and
content; the template list above is a guide, not a substitute.

**Footer year:** the live footer's year is rendered client-side (server HTML
says 2024, the browser shows 2026), so the new footer prints the current year.

**Header:** logo, links Hjem / Om oss / Artikler / Tjenester, red "Kontakt oss"
button. Tjenester opens a hover panel titled "Tjenester" with the description
"Utforsk løsninger tilpasset din bransje og bruk" and links Anlegg, Industri,
Produkter. Mobile: hamburger with the same links. **Footer:** logo, address
"Fabrikkgata 11D, 3320 Vestfossen", phone "32 25 20 30", email
"elba@elba.no", "© 2026 Elba AS", and a "Selskapet" column: Hjem, Om oss,
Artikler, Tjenester, Etikk og ansvar.

## Contact form (Kontakt oss, and the mini form on the home page)

Fields, verbatim from the live site: `Navn` (text), `E-post` (email),
`Selskap` (text), `Melding` (textarea). Submit label: `Send`, which is what
the home page's form already says; only the kontakt-oss form says `Senda!`
(see *Deviations from live*). Navn, E-post and Melding are required; Selskap
is optional. Product pages and the produkter index have no form, only a
call-to-action link to /kontakt-oss.

Flow:
1. Client component (`ContactForm`, same component as skralli with the field
   set and copy replaced) validates required fields with Norwegian messages:
   - `Vennligst fyll inn navn.`
   - `Vennligst oppgi en gyldig e-postadresse.`
   - `Vennligst skriv en melding.`
   - honeypot filled → `Sending mislyktes.`
2. Server action `submitContact` re-validates, then calls Resend once:
   - to: `CONTACT_TO` env var, default `elba@elba.no`
   - from: `EMAIL_FROM` env var (a verified sender on elba.no in Kode's Resend
     account, e.g. `Elba <web@elba.no>`)
   - reply-to: the submitter's email
   - subject: `Henvendelse fra elba.no – {Navn}`
   - plain-text and simple HTML body listing Navn, E-post, Selskap, Melding
3. While sending the button reads `Sender...`. Success replaces the form with
   `Takk! Vi har mottatt henvendelsen din og svarer så snart vi kan.` The live
   Framer form's success text cannot be read without submitting it, so this
   copy is new and is listed in the handover for Hlynur to adjust. Failure
   shows `Kunne ikke sende meldingen. Prøv igjen eller send e-post til
   elba@elba.no.` and keeps the user's input.

Env vars (set in Vercel, never committed): `RESEND_API_KEY`, `EMAIL_FROM`,
optional `CONTACT_TO`. Missing env vars throw at send time; the action catches
and returns `{ ok: false, error }` so the page never 500s. Honeypot field to
drop obvious bots; no third-party captcha. Adding elba.no as a verified domain
in Resend is DNS work for Einar or Hlynur and is tracked in the handover.

## Deviations from live

1. (approved) The kontakt-oss form button reads `Senda!` on the live site
   (Icelandic, left over from the Skralli template). The new site uses `Send`,
   matching the home page's form.
2. (approved) The footer "Artikler" link points to `./kontakt-oss` on the live
   site. The new site links it to `/artikler`.
3. (proposed, same class of template leftover) The five article pages' `<title>`
   values end in "— Skralli" on the live site. The new site ends them in
   "— Elba". Every other page shares the home page's title and description,
   which are copied verbatim.
4. (technical) The U+200B product-slug redirects described under *Page
   inventory*, and the spec-table widget chrome (search box, pager) described
   under *Page templates*.

All are noted in `docs/handover.md` so Hlynur is not surprised.

## Assets

- Scraper collects every `framerusercontent.com/images/...` URL per page,
  strips `?scale-down-to=` / `?width=` params, downloads once, and records
  `docs/asset-manifest.json` mapping `{page, originalUrl, localPath, width,
  height}`. The same pass downloads `framerusercontent.com/assets/*.mp4` and
  `*.pdf` referenced by `<video>`, `<source>` or `<a href>` and records them
  in the manifest with `kind: "video" | "document"`.
- Each image's `alt` text is copied from the live site where present.
- Logos: Elba SVG and PNGs from Drive; supplier/brand logos and any white
  logo variant from the live site.
- Drive swap rule: only when the same photo exists in Drive at larger pixel
  dimensions. Record each swap in the manifest.
- Favicon set from Drive: `favicon.ico`, `icon.svg`, `apple-icon.png`, the
  two manifest PNGs and `site.webmanifest` under `public/`.

## Fonts

Figtree and Inter via `next/font/google` (downloaded at build time, no runtime
request to Google), exposed as `--font-figtree` / `--font-inter` and mapped to
`--font-sans` / `--font-ui` in `globals.css`, exactly as in the skralli
template. Family and weight per element are measured on the live pages during
the scrape and applied per element, as the skralli handover describes.

## SEO / metadata

Per-page `<title>` and `description` copied from the live `<head>` into
`lib/seo.ts` (one shared title and description for every page except the home
page and the five articles, which have their own; see deviation 3 for the
article suffix). `sitemap.ts` emits the 25 public routes under
`https://www.elba.no`. `robots.ts` allows all. Open Graph image: the live
site's OG image if present, else the home hero poster. `metadataBase` is
`https://www.elba.no`.

## Testing and verification

- `npm run build` must pass with zero type errors and all 26 routes emitted.
- Vitest: email builder and validation (Norwegian messages, honeypot,
  escaping), `sendContact` with an injected send double (success, validation
  failure, missing env), `lib/routes.ts` equals `scripts/routes.mjs`, and data
  integrity for `lib/produkter.ts` (11 records, each with at least one table)
  and `lib/artikler.ts` (5 records with title and date).
- `npm run verify`: Playwright renders each local route and diffs its visible
  text against the live page. Zero `missing` lines per route is the
  acceptance bar, with the table widget's search box and pager strings
  excluded; `extra` may list only the approved deviations.
- Same script confirms every `<img>` on the live page has a counterpart on the
  new page (count per page and manifest).
- Visual pass on home, one content page, one product page, one article and
  kontakt-oss at desktop (1440) and mobile (390), side by side with the
  reference screenshots.
- Contact form: browser run of validation, honeypot and success states; one
  real send to elba@elba.no once the key is in `.env.local` (Einar pastes it
  locally, not in chat) or in Vercel.

## Deployment

Work happens on branch `site-recreation` with a PR to `main`. A Vercel project
`elba` under the Kode Solutions team (`kode-solutions-44807b0f`) deploys the
branch as a preview URL for Hlynur to review. Production deploy and pointing
elba.no at Vercel are separate later steps, tracked in the handover. Env vars
are added to the Vercel project by Einar.

## Work split

- Fable 5.1 (this session): planning, task decomposition, review of subagent
  output, final verification.
- Sonnet subagents: pipeline adaptation, page and component build, visual
  comparisons.
- Haiku subagents: mechanical data conversion, manifest checks, text
  extraction.
- The frontend-design guidance applies only to states that have no live
  reference (form error/success states); everything else copies the live
  site.

## Later (out of scope, noted so the structure supports it)

- `Innskráning` (customer login) for Elba customers, backed by Zirius as the
  ERP, with per-customer prices and online payment through a Norwegian
  provider. Hlynur said in March 2026 that Zirius offers a plug-and-play
  webshop with users mapped to existing customers; Elba is cleaning up Zirius
  first. Will need auth, a data source for customers and prices, and a
  logged-in area. Product records carry `id` and `erpId` now so they can be
  linked to Zirius item numbers later.
