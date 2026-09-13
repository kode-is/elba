import Image from "next/image";
import Link from "next/link";
import type { Img } from "@/lib/types";

type ArticleCardProps = {
  title: string;
  href: string;
  image: Img;
  /** Not present in the scrape for any current article card — optional so a future summary-bearing caller can pass one without a prop-shape change. */
  excerpt?: string;
  /**
   * "tile" (default): vertical card (image top, cream footer with title +
   * "Les mer →") used by the /artikler index grid (docs/scrape/
   * artikler.json blocks 4-23, docs/reference/artikler.desktop.jpg/
   * .mobile.jpg).
   * "row": compact horizontal card (220px image left, text right on
   * desktop; full-width image on top, text below on mobile) used by the
   * home page's narrow "Nyeste artikler" sidebar column (docs/scrape/
   * home.json blocks 83-94, docs/reference/home.desktop.jpg/.mobile.jpg) —
   * three of these stacked next to the heading/text/button column is a
   * very different shape from three "tile" cards, so it needs its own
   * layout rather than reusing the grid card's markup.
   * Both variants share the same `{ title, href, image, excerpt? }`
   * interface; whole card is the link either way.
   */
  variant?: "tile" | "row";
};

export function ArticleCard({ title, href, image, excerpt, variant = "tile" }: ArticleCardProps) {
  if (variant === "row") {
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
          {excerpt ? <p className="mt-2 text-sm leading-relaxed text-neutral-600">{excerpt}</p> : null}
          <p className="mt-3 text-sm font-semibold text-brand">Les mer →</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="flex flex-col overflow-hidden rounded-2xl bg-surface transition hover:opacity-90">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-ui text-lg font-semibold text-neutral-900">{title}</h3>
        {excerpt ? <p className="mt-2 text-sm leading-relaxed text-neutral-600">{excerpt}</p> : null}
        <p className="mt-3 text-sm font-semibold text-brand">Les mer →</p>
      </div>
    </Link>
  );
}
