import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { FeatureTileGrid, type FeatureTile } from "@/components/FeatureTileGrid";
import { TextureDivider } from "@/components/TextureDivider";
import { PhotoCollage } from "@/components/PhotoCollage";
import { CheckList } from "@/components/CheckList";
import { IconCardGrid, type IconCardItem } from "@/components/IconCardGrid";
import { IndustryGrid, type IndustryCard } from "@/components/industri/IndustryGrid";
import { ContactCta } from "@/components/ContactCta";
import { ProtegaBand } from "@/components/brannslukking/ProtegaBand";
import { BrandIcon } from "@/components/BrandIcon";
import { SpecTable } from "@/components/SpecTable";
import { Faq } from "@/components/Faq";
import { CheckIcon, ClockIcon, HardHatIcon, CoinsIcon, LeafIcon, SparkleIcon } from "@/components/icons";
import { FAQ_ITEMS, MONITORING_METHODS, MONITORING_TABLE } from "@/lib/industri";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ELBA - I INDUSTRIENS TJENESTE",
  description:
    "ELBA - Din partner innen smøreteknikk i Norge. Fra den minste minigraver til Norges største produksjonsanlegg er vi klare til å møte utfordringen med deg.",
  path: "/industri",
});

// docs/scrape/industri.json blocks 5-14.
const TILES: FeatureTile[] = [
  {
    type: "text",
    tone: "red",
    heading: "Lang erfaring",
    paragraphs: [
      "Med over 30 års erfaring i norsk industri vet vi hva som kreves for stabil og lønnsom drift. Når du velger ELBA, får du en langsiktig partner som kjenner industrien, utstyret og kravene som stilles i praksis.",
    ],
  },
  { type: "image", image: { src: "/images/industri/02-46c62221.jpg", alt: "", width: 626, height: 835 } },
  { type: "image", image: { src: "/images/industri/03-dbbda199.jpeg", alt: "", width: 388, height: 517 } },
  {
    type: "text",
    tone: "red",
    heading: "Overvåkning",
    paragraphs: [
      "Med overvåking ser du at smøringen virker, ikke bare at pumpen går. Måleinstrumenter viser mengden ute på anlegget, og digital overvåking samler alt i én oversikt og varsler ved avvik.",
    ],
  },
  {
    type: "text",
    tone: "red",
    heading: "Din servicepartner",
    paragraphs: [
      "Få grundige service- og tilstandsrapporter som gir deg full oversikt over anleggets status, utført arbeid og eventuelle anbefalte tiltak.",
      "Bedre beslutningsgrunnlag, enklere intern oppfølging.",
    ],
  },
  { type: "image", image: { src: "/images/industri/04-c4e0224c.jpeg", alt: "", width: 626, height: 835 } },
];

// docs/scrape/industri.json blocks 25-36. Icons aren't in the scrape (see
// components/icons.tsx).
const RELIABILITY: IconCardItem[] = [
  {
    icon: <ClockIcon className="h-6 w-6" />,
    heading: "Maksimert oppetid",
    text: "Automatisk smøring tilfører nøyaktige mengder smøremiddel til forhåndsprogrammerte intervaller, noe som minimerer slitasje og forebygger systemfeil som kan forstyrre produksjonsflyten.",
  },
  {
    icon: <ClockIcon className="h-6 w-6" />,
    heading: "Forlenget levetid",
    text: "Kontinuerlig og korrekt smøring sikrer optimal ytelse og forlenger levetiden på verdifullt maskinutstyr, noe som reduserer behovet for utskifting og tilhørende kostnader.",
  },
  {
    icon: <HardHatIcon className="h-6 w-6" />,
    heading: "Økt sikkerhet",
    text: "Automatiserte smøresystemer fjerner behovet for at personell må oppholde seg inne i potensielt farlige områder rundt bevegelig utstyr eller klatre på maskiner for å utføre smøring.",
  },
  {
    icon: <CoinsIcon className="h-6 w-6" />,
    heading: "Lavere vedlikeholdskostnader",
    text: "Ved å redusere antall driftsstans og forlenge systemenes levetid, gir automatisk smøring betydelige kostnadsbesparelser på lang sikt.",
  },
  {
    icon: <SparkleIcon className="h-6 w-6" />,
    heading: "Rent arbeidsmiljø",
    text: "Presis påføring minimerer sprut og overskudd av smøremiddel, holder produksjonsområdet rent og reduserer risikoen for skliulykker.",
  },
  {
    icon: <LeafIcon className="h-6 w-6" />,
    heading: "Miljøvennlig løsning",
    text: "Presis dosering av fett reduserer forbruket, minimerer svinn og begrenser risikoen for miljøforurensning.",
  },
];

// docs/scrape/industri.json blocks 37-56 — ten image+caption pairs, "Jarnbane" kept verbatim (live typo for "Jernbane").
const INDUSTRIES: IndustryCard[] = [
  { caption: "Sagbruk", image: { src: "/images/industri/08-75ffe60e.jpg", alt: "", width: 287, height: 191 } },
  { caption: "Offshore", image: { src: "/images/industri/09-0317a30c.webp", alt: "", width: 287, height: 410 } },
  { caption: "Papir/cellulose", image: { src: "/images/industri/10-eed0a990.jpg", alt: "", width: 287, height: 191 } },
  { caption: "Metall", image: { src: "/images/industri/11-e9f91639.jpg", alt: "", width: 287, height: 191 } },
  { caption: "Maritim", image: { src: "/images/industri/12-de2c4bb0.jpg", alt: "", width: 287, height: 188 } },
  { caption: "Jarnbane", image: { src: "/images/industri/13-0187a2eb.jpg", alt: "", width: 287, height: 189 } },
  { caption: "Gjenvinning", image: { src: "/images/industri/14-431f1023.jpg", alt: "", width: 287, height: 430 } },
  { caption: "Buss", image: { src: "/images/industri/15-9a740c4d.jpg", alt: "", width: 287, height: 157 } },
  { caption: "Mat- og drikkevare", image: { src: "/images/industri/16-f908364e.jpg", alt: "", width: 287, height: 191 } },
  { caption: "Havn", image: { src: "/images/industri/17-9598e4dc.jpg", alt: "", width: 287, height: 430 } },
];

