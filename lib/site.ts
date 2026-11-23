// Site-wide constants, scraped verbatim from elba.no (docs/scrape/home.json's
// `nav` and `footer` blocks) — see tests/nav.test.ts. One approved deviation:
// "Produkter" is its own nav item (and footer link) instead of a third entry
// under Tjenester — products are not a service
// (docs/superpowers/specs/2026-09-18-produkter-catalog-search-design.md).

export const site = {
  name: "ELBA",
  address: "Fabrikkgata 11D, 3320 Vestfossen",
  phone: "32 25 20 30",
  phoneHref: "tel:+4732252030",
  email: "elba@elba.no",
  // Enhetsregisteret (data.brreg.no): ELBA AS, Fabrikkgata 11D, 3320
  // Vestfossen — the same address as `address` above.
  orgNumber: "859 772 382",
  copyright: "ELBA AS",
  // Enhetsregisteret's stiftelsesdato for org.nr. 859 772 382.
  founded: "1991-01-02",
} as const;

/**
 * Whole years since ELBA was founded, worked out when the page is built — so
 * "35 års erfaring" moves on by itself with the next deploy after each
 * 2 January instead of going stale in the copy.
 */
export const yearsInBusiness = (() => {
  const founded = new Date(site.founded);
  const now = new Date();
  const passedAnniversary =
    now.getMonth() > founded.getMonth() ||
    (now.getMonth() === founded.getMonth() && now.getDate() >= founded.getDate());
  return now.getFullYear() - founded.getFullYear() - (passedAnniversary ? 0 : 1);
})();

/**
 * ELBA's own positioning line — approved by ELBA on 2026-11-09. Shown on
 * the home page and /om-oss and repeated in the search metadata, JSON-LD and
 * /llms.txt so Google and AI assistants read the same claim everywhere.
 */
export const positioning = "ELBA er en av Norges største og mest erfarne leverandører av smøreløsninger";

export const nav = [
  { text: "Hjem", href: "/" },
  { text: "Om oss", href: "/om-oss" },
  { text: "Artikler", href: "/artikler" },
  { text: "Tjenester", href: "/tjenester" },
  { text: "Produkter", href: "/produkter" },
] as const;

export const navCta = { text: "Kontakt oss", href: "/kontakt-oss" } as const;

// Desktop hover panel under the "Tjenester" nav item (Header.tsx /
// ServicesMenu.tsx).
export const servicesMenu = {
  heading: "Tjenester",
  description: "Utforsk løsninger tilpasset din bransje og bruk",
  columns: [
    [
      { text: "Anlegg", href: "/anlegg" },
      { text: "Industri", href: "/industri" },
      // Protega Solutions fire suppression — new service, not on live.
      { text: "Brannslukking", href: "/brannslukking" },
    ],
  ],
} as const;

export const footerColumns = [
  {
    heading: "Selskapet",
    links: [
      { text: "Hjem", href: "/" },
      { text: "Om oss", href: "/om-oss" },
      { text: "Artikler", href: "/artikler" }, // live links this to /kontakt-oss; approved fix
      { text: "Tjenester", href: "/tjenester" },
      { text: "Produkter", href: "/produkter" },
      { text: "Etikk og ansvar", href: "/etikk-og-ansvar" },
    ],
  },
] as const;
