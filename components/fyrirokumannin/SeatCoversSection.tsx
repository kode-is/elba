import { Container } from "@/components/Container";
import { Carousel } from "@/components/Carousel";
import { BulletList } from "@/components/BulletList";
import type { Img } from "@/lib/types";

// docs/scrape/fyrirokumannin.json blocks 7-44: heading/copy/price-list on
// the left, a photo carousel on the right (docs/reference/
// fyrirokumannin.desktop.jpg — 7 dots in the pagination, matching the 7
// unique photos below, each repeated 4x in the scrape for the live
// infinite-scroll carousel).
const CAROUSEL_IMAGES: Img[] = [
  { src: "/images/fyrirokumannin/02-a5d3e9bb.jpeg", alt: "", width: 3024, height: 4032 },
  { src: "/images/fyrirokumannin/03-9926b7eb.jpg", alt: "", width: 3543, height: 5315 },
  { src: "/images/fyrirokumannin/04-826b8643.jpeg", alt: "", width: 2736, height: 3648 },
  { src: "/images/fyrirokumannin/05-aed3f052.jpeg", alt: "", width: 2653, height: 3441 },
  { src: "/images/fyrirokumannin/06-33611083.jpeg", alt: "", width: 3024, height: 4032 },
  { src: "/images/fyrirokumannin/07-cb83398b.jpeg", alt: "", width: 3024, height: 4032 },
  { src: "/images/fyrirokumannin/08-1d1531ef.jpeg", alt: "", width: 3024, height: 4032 },
];

const PREV_ARROW: Img = { src: "/images/smurkerfi/35-8ea812bc.svg", alt: "Back Arrow", width: 40, height: 40 };
const NEXT_ARROW: Img = { src: "/images/smurkerfi/36-192ac70b.svg", alt: "Next Arrow", width: 40, height: 40 };

const PRICE_LIST = [
  "Vinnubíla - frá 70.629kr m/vsk.",
  "Vörubíla - 46.872kr m/vsk.",
  "Vinnuvélar - 43.400kr m/vsk.",
  "Dráttarvélar - 43.400kr m/vsk.",
];

export function SeatCoversSection() {
  return (
    <section className="bg-white py-14 md:py-16">
      <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">Sætisáklæði</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
            Vönduð sætisáklæði, sérsniðin fyrir hvern framleiðanda. Stílhrein og nákvæm hönnun sem
            sér til þess að efnið færist ekki til þegar er verið að fara oft inn í og úr
            ökutækinu. Áklæðin gera ráð fyrir því hvort sætin séu með loftpúða, höfuðpúða eða
            innbyggð borð.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
            Veldu tau eða leðurlíki.
          </p>
          <div className="hidden md:block">
            <p className="mt-6 text-sm font-semibold text-neutral-900">Fyrir</p>
            <BulletList items={PRICE_LIST} className="mt-3" />
          </div>
          {/* docs/scrape/mobile-only.json's /fyrirokumannin entry: at phone
              widths the live site replaces this per-vehicle price list (and
              FloorMatsSection's) with one condensed line — verbatim text
              from that scrape, not a design guess. */}
          <p className="mt-6 text-sm font-semibold text-neutral-900 md:hidden">
            Fyrir vinnubíla, vörubíla, vinnuvélar og dráttarvélar
          </p>
        </div>
        <Carousel
          images={CAROUSEL_IMAGES}
          prevArrow={PREV_ARROW}
          nextArrow={NEXT_ARROW}
          label="Sætisáklæði"
        />
      </Container>
    </section>
  );
}