export default function Industri() {
  return (
    <main id="main">
      <PageHero
        image={{ src: "/images/home/04-41b11055.jpg", alt: "Industri", width: 512, height: 683 }}
        title="Industri"
        subtitle="Skreddersydde løsninger for norsk industri"
        crumbs={[{ text: "Industri" }]}
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
        <Container narrow>
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <PhotoCollage
              main={{ src: "/images/industri/06-5ec9edb8.jpeg", alt: "Interior work", width: 388, height: 518 }}
              inset={{ src: "/images/industri/07-a80a4311.jpeg", alt: "Bedroom work", width: 229, height: 305 }}
            />
            <div>
              <h2 className="text-section font-semibold text-black md:text-section-lg">Tilpassede serviceavtaler</h2>
              <p className="mt-4 text-lead text-ink-muted md:text-lead-lg">
                Norsk industri opererer under krevende forhold med høye krav til oppetid, presisjon og sikkerhet. Vi
                leverer løsninger som sikrer stabil drift, reduserer uforutsette stans og forlenger levetiden på
                kritisk utstyr.
              </p>
              <CheckList items={["Kvalitet", "Tilpasning", "Oppfølging"]} className="mt-6" />
            </div>
          </div>
        </Container>
      </section>

      {/* Monitoring: the review asked for far more on this, instruments as
          well as digital (docs/handover.md). New, not on live. */}
      <section id="overvaking" className="scroll-mt-8 py-14 md:py-20">
        <Container>
          <h2 className="text-section font-semibold text-black md:text-section-lg">Se at smøringen virker</h2>
          <p className="mt-4 max-w-3xl text-lead text-ink-muted md:text-lead-lg">
            At pumpen går, sier ikke at lageret får fett. Vi overvåker smøringen der det teller: med måleinstrumenter som
            viser mengden ute på anlegget, med indikatorer som virker uten strøm, og med digital overvåking som samler alt
            i én oversikt og varsler når noe avviker.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {MONITORING_METHODS.map((m) => (
              <div key={m.heading} className="flex flex-col rounded-[20px] bg-surface p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <span aria-hidden="true" className="flex h-[55px] w-[55px] shrink-0 items-center justify-center rounded-[10px] bg-brand">
                    <BrandIcon src={`/images/icons/brand/${m.icon}.svg`} className="block h-8 w-8 bg-white" />
                  </span>
                  <div>
                    <p className="font-ui text-eyebrow font-semibold text-brand">{m.eyebrow}</p>
                    <h3 className="font-ui text-[22px] leading-[1.25] font-bold text-black">{m.heading}</h3>
                  </div>
                </div>
                <p className="mt-4 font-ui text-body text-ink-muted md:text-body-lg">{m.text}</p>
                <ul className="mt-5 space-y-2">
                  {m.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <CheckIcon className="mt-1.5 h-4 w-4 shrink-0 text-brand" />
                      <span className="font-ui text-body font-semibold text-black md:text-body-lg">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-14 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
            <div>
              <h2 id="hva-vi-overvaker" className="text-section font-semibold text-black md:text-section-lg">
                Hva vi overvåker
              </h2>
              <p className="mt-4 text-lead text-ink-muted md:text-lead-lg">
                Hver del av anlegget har sitt mål og sitt instrument. Vi setter sammen det som passer anlegget og
                styresystemet dere har, fra en indikatorstift på fordeleren til full overvåking av alle punkter.
              </p>
              <Link
                href="/kontakt-oss"
                className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-brand px-[30px] py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50"
              >
                Spør om overvåking
              </Link>
            </div>
            <SpecTable headers={MONITORING_TABLE.headers} rows={MONITORING_TABLE.rows} ariaLabelledBy="hva-vi-overvaker" />
          </div>
        </Container>
      </section>

      <Container narrow>
        <div className="py-14 md:py-20">
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">
            Industriell pålitelighet
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lead text-ink-muted md:text-lead-lg">
            Dokumenterte fordeler for driftssikkerhet, totaløkonomi og bærekraftig produksjon.
          </p>
          <IconCardGrid items={RELIABILITY} className="mt-10" />
        </div>

        <div className="pb-16 md:pb-24">
          <IndustryGrid items={INDUSTRIES} />
        </div>
      </Container>

      <section className="bg-surface py-14 md:py-20">
        <Container narrow>
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Spørsmål og svar om overvåking</h2>
          <div className="mx-auto mt-10 max-w-3xl">
            <Faq items={FAQ_ITEMS} />
          </div>
        </Container>
      </section>

      {/* Not on live: the new fire-suppression service, pitched to industry. */}
      <ProtegaBand
        className="py-16 md:py-24"
        heading="Brannvern for ubemannet drift"
        text="CNC-maskiner, el-skap og filteranlegg går natt og helg uten folk til stede. Protega oppdager og slukker brann på stedet – med rene slukkemidler som ikke skader elektronikken."
        points={["CNC og maskineringssentre", "El-skap og filterskap", "Service med inspeksjonssertifikat"]}
      />

      <ContactCta />
    </main>
  );
}
