import Image from "next/image";
import type { Img } from "@/lib/types";
import { ValuesSection } from "@/components/om-oss/ValuesSection";

type StorySectionProps = {
  heading1: string;
  text1: string;
  image1: Img;
  image2: Img;
  heading2: string;
  text2: string;
  mainImage: Img;
  insetImage: Img;
};

/**
 * The two "story" rows between the breadcrumb and the stat counters
 * (docs/scrape/om-oss.json blocks 4-14, docs/reference/om-oss.desktop.jpg /
 * .mobile.jpg):
 *
 * Row 1 ("Kvalitet og profesjonalitet."): text left / two same-size photos
 * side by side right on desktop. On mobile the reference screenshot shows
 * the photo pair above the heading, so the text block carries
 * `order-2 md:order-1` and the photo pair `order-1 md:order-2` to flip
 * their visual order per breakpoint while keeping the heading first in
 * source order.
 *
 * Row 2 ("Din drift er vår ambisjon."): a tall photo with a smaller photo
 * overlapping its bottom-right corner, left on desktop / first on mobile
 * (matching source order, no reordering needed). Same general idea as
 * components/PhotoCollage.tsx (an overlapping inset thumbnail) but not the
 * same measured shape: PhotoCollage's main/inset are aspect-[3/4]/aspect-
 * [4/3] at inset width 55%, always hides the inset below md, and adds a
 * white border/shadow — none of that matches om-oss's own reference
 * screenshots (measured pixel boxes below; inset is visible at 390px too,
 * borderless, and portrait rather than landscape). Rebuilt locally here
 * rather than stretching the shared component for a shape it doesn't
 * actually have on this page.
 */
export function StorySection({
  heading1,
  text1,
  image1,
  image2,
  heading2,
  text2,
  mainImage,
  insetImage,
}: StorySectionProps) {
  return (
    <div className="space-y-14 md:space-y-20">
      <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
        <div className="order-2 md:order-1">
          <h2 className="text-section font-semibold text-black md:text-section-lg">{heading1}</h2>
          <p className="mt-4 text-lead text-ink-muted md:text-lead-lg">{text1}</p>
        </div>
        <div className="order-1 grid grid-cols-2 gap-4 md:order-2">
          {/* Measured off docs/reference/om-oss.desktop.jpg: each photo box
              is ~202x503 / ~200x503 at 1440px (≈2:5), not the scraped
              200x266 (3:4) source images — object-cover crops the taller
              box. Cross-checked against .mobile.jpg too (~133x304, ≈0.44,
              same shape). */}
          {[image1, image2].map((image) => (
            <div key={image.src} className="relative aspect-[2/5] w-full overflow-hidden rounded-2xl">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
        <div className="relative">
          {/* Measured off docs/reference/om-oss.desktop.jpg: main photo box
              is ~386x502 at 1440px (≈3:4, matching the scraped 388x518
              source) — not square. Cross-checked against .mobile.jpg
              (~240x350, ≈0.69, same portrait shape). */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {/* Measured off docs/reference/om-oss.desktop.jpg: inset photo box
              is ~172x297 at 1440px (≈3:5, portrait) at ~45% of the main
              box's width (172/386) — not PhotoCollage's landscape aspect-
              [4/3] at 55% width. */}
          <div className="absolute -bottom-6 -right-6 aspect-[3/5] w-[45%] overflow-hidden rounded-2xl">
            <Image
              src={insetImage.src}
              alt={insetImage.alt}
              fill
              sizes="(min-width: 768px) 22vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="text-section font-semibold text-black md:text-section-lg">{heading2}</h2>
          <p className="mt-4 text-lead text-ink-muted md:text-lead-lg">{text2}</p>
          <ValuesSection className="mt-6" />
        </div>
      </div>
    </div>
  );
}
