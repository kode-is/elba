import Image from "next/image";
import type { Img } from "@/lib/types";

export type FeatureTile =
  | { type: "text"; heading: string; paragraphs: string[]; tone: "cream" | "red" }
  | { type: "image"; image: Img };

type FeatureTileGridProps = {
  tiles: FeatureTile[];
};

/**
 * Two-column grid alternating a coloured text tile (H1 heading + one or two
 * paragraphs, live markup keeps these at H1 despite sitting mid-page) with a
 * plain photo tile — /anlegg's three-tile intro (docs/reference/
 * anlegg.desktop.jpg: cream/photo/photo/red/cream/photo) and /industri's
 * (docs/reference/industri.desktop.jpg: all three text tiles red). Shared
 * because both routes render the identical six-cell layout, just with
 * different tones and copy.
 */
export function FeatureTileGrid({ tiles }: FeatureTileGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 md:auto-rows-fr">
      {tiles.map((tile, index) =>
        tile.type === "image" ? (
          <div
            key={index}
            className="relative h-[280px] w-full overflow-hidden rounded-[20px] md:h-full md:min-h-[320px]"
          >
            <Image
              src={tile.image.src}
              alt={tile.image.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            key={index}
            className={`flex flex-col justify-center rounded-[20px] p-8 md:p-10 ${
              tile.tone === "red" ? "bg-brand text-white" : "bg-surface text-black"
            }`}
          >
            <h1 className="font-ui text-[24px] leading-[1.2] font-bold md:text-[30px]">{tile.heading}</h1>
            {tile.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className={`mt-4 ${
                  tile.tone === "red"
                    ? "text-lead text-brand-soft md:text-lead-lg"
                    : "font-ui text-body text-ink-muted md:text-body-lg"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        ),
      )}
    </div>
  );
}
