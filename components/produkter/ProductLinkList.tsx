import Image from "next/image";
import Link from "next/link";
import type { Img } from "@/lib/types";

export type ProductLink = { text: string; href: string; image: Img };

type ProductLinkListProps = {
  items: ProductLink[];
};

/**
 * The eleven product-category cards on /produkter (docs/scrape/
 * produkter.json blocks 17-49) — each card a link wrapping an image + H3,
 * laid out as a CSS multi-column ("masonry") list: docs/reference/
 * produkter.desktop.jpg's three visual rows don't match the scrape's DOM
 * order (Fett, Skruhylser, Forlengere, Skottgjennomføring, Slanger, …), but
 * reading top-to-bottom column-by-column does — column 1 is items 1-4,
 * column 2 is items 5-8, column 3 is items 9-11 — which is exactly how a
 * `columns-*` layout fills. Two of the scraped hrefs/texts carry a leading
 * U+200B on live (Skottgjennomføring, Lynfittings); callers strip it before
 * passing `text`/`href` here since it's not visible copy.
 */
export function ProductLinkList({ items }: ProductLinkListProps) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="mb-6 block break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm transition hover:opacity-90"
        >
          <div className="relative w-full" style={{ aspectRatio: `${item.image.width} / ${item.image.height}` }}>
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <h3 className="font-ui text-[20px] leading-[1.4] font-semibold text-black">{item.text}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
