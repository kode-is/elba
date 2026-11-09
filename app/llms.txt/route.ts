import { artikler } from "@/lib/artikler";
import { produkter } from "@/lib/produkter";
import { ARTICLE_DESCRIPTIONS, PAGE_META } from "@/lib/seo-meta";
import { positioning, servicesMenu, site, yearsInBusiness } from "@/lib/site";
import { stats } from "@/lib/stats";

// /llms.txt (https://llmstxt.org): a plain-text summary of who ELBA is and
// what each page covers, for AI assistants and answer engines. Built from the
// same data as the pages and their search metadata, so it can't drift from
// them. Prerendered to a static file at build time.
export const dynamic = "force-static";

const SITE_URL = "https://www.elba.no";

/** The service pages in the header's "Tjenester" menu — a new one shows up here by itself. */
const SERVICE_PATHS = servicesMenu.columns.flat().map((l) => l.href as keyof typeof PAGE_META);

const stat = (label: string) => {
  const s = stats.find((x) => x.label === label);
  return s ? `${Number(s.value).toLocaleString("nb-NO")}${s.suffix}` : "";
};

const link = (path: string, title: string, description: string) =>
  `- [${title}](${SITE_URL}${encodeURI(path)}): ${description}`;

const stripBrand = (title: string) => title.replace(/\s*[|—]\s*ELBA$/, "");

export function GET() {
  const services = SERVICE_PATHS.map((p) => link(p, stripBrand(PAGE_META[p].title), PAGE_META[p].description));
  const products = produkter.map((p) => `[${p.title}](${SITE_URL}${encodeURI(`/produkter/${p.id}`)})`).join(", ");
  const articles = artikler.map((a) =>
    link(`/artikler/${a.id}`, stripBrand(a.metaTitle), ARTICLE_DESCRIPTIONS[a.id] ?? a.metaDescription),
  );

  const body = `# ELBA

> ${positioning}. ELBA har spesialisert seg på sentralsmøring siden 1991 og leverer, monterer og servicerer sentralsmøreanlegg, automatiske smøresystemer og smøreutstyr til anleggsmaskiner og industri i hele Norge, fra Vestfossen.
>
> ELBA is one of Norway's largest and most experienced suppliers of lubrication solutions. Specialised in central (automatic) lubrication since 1991, ELBA supplies, installs and services central lubrication systems and lubrication equipment for construction machinery and industry throughout Norway, from Vestfossen.

## Fakta / Key facts

- Juridisk navn / Legal name: ELBA AS
- Organisasjonsnummer / Company number: ${site.orgNumber} (Enhetsregisteret, Brønnøysund)
- Etablert / Founded: 2 January 1991 – ${yearsInBusiness} years in lubrication
- Adresse / Address: ${site.address}, Norway
- Telefon / Phone: +47 ${site.phone}
- E-post / Email: ${site.email}
- Nettside / Website: ${SITE_URL}
- ${stat("Montasjer i året")} montasjer i året / installations per year
- ${stat("Artikler på lager")} artikler på lager / items in stock
- ${stat("Fornøyde kunder")} fornøyde kunder / customers
- Område / Area served: hele Norge / all of Norway
- Bransjer / Industries: anlegg, landbruk, sagbruk, offshore, papir og cellulose, metall, maritim, jernbane, gjenvinning (construction, agriculture, sawmills, offshore, pulp and paper, metal, maritime, railway, recycling)

## Tjenester / Services

${services.join("\n")}
${link("/tjenester", "Alle tjenester", PAGE_META["/tjenester"].description)}

## Produkter / Products

${link("/produkter", "Produktkatalog", PAGE_META["/produkter"].description)}
- Kategorier / Categories: ${products}

## Fagartikler / Articles

${articles.join("\n")}

## Om ELBA / About

${link("/om-oss", "Om ELBA", PAGE_META["/om-oss"].description)}
${link("/kontakt-oss", "Kontakt", PAGE_META["/kontakt-oss"].description)}
${link("/etikk-og-ansvar", "Etikk og ansvar", PAGE_META["/etikk-og-ansvar"].description)}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
