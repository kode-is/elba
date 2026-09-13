// TypeScript mirror of scripts/routes.mjs's ROUTES array, so app/sitemap.ts
// (which runs through the Next.js/TypeScript build, not plain Node) can
// import it directly. Keep this list identical to scripts/routes.mjs —
// tests/routes.test.ts asserts the two arrays are equal.
export const ROUTES = [
  "/", "/om-oss", "/tjenester", "/anlegg", "/industri", "/etikk-og-ansvar", "/kontakt-oss",
  "/produkter",
  "/produkter/rørender", "/produkter/forlengere", "/produkter/fylleutstyr", "/produkter/fyllenippler",
  "/produkter/skottgjennomføring", "/produkter/snittringmatur", "/produkter/banjokoblinger",
  "/produkter/lynfittings", "/produkter/slanger", "/produkter/fett", "/produkter/skruhylser",
  "/artikler",
  "/artikler/nytt-design", "/artikler/nytt-eierskap", "/artikler/passiv-og-aktiv-overvaaking",
  "/artikler/hvorfor-smoresystem-industri", "/artikler/velge-system",
  "/404",
];

export const PRODUKT_SLUGS = ROUTES.filter((r) => r.startsWith("/produkter/")).map((r) => r.slice("/produkter/".length));
export const ARTIKKEL_SLUGS = ROUTES.filter((r) => r.startsWith("/artikler/")).map((r) => r.slice("/artikler/".length));
