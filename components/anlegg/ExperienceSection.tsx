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
 * paragraphs + a filled "Om oss" button. The stat numbers (e.g. "30 år", "2000+")
 * render as plain scraped headings — no count-up animation, unlike
 * StatCounter's home-page stats.
 */
export function ExperienceSection({ image, stats, heading, paragraphs, linkText, linkHref }: ExperienceSectionProps) {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
      {/* Square on phones and landscape on tablets, where the photo spans the full width; portrait beside the text from md. */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[20px] sm:aspect-[4/3] md:aspect-[3/4]">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[50%_30%]" />
        <div className="absolute inset-x-3 bottom-3 flex divide-x divide-white/25 rounded-xl bg-brand md:inset-x-4 md:bottom-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex-1 px-4 py-3 text-center md:px-6 md:py-5">
              <p className="text-[28px] leading-[1.2] font-semibold text-white md:text-section-lg">{stat.value}</p>
              <p className="mt-1 text-body text-stat-label md:text-body-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-section font-semibold text-black md:text-section-lg">{heading}</h2>
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-4 text-lead text-ink-muted md:text-lead-lg">
            {paragraph}
          </p>
        ))}
        <Link
          href={linkHref}
          className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-brand px-[30px] py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}
