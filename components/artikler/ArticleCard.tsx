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
   * "row": compact horizontal card (image left, text right; full-width
   * image on top, text below when the card itself is narrow) used by the
   * home page's narrow "Nyeste artikler" sidebar column (docs/scrape/
   * home.json blocks 83-94, docs/reference/home.desktop.jpg/.mobile.jpg) —
   * three of these stacked next to the heading/text/button column is a
   * very different shape from three "tile" cards, so it needs its own
   * layout rather than reusing the grid card's markup. Its breakpoints are
   * container queries on the card's own width, not the viewport's: the same
   * card is ~335px wide on a phone, up to ~920px in the single-column
   * tablet layout and 430-590px in the desktop sidebar, and a viewport
   * breakpoint can't tell those apart (it used to squeeze the title into
   * ~80px and clip it at 768-1100px).
   * Both variants share the same `{ title, href, image, excerpt? }`
   * interface; whole card is the link either way.
   */
  variant?: "tile" | "row";
};

export function ArticleCard({ title, href, image, excerpt, variant = "tile" }: ArticleCardProps) {
  if (variant === "row") {
    return (
      <div className="@container">
        <Link
          href={href}
          className="flex flex-col overflow-hidden rounded-2xl bg-surface transition hover:bg-surface/70 @sm:flex-row @sm:items-stretch @sm:gap-5"
        >
          <div className="relative h-48 w-full shrink-0 overflow-hidden @sm:h-auto @sm:min-h-[150px] @sm:w-[160px] @lg:w-[220px]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 480px) 220px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-5 @sm:px-0 @sm:pr-6">
            <h3 className="font-ui text-card font-semibold text-black @lg:text-card-lg">{title}</h3>
            {excerpt ? <p className="mt-2 font-ui text-body text-ink-muted md:text-body-lg">{excerpt}</p> : null}
            <p className="mt-3 text-body font-semibold text-brand md:text-body-lg">Les mer →</p>
          </div>
        </Link>
      </div>
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
        <h3 className="font-ui text-card font-semibold text-black md:text-card-lg">{title}</h3>
        {excerpt ? <p className="mt-2 font-ui text-body text-ink-muted md:text-body-lg">{excerpt}</p> : null}
        <p className="mt-3 text-body font-semibold text-brand md:text-body-lg">Les mer →</p>
      </div>
    </Link>
  );
}
