import Image from "next/image";
import type { Img } from "@/lib/types";

type FeatureCardProps = {
  heading: string;
  text: string;
  image?: Img;
  /**
   * Heading level for `heading`, so callers can match their own scrape's
   * level (the home page's and /tjenester's service cards are H5 —
   * docs/scrape/home.json blocks 52/56). Defaults to "h3".
   */
  headingTag?: "h2" | "h3" | "h4" | "h5";
};

/**
 * White, shadowed card behind the "Anlegg / Industri" service
 * grid on the home page and /tjenester (components/ServiceCards.tsx): an
 * optional top image plus a heading and a line of body copy.
 */
export function FeatureCard({ heading, text, image, headingTag = "h3" }: FeatureCardProps) {
  const Heading = headingTag;
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[20px] bg-white shadow-sm">
      {/* Live crops every service-card photo to the same 387x300 box
          (measured Task 11), not to the source image's own aspect. */}
      {image ? (
        <div className="relative aspect-[387/300] w-full overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 387px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="p-6">
        <Heading className="font-ui text-sub font-semibold text-black md:text-sub-lg">{heading}</Heading>
        <p className="mt-2 font-ui text-body text-ink-muted md:text-body-lg">{text}</p>
      </div>
    </div>
  );
}
