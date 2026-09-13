import Image from "next/image";
import type { Img } from "@/lib/types";

type FeatureCardProps = {
  heading: string;
  text: string;
  image?: Img;
  /**
   * Heading level for `heading`, so callers can match their own scrape's
   * level (e.g. the home page's service cards are H5 —
   * docs/scrape/home.json blocks 52/56/60 — while the /smurkerfi grid's are
   * H3). Defaults to "h3" so existing callers are unchanged.
   */
  headingTag?: "h2" | "h3" | "h4" | "h5";
};

/**
 * White, shadowed card used for the /smurkerfi product-feature grid (Task 9)
 * and reused by later service pages (Task 11): an optional top image plus a
 * heading and a line of body copy. Mirrors CategoryCard.tsx's card shell
 * without the icon badge.
 */
export function FeatureCard({ heading, text, image, headingTag = "h3" }: FeatureCardProps) {
  const Heading = headingTag;
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      {image ? (
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="p-6">
        <Heading className="font-ui text-lg font-semibold text-neutral-900">{heading}</Heading>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{text}</p>
      </div>
    </div>
  );
}
