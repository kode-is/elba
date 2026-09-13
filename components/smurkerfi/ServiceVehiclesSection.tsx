import Image from "next/image";
import { Container } from "@/components/Container";
import { Carousel } from "@/components/Carousel";
import type { Img } from "@/lib/types";

// docs/scrape/smurkerfi.json blocks 41-50: six photos (each repeated four
// times in the scrape = the live infinite-scroll carousel) plus the two
// arrow icons, positioned in the "Vel útbúnir þjónustubílar" section
// alongside its heading and tagline (docs/reference/smurkerfi.desktop.jpg
// shows this exact photo — with prev/next chevrons and dot pagination —
// where the scrape places the carousel blocks). Alt texts describe what's
// actually in each photo (replacing the scrape's stock-template leftovers
// like "Kitchen installation" — see task-16 final fix wave report).
const CAROUSEL_IMAGES: Img[] = [
  {
    src: "/images/smurkerfi/11-398b7a7e.jpeg",
    alt: "Opið vélarrými vinnuvélar með smurkerfi uppsettu",
    width: 1024,
    height: 1365,
  },
  {
    src: "/images/smurkerfi/12-ea960e01.jpg",
    alt: "Beltagrafa með verkfæri og smurkerfishluti á jörðu",
    width: 1024,
    height: 768,
  },
  {
    src: "/images/smurkerfi/13-ff6a4cca.jpg",
    alt: "Beltagrafa og þjónustubíll Skralla á athafnasvæði",
    width: 1024,
    height: 768,
  },
  { src: "/images/smurkerfi/14-2234de63.jpg", alt: "Skralli og grafa", width: 1024, height: 768 },
  {
    src: "/images/smurkerfi/15-a810ffe2.jpg",
    alt: "Stór CAT-vinnuvél við þjónustubíl Skralla",
    width: 1024,
    height: 768,
  },
  {
    src: "/images/smurkerfi/16-4447d960.jpg",
    alt: "CAT-vinnuvél með skóflu og þjónustubílar Skralla",
    width: 1024,
    height: 768,
  },
];

const PREV_ARROW: Img = { src: "/images/smurkerfi/35-8ea812bc.svg", alt: "Back Arrow", width: 40, height: 40 };
const NEXT_ARROW: Img = { src: "/images/smurkerfi/36-192ac70b.svg", alt: "Next Arrow", width: 40, height: 40 };

// docs/scrape/smurkerfi.json blocks 51-58: two info cards. The scraper
// captured a `link` block with concatenated text ("Koppafeiti í
// áskrift" + its blurb) immediately before image 38 — the live "Koppafeiti
// í áskrift" card is an <a>, but no href was captured. `curl -sL -A Mozilla
// https://skralli.is/smurkerfi | grep -o 'href="[^"]*"'` (run for this task)
// lists every other link on the page but nothing plausible for this card
// either, and the reference screenshot doesn't reveal one, so per the task-9
// brief this renders as a non-link card instead of guessing a destination.
const REPAIR_KIT_IMAGE: Img = { src: "/images/smurkerfi/37-f322c560.jpeg", alt: "", width: 569, height: 759 };
const SUBSCRIPTION_IMAGE: Img = { src: "/images/smurkerfi/38-131a47c4.jpeg", alt: "", width: 570, height: 759 };

export function ServiceVehiclesSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Carousel
            images={CAROUSEL_IMAGES}
            prevArrow={PREV_ARROW}
            nextArrow={NEXT_ARROW}
            label="Vel útbúnir þjónustubílar"
          />
          <div>
            <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">
              Vel útbúnir þjónustubílar
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
              Við mætum, bilanagreinum og gerum við
              <br />- hvar sem er.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={REPAIR_KIT_IMAGE.src}
                alt={REPAIR_KIT_IMAGE.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="font-ui text-lg font-semibold text-neutral-900">Viðgerðatöskur</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Viðgerðatöskur sérsniðnar að þínum þörfum. Allt sem þú þarft til þess að sinna
                viðhaldi á þínu smurkerfi. Þegar eitthvað klárast hefur þú einfaldlega samband og
                við fyllum á.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-sm">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={SUBSCRIPTION_IMAGE.src}
                alt={SUBSCRIPTION_IMAGE.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="font-ui text-lg font-semibold text-neutral-900">Koppafeiti í áskrift</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Við sendum þér koppafeiti reglulega eða komum sjálfir og fyllum á - allt eftir
                þínum óskum.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
