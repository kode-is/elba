import Image from "next/image";
import type { Img } from "@/lib/types";

export type IndustryCard = { caption: string; image: Img };

type IndustryGridProps = {
  items: IndustryCard[];
};

/**
 * The ten industry photo cards at the bottom of /industri (docs/scrape/
 * industri.json blocks 37-56) — a horizontally scrolling strip of
 * fixed-width, differing-height photo tiles with a dark gradient and a
 * white caption in the bottom-left corner (docs/reference/
 * industri.desktop.jpg). The live page drives this as an interactive
 * carousel with prev/next arrows; this recreation keeps every card in one
 * scrollable row (all ten stay in the DOM, matching `npm run verify`'s
 * image-count check) without reproducing the arrow controls, which the
 * task brief doesn't ask for.
 */
export function IndustryGrid({ items }: IndustryGridProps) {
  return (
    <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 md:-mx-[50px] md:px-[50px]">
      {items.map((item) => (
        <div
          key={item.caption}
          className="relative w-[220px] shrink-0 overflow-hidden rounded-2xl md:w-[287px]"
          style={{ aspectRatio: `${item.image.width} / ${item.image.height}` }}
        >
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(min-width: 768px) 287px, 220px"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0"
          />
          <p className="absolute bottom-4 left-4 font-ui text-base font-semibold text-white">{item.caption}</p>
        </div>
      ))}
    </div>
  );
}
