import Image from "next/image";
import Link from "next/link";
import type { Img } from "@/lib/types";

export type ChildCard = { href: string; title: string; image: Img };

/**
 * Link-card grid used by /hifi-festibunadur (its five category cards) and
 * /hifi-festibunadur/stroffur (its three child-page cards) — the scrape's
 * `link` + `image` + heading-3 triples for each. Visually a simpler sibling
 * of CategoryCard.tsx (no icon badge, no blurb line, since neither of these
 * two source pages has one for these cards).
 */
export function ChildCards({ items }: { items: ChildCard[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
        >
          <div className="relative aspect-[5/4] w-full overflow-hidden">
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <h3 className="font-ui text-lg font-semibold text-neutral-900">{item.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
