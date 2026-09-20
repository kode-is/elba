# elba.no rebuild — handover

A static Next.js recreation of www.elba.no, built from a scrape of the live
site (`docs/scrape/*.json`, `docs/reference/*.jpg`). `npm run verify` diffs
every route's visible text against the live site; at the end of Task 11 all
26 routes pass with `missing=0`.

Since 2026-09-18 the site also departs from live on purpose in three places —
Produkter as its own item, a catalog search, a new breadcrumb and a site-wide
search palette (deviations 6-9 below; spec `docs/superpowers/specs/2026-09-18-produkter-catalog-search-design.md`).
`npm run verify` still passes 26/26 with those recorded in `scripts/verify.mjs`.

---

## Still needs you or Hlynur

1. **Resend (contact form) — working; switch the recipient before launch.**
   `RESEND_API_KEY`, `EMAIL_FROM` and `CONTACT_TO` were added to the Vercel
   project for **Preview** and **Production** on 2026-09-19, and one real send
   was exercised that day from the PR #2 preview's `/kontakt-oss`: the form
   showed its success message and the mail arrived in the inbox (not spam),
   from `elba@elba.no`, subject `Henvendelse fra elba.no – <navn>`, reply-to
   the visitor's address. **`CONTACT_TO` pointed at Einar's address for that
   test — set it to `elba@elba.no` (and redeploy) before go-live.** There is
   still no `.env.local`, and the variables are not set for the Development
   environment, so a local `npm run dev` shows the friendly failure message
   instead of sending.
2. **One more send after the `CONTACT_TO` switch**, to confirm the mail lands
   in Elba's own inbox.
3. **Review the success/error copy.** Ours is new — live's Framer form shows
   its own strings. Success: "Takk! Vi har mottatt henvendelsen din og svarer
   så snart vi kan." Errors: "Vennligst fyll inn navn.", "Vennligst oppgi en
   gyldig e-postadresse.", "Vennligst skriv en melding."
4. **Review the new Norwegian UI strings (Hlynur).** The catalog search and
   the new breadcrumb/nav carry copy that is ours, not live's: `Produkter`
   (nav, footer, home heading), `Se alle produkter`, `Søk i alle produkter`,
   the placeholder `Art.nr., gjenge, dimensjon, materiale …`, `Søk`,
   `Kategori`, `Materiale`, `Forsinket stål` / `Syrefast` / `Messing`,
   `Viser N av 215 produkter`, `Nullstill`, `Ingen treff`, `Finner du ikke det
   du leter etter? Ta kontakt, så hjelper vi deg.` and the breadcrumb's
   `Hjem`. The search palette adds: `Søk`, `Søk etter produkt, art.nr.,
   artikkel eller side …`, `Lukk søk`, the group names `Produktkategorier` /
   `Produkter` / `Artikler` / `Sider`, `N av M`, `Se alle N treff i
   produktkatalogen` / `Se treffet i produktkatalogen`, `Art.nr. …`,
   `<Kategori> – på forespørsel`, `N produkter`, `Laster søk …`, `Kunne ikke
   laste søket. Lukk og prøv igjen.`, `Ingen treff for «…». Prøv et annet
   søkeord, eller ta kontakt.` and the key hints `naviger` / `åpne` / `lukk` /
   `eller / åpner søket`. (Live's own per-table `Search…` box, pager and CSV export are still
   not reproduced — the catalog search on `/produkter` replaces the need.)
5. **Placeholder team avatar.** All nine team members share the same
   silhouette placeholder (`/images/om-oss/06-ccdd026b.png`) on live
   (`lib/team.ts`); real portraits can drop straight into
   `public/images/om-oss/` and the same `team` array.
6. **The favicon SVG is a JPEG in an SVG wrapper.** `app/icon.svg` is a
   1280×1280 `<image>` element holding a base64 JPEG (117 KB), which is what
   the brand kit provided. A real vector mark would be smaller and sharper —
   `public/logos/elba-logo.svg` is the true vector logo if you want it
   redrawn as an icon.
