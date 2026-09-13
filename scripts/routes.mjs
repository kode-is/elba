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
export const LIVE = "https://www.elba.no";
// Two live product URLs carry a leading zero-width space (U+200B). The
// scraper must fetch those exact URLs; the new site serves the clean slug
// and redirects the U+200B form (see app/produkter/[slug]/page.tsx).
export const LIVE_PATH_OVERRIDES = {
  "/produkter/skottgjennomføring": "/produkter/​skottgjennomføring",
  "/produkter/lynfittings": "/produkter/​lynfittings",
};
export const livePath = (route) => LIVE_PATH_OVERRIDES[route] ?? route;
export const routeToFile = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "__"));
