import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { ScalesIcon, MegaphoneIcon, LeafIcon, HandshakeIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/seo";
import type { ReactNode } from "react";

export const metadata = pageMetadata({
  title: "ELBA - I INDUSTRIENS TJENESTE",
  description:
    "ELBA - Din partner innen smøreteknikk i Norge. Fra den minste minigraver til Norges største produksjonsanlegg er vi klare til å møte utfordringen med deg.",
  path: "/etikk-og-ansvar",
});

// docs/scrape/etikk-og-ansvar.json blocks 4-13. The icons aren't in the
// scrape (see components/icons.tsx); block 5's paragraph text ends with the
// PDF link's own "Last ned" (the scraper folded the inline anchor into the
// surrounding paragraph's innerText) — stripped here and rendered once,
// below, as the real link built from block 6's `asset` block (block 7's
// duplicate framerusercontent link is skipped per the task brief).
const CARDS: { icon: ReactNode; heading: string; text: string }[] = [
  {
    icon: <ScalesIcon className="h-7 w-7" />,
    heading: "Etiske retningslinjer",
    text: "Vi har vedtatt etiske retningslinjer som gjelder for alle ansatte og representanter for ELBA. Retningslinjene er basert på FNs Global Compact og ILOs kjernekonvensjoner, og dekker menneskerettigheter, arbeidsforhold, miljø og anti-korrupsjon.",
  },
  {
    icon: <MegaphoneIcon className="h-7 w-7" />,
    heading: "Varsling",
    text: "Ansatte og eksterne — kunder, leverandører og samarbeidspartnere — kan varsle om mistanke om korrupsjon, uetisk adferd eller lovbrudd. Varsler behandles konfidensielt. Kontakt: varsling@elba.no",
  },
  {
    icon: <LeafIcon className="h-7 w-7" />,
    heading: "Miljø",
    text: "Vi overholder gjeldende miljølovgivning og tar miljøhensyn i innkjøp og daglig drift. Vi arbeider løpende for å redusere vår miljøpåvirkning.",
  },
  {
    icon: <HandshakeIcon className="h-7 w-7" />,
    heading: "Leverandørkrav",
    text: "Vi forventer at våre leverandører og samarbeidspartnere respekterer menneskerettigheter, ivaretar anstendig arbeid og opptrer etisk i hele verdikjeden.",
  },
];

export default function EtikkOgAnsvar() {
  return (
    <main id="main">
      <PageHero
        image={{
          src: "/images/etikk-og-ansvar/01-799b1404.jpg",
          alt: "",
          width: 1440,
          height: 807,
        }}
        title="Etikk og ansvar"
      />
      <Container>
        <div className="py-12 md:py-16">
          <Breadcrumb items={[{ text: "Etikk og ansvar" }]} />

          <div className="mt-10 divide-y divide-neutral-200 md:mt-14">
            {CARDS.map((card) => (
              <div key={card.heading} className="flex gap-5 py-8 first:pt-0 last:pb-0">
                <span
                  aria-hidden="true"
                  className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl bg-brand text-white"
                >
                  {card.icon}
                </span>
                <div>
                  <h4 className="font-ui text-lg font-semibold text-neutral-900">{card.heading}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-base">
                    {card.text}
                    {card.heading === "Etiske retningslinjer" ? (
                      <>
                        {" "}
                        <a
                          href="/docs/77tNNLfbWmUiQnPLVWnCArstbbo.pdf"
                          target="_blank"
                          rel="noopener"
                          className="font-semibold text-brand underline underline-offset-2"
                        >
                          Last ned
                        </a>
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
      <ContactCta />
    </main>
  );
}
