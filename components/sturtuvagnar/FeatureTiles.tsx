import { Container } from "@/components/Container";

// The tile grid from lib/sturtuvagnar.ts's `groupFeatures` (currently only
// populated for the hjólagröfuvagnar group — see scripts/gen-sturtuvagnar.mjs).
// Used only by FeaturesSection.tsx on /sturtuvagnar itself, rendering this
// same data as a 3-column desktop grid (docs/reference/
// sturtuvagnar.desktop.jpg: 7 tiles as 3+3+1). Product pages render their
// own restyled tiles via ProductFeatureTiles.tsx instead, so this component
// no longer needs a per-caller column choice.
export function FeatureTiles({
  heading,
  items,
}: {
  heading: string;
  items: string[];
}) {
  return (
    <section className="bg-[#f0f4fa] py-16 md:py-20">
      <Container>
        <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">{heading}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center rounded-2xl bg-white px-6 py-5 shadow-sm"
            >
              <h3 className="font-ui text-base font-semibold text-neutral-900">{item}</h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
