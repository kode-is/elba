import Image from "next/image";
import Link from "next/link";
import type { Img } from "@/lib/types";

type Stat = { value: string; label: string };

type ExperienceSectionProps = {
  image: Img;
  stats: [Stat, Stat];
  heading: string;
  paragraphs: string[];
  linkText: string;
  linkHref: string;
};

/**
 * /anlegg's closing "Erfaring i praksis" section (docs/scrape/anlegg.json
 * blocks 43-51, docs/reference/anlegg.desktop.jpg): a photo with a red
 * two-stat banner overlapping its bottom edge, beside a heading + two
 * paragraphs + a filled "Om oss" button. The stat numbers ("30y", "2k+")
 * render as plain scraped headings — no count-up animation, unlike
 * StatCounter's home-page stats.
 */
export function ExperienceSection({ image, stats, heading, paragraphs, linkText, linkHref }: ExperienceSectionProps) {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        <div className="absolute inset-x-4 bottom-4 flex divide-x divide-white/25 rounded-xl bg-brand">
          {stats.map((stat) => (
            <div key={stat.label} className="flex-1 px-6 py-5 text-center">
              <h2 className="font-stat text-3xl font-bold text-white md:text-4xl">{stat.value}</h2>
              <p className="mt-1 text-sm font-medium text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-semibold text-neutral-900 md:text-[40px]">{heading}</h2>
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
            {paragraph}
          </p>
        ))}
        <Link
          href={linkHref}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}
