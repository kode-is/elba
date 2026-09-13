import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import type { Img } from "@/lib/types";

// docs/scrape/fyrirokumannin.json blocks 76-80.
const IMAGE: Img = { src: "/images/fyrirokumannin/55-d2881ae9.jpg", alt: "", width: 305, height: 279 };
// Live renders this image in a 305 × 254 box (full width on mobile), not at its intrinsic ratio.

const BUTTON_CLASSES =
  "inline-flex w-fit items-center justify-center rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-mid";

export function ShoeTraySection() {
  return (
    <section className="bg-[#f0f4fa] pt-[30px] pb-16 md:pb-20">
      <Container className="grid items-center gap-6 md:grid-cols-2 md:gap-16">
        <div>
          <h3 className="text-2xl font-semibold text-neutral-900 md:text-3xl">
            Ekki vaða inn á skítugum skónum
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
            Í samstarfi við PeBe höfum við þróað sérútbúna skóbakka úr þykku gúmmíi með kanti.
          </p>
          <h3 className="mt-6 text-xl font-semibold text-neutral-900">8.060kr m/vsk.</h3>
          <Link href="/hafa-samband" className={`mt-6 ${BUTTON_CLASSES}`}>
            Hafa samband
          </Link>
        </div>
        <div
          className="relative order-first mx-auto w-full overflow-hidden rounded-2xl shadow-sm md:order-none md:w-[305px]"
          style={{ aspectRatio: "305 / 254" }}
        >
          <Image
            src={IMAGE.src}
            alt={IMAGE.alt}
            fill
            sizes="(min-width: 768px) 40vw, 90vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
