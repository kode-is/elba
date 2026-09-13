import Link from "next/link";
import { Container } from "@/components/Container";

// docs/scrape/oryggisrudur.json blocks 13-19: H2 "Styrkleikar Hammerglass"
// followed by five H3 "strength" tiles, laid out as a 2-column grid of
// plain white tiles (docs/reference/oryggisrudur.desktop.jpg) with the
// "Taktu skrefið" link (block 20) filling the otherwise-empty sixth cell.
const STRENGTHS = [
  "300 sinnum sterkara en gler",
  "Alveg gegnsætt",
  "Viðhaldslítið",
  "UV- og rispuþolið",
  "Brennur ekki, sjálfslökkvandi",
];

export function StrengthsSection() {
  return (
    <section className="bg-[#f0f4fa] pt-[63px] pb-16 md:pt-[75px] md:pb-20">
      <Container>
        <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">Styrkleikar Hammerglass</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {STRENGTHS.map((strength) => (
            <div key={strength} className="flex items-center rounded-2xl bg-white px-6 py-5 shadow-sm">
              <h3 className="font-ui text-base font-semibold text-neutral-900">{strength}</h3>
            </div>
          ))}
          <Link
            href="/hafa-samband"
            className="flex items-center justify-center rounded-2xl bg-brand-dark px-6 py-5 text-base font-semibold text-white transition hover:bg-brand-mid"
          >
            Taktu skrefið
          </Link>
        </div>
      </Container>
    </section>
  );
}
