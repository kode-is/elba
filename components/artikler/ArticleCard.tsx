import Image from "next/image";
import Link from "next/link";
import type { Img } from "@/lib/types";

type ArticleCardProps = {
  title: string;
  href: string;
  image: Img;
};

/**
 * Horizontal-on-desktop, stacked-on-mobile article card (image + H3 title +
 * "Les mer →") used by the home page's "Nyeste artikler" section
 * (docs/scrape/home.json blocks 83-94) — the whole card is the link. Task 7
 * owns /artikler and may replace this file with its own version of the same
 * `{ title, href, image }` interface.
 */
export function ArticleCard({ title, href, image }: ArticleCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col overflow-hidden rounded-2xl bg-surface transition hover:bg-surface/70 md:flex-row md:items-stretch md:gap-5"
    >
      <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-auto md:w-[220px]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 768px) 220px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center px-6 py-5 md:px-0 md:py-5 md:pr-6">
        <h3 className="font-ui text-lg font-semibold text-neutral-900 md:text-xl">{title}</h3>
        <p className="mt-3 text-sm font-semibold text-brand">Les mer →</p>
      </div>
    </Link>
  );
}