7. **Higher-resolution photos.** Every photo on the site is the original
   Framer asset from the scrape, so nothing is upscaled — but the Drive
   folder **"ELBA AS / Mynda album"** (id `19yuCLJy3vGOx91B-qCM7yE-11vA5LgpO`;
   subfolders `Myndir/Anlegg` `1KgirKqq41pKtvl6VEJsZZPEn2CQ3O0t7`,
   `Myndir/Industri` `1luyMT1P5bCiKVE-4HM2BfIiSgGCze2UI`, `Industri Carousel`
   `1PtXpBowZ1kf_BZYz2nzKR3204yZsEfKW`, `Myndir af produkter`
   `1-rrfrxSuWIz2zaoIAeA0h23IknuwHFXT`) may hold larger originals of the same
   shots. The files are too big to move through the Drive tool, so the swap
   is a local job: drop the folder on this machine, and for each Drive photo
   that is *clearly the same shot at a larger pixel size* (same subject, same
   crop — nothing ambiguous), save it next to the scraped file with a
   `-hires` suffix, point the page at it, and add
   `{ swappedFrom: <original URL>, driveId: <id> }` to that row of
   `docs/asset-manifest.json`.
8. **Alt text.** 159 of the 188 scraped assets have no alt text on live, so
   they are rendered with `alt=""` (decorative). Anything that carries real
   meaning for a screen reader needs a written alt — the images on
   `/produkter/*` and the article photos are the ones worth doing first.
   A handful of the alt texts live *does* carry are leftovers from Skralli
   (the Icelandic site this Framer template was cloned from) or its own
   stock-photo template, copied verbatim since we never touch scraped copy:
   `Snjókeðjur, Hlífi- & festibúnaður` (Icelandic — `app/(site)/produkter/page.tsx`,
   `components/ServiceCards.tsx`), `Aðstaða` on both `/om-oss` photos
   (`app/(site)/om-oss/page.tsx`), and the English `Kitchen installation`,
   `Bedroom work`, `Interior work` and `Discover` (`app/(site)/anlegg/page.tsx`,
   `app/(site)/industri/page.tsx`, `app/(site)/artikler/page.tsx`) — none of
   them describe the photo they're on. Same class of issue as the rest of
   this item; Hlynur to supply real Norwegian alt texts for all of it.
9. **Vercel production + DNS — domains added, waiting for the DNS switch.**
   The Vercel project `elba` (team **Kode Solutions**, scope
   `kode-solutions-44807b0f`, linked to `kode-is/elba`) deploys `main` to
   production; the public production alias is https://elba-pi.vercel.app
   (deployment URLs themselves sit behind the Vercel login). On 2026-09-20
   `www.elba.no` and `elba.no` were added to the project, with `elba.no`
   redirecting (308) to `www.elba.no` — the canonical origin `lib/seo.ts` and
   `app/sitemap.ts` already use. DNS for elba.no is hosted at hyp.net
   (Domeneshop) and still points at Framer. To go live, change **only** these
   records there:

   | Type | Name | Now (Framer) | Change to (Vercel) |
   | --- | --- | --- | --- |
   | A | `@` | `31.43.160.6` | `216.150.1.1` |
   | A | `@` | `31.43.161.6` | `216.150.16.1` |
   | CNAME | `www` | `sites.framer.app.` | `2f8a7504558d2c43.vercel-dns-016.com.` |

   Leave the nameservers and every mail record alone: `MX` and the SPF/`MS=`
   TXT records (Microsoft 365), `_dmarc`, and Resend's `resend._domainkey` and
   `send.elba.no` records. Vercel issues the certificates by itself once the
   records resolve; `vercel domains verify www.elba.no --scope
   kode-solutions-44807b0f` reports the state. Before the switch: set
   `CONTACT_TO` to `elba@elba.no` and redeploy (item 1). Keep the Framer site
   published until the new records have propagated.
10. **No captcha or rate limit on the contact form.** `app/actions.ts` only
    has the honeypot field (`website`) — nothing stops a scripted flood of
    submissions. A Vercel Firewall rate-limit rule or a per-IP throttle in
    `submitContact` is the suggested follow-up once the form is live.
11. **Confirm the stat-counter numbers.** The four home/`om-oss` counters
    (`lib/stats.ts`: 184 / 14 / 10984 / 5984) were read off live's own
    count-up animation once it visibly settled; live's server-rendered HTML
    itself bakes in a lower baseline (180 / 10 / 10980 / 5980) before that
    animation runs. Please confirm 184/14/10984/5984 are the numbers you
    actually want shown, not just where the animation happened to land.
12. **`CurrentYear` hydration note.** `components/CurrentYear.tsx` derives
    its server snapshot from the module-load year (`BUILD_YEAR`), so right
    after a New Year — before the next redeploy — the console will show one
    hydration warning as the client corrects to the real year; it then
    self-corrects on the following render, so it's cosmetic. The follow-up,
    if it's worth doing, is inlining the build year via a build-time env var
    instead of computing it at module load.

