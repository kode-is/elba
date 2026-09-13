import Image from "next/image";
import { Container } from "@/components/Container";

// docs/scrape/um-okkur.json blocks 6-11.
const HEADING = "Við trúum á gæði og fagmennsku.";
const TEXT =
  "Við leggjum okkur fram við að veita fyrsta flokks þjónustu og skapa jákvæða upplifun fyrir viðskiptavini okkar. Sérhver lausn er sérsniðin til að mæta þínum þörfum og veita áreiðanlegar niðurstöður. Samheldni og fagmennska eru lykilatriði í okkar starfi.";

const IMAGES = [
  { src: "/images/um-okkur/02-c7059e7f.jpeg", alt: "Aðstaða", width: 270, height: 360 },
  { src: "/images/um-okkur/03-9b3d1db5.jpeg", alt: "Aðstaða", width: 270, height: 360 },
];

export function AboutIntro() {
  return (
    <section className="bg-white pt-12 pb-16 md:pt-16 md:pb-20">
      <Container className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">{HEADING}</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">
            {TEXT}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {IMAGES.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl"
              style={{ aspectRatio: `${image.width} / ${image.height}` }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
