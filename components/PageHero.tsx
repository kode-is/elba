import Image from "next/image";
import type { ReactNode } from "react";
import type { Img } from "@/lib/types";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

type PageHeroProps = {
  image: Img;
  /** Required unless `children` supplies custom content instead. */
  title?: string;
  subtitle?: string;
  /**
   * Hero band height, as Tailwind classes. Defaults to the inner-page hero
   * measured on live (318px mobile / 534px desktop on /om-oss and
   * /kontakt-oss — docs/measure.txt) as a *minimum* height, so a hero with a
   * long wrapping subtitle grows the way /anlegg's does. The product and
   * article heroes (438/479px) and not-found's full-viewport band pass their
   * own instead of duplicating this component's image+overlay markup.
   */
  height?: string;
  /** Tint overlay classes. Defaults to the standard `bg-black/50`; not-found's is a touch darker. */
  overlayClassName?: string;
  /** Content wrapper classes, in front of the overlay. Defaults to a centered block; not-found's needs a vertical flex stack instead. */
  contentClassName?: string;
  /** Breadcrumb trail, rendered as a band directly under the hero (as in kode-is/skralli-v2). Omit for no band (not-found). */
  crumbs?: BreadcrumbItem[];
  /** Custom content, replacing the default title/subtitle block (not-found's 404 heading + copy + link). `title` is unused when this is set. */
  children?: ReactNode;
};

export function PageHero({
  image,
  title,
  subtitle,
  height = "min-h-[318px] md:min-h-[534px]",
  overlayClassName = "bg-black/50",
  contentClassName = "px-6 text-center",
  crumbs,
  children,
}: PageHeroProps) {
  return (
    <>
      <div className={`relative flex ${height} items-center justify-center overflow-hidden py-12`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden="true" />
        <div className={`relative z-10 ${contentClassName}`}>
          {children ?? (
            <>
              <h1 className="text-[36px] leading-[1.2] font-semibold text-white md:text-[70px]">
                {title}
              </h1>
              {subtitle ? (
                <p className="mx-auto mt-4 max-w-2xl text-lead text-white/85 md:text-lead-lg">
                  {subtitle}
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
      {crumbs ? <Breadcrumb items={crumbs} /> : null}
    </>
  );
}
