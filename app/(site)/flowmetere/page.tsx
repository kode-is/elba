import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { TextureDivider } from "@/components/TextureDivider";
import { StepCard } from "@/components/StepCard";
import { ExperienceSection } from "@/components/anlegg/ExperienceSection";
import { Faq } from "@/components/Faq";
import { ContactCta } from "@/components/ContactCta";
import { BrandIcon } from "@/components/BrandIcon";
import { CheckIcon } from "@/components/icons";
import { FlowDemo } from "@/components/flowmetere/FlowDemo";
import { MeterTable } from "@/components/flowmetere/MeterTable";
import { ICONS } from "@/lib/brannslukking";
import { FAQ_ITEMS, INDUSTRIES, KYTOLA_NAME, MORE_PRODUCTS, PROCESS, PRODUCTS } from "@/lib/flowmetere";
import { pageMetadata } from "@/lib/seo";
import { PAGE_META } from "@/lib/seo-meta";

export const metadata = pageMetadata(PAGE_META["/flowmetere"]);

// The site's button: 10px radius, 20/30px padding, fades on hover.
const BUTTON = "inline-flex items-center justify-center rounded-[10px] px-[30px] py-5 text-[16px] leading-[1.2] font-semibold transition";

const INDUSTRY_ICONS = [ICONS.oil, ICONS.technical, ICONS.components];

