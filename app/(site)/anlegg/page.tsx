import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { FeatureTileGrid, type FeatureTile } from "@/components/FeatureTileGrid";
import { TextureDivider } from "@/components/TextureDivider";
import { Faq } from "@/components/Faq";
import { CheckList } from "@/components/CheckList";
import { IconCardGrid, type IconCardItem } from "@/components/IconCardGrid";
import { ExperienceSection } from "@/components/anlegg/ExperienceSection";
import { ContactCta } from "@/components/ContactCta";
import { ProtegaBand } from "@/components/brannslukking/ProtegaBand";
import { LubricationDemo } from "@/components/sentralsmoring/LubricationDemo";
import { Pump } from "@/components/sentralsmoring/Machine";
import { DividerDemo } from "@/components/sentralsmoring/DividerDemo";
import { DividerIcon } from "@/components/sentralsmoring/DividerIcon";
import { TargetIcon, ClockIcon, HardHatIcon, CoinsIcon, LeafIcon } from "@/components/icons";
import { COMPONENTS, DAY_MOMENTS, FAQ_ITEMS } from "@/lib/sentralsmoring";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sentralsmøring for anleggsmaskiner | ELBA",
  description:
    "Progressiv sentralsmøring for gravemaskiner, hjullastere og dumpere. Smører mens maskinen jobber – i alle posisjoner – og holder fettmengden rundt det optimale hele dagen. Levert og montert av ELBA.",
  path: "/anlegg",
});

// The intro tiles, laid out as before (cream / photo / photo / red / cream /
// photo); the copy now leads with what the page shows.
const TILES: FeatureTile[] = [
  {
    type: "text",
    tone: "cream",
    heading: "Smurt mens den jobber",
    paragraphs: [
      "ELBA leverer sentralsmøreanlegg til gravemaskiner, hjullastere, dumpere og annet anleggsutstyr. Fettet går inn mens maskinen er i drift, når boltene beveger seg og er under last.",
    ],
  },
  { type: "image", image: { src: "/images/anlegg/02-c89d7570.jpeg", alt: "", width: 626, height: 835 } },
  { type: "image", image: { src: "/images/anlegg/03-497fe191.jpeg", alt: "", width: 517, height: 689 } },
  {
    type: "text",
    tone: "red",
    heading: "Riktig mengde, hele dagen",
    paragraphs: [
      "Små doser med jevne mellomrom i stedet for alt på én gang. Ikke for mye om morgenen, ikke tørt om ettermiddagen.",
    ],
  },
  {
    type: "text",
    tone: "cream",
    heading: "Modelltilpasset og montert",
    paragraphs: [
      "Dimensjonert for maskinen og klar for montering – på nye maskiner og som ettermontering. Vi leverer komplette kit til forhandlere eller monterer direkte hos deg.",
    ],
  },
  { type: "image", image: { src: "/images/anlegg/04-c08775a5.jpeg", alt: "", width: 626, height: 835 } },
];

const KEY_FUNCTIONS: IconCardItem[] = [
  {
    icon: <TargetIcon className="h-6 w-6" />,
    heading: "Jevn dosering",
    text: "Riktig fettmengde tilføres automatisk med faste intervaller, uavhengig av fører og skift.",
  },
  {
    icon: <ClockIcon className="h-6 w-6" />,
    heading: "Redusert nedetid",
    text: "Ingen stopp for å smøre, og færre slitasjerelaterte stopp og uplanlagte verkstedbesøk.",
  },
  {
    icon: <HardHatIcon className="h-6 w-6" />,
    heading: "Økt sikkerhet",
    text: "Føreren slipper å krype rundt bom og skuffe med fettpressen. Manuell smøring i risikoområder reduseres betydelig.",
  },
  {
    icon: <CoinsIcon className="h-6 w-6" />,
    heading: "Lavere kostnader",
    text: "Mindre slitasje og færre bytter av bolter og bøssinger gir lavere driftskostnader over tid.",
  },
  {
    icon: <ClockIcon className="h-6 w-6" />,
    heading: "Forlenget levetid",
    text: "Bolter, lager og ledd får smøring i alle posisjoner, hele dagen. Det reduserer friksjon og komponentbytte.",
  },
  {
    icon: <LeafIcon className="h-6 w-6" />,
    heading: "Redusert forbruk",
    text: "Små, presise doser i stedet for overfylte lagre. Mindre fett brukes, og mindre havner på bakken.",
  },
];

