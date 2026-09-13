import type { SVGProps } from "react";

/**
 * Truck-and-trailer glyph shown in the PageHero icon badge on the five
 * /sturtuvagnar/[slug] wagon-group pages (docs/reference/
 * sturtuvagnar__hjolagrofuvagnar.desktop.jpg and the other four group
 * screenshots all show this badge above the H1; the 25 product-page
 * screenshots don't have one — confirmed by zooming into
 * sturtuvagnar__gw-100.desktop.jpg, where the only blue-ish square near the
 * H1 is a sticker in the photo itself, not a UI badge).
 *
 * Like components/CategoryIcons.tsx's icons, this isn't in the scrape (the
 * live site renders it from a Framer icon set the scraper can't capture),
 * so it's a hand-drawn stand-in in the same stroke style — decorative only.
 */
export function TrailerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2.5" y="9" width="8" height="7" rx="1" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
      <path
        d="M10.5 9h3.2l3.3 3.3V16h-6.5"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <circle cx="6" cy="17.7" r="1.5" stroke="currentColor" strokeWidth={1.4} />
      <circle cx="15" cy="17.7" r="1.5" stroke="currentColor" strokeWidth={1.4} />
      <path d="M16.5 12.3h-3.4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}
