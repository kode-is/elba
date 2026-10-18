import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { FeatureTileGrid, type FeatureTile } from "@/components/FeatureTileGrid";
import { FeatureCard } from "@/components/FeatureCard";
import { IconCardGrid } from "@/components/IconCardGrid";
import { CheckList } from "@/components/CheckList";
import { StatsSection } from "@/components/StatsSection";
import { StepCard } from "@/components/StepCard";
import { ExperienceSection } from "@/components/anlegg/ExperienceSection";
import { PhotoCollage } from "@/components/PhotoCollage";
import { TextureDivider } from "@/components/TextureDivider";
import { Faq } from "@/components/Faq";
import { ContactCta } from "@/components/ContactCta";
import { BrandIcon } from "@/components/BrandIcon";
import { Sparks } from "@/components/brannslukking/Sparks";
import { SegmentGrid } from "@/components/brannslukking/SegmentGrid";
import { HeatScale } from "@/components/brannslukking/HeatScale";
import { SuppressionDemo } from "@/components/brannslukking/SuppressionDemo";
import { ComparisonTable } from "@/components/brannslukking/ComparisonTable";
import {
  AGENTS,
  AUDIENCES,
  FAQ_ITEMS,
  GALLERY,
  OPTIONS,
  PROCESS,
  PROTEGA_NAME,
  REASONS,
  RISK_ZONES,
} from "@/lib/brannslukking";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Automatisk brannslukking | ELBA",
  description:
    "ELBA leverer og monterer automatisk brannslukking fra Protega Solutions for anleggsmaskiner, landbruk, gjenvinning, transport, maritim og industri. Helt mekanisk, uten strøm, døgnet rundt.",
  path: "/brannslukking",
});

// The three audiences as /anlegg's intro tiles: cream / photo / photo / red /
// cream / photo.
const TILES: FeatureTile[] = [
  { type: "text", tone: "cream", heading: AUDIENCES[0].who, paragraphs: [AUDIENCES[0].text] },
  {
    type: "image",
    image: { src: "/images/brannslukking/hjullaster.webp", alt: "Hjullaster med åpent motorrom i verkstedet", width: 1200, height: 1600 },
  },
  {
    type: "image",
    image: { src: "/images/brannslukking/beltemaskin-hoy.webp", alt: "Tre slukkesylindre montert på en beltemaskin", width: 853, height: 1280 },
  },
  { type: "text", tone: "red", heading: AUDIENCES[1].who, paragraphs: [AUDIENCES[1].text] },
  { type: "text", tone: "cream", heading: AUDIENCES[2].who, paragraphs: [AUDIENCES[2].text] },
  {
    type: "image",
    image: { src: "/images/brannslukking/cnc.webp", alt: "Slukkesylindre montert i en CNC-maskin", width: 1000, height: 1778 },
  },
];

// The site's button: 10px radius, 20/30px padding, fades on hover.
const BUTTON = "inline-flex items-center justify-center rounded-[10px] px-[30px] py-5 text-[16px] leading-[1.2] font-semibold transition";

