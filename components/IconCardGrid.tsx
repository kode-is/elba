import type { ReactNode } from "react";

export type IconCardItem = { icon: ReactNode; heading: string; text: string };

type IconCardGridProps = {
  items: IconCardItem[];
  className?: string;
};

/**
 * Two-column grid of red-icon-badge + H4 heading + paragraph cards, used by
 * /anlegg's "Nøkkelfunksjoner" (six cards) and /industri's "Industriell
 * pålitelighet" (six cards) — both routes render the identical card shape
 * (docs/reference/anlegg.desktop.jpg, industri.desktop.jpg), so it's shared
 * instead of duplicated per page.
 */
export function IconCardGrid({ items, className }: IconCardGridProps) {
  return (
    <div className={`grid gap-x-10 gap-y-8 md:grid-cols-2${className ? ` ${className}` : ""}`}>
      {items.map((item) => (
        <div key={item.heading} className="flex gap-4">
          <span
            aria-hidden="true"
            className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[10px] bg-brand"
          >
            <span className="text-white">{item.icon}</span>
          </span>
          <div>
            <h4 className="text-label-lg font-semibold text-black">{item.heading}</h4>
            <p className="mt-1.5 text-body-lg text-ink-muted">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
