import Image from "next/image";
import type { ReactNode } from "react";
import type { Img } from "@/lib/types";
import { Container } from "@/components/Container";

type PageHeroProps = {
  image: Img;
  /** Required unless `children` supplies custom content instead. */
  title?: string;
  subtitle?: string;
  /**
   * Small decorative badge shown above the title. Not present in the scrape —
   * the live site renders its hero glyphs from a Framer icon set the scraper
   * couldn't capture — so this is purely visual and optional; no elba.no
   * route passes one today.
   */
  icon?: ReactNode;
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
  /** Custom content, replacing the default title/subtitle/icon block (not-found's 404 heading + copy + link). `title` is unused when this is set. */
  children?: ReactNode;
  /**
   * A breadcrumb rendered as an absolutely positioned bar flush with the
   * hero's bottom edge, above the tint overlay and the title/subtitle
   * content. Pass `<Breadcrumb variant="hero" items={...} />`. elba.no's own
   * pages render the plain breadcrumb below the hero instead, so no route
   * passes this today.
   */
  breadcrumb?: ReactNode;
};

export function PageHero({
  image,
  title,
  subtitle,
  icon,
  height = "min-h-[318px] md:min-h-[534px]",
  overlayClassName = "bg-black/50",
  contentClassName = "px-6 text-center",
  children,
  breadcrumb,
}: PageHeroProps) {
  return (
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
            {icon ? (
              <div
                aria-hidden="true"
                className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white"
              >
                {icon}
              </div>
            ) : null}
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
      {breadcrumb ? (
        <div className="absolute inset-x-0 bottom-0 z-20 flex h-12 items-center border-t border-white/[.16] bg-[rgba(0,26,40,.55)] backdrop-blur-[6px] md:h-14">
          <Container className="w-full">{breadcrumb}</Container>
        </div>
      ) : null}
    </div>
  );
}
