# elba.no rebuild — handover log

## Logos

The live site uses a single logo file in both header and footer:
- **Location in scraped JSON:** `docs/scrape/home.json`, one `image` block with `role: "logo"`
- **Header logo:** `/images/home/00-d1c05434.png`, 216×64 px, red ELBA wordmark
- **Footer logo:** `/images/home/00-d1c05434.png`, 216×64 px, red ELBA wordmark (same file)
- **Visual confirmation:** Verified in `docs/reference/home.desktop.jpg` header top-left and footer bottom-left
- **Notes:** Task 4 will render these scraped logo files (what the live site shows). The official Drive SVG logo (`public/logos/elba-logo.svg`) is kept for print/brand use.

## Contact form

Real send pending `RESEND_API_KEY` / `EMAIL_FROM` / `CONTACT_TO` — no `.env.local` exists on this machine, so a real Resend send to elba@elba.no was not exercised. Validation errors, the honeypot rejection, and the friendly failure message (env vars missing) were all verified against the dev server instead; see `.superpowers/sdd/2026-09-13-elba-website-recreation/task-5-report.md` for the observed output.
