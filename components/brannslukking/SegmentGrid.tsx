import Image from "next/image";
import { BrandIcon } from "@/components/BrandIcon";
import { SEGMENTS } from "@/lib/brannslukking";

/**
 * "Samme kunder, samme maskiner": ELBA's own customer segments — the home
 * page's industry strip, with the same brand icons — each paired with the
 * machines it runs and what Protega protects on them. The card is
 * FeatureCard's (white, 20px radius, photo on top), with the red 55px icon
 * badge overlapping the photo that live puts on its service cards.
 */
export function SegmentGrid() {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {SEGMENTS.map((s) => (
        <li key={s.name} className="group flex flex-col overflow-hidden rounded-[20px] bg-white shadow-sm">
          <div className="relative aspect-[387/300] overflow-hidden">
            <Image
              src={s.photo}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          <div className="relative flex-1 p-6 pt-10">
            <span className="absolute -top-[27px] left-6 flex h-[55px] w-[55px] items-center justify-center rounded-[10px] bg-brand">
              <BrandIcon src={s.icon} className="h-8 w-8 bg-white" />
            </span>
            <h3 className="font-ui text-sub font-semibold text-black md:text-sub-lg">{s.name}</h3>
            <p className="mt-1 font-ui text-[14px] leading-[1.5] font-semibold text-brand">{s.machines}</p>
            <p className="mt-2 font-ui text-body text-ink-muted">{s.protects}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
