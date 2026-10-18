import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { FeatureTileGrid, type FeatureTile } from "@/components/FeatureTileGrid";
import { TextureDivider } from "@/components/TextureDivider";
import { Faq } from "@/components/Faq";
import { CheckList } from "@/components/CheckList";
import { IconCardGrid, type IconCardItem } from "@/components/IconCardGrid";
import { BrandIcon } from "@/components/BrandIcon";
import { ExperienceSection } from "@/components/anlegg/ExperienceSection";
import { ContactCta } from "@/components/ContactCta";
import { ProtegaBand } from "@/components/brannslukking/ProtegaBand";
import { LubricationDemo } from "@/components/sentralsmoring/LubricationDemo";
import { DividerDemo } from "@/components/sentralsmoring/DividerDemo";
import { COMPONENTS, DAY_MOMENTS, FAQ_ITEMS } from "@/lib/sentralsmoring";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sentralsmøring for anleggsmaskiner | ELBA",
  description:
    "Progressiv sentralsmøring for gravemaskiner, hjullastere og dumpere. Pumpen går med faste pauser mens maskinen er i drift, og fordelerne gir hvert smørepunkt sin dose. Levert og montert av ELBA.",
  path: "/anlegg",
});

// The intro tiles, laid out as before (cream / photo / photo / red / cream /
// photo), now with photos of ELBA's own installations.
const TILES: FeatureTile[] = [
  {
    type: "text",
    tone: "cream",
    heading: "Fett inn under arbeid",
    paragraphs: [
      "ELBA leverer og monterer smøreanlegg på gravemaskiner, hjullastere, dumpere og annet anleggsutstyr. Pumpen går mens maskinen er i drift, og fettet kommer inn mens leddene beveger seg.",
    ],
  },
  {
    type: "image",
    image: { src: "/images/anlegg/06-2207cb6d.jpeg", alt: "Smørepumpe og fordeler montert på en dumper", width: 626, height: 835 },
  },
  {
    type: "image",
    image: { src: "/images/anlegg/03-497fe191.jpeg", alt: "Fordeler med smørerør montert på en maskin", width: 517, height: 689 },
  },
  {
    type: "text",
    tone: "red",
    heading: "Jevn fettmengde",
    paragraphs: ["Små doser med faste pauser i stedet for én stor dose ved skiftstart. Fettfilmen holder seg jevn gjennom hele skiftet."],
  },
  {
    type: "text",
    tone: "cream",
    heading: "Tilpasset og montert",
    paragraphs: [
      "Vi dimensjonerer anlegget for maskinen, både på nye maskiner og som ettermontering. Forhandlere får komplette kit, og vi monterer også direkte hos sluttkunde.",
    ],
  },
  {
    type: "image",
    image: { src: "/images/anlegg/04-c08775a5.jpeg", alt: "ELBA-montør legger smørerør på en maskin", width: 626, height: 835 },
  },
];

const PHOTOS: Record<(typeof COMPONENTS)[number]["kind"], { src: string; alt: string }> = {
  pump: { src: "/images/anlegg/02-c89d7570.jpeg", alt: "BEKA EP-1 smørepumpe montert på en gravemaskin" },
  distributor: { src: "/images/anlegg/08-d666f418.jpeg", alt: "Montør kobler smørerør til en BEKA MX-F fordeler" },
};

const ICON = (name: string) => <BrandIcon src={`/images/icons/brand/${name}.svg`} className="block h-10 w-10 bg-white" />;