export default function Brannslukking() {
  return (
    <main id="main">
      <PageHero
        image={{ src: "/images/brannslukking/beltemaskin.webp", alt: "", width: 1280, height: 853 }}
        crumbs={[{ text: "Tjenester", href: "/tjenester" }, { text: "Brannslukking" }]}
        decoration={<Sparks />}
        // Taller than the default inner hero, with room for the header on
        // top: this one carries a subtitle and two buttons as well.
        height="min-h-[560px] md:min-h-[600px]"
        contentClassName="px-6 pt-20 text-center md:pt-16"
      >
        <h1 className="text-[36px] leading-[1.2] font-semibold text-white md:text-[70px]">Brannslukking</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lead text-white/85 md:text-lead-lg">
          Automatisk brannslukking for maskinene dine – helt mekanisk, uten strøm, døgnet rundt. Levert og montert av
          ELBA, i samarbeid med {PROTEGA_NAME}.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/kontakt-oss" className={`${BUTTON} bg-brand text-white hover:opacity-50`}>
            Be om tilbud
          </Link>
          <a href="#slik-virker-det" className={`${BUTTON} border border-white text-white hover:bg-white hover:text-brand`}>
            Slik virker det
          </a>
        </div>
      </PageHero>

      {/* Same customers, same machines */}
      <Container narrow>
        <div className="pt-12 pb-6 md:pt-16">
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Samme kunder. Samme maskiner.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lead text-ink-muted md:text-lead-lg">
            I over 30 år har vi smurt maskinene til entreprenører, bønder, sagbruk, rederier og industri over hele
            landet. Der fett og hydraulikkolje går tett på varme flater, er det også brannfare. Nå får du smøring og
            brannvern fra samme leverandør – ofte i samme verkstedbesøk.
          </p>
          <div className="mt-10">
            <FeatureTileGrid tiles={TILES} />
          </div>
        </div>
      </Container>

      <TextureDivider src="/images/anlegg/05-463dd036.svg" />

      <section className="bg-surface py-14 md:py-20">
        <Container>
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Dine bransjer</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lead text-ink-muted md:text-lead-lg">
            Bransjene vi har smurt i 30 år, og det vi beskytter i hver av dem.
          </p>
          <div className="mt-14">
            <SegmentGrid />
          </div>
        </Container>
      </section>

      <StatsSection />

      {/* The risk */}
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-2 md:items-center md:gap-16 md:py-20">
          <div>
            <h2 className="text-section font-semibold text-black md:text-section-lg">Én lekkasje er nok</h2>
            <p className="mt-4 text-lead text-ink-muted md:text-lead-lg">
              Drivstoff, olje og elektrisk utstyr sitter tett på varmen som kan antenne dem. Kortslutning, overoppheting
              eller en sprukket hydraulikkslange mot en varm turbo – det er de vanligste årsakene til brann i maskiner.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {RISK_ZONES.map((z) => (
                <li key={z} className="rounded-full bg-surface px-4 py-2 font-ui text-[14px] leading-[1.4] font-medium text-ink-muted">
                  {z}
                </li>
              ))}
            </ul>
          </div>
          <HeatScale />
        </div>
      </Container>

      {/* How it works */}
      <section id="slik-virker-det" className="scroll-mt-8 bg-surface py-14 md:py-20">
        <Container>
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Oppdager, sprekker, slukker</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lead text-ink-muted md:text-lead-lg">
            Et trykksatt deteksjonsrør legges gjennom risikosonene. Ingen elektronikk må virke for at systemet skal
            utløse. Velg system og se forskjellen.
          </p>
          <div className="mt-10">
            <SuppressionDemo />
          </div>
        </Container>
      </section>

      {/* Agents */}
      <Container>
        <div className="py-14 md:py-20">
          <h2 className="text-section font-semibold text-black md:text-section-lg">Riktig middel for risikoen</h2>
          <p className="mt-4 max-w-3xl text-lead text-ink-muted md:text-lead-lg">
            Sylindre fra 1 kg til et lite el-skap og opptil 100 kg for de største rommene. Doble kit kombinerer to midler
            der risikoen krever det.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {AGENTS.map((a) => (
              <FeatureCard key={a.name} heading={a.name} text={a.text} />
            ))}
          </div>
        </div>
      </Container>

      {/* Versus what the customer already has */}
      <section className="bg-surface py-14 md:py-20">
        <Container>
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-16">
            <div>
              <h2 className="text-section font-semibold text-black md:text-section-lg">Mer enn et brannslukningsapparat</h2>
              <p className="mt-4 text-lead text-ink-muted md:text-lead-lg">
                Et håndapparat forutsetter at noen ser brannen og rekker frem til den. Protega trenger ingen – det slukker
                selv, døgnet rundt, og kan stoppe motoren samtidig.
              </p>
            </div>
            <ComparisonTable />
          </div>
        </Container>
      </section>

      {/* Why Protega */}
      <Container narrow>
        <div className="py-14 md:py-20">
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Nøkkelfunksjoner</h2>
          <IconCardGrid
            className="mt-10"
            items={REASONS.map((r) => ({
              icon: <BrandIcon src={r.icon} className="block h-10 w-10 bg-white" />,
              heading: r.heading,
              text: r.text,
            }))}
          />
        </div>

        <div className="grid gap-10 pb-14 md:grid-cols-2 md:items-center md:gap-16 md:pb-20">
          <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-surface-cool">
            <Image
              src="/images/brannslukking/sylinder.webp"
              alt="Slukkesylinder med ventil og trykkmåler"
              width={404}
              height={1100}
              sizes="200px"
              className="h-[85%] w-auto"
            />
          </div>
          <div>
            <h2 className="text-section font-semibold text-black md:text-section-lg">Tilpass systemet</h2>
            <p className="mt-4 text-lead text-ink-muted md:text-lead-lg">
              Systemet konfigureres etter maskinen. Disse tilleggene kan kobles til:
            </p>
            <CheckList items={OPTIONS} className="mt-6" />
          </div>
        </div>
      </Container>

      {/* One workshop visit */}
      <section className="bg-surface py-14 md:py-20">
        <Container>
          <h2 className="text-section font-semibold text-black md:text-section-lg">Ett verkstedbesøk. Smurt og sikret.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => (
              <StepCard
                key={p.heading}
                number={String(i + 1)}
                title={p.heading}
                text={p.text}
                linkText="Ta kontakt →"
                href="/kontakt-oss"
                tone="white"
              />
            ))}
          </div>
        </Container>
      </section>

      <Container narrow>
        <div className="py-14 md:py-20">
          <ExperienceSection
            image={{ src: "/images/brannslukking/montor.webp", alt: "ELBA-montør på jobb hos en industrikunde", width: 1200, height: 1600 }}
            stats={[
              { value: "30 år", label: "Erfaring" },
              { value: "200+", label: "Montasjer i året" },
            ]}
            heading="Montert av ELBA"
            paragraphs={[
              "Våre montører kjenner maskinene dine fra før. Nå monterer de brannslukking i samme runde som sentralsmøringen – én avtale, én faktura og én kontakt å ringe.",
              "For forhandlere leverer vi komplette kit og lærer opp egne teknikere, så systemet monteres riktig og dokumenteres fra første dag.",
            ]}
            linkText="Om oss"
            linkHref="/om-oss"
          />
        </div>
      </Container>

      {/* Installations */}
      <section className="pb-14 md:pb-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <h2 className="text-section font-semibold text-black md:text-section-lg">Fra hjullaster til fartøy</h2>
            <Link href="/kontakt-oss" className={`${BUTTON} bg-brand text-white hover:opacity-50`}>
              Be om tilbud
            </Link>
          </div>
          <ul className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {GALLERY.map((g) => (
              <li key={g.src} className="group relative mb-6 break-inside-avoid overflow-hidden rounded-[20px]">
                <Image
                  src={g.src}
                  alt={g.caption}
                  width={g.width}
                  height={g.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full transition duration-700 group-hover:scale-105"
                />
                <p className="absolute bottom-4 left-4 rounded-[10px] bg-brand px-4 py-2 font-ui text-[14px] font-semibold text-white">
                  {g.caption}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* FAQ, as /anlegg's "Hvordan fungerer det?" */}
      <section className="bg-surface py-14 md:py-20">
        <Container>
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Spørsmål og svar</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-start md:gap-10">
            <Faq items={FAQ_ITEMS} />
            <PhotoCollage
              main={{ src: "/images/brannslukking/sylinder-baat.webp", alt: "Slukkesylinder om bord på et fartøy", width: 853, height: 1280 }}
              inset={{ src: "/images/brannslukking/smorepumpe.webp", alt: "Sentralsmørepumpe montert på en maskin", width: 1000, height: 833 }}
            />
          </div>
        </Container>
      </section>

      <ContactCta />
    </main>
  );
}
