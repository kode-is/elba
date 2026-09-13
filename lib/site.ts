// Site-wide constants. Placeholder values for now — Task 4 replaces every
// string with ones scraped verbatim from elba.no.

export const site = {
  name: "ELBA",
  address: "Fabrikkgata 11D, 3320 Vestfossen",
  phone: "32 25 20 30",
  phoneHref: "tel:+4732252030",
  email: "elba@elba.no",
  copyright: "Elba AS",
} as const;

export const nav = [
  { text: "Hjem", href: "/" },
  { text: "Om oss", href: "/om-oss" },
  { text: "Artikler", href: "/artikler" },
  { text: "Tjenester", href: "/tjenester" },
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
      { text: "Produkter", href: "/produkter" },
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
      { text: "Etikk og ansvar", href: "/etikk-og-ansvar" },
    ],
  },
] as const;
