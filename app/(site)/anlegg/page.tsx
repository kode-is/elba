import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { FeatureTileGrid, type FeatureTile } from "@/components/FeatureTileGrid";
import { TextureDivider } from "@/components/TextureDivider";
import { Faq } from "@/components/Faq";
import { CheckList } from "@/components/CheckList";
import { IconCardGrid, type IconCardItem } from "@/components/IconCardGrid";
import { ExperienceSection } from "@/components/anlegg/ExperienceSection";
import { ContactCta } from "@/components/ContactCta";
import { TargetIcon, ClockIcon, HardHatIcon, CoinsIcon, LeafIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ELBA - I INDUSTRIENS TJENESTE",
  description:
    "ELBA - Din partner innen smøreteknikk i Norge. Fra den minste minigraver til Norges største produksjonsanlegg er vi klare til å møte utfordringen med deg.",
  path: "/anlegg",
});

// docs/scrape/anlegg.json blocks 5-13.
const TILES: FeatureTile[] = [
  {
    type: "text",
    tone: "cream",
    heading: "Driftssikre smøresystemer",
    paragraphs: [
      "ELBA leverer sentralsmøreanlegg til gravemaskiner, hjullastere, dumpere og annet anleggsutstyr. Reduser slitasje, minimerer driftsstans og sikre jevn smøring av kritisk utstyr.",
    ],
  },
  { type: "image", image: { src: "/images/anlegg/02-c89d7570.jpeg", alt: "", width: 626, height: 835 } },
  { type: "image", image: { src: "/images/anlegg/03-497fe191.jpeg", alt: "", width: 517, height: 689 } },
  {
    type: "text",
    tone: "red",
    heading: "Effektive løsninger",
    paragraphs: [
      "Fra enkle pumpesystemer til løsninger med elektronisk overvåking. Modelltilpasset, dimensjonert og klargjort for installasjon. For nye maskiner og ettermontering.",
    ],
  },
  {
    type: "text",
    tone: "cream",
    heading: "Profesjonell levering",
    paragraphs: ["Vi leverer komplette kit til forhandlere eller håndterer installasjon direkte mot sluttkunde."],
  },
  { type: "image", image: { src: "/images/anlegg/04-c08775a5.jpeg", alt: "", width: 626, height: 835 } },
];

// docs/scrape/anlegg.json blocks 16-21 (block 19 is the recovered FAQ
// answer — see docs/handover.md and the task report for the Playwright
// patch script and the exact text).
const FAQ_ITEMS = [
  {
    question: "Kan systemet ettermonteres?",
    answer:
      "Ja. Vi leverer modelltilpassede kit for både nye og brukte maskiner. Ettermontering er særlig aktuelt på maskiner med høy belastning, mange smørepunkter eller varierende vedlikeholdsrutiner.",
  },
  {
    question: "Hvor driftssikkert er systemet?",
    answer:
      "Systemene er dimensjonert for krevende miljøer og kontinuerlig drift. Komponentene er robuste og tilpasset nordiske forhold. Elektronisk overvåking kan integreres for varsling ved avvik.",
  },
  {
    question: "Hva skjer dersom systemet får en feil?",
    answer:
      "Ved eventuelle avvik gir overvåkede systemer varsel tidlig. Uten overvåking vil systemet fortsatt være mekanisk robust og enkelt å feilsøke. Vi tilbyr rask support og reservedeler. Målet er alltid å minimere nedetid og sikre rask gjenoppretting.",
  },
];

// docs/scrape/anlegg.json blocks 31-42. Icons aren't in the scrape (see
// components/icons.tsx).
const KEY_FUNCTIONS: IconCardItem[] = [
  {
    icon: <TargetIcon className="h-6 w-6" />,
    heading: "Jevn dosering",
    text: "Riktig fettmengde tilføres automatisk med definerte intervaller uavhengig av operatør.",
  },
  {
    icon: <ClockIcon className="h-6 w-6" />,
    heading: "Redusert nedetid",
    text: "Kontinuerlig smøring minimerer slitasjerelaterte stopp og uplanlagt verkstedtid.",
  },
  {
    icon: <HardHatIcon className="h-6 w-6" />,
    heading: "Økt sikkerhet",
    text: "Manuell smøring i risikoområder reduseres betydelig.",
  },
  {
    icon: <CoinsIcon className="h-6 w-6" />,
    heading: "Lavere kostnader",
    text: "Mindre slitasje og færre reparasjoner gir lavere totale driftskostnader over tid.",
  },
  {
    icon: <ClockIcon className="h-6 w-6" />,
    heading: "Forlenget levetid",
    text: "Bolter, lager og ledd får optimal smøring som reduserer friksjon og komponentbytte.",
  },
  {
    icon: <LeafIcon className="h-6 w-6" />,
    heading: "Redusert forbruk",
    text: "Presis og kontrollert dosering minimerer fettforbruk og reduserer miljøbelastning.",
  },
];

export default function Anlegg() {
  return (
    <main id="main">
      <PageHero
        image={{ src: "/images/home/03-01289078.jpeg", alt: "", width: 1439, height: 1919 }}
        title="Anlegg"
        subtitle="Presis kontinuerlig smøring til din maskin"
        crumbs={[{ text: "Anlegg" }]}
      />
      <Container narrow>
        {/* Less room below than above: on live the dot separator starts
            right under the tiles (0-25px), not a full section-gap later. */}
        <div className="pt-12 pb-6 md:pt-16">
          <FeatureTileGrid tiles={TILES} />
        </div>
      </Container>

      <TextureDivider src="/images/anlegg/05-463dd036.svg" />

      <section className="bg-surface py-14 md:py-20">
        <Container>
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Hvordan fungerer det?</h2>
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

        <div className="pb-16 md:pb-24">
          <ExperienceSection
            image={{ src: "/images/anlegg/08-d666f418.jpeg", alt: "Kitchen installation", width: 590, height: 787 }}
            stats={[
              { value: "30y", label: "Erfaring" },
              { value: "2k+", label: "Montasjer" },
            ]}
            heading="Erfaring i praksis"
            paragraphs={[
              "Elba leverer og installerer sentralsmøresystemer til anleggsmaskiner over hele landet. Våre teknikere har solid erfaring med dimensjonering, montering og feilsøking i krevende driftsmiljøer.",
              "Vi arbeider strukturert og prioriterer rask respons. For både forhandlere og entreprenører betyr dette en leveranse som fungerer - også etter overtakelse.",
            ]}
            linkText="Om oss"
            linkHref="/om-oss"
          />
        </div>
      </Container>

      <ContactCta />
    </main>
  );
}