// The site's button: 10px radius, 20/30px padding, fades on hover.
const BUTTON = "inline-flex items-center justify-center rounded-[10px] px-[30px] py-5 text-[16px] leading-[1.2] font-semibold transition";

export default function Anlegg() {
  return (
    <main id="main">
      <PageHero
        image={{ src: "/images/home/03-01289078.jpeg", alt: "", width: 1439, height: 1919 }}
        crumbs={[{ text: "Anlegg" }]}
        height="min-h-[520px] md:min-h-[580px]"
        contentClassName="px-6 pt-16 text-center md:pt-12"
      >
        <h1 className="text-[36px] leading-[1.2] font-semibold text-white md:text-[70px]">Anlegg</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lead text-white/85 md:text-lead-lg">
          Presis kontinuerlig smøring til din maskin. Progressiv sentralsmøring som smører mens maskinen jobber – i alle
          posisjoner, med riktig mengde hele dagen.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/kontakt-oss" className={`${BUTTON} bg-brand text-white hover:opacity-50`}>
            Be om tilbud
          </Link>
          <a href="#slik-virker-det" className={`${BUTTON} border border-white text-white hover:bg-white hover:text-brand`}>
            Se hvordan det virker
          </a>
        </div>
      </PageHero>

      <Container narrow>
        <div className="pt-12 pb-6 md:pt-16">
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Smøring som jobber med maskinen</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lead text-ink-muted md:text-lead-lg">
            Bom, stikke, skuffe og svingkrans – hvert ledd på en gravemaskin slites hver time den er i drift. Med sentralsmøring
            får hvert punkt fett mens maskinen jobber – ikke bare når noen har tid til fettpressen.
          </p>
          <div className="mt-10">
            <FeatureTileGrid tiles={TILES} />
          </div>
        </div>
      </Container>

      <TextureDivider src="/images/anlegg/05-463dd036.svg" />

      {/* The demo */}
      <section id="slik-virker-det" className="scroll-mt-8 bg-surface py-14 md:py-20">
        <Container>
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Smurt i alle posisjoner</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lead text-ink-muted md:text-lead-lg">
            Én arbeidsdag på en gravemaskin, fra kl. 07 til 15. Se hvordan fettet fordeles når maskinen smører seg selv
            mens den graver – og bytt til manuell smøring for å se forskjellen.
          </p>
          <div className="mt-10">
            <LubricationDemo />
          </div>
        </Container>
      </section>

      {/* Too much, too little, right */}
      <Container>
        <div className="py-14 md:py-20">
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end md:gap-16">
            <h2 className="text-section font-semibold text-black md:text-section-lg">Ikke for mye. Ikke for lite.</h2>
            <p className="text-lead text-ink-muted md:text-lead-lg">
              Et lager trenger en jevn fettfilm, ikke en full dose om morgenen og ingenting om ettermiddagen. Det er
              forskjellen på å smøre én gang om dagen og å smøre hele dagen.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {DAY_MOMENTS.map((m) => (
              <div key={m.heading} className={`rounded-[20px] p-6 md:p-8 ${m.tone === "red" ? "bg-brand" : "bg-surface"}`}>
                <p className={`font-ui text-[14px] font-semibold tracking-wide uppercase ${m.tone === "red" ? "text-brand-soft" : "text-brand"}`}>
                  {m.when}
                </p>
                <h3 className={`mt-2 text-[24px] leading-[1.25] font-semibold md:text-[28px] ${m.tone === "red" ? "text-white" : "text-black"}`}>
                  {m.heading}
                </h3>
                <p className={`mt-3 font-ui text-body md:text-body-lg ${m.tone === "red" ? "text-brand-soft" : "text-ink-muted"}`}>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* The system */}
      <section className="bg-surface py-14 md:py-20">
        <Container>
          <h2 className="text-section font-semibold text-black md:text-section-lg">Pumpe og progressiv fordeler</h2>
          <p className="mt-4 max-w-3xl text-lead text-ink-muted md:text-lead-lg">
            To komponenter gjør jobben: en pumpe som presser fettet ut, og en fordeler som deler det mellom punktene. Rør,
            slanger og koblinger leverer vi fra{" "}
            <Link href="/produkter" className="font-semibold text-brand hover:underline">
              eget lager
            </Link>
            .
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {COMPONENTS.map((c) => (
              <div key={c.name} className="flex flex-col overflow-hidden rounded-[20px] bg-white sm:flex-row">
                <div className="flex items-center justify-center bg-surface-cool p-8 sm:w-[38%] sm:shrink-0">
                  {c.kind === "pump" ? (
                    <svg viewBox="-8 -6 56 92" aria-hidden="true" className="h-40 w-auto">
                      <Pump x={0} y={80} level={0.72} stir={30} running={false} scale={1} />
                    </svg>
                  ) : (
                    <DividerIcon className="h-auto w-full max-w-[200px]" />
                  )}
                </div>
                <div className="p-6 md:p-8">
                  <p className="font-ui text-[14px] font-semibold text-brand">{c.role}</p>
                  <h3 className="mt-1 text-[24px] leading-[1.25] font-semibold text-black">{c.name}</h3>
                  <p className="mt-3 font-ui text-body text-ink-muted md:text-body-lg">{c.text}</p>
                  <CheckList items={[...c.facts]} className="mt-5" />
                </div>
              </div>
            ))}
          </div>

          <div id="fordeleren" className="mt-16 scroll-mt-8 md:mt-20">
            <h2 className="text-section font-semibold text-black md:text-section-lg">Inne i en progressiv fordeler</h2>
            <p className="mt-4 max-w-3xl text-lead text-ink-muted md:text-lead-lg">
              Hvert stempel må fullføre sin dose før det neste kan bevege seg. Derfor får alle punktene fett i hver
              syklus – og stopper ett, stopper alle.
            </p>
            <div className="mt-10">
              <DividerDemo />
            </div>
          </div>
        </Container>
      </section>

      <Container narrow>
        <div className="py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/anlegg/07-74a78715.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-section font-semibold text-black md:text-section-lg">Digital overvåking</h2>
              <p className="mt-4 text-lead text-ink-muted md:text-lead-lg">
                Vi tilbyr digital overvåking av sentralsmøresystemer både for individuelle maskiner eller som en
                sentralisert oversikt over hele maskinparker.
              </p>
              <p className="mt-3 text-lead text-ink-muted md:text-lead-lg">
                Løsningene kan varsle fører ved avvik og gir historisk sporbarhet på sykluser og hendelser.
              </p>
              <CheckList items={["Oversikt", "Varsling", "Sporbarhet"]} className="mt-6" />
            </div>
          </div>
        </div>

        <div className="pb-14 md:pb-20">
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Nøkkelfunksjoner</h2>
          <IconCardGrid items={KEY_FUNCTIONS} className="mt-10" />
        </div>
      </Container>

      <section className="bg-surface py-14 md:py-20">
        <Container>
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Spørsmål og svar</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-start md:gap-10">
            <Faq items={FAQ_ITEMS} />
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/anlegg/06-2207cb6d.jpeg"
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <Container narrow>
        <div className="py-16 md:py-24">
          <ExperienceSection
            image={{ src: "/images/anlegg/08-d666f418.jpeg", alt: "ELBA-montør ved en anleggsmaskin", width: 590, height: 787 }}
            stats={[
              { value: "30y", label: "Erfaring" },
              { value: "2k+", label: "Montasjer" },
            ]}
            heading="Erfaring i praksis"
            paragraphs={[
              "ELBA leverer og installerer sentralsmøresystemer til anleggsmaskiner over hele landet. Våre teknikere har solid erfaring med dimensjonering, montering og feilsøking i krevende driftsmiljøer.",
              "Vi arbeider strukturert og prioriterer rask respons. For både forhandlere og entreprenører betyr dette en leveranse som fungerer - også etter overtakelse.",
            ]}
            linkText="Om oss"
            linkHref="/om-oss"
          />
        </div>
      </Container>

      <ProtegaBand
        className="pb-16 md:pb-24"
        heading="Smurt og sikret mot brann"
        text="Motorrom, hydraulikk og turbo er der anleggsmaskiner tar fyr. Nå monterer vi automatisk brannslukking fra Protega – gjerne i samme verkstedbesøk som sentralsmøringen."
        points={["Slukker uten fører til stede", "Ettermonteres på maskinene du har", "Kit til forhandlere"]}
      />

      <ContactCta />
    </main>
  );
}
