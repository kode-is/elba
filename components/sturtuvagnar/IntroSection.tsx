import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import type { Img } from "@/lib/types";

// docs/scrape/sturtuvagnar.json blocks 8-13.
const HEADING = "Vertu lipur með Gigant.";
const TEXT =
  "Hjólagröfuvagnarnir frá Gigant eru einstaklega sterkir og liprir aftan í hjólagröfum. Útbúnir sérstöku bremsukerfi sem bremsar á lægri þrýstingi en venjulegur vagn, eða max 110 börum. Hjólagröfur bremsa á u.þ.b. 50-90 börum, en ekki þeim 160-180 börum sem dráttarvélar nota. Þetta lágmarkar álag á drifbúnaðinn.";

const IMAGE: Img = {
  src: "/images/sturtuvagnar/02-5d9ed090.jpg",
  alt: "",
  width: 1200,
  height: 900,
};

const BUTTON_CLASSES =
  "inline-flex w-fit items-center justify-center rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-mid";

export function IntroSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <h3 className="text-2xl font-semibold text-neutral-900 md:text-3xl">{HEADING}</h3>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">{TEXT}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/hafa-samband" className={BUTTON_CLASSES}>
              Hafa samband
            </Link>
            <Link href="/sturtuvagnar/hjolagrofuvagnar" className={BUTTON_CLASSES}>
              Sjá hjólagröfuvagna
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl shadow-md" style={{ aspectRatio: `${IMAGE.width} / ${IMAGE.height}` }}>
          <Image
            src={IMAGE.src}
            alt={IMAGE.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
