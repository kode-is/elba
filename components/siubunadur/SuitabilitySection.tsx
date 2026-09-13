import { Container } from "@/components/Container";

// docs/scrape/siubunadur.json blocks 14-18: five bare H3s with no body copy
// or images in the scrape, shown as plain white pill tiles in a 3-column
// grid (docs/reference/siubunadur.desktop.jpg — row 1 has 3 equal-width
// tiles, the last 2 wrap into row 2 under columns 1-2), one column per row
// on mobile (docs/reference/siubunadur.mobile.jpg).
const SUITABILITY = [
  "Endurvinnsla",
  "Jarðgerð",
  "Flutningar og geymsla",
  "Niðurrif bygginga",
  "Námuvinnsla",
];

export function SuitabilitySection() {
  return (
    <section className="bg-[#f0f4fa] pt-[105px] pb-16 md:pt-[125px] md:pb-20">
      <Container>
        <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">Hvar hentar BMair?</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
          Sérhver grein hefur sín efni sem hafa áhrif á loftgæði og heilsu vélamanna.
        </p>
        {/* Partial bold from docs/scrape/formatting.json's "strong" list. */}
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
          Við höfum búnaðinn sem hentar{" "}
          <strong className="font-semibold text-neutral-900">þínu umhverfi</strong> best, hvort
          sem það er:
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {SUITABILITY.map((item) => (
            <div key={item} className="rounded-2xl bg-white px-6 py-4 shadow-sm">
              <h3 className="font-ui text-base font-semibold text-neutral-900">{item}</h3>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm leading-relaxed text-neutral-600 md:text-base">
          Ert þú eða þitt starfsfólk að vinna í menguðu umhverfi?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-base">
          Fáðu tilboð strax í dag og taktu stjórn á loftgæðunum.
        </p>
      </Container>
    </section>
  );
}
