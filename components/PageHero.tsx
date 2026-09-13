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
   * Small decorative badge shown above the title (e.g. a category glyph from
   * CategoryIcons.tsx). Not present in the scrape — the live site renders it
   * from a Framer icon set the scraper couldn't capture — so this is purely
   * visual and optional; omit it for hero variants that don't have one.
   */
  icon?: ReactNode;
  /**
   * Subtle repeating diagonal-stripe texture (docs/scrape/svg/b9d9b044.svg).
   * Verified against a live fetch of https://skralli.is/smurkerfi: the SVG
   * is set as a `background-image` on a `position:absolute;inset:0` div
   * that is the *first* child of the hero section (Framer calls it
   * "Service Title") — i.e. it's this hero band's own background, painted
   * behind the black tint overlay and the full-bleed photo, not a
   * background on the two info cards further down the page. Because the
   * photo is opaque and covers the hero edge-to-edge, the texture ends up
   * fully hidden behind it in normal rendering on the live site too — this
   * prop reproduces that same (near-invisible) layering. `docs/scrape/
   * inline-svg.json` only lists this pattern for a subset of routes
   * (service/category pages like /smurkerfi), so it's opt-in and unused by
   * the hub pages (/, /um-okkur, /thjonusta, /vorumerki).
   */
  pattern?: boolean;
  /**
   * Hero band height, as Tailwind classes. Defaults to the standard
   * category-page hero (420/560px). vorumerki/[slug]'s title band
   * (438/479px) and not-found's full-viewport band pass their own instead
   * of duplicating this component's image+overlay markup.
   */
  height?: string;
  /** Tint overlay classes. Defaults to the standard `bg-black/50`; not-found's is a touch darker. */
  overlayClassName?: string;
  /** Content wrapper classes, in front of the overlay. Defaults to a centered block; not-found's needs a vertical flex stack instead. */
  contentClassName?: string;
  /** Custom content, replacing the default title/subtitle/icon block (not-found's 404 heading + copy + link). `title` is unused when this is set. */
  children?: ReactNode;
  /**
   * design.dc.html 1a/1b/1c ("Kostur A"): a breadcrumb rendered as an
   * absolutely positioned bar flush with the hero's bottom edge, above the
   * tint overlay and the title/subtitle content. Pass
   * `<Breadcrumb variant="hero" items={...} />`. Omit for every hero that
   * isn't a sturtuvagnar product/group page.
   */
  breadcrumb?: ReactNode;
};

export function PageHero({
  image,
  title,
  subtitle,
  icon,
  pattern,
  height = "h-[420px] md:h-[560px]",
  overlayClassName = "bg-black/50",
  contentClassName = "px-6 text-center",
  children,
  breadcrumb,
}: PageHeroProps) {
  return (
    <div className={`relative flex ${height} items-center justify-center overflow-hidden`}>
      {pattern ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/smurkerfi/pattern-b9d9b044.svg)",
            backgroundRepeat: "repeat",
          }}
        />
      ) : null}
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
                className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-dark text-white"
              >
                {icon}
              </div>
            ) : null}
            <h1 className="text-[44px] leading-[1.05] font-semibold text-white md:text-[70px] md:leading-[1.02]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 md:text-lg">
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
