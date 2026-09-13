import Image from "next/image";
import Link from "next/link";
import type { Img } from "@/lib/types";

type ArticleCardProps = {
  title: string;
  href: string;
  image: Img;
  /** Not present in the scrape for any current article card — optional so a future summary-bearing caller can pass one without a prop-shape change. */
  excerpt?: string;
};

/**
 * Vertical card (image top, cream footer with title + "Les mer →") used by
 * the /artikler index grid (docs/scrape/artikler.json blocks 4-23,
 * docs/reference/artikler.desktop.jpg/.mobile.jpg) — the whole card is the
 * link. Previously a horizontal image-left/text-right card tuned for the
 * home page's narrow sidebar list; /artikler owns this file now, per this
 * component's own history, and a later task points home's own article list
 * at this same shape.
 */
export function ArticleCard({ title, href, image, excerpt }: ArticleCardProps) {
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
