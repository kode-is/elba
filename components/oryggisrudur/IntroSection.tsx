import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { DotDivider } from "@/components/DotDivider";
import type { Img } from "@/lib/types";

// docs/scrape/oryggisrudur.json blocks 8-11.
const IMAGE: Img = {
  src: "/images/oryggisrudur/02-d5004001.jpg",
  alt: "Hammerglass hljóðvistarveggir",
  width: 1199,
  height: 775,
};

const BUTTON_CLASSES =
  "inline-flex w-fit items-center justify-center rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-mid";

export function IntroSection() {
  return (
    <section className="bg-white pt-10 md:pt-14">
      <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div
          className="relative w-full overflow-hidden rounded-2xl shadow-md"
          style={{ aspectRatio: `${IMAGE.width} / ${IMAGE.height}` }}
        >
          <Image
            src={IMAGE.src}
            alt={IMAGE.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-neutral-900 md:text-3xl">Hammerglass er málið!</h3>
          {/* Partial bold from docs/scrape/formatting.json's "strong" list
              for this route: three phrases inside this one paragraph. */}
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
            Skralli býður íslenskum sveitarfélögum, verktökum og fyrirtækjum{" "}
            <strong className="font-semibold text-neutral-900">óbrjótanlegt öryggi</strong> í
            samgöngumannvirkjum, ökutækjum og byggingum. Með Hammerglass færðu öruggar og{" "}
            <strong className="font-semibold text-neutral-900">endingargóðar rúður</strong> sem
            henta við íslenskar aðstæður og veita{" "}
            <strong className="font-semibold text-neutral-900">hámarks vernd</strong> gegn
            utanaðkomandi hættum.
          </p>
          <Link href="/hafa-samband" className={`mt-8 ${BUTTON_CLASSES}`}>
            Hafa samband
          </Link>
        </div>
      </Container>

      {/* docs/scrape/oryggisrudur.json block 12. */}
      <DotDivider className="mt-[60px] md:mt-[28px]" />
    </section>
  );
}
