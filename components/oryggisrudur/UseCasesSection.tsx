import { Container } from "@/components/Container";
import { FeatureCard } from "@/components/FeatureCard";
import type { Img } from "@/lib/types";

// docs/scrape/oryggisrudur.json block 21: italic callout between the
// "Styrkleikar" band and the three use-case cards below.
const CALLOUT = "Óbrjótanlegt. Eldhamlandi. Hljóðdempandi.";

type UseCase = { heading: string; text: string; image: Img };

// docs/scrape/oryggisrudur.json blocks 22-30 (image alts kept verbatim —
// "Dælur" and "Fleygafeiti" are leftover alts from other routes' photos).
// Dimensions are the downloaded files' real pixel size (`sips -g pixelWidth
// -g pixelHeight`), not the scrape's thumbnail-srcset size (383×247 /
// 383×246), so FeatureCard's `aspectRatio` box matches each photo instead of
// stretching or cropping it under `object-cover`.
const USE_CASES: UseCase[] = [
  {
    heading: "Vinnuvélar",
    text: "Hammerglass tryggir öryggi ökumannsins á vinnusvæðum þar sem hætta er á grjóthruni eða þungum hlutum í lausu lofti.",
    image: { src: "/images/oryggisrudur/04-26b92505.jpg", alt: "Dælur", width: 650, height: 420 },
  },
  {
    heading: "Fasteignir/verslanir",
    text: "Hammerglass gluggarúður fyrir verslanir og almenningsstaði þar sem hætta er á innbrotum eða skemmdarverkum.",
    image: {
      src: "/images/oryggisrudur/05-d1d8270c.jpg",
      alt: "Hammerglass verslanir",
      width: 650,
      height: 420,
    },
  },
  {
    heading: "Innviðir",
    text: "Rúður í hljóðmúra, skjólveggi og strætóskýli sem lágmarka viðhald og hámarka öryggi.",
    image: { src: "/images/oryggisrudur/06-b051e3ca.webp", alt: "Fleygafeiti", width: 1400, height: 900 },
  },
];

export function UseCasesSection() {
  return (
    <section className="bg-white pt-14 pb-16 md:pt-16 md:pb-20">
      <Container>
        <h5 className="text-center text-base font-semibold italic text-neutral-800 md:text-lg">
          {CALLOUT}
        </h5>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
          {USE_CASES.map((useCase) => (
            <FeatureCard
              key={useCase.heading}
              heading={useCase.heading}
              text={useCase.text}
              image={useCase.image}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
