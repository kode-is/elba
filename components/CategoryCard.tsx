import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/categories";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";

/**
 * Category card as measured on the live home page ("Okkar vöruframboð"):
 * white card, 15 px radius, no border or shadow; image 300 px tall (200 on
 * mobile); a 55 px brand-dark icon badge (10 px radius, 25 px icon) that sits
 * IN FRONT of the card body and straddles the image's bottom edge — 40 px
 * above it, 15 px below; body padding 40 px (30 on mobile); title 18/16 px
 * Inter 600, blurb 16/15 px at line-height 1.9 in #444.
 *
 * The badge is a sibling of the image box, not a child, so the image box can
 * clip the hover zoom without clipping the badge.
 */
export function CategoryCard({ category }: { category: Category }) {
  const Icon = CATEGORY_ICONS[category.id];

  return (
    <Link href={category.href} className="group relative block rounded-[15px] bg-white">
      <div className="relative h-[200px] w-full overflow-hidden rounded-t-[15px] md:h-[300px]">
        <Image
          src={category.image.src}
          alt={category.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      {Icon ? (
        <span className="absolute top-[160px] left-[30px] z-10 flex h-[55px] w-[55px] items-center justify-center rounded-[10px] bg-brand-dark text-white md:top-[260px] md:left-10">
          <Icon className="h-[25px] w-[25px]" />
        </span>
      ) : null}
      <div className="p-[30px] md:p-10">
        <h5 className="font-ui text-base leading-relaxed font-semibold text-neutral-900 md:text-lg">
          {category.title}
        </h5>
        <p className="mt-[15px] text-[15px] leading-[1.9] text-[#444] md:mt-5 md:text-base">
          {category.blurb}
        </p>
      </div>
    </Link>
  );
}
