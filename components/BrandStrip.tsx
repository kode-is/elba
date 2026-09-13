import Image from "next/image";
import { Container } from "@/components/Container";
import { brands } from "@/lib/brands";

// Native SVG/PNG dimensions for each brand-strip logo (docs/scrape/home.json
// blocks 8-13), used so next/image can size them without distortion while
// CSS constrains the rendered height.
const LOGO_SIZE: Record<string, { width: number; height: number }> = {
  gigant: { width: 380, height: 96 },
  hammerglass: { width: 497, height: 60 },
  "um-beka": { width: 500, height: 47 },
  "lilleseth-kjetting": { width: 100, height: 37 },
  pebe: { width: 260, height: 129 },
  bmair: { width: 300, height: 80 },
};

export function BrandStrip() {
  return (
    <div className="relative -mt-10 md:-mt-14 z-10">
      <Container>
        <div className="overflow-hidden rounded-2xl bg-brand-dark py-6 shadow-lg md:py-8">
          <div className="flex w-max animate-marquee items-center gap-16 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] md:gap-24">
            {[0, 1, 2].map((copy) =>
              brands.map((brand) => {
                const size = LOGO_SIZE[brand.id];
                return (
                  <div
                    key={`${copy}-${brand.id}`}
                    className="flex shrink-0 items-center justify-center"
                    aria-hidden={copy > 0 || undefined}
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={size.width}
                      height={size.height}
                      className="h-7 w-auto object-contain md:h-9"
                    />
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
