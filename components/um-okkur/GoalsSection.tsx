import Image from "next/image";
import type { SVGProps } from "react";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

// docs/scrape/um-okkur.json blocks 10-16. The three checklist items repeat
// the site motto (lib/site.ts `motto`) rather than hardcoding the copy again.
const HEADING = "Markmið okkar.";
const TEXT =
  "Okkar markmið er að skapa traust og ánægju viðskiptavina. Við einsetjum okkur að fylgja þér alla leið og tryggja að þú fáir það sem þú þarfnast til að ná sem mestum árangri.";
const CHECKLIST = site.motto.split(" - ");

// Dimensions from docs/asset-manifest.json (the scrape's recorded source size
// for each downloaded image).
const MAIN_IMAGE = {
  src: "/images/um-okkur/04-ab45b0b4.jpeg",
  alt: "Nærmynd af stýrishúsi og slöngum vinnuvélar",
  width: 514,
  height: 686,
};
// Source is 228x407 (aspect ~0.56, a tall portrait crop), but
// docs/reference/um-okkur.desktop.jpg pixel-measures this overlapping
// thumbnail's rendered box at ~240x325px (aspect ~0.74) — the live site
// crops it to roughly the same 3:4 box as the main photo, not to its native
// aspect ratio. Kept as a named, documented constant rather than an
// unexplained "hand-eyeballed" class.
const OVERLAY_IMAGE = {
  src: "/images/um-okkur/05-baa00a71.jpg",
  alt: "Starfsmaður Skralla við Lokotrack-vinnsluvél á námusvæði",
  aspectRatio: "3 / 4",
};

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="m5 12.5 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GoalsSection() {
  return (
    <section className="bg-white pb-16 md:pb-20">
      <Container className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div
          className="relative mx-auto w-full max-w-sm md:mx-0"
          style={{ aspectRatio: `${MAIN_IMAGE.width} / ${MAIN_IMAGE.height}` }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <Image
              src={MAIN_IMAGE.src}
              alt={MAIN_IMAGE.alt}
              fill
              sizes="(min-width: 768px) 33vw, 80vw"
              className="object-cover"
            />
          </div>
          <div
            className="absolute -bottom-8 -right-8 w-2/5 overflow-hidden rounded-2xl ring-4 ring-white"
            style={{ aspectRatio: OVERLAY_IMAGE.aspectRatio }}
          >
            <Image
              src={OVERLAY_IMAGE.src}
              alt={OVERLAY_IMAGE.alt}
              fill
              sizes="(min-width: 768px) 15vw, 35vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-8 md:mt-0">
          <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">{HEADING}</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">
            {TEXT}
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <h4 className="font-ui font-semibold text-neutral-900">{item}</h4>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