---

## Deviations from live (approved)

1. **`Senda!` → `Send`.** Live's contact button still carries the Icelandic
   template's label; ours says `Send` (`components/home/ContactSection.tsx`,
   `app/(site)/kontakt-oss/page.tsx`). This is the one place our visible text
   deliberately differs from live, and `scripts/verify.mjs` allows it.
2. **Footer "Artikler" link.** Live points that footer link at
   `/kontakt-oss`; ours points at `/artikler` (`lib/site.ts`, commented at
   the line).
3. **Article `<title>` suffix.** Every live article title ends in
   `— Skralli` (the Framer site was cloned from skralli.is); the generator
   rewrites it to `— Elba` (`scripts/gen-artikler.mjs`, locked by
   `tests/artikler.test.ts`).
4. **U+200B product URLs and the table widget.** Two live product URLs carry
   a leading zero-width space (`/produkter/​skottgjennomføring`,
   `/produkter/​lynfittings`). We serve the clean slugs and redirect the
   U+200B form (`app/(site)/produkter/[slug]/page.tsx`). The Framer table widget's
   own chrome (`Search…`, `Previous`, `Page X of Y`, `Next`, CSV export) is
   not reproduced — `scripts/verify.mjs` carries a `WIDGET_CHROME` ignore
   list for it.
5. **The hero e-mail/phone pills are real links.** Live's anchors have no
   `href`; ours are `mailto:` and `tel:` (text verbatim).

6. **Produkter is its own item, not a service.** Requested by Hlynur
   (2026-09-16): "Produkter" is a fifth main-nav item and a footer link, and is
   gone from the Tjenester panel and from the "Våre tjenester" cards on `/` and
   `/tjenester`, which now show Anlegg + Industri (`lib/site.ts`,
   `components/ServiceCards.tsx`). The home page gains a "Produkter" section at
   the top, directly under the hero (`components/home/ProductsSection.tsx`): the card's old line of copy, a
   search form and a pill per category. With five items the desktop nav no
   longer fits a 768px band, so it starts at `lg` (1024px); tablets get the
   hamburger menu.
7. **Catalog search on `/produkter`.** One search box plus Kategori and
   Materiale filter chips across all 215 table rows at once
   (`components/produkter/ProductCatalog.tsx`, logic in `lib/catalog.ts`,
   tests in `tests/catalog.test.ts`). It matches Art.Nr., category, table
   heading and every cell, ignoring case, `ø/æ/å`, `,` vs `.` and spaces
   (`04014701013` finds `0401 4701 013`, `M10x1` finds `M 10x1`); several words
   must all match. Until a search or filter is active the page shows the
   eleven category cards as before. State lives in the URL
   (`?q=…&kategori=a,b&materiale=x`), so searches can be shared, and the home
   section and every `/produkter/<kategori>` page carry a small form that
   deep-links into it. The page order changed to catalog → "Vi leverer" → "Et
   bredt produktspekter"; the copy itself is untouched. Material is derived
   from the table heading ("Forsinket…", "Syrefast…", "Messing") or the
   `Material` column, which covers 5 of the 11 categories — rows without a
   material only drop out while a Materiale chip is on.
8. **Breadcrumb band, as on kode-is/skralli-v2.** A full-width cream band
   directly under every hero with a text trail `Hjem › Produkter › Rørender`
   (muted ink, brand-red on hover, current page in black), rendered by
   `PageHero`'s `crumbs` prop (`components/Breadcrumb.tsx`). It replaces live's
   red house-icon-and-chevron trail inside each page's content column. The
   article trail still says `Artikle` (sic) — that is live's own copy.

9. **Site-wide search palette.** A search button in the header (every width;
   beside the hamburger below `lg`) opens a command palette over the pages,
   the eleven product categories, all 215 product rows and the five articles
   (`components/SearchPalette.tsx`, ranking and highlighting in
   `lib/search.ts`, tests in `tests/search.test.ts`). Modelled on
   kode-is/totus's search — `⌘K` / `Ctrl+K` — plus: `/` opens it too; ↑ ↓ Home
   End Enter walk the results; it is a native modal `<dialog>` with combobox
   semantics (focus trap, Esc, focus back to the button); matched words are
   highlighted; an exact Art.Nr. ranks first and "rørender" leads with the
   category rather than its thirty rows; each group shows six hits with an
   "N av M" count, and the product group ends in "Se alle N treff i
   produktkatalogen" → `/produkter?q=…`; before anything is typed it lists the
   categories and pages as shortcuts. A product row opens the `/produkter`
   catalog filtered down to itself. The index is a prerendered static file,
   `/search-index.json` (`app/search-index.json/route.ts`, ~90 KB, ~15 KB
   gzipped), fetched the first time the palette opens and warmed when the
   button is hovered or focused — nothing is added to the pages' own bundles.
   The page keywords in `lib/search.ts` (`PAGES`) are search-only and worth a
   look from Hlynur: add the words customers actually use.

