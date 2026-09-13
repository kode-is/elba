import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { FeatureTileGrid, type FeatureTile } from "@/components/FeatureTileGrid";
import { TextureDivider } from "@/components/TextureDivider";
import { PhotoCollage } from "@/components/PhotoCollage";
import { CheckList } from "@/components/CheckList";
import { IconCardGrid, type IconCardItem } from "@/components/IconCardGrid";
import { IndustryGrid, type IndustryCard } from "@/components/industri/IndustryGrid";
import { ContactCta } from "@/components/ContactCta";
import { ClockIcon, HardHatIcon, CoinsIcon, LeafIcon, SparkleIcon } from "@/components/icons";
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
      "Med over 30 års erfaring i norsk industri vet vi hva som kreves for stabil og lønnsom drift. Når du velger Elba, får du en langsiktig partner som kjenner industrien, utstyret og kravene som stilles i praksis.",
    ],
  },
  { type: "image", image: { src: "/images/industri/02-46c62221.jpg", alt: "", width: 626, height: 835 } },
  { type: "image", image: { src: "/images/industri/03-dbbda199.jpeg", alt: "", width: 388, height: 517 } },
  {
    type: "text",
    tone: "red",
    heading: "Digital overvåkning",
    paragraphs: [
      "Med digital overvåkning får du full kontroll på smøresystemene i sanntid. Få full oversikt over drift med et øyekast og oppdag avvik tidlig for tryggere drift.",
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
      />
      <Container>
        <div className="py-12 md:py-16">
          <Breadcrumb items={[{ text: "Industri" }]} />
          <div className="mt-10 md:mt-14">
            <FeatureTileGrid tiles={TILES} />
          </div>
        </div>
      </Container>

      <TextureDivider src="/images/anlegg/05-463dd036.svg" />

      <section className="bg-surface py-14 md:py-20">
        <Container>
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

      <Container>
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

      <ContactCta />
    </main>
  );
}
