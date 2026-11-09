// Search titles and descriptions — one per page, each naming what the page is
// about, so Google and AI search can tell the pages (and ELBA) apart.
//
// Live's Framer pages all shared the slogan "ELBA - I INDUSTRIENS TJENESTE"
// as title and one generic description, which left every page competing for
// nothing. The generated data in lib/produkter.ts and lib/artikler.ts still
// carries those scraped values; the overrides here win over them.
//
// Facts used (keep them true): founded 1991-01-02 per Enhetsregisteret
// (org.nr. 859 772 382); the round figures are lib/stats.ts; the positioning
// line is ELBA's own (lib/site.ts). Name the company "ELBA" — "ELBA AS" only
// where the full legal name is the point (JSON-LD legalName, /llms.txt facts).

import { positioning, yearsInBusiness } from "@/lib/site";

export type PageMeta = { title: string; description: string; path: string };

export const PAGE_META = {
  "/": {
    title: "ELBA – sentralsmøring og smøresystemer for anlegg og industri",
    description:
      "ELBA – en av Norges største og mest erfarne leverandører av smøreløsninger – leverer, monterer og servicerer sentralsmøreanlegg til anlegg og industri siden 1991. Egne montører og fast pris.",
    path: "/",
  },
  "/om-oss": {
    title: "Om ELBA – smøreteknikk i Norge siden 1991",
    description:
      `${positioning}. Fra Vestfossen har vi levert sentralsmøreanlegg til norsk anlegg og industri i ${yearsInBusiness} år – over 200 montasjer i året og mer enn 6 000 fornøyde kunder.`,
    path: "/om-oss",
  },
  "/tjenester": {
    title: "Tjenester – sentralsmøring for anlegg og industri | ELBA",
    description:
      "ELBA dimensjonerer, leverer, monterer og servicerer sentralsmøreanlegg for anleggsmaskiner og norsk industri – og automatisk brannslukking fra Protega. Send en forespørsel og få fast pris.",
    path: "/tjenester",
  },
  "/anlegg": {
    title: "Sentralsmøring til anleggsmaskiner | ELBA",
    description:
      "Sentralsmøreanlegg til gravemaskiner, hjullastere, dumpere og annet anleggsutstyr. Modelltilpasset for nye maskiner og ettermontering, med digital overvåking og komplette kit til forhandlere.",
    path: "/anlegg",
  },
  "/industri": {
    title: "Smøresystemer for industri – service og overvåking | ELBA",
    description:
      `Skreddersydde smøresystemer for norsk industri fra en partner med over ${yearsInBusiness} års erfaring: digital overvåking, service- og tilstandsrapporter og tilpassede serviceavtaler for høy oppetid.`,
    path: "/industri",
  },
  "/brannslukking": {
    title: "Automatisk brannslukking for maskiner – Protega | ELBA",
    description:
      "ELBA leverer og monterer automatisk brannslukking fra Protega Solutions for anleggsmaskiner, landbruk, gjenvinning, transport, maritim og industri. Helt mekanisk, uten strøm, døgnet rundt.",
    path: "/brannslukking",
  },
  "/etikk-og-ansvar": {
    title: "Etikk og ansvar | ELBA",
    description:
      "ELBAs etiske retningslinjer, varsling, miljø og leverandørkrav – basert på FNs Global Compact og ILOs kjernekonvensjoner.",
    path: "/etikk-og-ansvar",
  },
  "/kontakt-oss": {
    title: "Kontakt ELBA – sentralsmøring i Vestfossen",
    description:
      "Kontakt ELBA om sentralsmøreanlegg, smøreutstyr og service. Fabrikkgata 11D, 3320 Vestfossen · tlf. 32 25 20 30 · elba@elba.no. Få fast pris i dag.",
    path: "/kontakt-oss",
  },
  "/produkter": {
    title: "Smøreutstyr og deler til sentralsmøreanlegg | ELBA",
    description:
      "Søk i ELBAs katalog over smøreutstyr og deler til sentralsmøreanlegg: rørender, fyllenippler, lynfittings, slanger, banjokoblinger, fett og mer. Over 11 000 artikler på lager.",
    path: "/produkter",
  },
  "/artikler": {
    title: "Artikler om smøresystemer og sentralsmøring | ELBA",
    description:
      "Fagartikler fra ELBA om valg av smøresystem, overvåking av smøreanlegg og hvordan sentralsmøring sparer tid og penger i anlegg og industri.",
    path: "/artikler",
  },
  "/404": {
    title: "Fant ikke siden | ELBA",
    description: "Siden finnes ikke. Gå til forsiden for sentralsmøring, smøreutstyr og service fra ELBA.",
    path: "/404",
  },
} satisfies Record<string, PageMeta>;

/** Product category pages: title and description built from the category name. */
export function productMeta(id: string, title: string): PageMeta {
  return {
    title: `${title} – smøreutstyr | ELBA`,
    description: `${title} fra ELBA til sentralsmøreanlegg og smøresystemer. Se varianter og art.nr. i katalogen – over 11 000 artikler på lager, levert fra Vestfossen.`,
    path: `/produkter/${id}`,
  };
}

/** Article descriptions (titles stay the generated "… — ELBA"). */
export const ARTICLE_DESCRIPTIONS: Record<string, string> = {
  "nytt-design":
    "ELBA har lansert ny nettside med moderne design, bedre struktur og enklere navigasjon til produkter, tjenester og kontakt.",
  "nytt-eierskap":
    "Daglig leder Ronny Thoresen, med nær 30 år i Elba, har kjøpt selskapet sammen med islandske Skralli. Elba er en ledende aktør innen smøresystemer for anlegg og industri i Norge.",
  "passiv-og-aktiv-overvaaking":
    "Slik gir digital fjernovervåking og analoge sikkerhetsindikatorer på smøreanlegg høyere oppetid og lavere kostnader for driftsledere.",
  "hvorfor-smoresystem-industri":
    "Automatiske og sentraliserte smøresystemer reduserer nedetid, forlenger maskinenes levetid og frigjør arbeidstid i industrien. Slik sparer de penger.",
  "velge-system":
    "Enlinje, tolinje, progressivt eller flerlinje? En praktisk gjennomgang av de vanligste smøresystemene og når hvert av dem passer best.",
};
