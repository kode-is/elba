import Image from "next/image";
import type { Img } from "@/lib/types";

type TeamCardProps = {
  image: Img;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  /**
   * "compact" (default): small rounded photo + name below, used by the home
   * page's AdvisorySection teaser.
   * "profile": full-width photo with role/name/contact below on a plain
   * background, used by the /um-okkur team grid. Per the live site's
   * server-rendered HTML, email/phone there are plain <h6> text, not links,
   * so this variant never renders them as anchors.
   */
  variant?: "compact" | "profile";
};

export function TeamCard({ image, name, role, email, phone, variant = "compact" }: TeamCardProps) {
  if (variant === "profile") {
    return (
      <div className="flex flex-col">
        {/*
         * Pixel-measured against docs/reference/um-okkur.desktop.jpg (team grid,
         * ~393x400px per card): the photo box renders effectively square via
         * object-cover, regardless of each source photo's native aspect ratio
         * (people portraits are 393x261 landscape; Kormákur's placeholder is
         * 393x409) — so the box uses aspect-square, not the source ratio.
         * Text sits inside the photo container, bottom-anchored over a dark
         * gradient scrim, matching the reference exactly (white text on the
         * image, no white gap below it).
         */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src={image.src}
            alt={image.alt || name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-4">
            {role ? (
              <h6 className="text-xs font-semibold uppercase tracking-wide text-white/70">
                {role}
              </h6>
            ) : null}
            <h3 className="mt-1 font-ui text-lg font-semibold text-white">{name}</h3>
            {email || phone ? (
              <div className="mt-1 flex items-center justify-between gap-3">
                {email ? (
                  <h6 className="truncate text-xs uppercase tracking-wide text-white/70">
                    {email}
                  </h6>
                ) : null}
                {phone ? (
                  <h6 className="shrink-0 text-xs uppercase tracking-wide text-white/70">
                    {phone}
                  </h6>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Image
        src={image.src}
        alt={image.alt || name}
        width={image.width}
        height={image.height}
        className="h-[63px] w-[96px] rounded-xl object-cover md:h-[90px] md:w-[136px]"
      />
      <div>
        <p className="font-semibold text-neutral-900">{name}</p>
        {role ? <p className="text-sm text-neutral-600">{role}</p> : null}
        {email ? (
          <a href={`mailto:${email}`} className="block text-sm text-brand-dark hover:underline">
            {email}
          </a>
        ) : null}
        {phone ? (
          <a href={`tel:${phone}`} className="block text-sm text-brand-dark hover:underline">
            {phone}
          </a>
        ) : null}
      </div>
    </div>
  );
}
