// Shared per-page <head> boilerplate: canonical link, Open Graph, Twitter
// card and the robots meta tag, all derived from a page's own title,
// description and path.
import type { Metadata } from "next";
import { positioning, site } from "@/lib/site";

const SITE_URL = "https://www.elba.no";

// Home hero still (docs/scrape/home.json block 2 — the poster used by
// components/home/Hero.tsx's <video>).
const OG_IMAGE = {
  url: "/images/home/01-a13ec070.png",
  width: 1440,
  height: 808,
  alt: "ELBA – sentralsmøring for anlegg og industri",
};

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "ELBA",
      locale: "nb_NO",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    robots: {
      "max-image-preview": "large",
    },
  };
}

// Site-wide structured data (schema.org JSON-LD), rendered once in
// app/layout.tsx. It ties www.elba.no to the registered company (legal name ELBA AS,
// Enhetsregisteret 859 772 382, founded 1991-01-02) so Google's Knowledge
// Graph and AI assistants can tell this ELBA apart from the island, the
// appliance brand and others — and know what it does and where.
const ORG_ID = `${SITE_URL}/#organization`;

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": ORG_ID,
      name: "ELBA",
      legalName: "ELBA AS",
      alternateName: "Elba",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/web-app-manifest-512x512.png`,
      image: `${SITE_URL}${OG_IMAGE.url}`,
      slogan: "I industriens tjeneste",
      description: `${positioning}, med sentralsmøring som spesialfelt siden 1991. ELBA leverer, monterer og servicerer sentralsmøreanlegg, smøresystemer og smøreutstyr til anleggsmaskiner og industri i hele Norge – over 200 montasjer i året og over 11 000 artikler på lager.`,
      foundingDate: site.founded,
      taxID: "859772382",
      vatID: "NO859772382MVA",
      identifier: {
        "@type": "PropertyValue",
        propertyID: "Organisasjonsnummer (Enhetsregisteret)",
        value: "859772382",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Fabrikkgata 11D",
        postalCode: "3320",
        addressLocality: "Vestfossen",
        addressRegion: "Buskerud",
        addressCountry: "NO",
      },
      telephone: "+47 32 25 20 30",
      email: "elba@elba.no",
      areaServed: { "@type": "Country", name: "Norge" },
      knowsAbout: [
        "Sentralsmøring",
        "Sentralsmøreanlegg",
        "Automatiske smøresystemer",
        "Progressive smøresystemer",
        "Smøreteknikk",
        "Smøreutstyr",
        "Overvåking av smøreanlegg",
        "Smøring av anleggsmaskiner",
        "Industriell smøring",
        "Automatisk brannslukking for anleggsmaskiner og industri",
        "Protega Solutions brannslukkingsanlegg",
        "Central lubrication systems",
        "Automatic lubrication systems",
      ],
      sameAs: ["https://virksomhet.brreg.no/nb/oppslag/enheter/859772382"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "ELBA",
      inLanguage: "nb-NO",
      publisher: { "@id": ORG_ID },
    },
  ],
};

/** JSON.stringify for a <script type="application/ld+json">, with `<` escaped (see Next's JSON-LD guide). */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
