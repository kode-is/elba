import { Container } from "@/components/Container";
import { Carousel } from "@/components/Carousel";
import { BulletList } from "@/components/BulletList";
import { DotDivider } from "@/components/DotDivider";
import type { Img } from "@/lib/types";

// docs/scrape/fyrirokumannin.json blocks 45-75: a second photo carousel
// (5 unique photos, each repeated 4x — 5 dots in docs/reference/
// fyrirokumannin.desktop.jpg's pagination) on the left, heading/copy/list
// on the right. docs/reference/fyrirokumannin.mobile.jpg stacks these in
// the opposite order from the DOM's visual desktop side (text above,
// carousel below), unlike SeatCoversSection where DOM order already
// matches both breakpoints — so the carousel is placed second in markup
// (matching the JSON's own block order) and pulled to the left column
// only at the md breakpoint via `md:order-first`.
const CAROUSEL_IMAGES: Img[] = [
  { src: "/images/fyrirokumannin/32-b915af96.png", alt: "", width: 6000, height: 4000 },
  { src: "/images/fyrirokumannin/33-ae952cb3.png", alt: "", width: 4000, height: 6000 },
  { src: "/images/fyrirokumannin/34-5dae7337.png", alt: "", width: 4000, height: 6000 },
  { src: "/images/fyrirokumannin/35-b9bddba2.png", alt: "", width: 4000, height: 6000 },
  { src: "/images/fyrirokumannin/36-c679b572.png", alt: "", width: 4000, height: 6000 },
];

const PREV_ARROW: Img = { src: "/images/smurkerfi/35-8ea812bc.svg", alt: "Back Arrow", width: 40, height: 40 };
const NEXT_ARROW: Img = { src: "/images/smurkerfi/36-192ac70b.svg", alt: "Next Arrow", width: 40, height: 40 };

// block 73 "Dráttarvélar" has no `list` annotation in the scrape, but
// docs/scrape/formatting.json's raw `lists` array confirms it as the 4th
// item of this same list, and docs/reference/fyrirokumannin.desktop.jpg
// shows it bulleted alongside the other three.
const ITEMS = ["Vinnubíla", "Vörubíla", "Vinnuvélar", "Dráttarvélar"];

export function FloorMatsSection() {
  return (
    <section className="bg-white">
      <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">Gólfmottur</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
            Slitsterkar gólfmottur sem þola mikla notkun. Sérsniðið að gólfinu í hverju tæki og
            renna þannig ekki til líkt og alhliða gólfmottur eiga til að gera.
          </p>
          <div className="hidden md:block">
            <p className="mt-6 text-sm font-semibold text-neutral-900">Fyrir</p>
            <BulletList items={ITEMS} className="mt-3" />
            <p className="mt-4 text-sm font-semibold text-neutral-900">21.700kr m/vsk.</p>
          </div>
          {/* docs/scrape/mobile-only.json's /fyrirokumannin entry: at phone
              widths the live site collapses both this section's and
              SeatCoversSection's per-vehicle "Fyrir" lists into one
              condensed line, and this price into "16.800+vsk kr." — verbatim
              text from that scrape, not a design guess. */}
          <div className="md:hidden">
            <p className="mt-6 text-sm font-semibold text-neutral-900">
              Fyrir vinnubíla, vörubíla, vinnuvélar og dráttarvélar
            </p>
            <p className="mt-4 text-sm font-semibold text-neutral-900">16.800+vsk kr.</p>
          </div>
        </div>
        <div className="md:order-first">
          <Carousel
            images={CAROUSEL_IMAGES}
            prevArrow={PREV_ARROW}
            nextArrow={NEXT_ARROW}
            label="Gólfmottur"
          />
        </div>
      </Container>

      {/* docs/scrape/fyrirokumannin.json block 75. */}
      <DotDivider className="mt-[60px]" />
    </section>
  );
}