Two small additions of our own, for accessibility: a "Gå til innhold" skip
link, and `sr-only` labels on the contact-form fields. Both show up under
`extra` in `docs/verify-report.md`.

---

## Known differences from live (screenshot pass, Task 11)

Measured against `docs/reference/*.jpg` with local production screenshots of
`/`, `/om-oss`, `/anlegg`, `/produkter/rørender`, `/artikler/nytt-eierskap`
and `/kontakt-oss` at 1440×900 and 390×844. What was fixed is in the Task 11
commits; what is left:

- **Hero photo crop.** Framer stores a per-image focal point, which the
  scrape does not record: live renders the hero photo with
  `object-position: 31.5% 32%` on `/kontakt-oss`, `48.9% 9.4%` on `/anlegg`
  and `50.6% 12.3%` on `/artikler/nytt-eierskap` (and dead centre on
  `/om-oss` and `/produkter/rørender`). Ours centres every hero, so on the
  first three a different part of the photo is visible. Fixable by measuring
  `object-position` for all 26 heroes and passing it through `PageHero`.
- **Framer icon glyphs.** Three decorative glyphs come from a Framer icon set
  the scraper could not capture and are missing here: the red 55×55 badge
  overlapping each service card's photo (a bulldozer glyph on "Anlegg"), the
  red bookmark glyph at the right of home's "Få fast pris i dag", and the
  small red badge above the hero title on `/anlegg`. `PageHero` already has
  an `icon` prop for the last one.
- **Product tables are stacked, not paired.** Live puts a table that has its
  own images beside the next one in a two-column row — clearest on
  `/produkter/rørender`, where "Forsinket stål (Zn-Ni)" and "Syrefast
  (316 / V4A)" sit side by side under their own images. `ProductTables`
  stacks every table full width. Same content, same order, single column.
- **`/produkter/skruhylser`'s three-image group** renders 2 + 1; live shows
  two side by side with the third inset over the second.
