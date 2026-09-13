import { Container } from "@/components/Container";
import { BulletList } from "@/components/BulletList";

// docs/scrape/vetrarbunadur.json blocks 10-24.
const VEHICLE_TYPES = ["Vinnuvélar", "Vörubílar", "Dráttarvélar"];
const SPIKE_TYPES = ["Flatkantur / fírkant", "U-broddar", "Gaddar"];
const ACCESSORIES = ["Keðjuefni", "Viðgerðahlekkir", "Strekkjarar", "Verkfæri / keðjutangir"];

export function ChainsSection() {
  return (
    <section className="bg-white py-10 md:py-14">
      <Container className="max-w-3xl">
        <h3 className="font-ui text-2xl font-semibold text-neutral-900 md:text-3xl">Snjókeðjur</h3>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
          Lilleseth er norskt rótgróið fjölskyldufyrirtæki stofnað 1947 og sérhæfir sig í
          snjókeðjum fyrir bíla og tæki af öllum gerðum. Allar keðjur eru sérsniðnar og einfaldar í
          uppsetningu og eru því sérstaklega þægilegar í notkun.
        </p>
        <BulletList items={VEHICLE_TYPES} className="mt-4" />

        <h5 className="mt-10 font-ui text-lg font-semibold text-neutral-900">Gerðir brodda</h5>
        <BulletList items={SPIKE_TYPES} className="mt-3" />

        <h5 className="mt-10 font-ui text-lg font-semibold text-neutral-900">Aukahlutir</h5>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
          Við bjóðum upp á breitt úrval af varahlutum og verkfærum fyrir snjókeðjur.
        </p>
        <BulletList items={ACCESSORIES} className="mt-3" />
      </Container>
    </section>
  );
}
