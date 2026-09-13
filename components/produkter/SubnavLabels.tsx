/**
 * Static "sub-navigation" pill row shown above a product's tables (e.g.
 * /produkter/rørender: "Rørender rette" / "Rørender 90 grader" / "Rørender
 * 45 grader" — see docs/reference/produkter__rørender.desktop.jpg). On the
 * live site these are plain labels, not links — Product.subnav (lib/
 * produkter.ts) carries only the text, so there is nothing to navigate to.
 * The reference screenshots consistently render the first pill filled in
 * brand red and the rest outlined; reproduced here since it's the only
 * variation the live page itself shows.
 */
export function SubnavLabels({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mb-10 flex flex-wrap gap-3">
      {items.map((label, index) => (
        <span
          key={label}
          className={`rounded-full border px-5 py-2 text-[16px] leading-[1.2] font-semibold ${
            index === 0 ? "border-brand bg-brand text-white" : "border-neutral-300 text-black"
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
