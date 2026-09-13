import Image from "next/image";
import type { Img } from "@/lib/types";

type PhotoCollageProps = {
  main: Img;
  inset: Img;
  className?: string;
};

/**
 * A tall photo with a smaller landscape photo overlapping its bottom-right
 * corner — /anlegg's pair beside the FAQ and /industri's pair beside
 * "Tilpassede serviceavtaler" both scrape as two consecutive `image` blocks
 * whose alt text is the same generic stock-photo placeholder ("Interior
 * work"), and docs/reference/industri.desktop.jpg shows exactly this
 * layered-photo shape, so the same two-image collage is reused for both.
 */
export function PhotoCollage({ main, inset, className }: PhotoCollageProps) {
  return (
    <div className={`relative${className ? ` ${className}` : ""}`}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
        <Image src={main.src} alt={main.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="absolute -bottom-6 -right-6 hidden aspect-[4/3] w-[55%] overflow-hidden rounded-2xl border-4 border-white shadow-lg md:block">
        <Image
          src={inset.src}
          alt={inset.alt}
          fill
          sizes="(min-width: 768px) 27vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
