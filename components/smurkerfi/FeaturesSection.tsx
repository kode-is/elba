import { Container } from "@/components/Container";
import { DotDivider } from "@/components/DotDivider";
import { FeatureCard } from "@/components/FeatureCard";
import type { Img } from "@/lib/types";

type Feature = { heading: string; text: string; image: Img };

// docs/scrape/smurkerfi.json blocks 12-33 (image alts kept verbatim, some
// are empty in the scrape).
const FEATURES: Feature[] = [
  {
    heading: "Dælur",
    text: "Beka og Groeneveld smurdælur fyrir öll notkunarsvið.",
    image: { src: "/images/smurkerfi/03-c89d7570.jpeg", alt: "Dælur", width: 383, height: 511 },
  },
  {
    heading: "Koppafeiti",
    text: "MAX-2-LUBE (NLG2) með einstaklega mikla viðloðun og breitt hitasvið.",
    image: { src: "/images/smurkerfi/04-e1cf3aba.jpeg", alt: "Koppafeiti", width: 383, height: 511 },
  },
  {
    heading: "Fleygafeiti",
    text: "Gæða feiti fyrir flestar gerðir fleyga",
    image: { src: "/images/smurkerfi/05-56c71eb7.png", alt: "Fleygafeiti", width: 383, height: 383 },
  },
  {
    heading: "BEKA deiliblokkir",
    text: "Smurblokkir sem einfalt er að sníða að magni og fjölda smurpunkta fyrir hvert tæki.",
    image: { src: "/images/smurkerfi/06-77b497b7.png", alt: "", width: 383, height: 383 },
  },
  {
    heading: "Groeneveld skammtarar",
    text: "Sérsniðnir skammtarar að þörfum hvers tækis.",
    image: {
      src: "/images/smurkerfi/07-771eb8cc.png",
      alt: "Groeneveld skammtarar",
      width: 383,
      height: 255,
    },
  },
  {
    heading: "Fittings",
    text: "Breiðasta lagerúrval landsins af fittings fyrir 4mm, 5mm, 6mm og 8mm lagnir og enda.",
    image: { src: "/images/smurkerfi/08-ea5c5980.png", alt: "Fittings", width: 383, height: 383 },
  },
  {
    heading: "Fylltar slöngur",
    text: "Fylltar slöngur úr nylon eða gúmmí. Stærðir frá 4, 5, 6 eða 8 mm.",
    image: { src: "/images/smurkerfi/09-a521d77e.png", alt: "", width: 383, height: 383 },
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-white">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.heading}
              heading={feature.heading}
              text={feature.text}
              image={feature.image}
            />
          ))}
        </div>
      </Container>

      {/* Decorative dot pattern (docs/scrape/smurkerfi.json block 34, a 0x0
          CSS background rather than a visible <img>); live gap above: 60/50 px. */}
      <DotDivider className="mt-[60px] md:mt-[50px]" />
    </section>
  );
}
