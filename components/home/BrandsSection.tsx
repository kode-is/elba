import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { brands } from "@/lib/brands";
import type { Img } from "@/lib/types";

// The three brands featured here use their own card artwork (docs/scrape/
// home.json blocks 92/96/100), distinct from the brand-strip marquee logos
// in lib/brands.ts.
const FEATURED: { id: string; image: Img }[] = [
  { id: "hammerglass", image: { src: "/images/home/30-51b0fe1c.png", alt: "Hammerglass", width: 220, height: 171 } },
  {
    id: "um-beka",
    image: { src: "/images/home/31-8e2b1073.svg", alt: "Groenevald-BEKA logo", width: 264, height: 288 },
  },
  {
    id: "lilleseth-kjetting",
    image: { src: "/images/home/32-4354a44e.png", alt: "Lilleseth Kjetting", width: 220, height: 150 },
  },
];

export function BrandsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <div>
            <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">
              Kynntu þér vörumerkin okkar
            </h2>
            <p className="mt-4 max-w-sm text-sm text-neutral-600 md:text-base">
              Við bjóðum eingöngu upp á vörur frá þekktum og viðurkenndum aðilum
            </p>
            <Link
              href="/vorumerki"
              className="mt-8 inline-flex w-fit items-center justify-center rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-mid"
            >
              Skoða nánar
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {FEATURED.map((featured) => {
              const brand = brands.find((b) => b.id === featured.id);
              if (!brand) return null;
              return (
                <div
                  key={brand.id}
                  className="flex items-center gap-6 rounded-2xl bg-[#f0f4fa] p-6"
                >
                  <Image
                    src={featured.image.src}
                    alt={featured.image.alt}
                    width={featured.image.width}
                    height={featured.image.height}
                    className="h-14 w-auto shrink-0 object-contain"
                  />
                  <div>
                    <h3 className="font-ui text-lg font-semibold text-neutral-900">{brand.name}</h3>
                    <Link
                      href={brand.href}
                      className="mt-1 inline-flex items-center text-sm font-semibold text-brand-dark transition hover:underline"
                    >
                      Skoða nánar →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