export default function Flowmetere() {
  return (
    <main id="main">
      <PageHero
        image={{ src: "/images/flowmetere/papirmaskin.webp", alt: "", width: 1920, height: 1280 }}
        crumbs={[{ text: "Tjenester", href: "/tjenester" }, { text: "Flowmetere" }]}
        // Same height and layout as /brannslukking's: a subtitle and two buttons.
        height="min-h-[560px] md:min-h-[600px]"
        contentClassName="px-6 pt-20 text-center md:pt-16"
      >
        <h1 className="text-[36px] leading-[1.2] font-semibold text-white md:text-[70px]">Flowmetere</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lead text-white/85 md:text-lead-lg">
          Vit at oljen kommer frem – til hvert lager og hvert gir. Flowmetere og overvåking av oljesmøring fra{" "}
          {KYTOLA_NAME}, levert, montert og servicert av ELBA.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/kontakt-oss" className={`${BUTTON} bg-brand text-white hover:opacity-50`}>
            Be om tilbud
          </Link>
          <a href="#slik-maler-de" className={`${BUTTON} border border-white text-white hover:bg-white hover:text-brand`}>
            Slik måler de
          </a>
        </div>
      </PageHero>

      {/* The problem */}
      <Container narrow>
        <div className="pt-12 pb-6 md:pt-16">
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Pumpen går. Men får lageret olje?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lead text-ink-muted md:text-lead-lg">
            I et sirkulasjonsanlegg kan én tett sil eller en feilstilt ventil la et lager gå tørt mens resten av maskinen
            går som normalt. Et flowmeter på hvert smørepunkt viser at oljen faktisk kommer frem – og slår alarm før
            lageret tar skade. Ifølge Kytola kan én unngått lagerskade betale hele overvåkingssystemet.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {INDUSTRIES.map((industry, i) => (
              <li key={industry.heading} className="rounded-[20px] bg-surface p-8">
                <span className="flex h-[55px] w-[55px] items-center justify-center rounded-[10px] bg-brand">
                  <BrandIcon src={INDUSTRY_ICONS[i]} className="h-8 w-8 bg-white" />
                </span>
                <h3 className="mt-6 font-ui text-[22px] leading-[1.3] font-bold text-black">{industry.heading}</h3>
                <p className="mt-3 font-ui text-body text-ink-muted md:text-body-lg">{industry.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <TextureDivider src="/images/anlegg/05-463dd036.svg" />

      {/* How they measure */}
      <section id="slik-maler-de" className="scroll-mt-8 bg-surface py-14 md:py-20">
        <Container>
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">To måter å måle på</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lead text-ink-muted md:text-lead-lg">
            Kytola lager begge måleprinsippene for oljesmøring. Velg prinsipp og se hva som skjer ved kald oppstart og
            når en sil tetter seg.
          </p>
          <div className="mt-10">
            <FlowDemo />
          </div>
        </Container>
      </section>

      {/* VA or oval gear */}
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-16 md:py-20">
          <div>
            <h2 className="text-section font-semibold text-black md:text-section-lg">Variabelt areal eller ovalhjul?</h2>
            <p className="mt-4 text-lead text-ink-muted md:text-lead-lg">
              Variabelt areal er enkelt, rimelig og lett å lese av. Ovalhjul måler riktig uansett temperatur og kan tas
              ut til service uten å stoppe smøringen. Mange anlegg bruker begge – vi hjelper deg å velge per punkt.
            </p>
          </div>
          <MeterTable />
        </div>
      </Container>

      {/* The range */}
      <section className="bg-surface py-14 md:py-20">
        <Container>
          <h2 className="text-section font-semibold text-black md:text-section-lg">Sortimentet</h2>
          <p className="mt-4 max-w-3xl text-lead text-ink-muted md:text-lead-lg">
            Fra ett enkelt smørepunkt til en oljesentral med hundrevis av punkter. Utvalget under er det vi leverer
            mest av – vi skaffer hele {KYTOLA_NAME}-sortimentet.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <li key={p.name} className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-sm">
                <div className="flex h-[220px] items-center justify-center bg-surface-cool p-6">
                  <Image
                    src={p.image.src}
                    alt={p.image.alt}
                    width={p.image.width}
                    height={p.image.height}
                    sizes="240px"
                    className="h-full w-auto max-w-full object-contain"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-ui text-[13px] leading-[1.4] font-semibold tracking-wide text-brand uppercase">{p.kind}</p>
                  <h3 className="mt-1 font-ui text-card font-semibold text-black md:text-card-lg">{p.name}</h3>
                  <p className="mt-2 font-ui text-body text-ink-muted">{p.text}</p>
                  <ul className="mt-4 space-y-2">
                    {p.facts.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 font-ui text-[14px] leading-[1.5] text-black">
                        <CheckIcon className="mt-[3px] h-3.5 w-3.5 shrink-0 text-brand" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-12 font-ui text-[15px] font-semibold text-black">Også fra Kytola</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {MORE_PRODUCTS.map((m) => (
              <li key={m} className="rounded-full bg-white px-4 py-2 font-ui text-[14px] leading-[1.4] font-medium text-ink-muted">
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-ui text-[13px] leading-[1.6] text-ink-faint">
            KYTOLA® er et registrert varemerke for Kytola Instruments Oy, Finland. Produktbilder: {KYTOLA_NAME}.
          </p>
        </Container>
      </section>

      {/* How ELBA works */}
      <section className="py-14 md:py-20">
        <Container>
          <h2 className="text-section font-semibold text-black md:text-section-lg">Fra kartlegging til service</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => (
              <StepCard key={p.heading} number={String(i + 1)} title={p.heading} text={p.text} linkText="Ta kontakt →" href="/kontakt-oss" />
            ))}
          </div>
        </Container>
      </section>

      <Container narrow>
        <div className="pb-14 md:pb-20">
          <ExperienceSection
            image={{ src: "/images/flowmetere/montor.webp", alt: "ELBA-montør klargjør utstyr i en prosessfabrikk", width: 1200, height: 1600 }}
            stats={[
              { value: "20+ år", label: "Med Kytola" },
              { value: "1–64", label: "Punkter per stasjon" },
            ]}
            heading="Satt opp av ELBA"
            paragraphs={[
              "Vi har levert Kytola til norske papirfabrikker i over 20 år – fra enkeltmålere til hele oljesentraler med overvåking av hvert smørepunkt.",
              "Den samme montøren som kjenner sentralsmøringen din, setter alarmgrensene, kobler målestasjonen til styresystemet og kommer tilbake når noe skal overhales.",
            ]}
            linkText="Om oss"
            linkHref="/om-oss"
          />
        </div>
      </Container>

      {/* FAQ */}
      <section className="bg-surface py-14 md:py-20">
        <Container narrow>
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Spørsmål og svar</h2>
          <div className="mt-10">
            <Faq items={FAQ_ITEMS} />
          </div>
        </Container>
      </section>

      <ContactCta />
    </main>
  );
}
