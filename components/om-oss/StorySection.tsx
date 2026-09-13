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
 * (matching source order, no reordering needed) — same shape as
 * components/PhotoCollage.tsx, but that component always hides its inset
 * below md and adds a white border/shadow that neither of om-oss's own
 * reference screenshots show (the inset is visible at 390px too, borderless).
 * Rebuilt locally here rather than stretching the shared component for a
 * shape it doesn't actually have on this page.
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
          <h2 className="text-3xl font-semibold text-neutral-900 md:text-[40px]">{heading1}</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">{text1}</p>
        </div>
        <div className="order-1 grid grid-cols-2 gap-4 md:order-2">
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
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 aspect-[4/3] w-[55%] overflow-hidden rounded-2xl">
            <Image
              src={insetImage.src}
              alt={insetImage.alt}
              fill
              sizes="(min-width: 768px) 27vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-neutral-900 md:text-[40px]">{heading2}</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">{text2}</p>
          <ValuesSection className="mt-6" />
        </div>
      </div>
    </div>
  );
}
