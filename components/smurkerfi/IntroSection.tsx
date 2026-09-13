import Image from "next/image";
import { Container } from "@/components/Container";

// docs/scrape/smurkerfi.json blocks 8-11.
const IMAGE = { src: "/images/smurkerfi/02-0914980d.png", alt: "", width: 1200, height: 799 };
const HEADING = "Sjálfvirk smurkerfi";
const TEXT =
  "Heildstæð lausn fyrir vinnuvélar, landbúnað, stóriðju og matvælaframleiðslu. Sjálfvirk smurkerfi sjá til þess að viðhalda réttu magni af feiti í öllum smurpunktum á meðan vélin er í gangi og því engar áhyggjur af því að vera ekki að smyrja nógu oft.";
const CALLOUT = "Sjálfvirk smurkerfi minnka viðhald og lengja líftíma vélarinnar.";

export function IntroSection() {
  return (
    <section className="bg-white pt-10 pb-16 md:pt-14 md:pb-20">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div
            className="relative mx-auto w-full max-w-md"
            style={{ aspectRatio: `${IMAGE.width} / ${IMAGE.height}` }}
          >
            <Image
              src={IMAGE.src}
              alt={IMAGE.alt}
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">{HEADING}</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
              {TEXT}
            </p>
          </div>
        </div>
        <h5 className="mt-14 text-center text-base font-semibold italic text-neutral-800 md:mt-16 md:text-lg">
          {CALLOUT}
        </h5>
      </Container>
    </section>
  );
}