- **`/produkter` card order.** The eleven product cards (now inside the
  catalog, in the 1240px band rather than live's 960px column) are a CSS
  `columns-3` masonry, so the browser's height balancing doesn't always put the same card
  in the same column as live. All eleven are present in scrape order.
- **Per-row tile widths on `/anlegg` and `/industri`.** Live's feature-tile
  rows aren't a uniform grid: rows 1 and 3 are 470/470 and row 2 is 388/552
  inside the same 960px column. Ours is an even two-column grid.
- **Inline italic/bold inside a paragraph.** Live italicises the article lede
  sentence with an inline element; the scrape only records whole-block
  `bold`, so that sentence renders upright. (The pull-quotes themselves now
  match live exactly: italic Inter 16px/1.8 in #999, indented 22px.)
- **`/etikk-og-ansvar`** lays its four cards out in a ~860px column
  (x=340..1200) on live; we use the full 1240px band there.
- **Product pages use the full band.** Live's product body column is 1200px
  (x=120..1320) against our 1240px — a 20px difference each side.
- **Tablet gutters.** Live's page gutter is ~20–30px between 768px and
  1024px; ours steps straight to 50px at the `md` breakpoint.
- **Footer address block.** Live sets those three lines at 18px/14.4px
  line-height; we use 18px with `leading-2`, which reproduces live's 36px
  row pitch but not the computed line-height.
- **Footer copyright year.** `components/Footer.tsx` is a statically
  prerendered server component, so `new Date().getFullYear()` would freeze at
  the build year forever. `components/CurrentYear.tsx` renders that same
  build year on the server (so the client's first render matches, with no
  hydration warning), then corrects it to the real year in a `useEffect` once
  mounted — the same client-side mechanism live's own footer uses (see the
  spec's "Footer year" note).
- **Two mobile headings are deliberately smaller than live.** Live keeps
  `/anlegg`'s "Nøkkelfunksjoner" and `/industri`'s "Industriell pålitelighet"
  at 50px on a 390px screen, where they break mid-word ("Nøkkelfunksjone /
  r" in `docs/reference/anlegg.mobile.jpg`); ours uses the 32px mobile
  section size every other heading on the site uses.
- **Product tables scroll inside their own box on mobile.** `SpecTable` keeps
  a `min-w-[560px]` table inside `overflow-x-auto`, so a wide table scrolls
  sideways within the page rather than reflowing; live's widget ships its own
  responsive mobile table instead.
- Two things in the reference screenshots are capture artefacts, not
  differences: the FAQ rows on `/anlegg` are open (the scraper expanded them
  before shooting), and the stat counters animate, so any screenshot taken
  mid-count shows different numbers. Some `*.mobile.jpg` references also end
  in a blank strip, which is a capture artefact too.
- **Checked and not a difference:** all six `/anlegg` and `/industri` key-
  feature badges are brand red on live today (70×70, 10px radius, white
  glyph) — an earlier note about a cream badge on "Økt sikkerhet" does not
  hold against the live page.
- **Checked and not a difference: `/404` (and any unknown path) has no
  footer, same as live.** Every real page route lives under `app/(site)/`,
  whose own layout renders the footer; `app/not-found.tsx` sits outside that
  group at the app root, so it (and every unmatched URL) renders through
  `app/layout.tsx` alone — header and content, no footer — matching live's
  own Framer 404 template.

---

## Typography, colour and layout (Task 11)

Everything in `app/globals.css`'s `@theme` was measured on the live site
rather than guessed. `scripts/measure.mjs` dumps the computed family, weight,
size, line-height and colour of every visible text element on a set of
routes; `docs/measure.txt` is its committed output for `/`, `/om-oss`,
`/anlegg`, `/produkter/fett`, `/artikler/nytt-eierskap` and `/kontakt-oss` at
1440px. `node scripts/measure.mjs --local` runs the same pass against
`http://localhost:3000`, which is how local and live were diffed element by
element.

- **Fonts.** Figtree for headings, leads and the industry strip; Inter
  (`font-ui`) for card titles, body copy, footer links, article text and
  table cells; **Satoshi is kept** — live really does render the stats band
  in it (digits Satoshi 700 64px `#eaecf0`, labels Satoshi 500 18px/28px
  `#d9d9d9`), and nothing else on the site uses it.
- **Type scale.** Role-named tokens (`text-section`, `text-card`,
  `text-label`, `text-sub`, `text-lead`, `text-body`, `text-cell`,
  `text-eyebrow`, `text-meta`, `text-stat`), each with a `-lg` variant
  holding the ≥768px value. Framer's line-height ratios: 1.2 display,
  1.25 section heading, 1.3 sub-heading, 1.4 card title, 1.6 card heading,
  1.9 body copy.
- **Colours.** `brand #c11e31`, `brand-soft #ffb6c1` (copy on the red tiles),
  `surface #f5f2ef`, `surface-cool #ebeef5`, `ink-muted #444` (all body
  copy), `ink-faint #919191`, `ink-quote #999`, `line #e0e0e0`,
  `table-head #f7f7f8`, `table-ink #111`, `stat-digit #eaecf0`,
  `stat-label #d9d9d9`. Headings are pure black, as live. No raw hex is left
  outside `@theme`.
- **Buttons have no hover colour.** Live fades the button to `opacity: .5`
  rather than darkening the red, so `--color-brand-hover` is gone and every
  button uses `hover:opacity-50`, with live's 10px radius and 20/30px
  padding.
- **Container.** The content band is 1240px (`--container-site`) with 50px
  desktop / 20px mobile gutters; `/anlegg`, `/industri`, `/om-oss` and
  `/produkter` lay their body sections out in live's narrower 960px column
  (`--container-narrow`, `<Container narrow>`), the same width the article
  pages read in.
- **Hero heights** are measured minimums: 318/534 on inner pages,
  438/479 on product and article pages, 656/580 on the home page (mobile
  first, then ≥768px), so a hero with a long wrapping subtitle grows the way
  `/anlegg`'s does.
- **Two tone swaps worth knowing:** the home page's form card is cream with
  white fields (the inverse of `/kontakt-oss`, which puts cream fields on a
  white section), and home's "Se utvalget" button only exists from `md` up,
  because live's 390px layout has no such anchor at all.

---

## Logos

The live site uses a single logo file in both header and footer:

- **Location in scraped JSON:** `docs/scrape/home.json`, one `image` block with `role: "logo"`
- **Header logo:** `/images/home/00-d1c05434.png`, 216×64 px, red ELBA wordmark
- **Footer logo:** `/images/home/00-d1c05434.png`, 216×64 px, red ELBA wordmark (same file)
- **Visual confirmation:** header top-left and footer bottom-left of `docs/reference/home.desktop.jpg`
- **Notes:** the pages render these scraped logo files (what the live site shows). The official Drive SVG logo (`public/logos/elba-logo.svg`) is kept for print/brand use.

## Contact form

Real send verified 2026-09-19 on the Vercel preview (see "Still needs you or
Hlynur" #1). Validation errors, the honeypot rejection and the friendly failure
message (env vars missing) were verified against the dev server earlier; see
`.superpowers/sdd/2026-09-13-elba-website-recreation/task-5-report.md`.

## Content pages (Task 7)

- **`/anlegg` FAQ answer patch:** `docs/scrape/anlegg.json`'s "Hvordan fungerer det?" accordion pass captured answers for Q1 and Q3 but missed Q2 ("Hvor driftssikkert er systemet?"). Recovered via a one-off Playwright script (goto `https://www.elba.no/anlegg`, click the question, read the row's revealed text) and inserted as a `text` block right after the question heading in the scrape JSON. Exact recovered text: "Systemene er dimensjonert for krevende miljøer og kontinuerlig drift. Komponentene er robuste og tilpasset nordiske forhold. Elektronisk overvåking kan integreres for varsling ved avvik." Full script and transcript are in the Task 7 report.
- **`/anlegg` block 23 misidentified, then corrected:** `docs/scrape/anlegg.json` block 23 (`local: "/images/anlegg/07-74a78715.jpg"`) has the generic stock-photo alt "Interior work", which reads like the FAQ section's second collage photo (mirroring `/industri`'s identically-alt'd pair) — but the actual file is the tablet+phone software-mockup graphic shown under "Digital overvåking" on the live page. Rendered accordingly: the FAQ section shows only image06 (no inset collage), and image07 is the left-column image of the "Digital overvåking" section. `/industri`'s equivalent pair (blocks 16/17, "Interior work"/"Bedroom work") *are* two real photos and *are* rendered as a main+inset collage (`components/PhotoCollage.tsx`) — don't assume the alt text is reliable without opening the file.
- **`Faq` component restyled:** `components/Faq.tsx` was built in Task 6 speculatively (single seamless card, divide-y rows, "+"-icon on the left) but had no live consumer yet. `/anlegg` is its first real usage, and `docs/reference/anlegg.desktop.jpg` shows each question as its own separate rounded white card with a right-aligned chevron — so the component was restyled to match (still one row per `<FaqRow>`, same accordion/DOM contract `scripts/lib/accordion.mjs` needs).
- **`components/artikler/ArticleCard.tsx` redesigned:** switched from the horizontal image-left/text-right card (tuned for the home page's narrow sidebar list) to a vertical image-top/cream-footer grid card, matching `/artikler`'s own reference screenshots. Home's `components/home/ArticlesSection.tsx` still imports this same component and now renders the new vertical shape inside its sidebar column instead of the old horizontal one — visually different from Task 6's original build, but text content is unchanged (home's own `npm run verify -- /` still passes).
- **`/produkter` "Vi leverer" pills:** no icons. `docs/reference/produkter.desktop.jpg` shows plain white rounded-full pills (heading text only), and `docs/scrape/inline-svg.json`'s `/produkter` entry has no per-item icon set — matches the brief's fallback instruction.
- **`/produkter` U+200B:** the live `Skottgjennomføring`/`Lynfittings` product links carry a leading zero-width space (U+200B) in both their link text and their `href` slug. Stripped in `app/(site)/produkter/page.tsx`'s data (clean text, clean `/produkter/<slug>` hrefs matching `lib/routes.ts`), and `scripts/verify.mjs`'s `norm()` now also strips U+200B before comparing live vs. local text so the two sides read as equal.
- **`/produkter` card order:** `components/produkter/ProductLinkList.tsx` renders the eleven product cards as a CSS `columns-3` masonry (to match each card's own image aspect ratio, unlike a row-locked CSS grid). The live page's three visible screenshot rows are actually a column-major read of the same DOM order (col 1 = items 1-4, col 2 = items 5-8, col 3 = items 9-11); a plain `columns-3` container reproduces that shape but its browser height-balancing heuristic doesn't always assign the exact same item to the exact same column as the live page. All eleven cards are present and in scrape order in the DOM either way — this is a minor, cosmetic per-column assignment difference only.
- **Shared components added/changed:** `components/ServiceCards.tsx` (service-card grid, shared by home + `/tjenester`), `components/FeatureTileGrid.tsx` + `components/PhotoCollage.tsx` + `components/TextureDivider.tsx` + `components/CheckList.tsx` + `components/IconCardGrid.tsx` (shared by `/anlegg` + `/industri`), `components/icons.tsx` (hand-drawn glyphs not present in the scrape, same rationale as `components/home/AdvisorySection.tsx`'s `CalendarIcon`/`ClockIcon`).

## Product pages (Task 9)

- **Live table widget not reproduced:** the Framer "Table" widget's own chrome (its `Search...` box, `Previous`/`Page X of Y`/`Next` pager, CSV export) isn't rendered — `SpecTable` just lists every row of `docs/scrape/tables.json`'s already-hydrated data instead, which is why `scripts/verify.mjs` carries a dedicated `WIDGET_CHROME` ignore list for every `/produkter/*` route. The sub-navigation pill labels (`Product.subnav`, e.g. rørender's "Rørender rette/90 grader/45 grader") are static text on the live site too, not links — `components/produkter/SubnavLabels.tsx` renders them as plain `<span>` pills, not `<Link>`s.
- **Table-to-heading pairing is by document order, not by heading text:** four routes (fett, fylleutstyr, banjokoblinger, slanger) have tables with no heading at all. `scripts/gen-produkter.mjs` pairs the k-th contiguous run of table-cell text in a product's `blocks` to the k-th entry in that route's `tables.json` list, purely by position, and throws if the counts don't match. Table text-runs are recognised by membership in that route's set of `tables.json` header/cell strings (trimmed) — a non-member text block mid-run (the widget's own "Page X of Y" pager, or an occasional cell whose whitespace doesn't exactly match, e.g. fett's `"-30  til 150"` double space) is discarded since the run's real data always comes from `tables.json`; a non-member text block *outside* a run is kept as `Product.intro` (only fylleutstyr has one — a caption between its first group's images and its first table: "Fyllepresse til sentralsmøreanlegg for fettpatron iht. DIN 1284").
- **Images per table are not capped at two:** skruhylser's first group has 3 (a diagram + two product photos) and fylleutstyr's has 4 (two diagram+photo pairs). A live image-count probe confirmed the live page really does render all of them, and the generated `lib/produkter.ts`'s per-table image counts match the live unique-image count exactly on every route checked (skruhylser 9/9, fylleutstyr 7/7, fett 3/3, rørender 14/14). `ProductTables` renders a single image full-width (no card, matching fett's product photo), and two-or-more in a two-column grid wrapping as needed, each on a light `surface-cool` card — the scrape doesn't distinguish "diagram" from "photo" blocks, so both get the same card treatment; live only puts the card behind photos, so a diagram (already a white-background PNG) sits inside a faint extra border.
- **Nine routes have sub-navigation, not eight:** all eleven product routes except `fett` and `skruhylser` carry `href: null` label links in the scrape (banjokoblinger, forlengere, fyllenippler, fylleutstyr, lynfittings, rørender, skottgjennomføring, slanger, snittringmatur).

## Articles (Task 10)

- **`— Skralli` → `— Elba` in every `<title>`:** all five `docs/scrape/artikler__*.json` carry the live page's real `<title>`, which ends in `— Skralli` (Skralli is Elba's Icelandic co-owner's own company, and elba.no's Framer site was seemingly cloned from skralli.is without updating this one string). `scripts/gen-artikler.mjs` rewrites it to `— Elba`; `tests/artikler.test.ts` locks this in. The body copy itself does say "Skralli" where it's actually about the acquisition (nytt-eierskap) — that's real content, left untouched.
- **No visible publish date:** none of the five live article pages show a date — Framer's own `<time>` element renders empty on all of them, and no scrape block anywhere matches a date pattern. `Article.date` is typed `date?: string` but the generator never sets it and no template renders a date line.
- **Two H1s, kept:** every article's DOM has a second `<h1>` right after the breadcrumb (`Article.subtitle`) — on nytt-design it's verbatim identical to the title H1; on the other four it's a distinct sentence. Rendered either way (as its own `<h1>`, matching live).
- **Body reading column is narrower than the standard `Container`:** measured against `docs/reference/artikler__nytt-eierskap.desktop.jpg` and `artikler__velge-system.desktop.jpg` at 1440px — both start their breadcrumb and body text at x≈241px, i.e. a 960px column centered inside the 1240px content band. `app/(site)/artikler/[slug]/page.tsx` wraps breadcrumb + body in `mx-auto max-w-[var(--container-narrow)]` (960px) to match.
- **nytt-eierskap's scrape glues three pull-quotes' closing quote mark directly onto their attribution** with no space (e.g. `…selskapene."sier Villi…`) — confirmed against a fresh live capture that the real page has a space there. `scripts/gen-artikler.mjs`'s `splitGluedQuote()` fixes this; one of the three instead glues on a "- Ronny, daglig leder" byline, which live renders as its own line, so that one splits into two `text` blocks instead of just gaining a space.
- **Bullet lists and whole-block bold come from `npm run scrape-formatting`:** `nytt-design` (list=4, bold=1), `passiv-og-aktiv-overvaaking` (list=14, bold=1), `hvorfor-smoresystem-industri` (list=15, bold=0) and `velge-system` (list=31, bold=8) carry real annotations; `nytt-eierskap` has none (no `<ul>`/`<strong>` on live at all). Re-running `scrape-formatting` after any `scrape` re-run is required — a `scrape.mjs` re-run regenerates the article JSON and drops the annotations.
- **Residual gap: inline (mid-sentence) bold and italic.** `scrape-formatting.mjs` only annotates a text block `bold: true` when the *entire* block's text matches a live `<strong>`/`<b>`; a `<strong>` around part of a sentence stays plain, since `ArticleBlock.text.bold` is a whole-block boolean, not inline spans. The same limit is why live's italic lede sentence renders upright here. Pull-quotes, which *are* whole blocks, now carry live's italic grey treatment (Task 11).

---

## Done

Tasks 1-11 are dated 2026-09-13.

| Task | Date | What landed |
| --- | --- | --- |
| 1 | 2026-09-13 | Bootstrapped from the kode-is/skralli template on branch `site-recreation`, stripped the Icelandic content and rebranded the scaffold; spec and implementation plan committed. |
| 2 | 2026-09-13 | Scrape pipeline: page text/blocks/nav JSON, images, the hero video, the PDF, hydrated tables, inline SVGs, mobile-only text and the reference screenshots for all 26 routes, plus `scripts/verify.mjs`. |
| 3 | 2026-09-13 | Elba logos, favicon set and brand cheatsheet pulled from Drive into `public/logos/` and `app/`. |
| 4 | 2026-09-13 | Site data (`lib/site.ts`), Header with the Tjenester panel, mobile menu, Footer, ContactCta and the 404 page. |
| 5 | 2026-09-13 | Contact form in Norwegian with Resend, server action, honeypot and validation (TDD), and `/kontakt-oss`. |
| 6 | 2026-09-13 | Home page: video hero, industry strip, steps, services, advisory, mini form, stats and the articles list. |
| 7 | 2026-09-13 | Content pages — `/tjenester`, `/anlegg`, `/industri`, `/etikk-og-ansvar` and the `/produkter` and `/artikler` indexes. |
| 8 | 2026-09-13 | `/om-oss`: story collages, values, stat counters and the team grid. |
| 9 | 2026-09-13 | Products — `scripts/gen-produkter.mjs`, `lib/produkter.ts`, the `/produkter/[slug]` template, `SpecTable`/`ProductTables` and the U+200B redirects. |
| 10 | 2026-09-13 | Articles — `scripts/gen-artikler.mjs`, `lib/artikler.ts`, the `/artikler/[slug]` template and the home/index cards. |
| 11 | 2026-09-13 | Typography, colour and container measured off live (`scripts/measure.mjs`, `docs/measure.txt`) and applied; metadata finished for all 26 routes; full verification (lint, tsc, 31 tests, build, `npm run verify` 26/26 `missing=0`); screenshot pass against the reference at 1440 and 390; this handover. |
| 12 | 2026-09-18 | Produkter as its own nav item and home section, the cross-catalog search on `/produkter` (`lib/catalog.ts`, 18 tests), and the skralli-v2 breadcrumb band — approved deviations 6-8; lint, tsc, 50 tests, build and `npm run verify` 26/26 all pass. |
| 13 | 2026-09-19 | Site-wide search palette in the header, after kode-is/totus (`components/SearchPalette.tsx`, `lib/search.ts`, `/search-index.json`, 14 tests) — approved deviation 9; lint, tsc, 64 tests, build and `npm run verify` 26/26 all pass. |
| 14 | 2026-09-20 | Service cards back to live's size, tablet-width layout fixes (article cards, stats band, advisory row, /om-oss overhang), dot separators matched to live's measured values; `www.elba.no` + `elba.no` added to the Vercel project. |
