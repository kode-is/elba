import Image from "next/image";
import type { Img } from "@/lib/types";

type FeatureCardProps = {
  heading: string;
  text: string;
  image?: Img;
};

/**
 * White, shadowed card used for the /smurkerfi product-feature grid (Task 9)
 * and reused by later service pages (Task 11): an optional top image plus a
 * heading and a line of body copy. Mirrors CategoryCard.tsx's card shell
 * without the icon badge.
 */
export function FeatureCard({ heading, text, image }: FeatureCardProps) {
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
        <h3 className="font-ui text-lg font-semibold text-neutral-900">{heading}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{text}</p>
      </div>
    </div>
  );
}