const BENEFITS: IconCardItem[] = [
  {
    icon: ICON("olje"),
    heading: "Jevn dosering",
    text: "Hvert punkt får sin faste andel, uavhengig av fører og skift.",
  },
  {
    icon: ICON("rask-service"),
    heading: "Ingen stopp for smøring",
    text: "Maskinen smøres mens den jobber, uten en runde med fettpressen før skiftet.",
  },
  {
    icon: ICON("teknisk"),
    heading: "Alle punkter med",
    text: "Også punktene som er vanskelige å nå, får fett i hver syklus.",
  },
  {
    icon: ICON("palitelighet"),
    heading: "Mindre slitasje",
    text: "En jevn fettfilm gir mindre slitasje på bolter og bøssinger, og færre bytter over tid.",
  },
  {
    icon: ICON("profesjonell"),
    heading: "Tryggere arbeid",
    text: "Mindre klatring rundt bom og skuffe med fettpresse.",
  },
  {
    icon: ICON("baerekraft"),
    heading: "Mindre fett på bakken",
    text: "Små doser i stedet for å smøre til det renner over.",
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
          Progressiv sentralsmøring for gravemaskiner, hjullastere og dumpere. Fettet går inn i små doser mens maskinen
          jobber.
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
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Sentralsmøring for anleggsmaskiner</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lead text-ink-muted md:text-lead-lg">
            Bom, stikke, skuffe og svingkrans slites hver time maskinen går. Med sentralsmøring får hvert punkt fett mens
            maskinen jobber, også punktene som er vanskelige å nå med fettpressen.
          </p>
          <div className="mt-10">
            <FeatureTileGrid tiles={TILES} />
          </div>
        </div>
      </Container>

      <TextureDivider src="/images/anlegg/05-463dd036.svg" />

      {/* The working day */}
      <section id="slik-virker-det" className="scroll-mt-8 bg-surface py-14 md:py-20">
        <Container>
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">En arbeidsdag med sentralsmøring</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lead text-ink-muted md:text-lead-lg">
            Gravemaskinen jobber fra kl. 07 til 15. Se hvordan pumpen og fordelerne fordeler fettet mens den graver, og
            bytt til manuell smøring for å sammenligne.
          </p>
          <div className="mt-10">
            <LubricationDemo />
          </div>
        </Container>
      </section>

      {/* Through the day */}
      <Container narrow>
        <div className="py-14 md:py-20">
          <h2 className="text-section font-semibold text-black md:text-section-lg">Jevn fettmengde gjennom dagen</h2>
          <p className="mt-4 max-w-3xl text-lead text-ink-muted md:text-lead-lg">
            Et lager trenger en jevn fettfilm. Med fettpresse får det en full dose ved skiftstart, og så tynnes filmen ut
            til neste gang.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {DAY_MOMENTS.map((m) => (
              <div key={m.heading} className={`rounded-[20px] p-8 ${m.tone === "red" ? "bg-brand" : "bg-surface"}`}>
                <p className={`font-ui text-eyebrow font-semibold ${m.tone === "red" ? "text-brand-soft" : "text-brand"}`}>{m.when}</p>
                <h3 className={`mt-2 font-ui text-[24px] leading-[1.2] font-bold ${m.tone === "red" ? "text-white" : "text-black"}`}>{m.heading}</h3>
                <p className={`mt-4 ${m.tone === "red" ? "text-lead text-brand-soft md:text-lead-lg" : "font-ui text-body text-ink-muted md:text-body-lg"}`}>
                  {m.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* The parts */}
      <section className="bg-surface py-14 md:py-20">
        <Container>
          <h2 className="text-section font-semibold text-black md:text-section-lg">Pumper og fordelere</h2>
          <p className="mt-4 max-w-3xl text-lead text-ink-muted md:text-lead-lg">
            Et smøreanlegg består av en pumpe med styring, en eller flere fordelere og rør og slanger ut til hvert punkt.
            Vi leverer pumper og fordelere fra flere produsenter og velger etter maskin og bruk. Her er to vi bruker mye.
            Pumpedeler, slanger og koblinger har vi på{" "}
            <Link href="/produkter" className="font-semibold text-brand hover:underline">
              eget lager
            </Link>
            .
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {COMPONENTS.map((c) => (
              <div key={c.name} className="flex flex-col overflow-hidden rounded-[20px] bg-white sm:flex-row">
                <div className="relative h-64 sm:h-auto sm:w-[40%] sm:shrink-0">
                  <Image src={PHOTOS[c.kind].src} alt={PHOTOS[c.kind].alt} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6 md:p-8">
                  <p className="font-ui text-eyebrow font-semibold text-brand">{c.role}</p>
                  <h3 className="mt-1 font-ui text-[24px] leading-[1.2] font-bold text-black">{c.name}</h3>
                  <p className="mt-3 font-ui text-body text-ink-muted md:text-body-lg">{c.text}</p>
                  <CheckList items={[...c.facts]} className="mt-5" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Inside a divider */}
      <section id="fordeleren" className="scroll-mt-8 py-14 md:py-20">
        <Container>
          <h2 className="text-section font-semibold text-black md:text-section-lg">Slik virker en progressiv fordeler</h2>
          <p className="mt-4 max-w-3xl text-lead text-ink-muted md:text-lead-lg">
            Hvert stempel må fullføre slaget sitt før det neste kan bevege seg. Derfor får alle punktene på fordeleren fett i
            hver runde. Tetter ett punkt seg, står hele fordeleren.
          </p>
          <div className="mt-10">
            <DividerDemo />
          </div>
        </Container>
      </section>

      {/* Settings and monitoring */}
      <section className="bg-surface py-14 md:py-20">
        <Container narrow>
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px]">
              <Image
                src="/images/anlegg/07-74a78715.jpg"
                alt="Innstillinger for smørepumpen i en app på nettbrett og mobil"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-section font-semibold text-black md:text-section-lg">Innstilling og overvåking</h2>
              <p className="mt-4 text-lead text-ink-muted md:text-lead-lg">
                Pause- og gangtid stilles inn fra mobil eller nettbrett. Med syklusovervåking får fører eller verksted varsel
                når en fordeler ikke går rundt som den skal.
              </p>
              <p className="mt-3 text-lead text-ink-muted md:text-lead-lg">
                For hele maskinparker kan smøreanleggene samles i én oversikt, med historikk over sykluser og hendelser.
              </p>
              <CheckList items={["Innstilling fra app", "Varsel når syklusen stopper", "Historikk per maskin"]} className="mt-6" />
            </div>
          </div>
        </Container>
      </section>

      <Container narrow>
        <div className="py-14 md:py-20">
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Hva du får med sentralsmøring</h2>
          <IconCardGrid items={BENEFITS} className="mt-10" />
        </div>
      </Container>

      <section className="bg-surface py-14 md:py-20">
        <Container narrow>
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Spørsmål og svar</h2>
          <div className="mx-auto mt-10 max-w-3xl">
            <Faq items={FAQ_ITEMS} />
          </div>
        </Container>
      </section>

      <Container narrow>
        <div className="py-16 md:py-24">
          <ExperienceSection
            image={{ src: "/images/brannslukking/montor.webp", alt: "ELBA-montør på jobb", width: 1200, height: 1600 }}
            stats={[
              { value: "30 år", label: "Erfaring" },
              { value: "2000+", label: "Montasjer" },
            ]}
            heading="Erfaring i praksis"
            paragraphs={[
              "ELBA leverer og monterer smøreanlegg på anleggsmaskiner over hele landet. Teknikerne våre dimensjonerer, monterer og feilsøker i krevende driftsmiljøer.",
              "Vi svarer raskt og følger opp anlegget etter levering, både for forhandlere og entreprenører.",
            ]}
            linkText="Om oss"
            linkHref="/om-oss"
          />
        </div>
      </Container>

      {/* Not on live: the new fire-suppression service, pitched to the same
          machine owners and dealers this page is for. */}
      <ProtegaBand
        className="pb-16 md:pb-24"
        heading="Brannslukking fra Protega"
        text="Brann i anleggsmaskiner starter ofte i motorrommet, ved turboen eller i hydraulikken. Vi monterer automatisk brannslukking fra Protega, gjerne i samme verkstedbesøk som sentralsmøringen."
        points={["Slukker uten fører til stede", "Ettermonteres på maskinene du har", "Kit til forhandlere"]}
      />

      <ContactCta />
    </main>
  );
}
