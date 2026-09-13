import Link from "next/link";

export type BreadcrumbItem = { text: string; href?: string };

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /**
   * "plain": today's output, byte-identical — used by every route except
   * the sturtuvagnar product/group hero (13 other pages keep this).
   * "hero": the product-redesign's hero-edge breadcrumb (design.dc.html
   * board 1c, "Kostur A") — white-on-dark, `›` separator, rendered inside
   * PageHero's bottom bar instead of a plain white block above the hero.
   */
  variant?: "plain" | "hero";
};

export function Breadcrumb({ items, variant = "plain" }: BreadcrumbProps) {
  if (variant === "hero") {
    return <HeroBreadcrumb items={items} />;
  }

  return (
    <nav aria-label="Brauðmolaslóð" className="font-ui text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-neutral-500">
        <li>
          <Link href="/" className="transition hover:text-brand-dark">
            Forsíða
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.text} className="flex items-center gap-2">
              <span aria-hidden="true">&gt;</span>
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-brand-dark">
                  {item.text}
                </Link>
              ) : (
                <span className={isLast ? "font-semibold text-neutral-900" : ""}>
                  {item.text}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// design.dc.html 1c "Kostur A" + 1a/1b: full breadcrumb trail (Forsíða +
// `items`) rendered white-on-dark in the hero's bottom edge bar. Mobile
// (1b) collapses the middle of the trail away, keeping only the first item
// (Forsíða), the immediate parent of the current page, and the current
// page itself — every item stays in the DOM (`hidden md:flex`), so this
// never diverges from the desktop trail's link targets or order.
function HeroBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const entries: BreadcrumbItem[] = [{ text: "Forsíða", href: "/" }, ...items];
  const lastIndex = entries.length - 1;
  const parentIndex = Math.max(lastIndex - 1, 0);

  return (
    <nav aria-label="Brauðmolaslóð" className="font-ui text-[13px] md:text-sm">
      <ol className="flex items-center gap-2">
        {entries.map((item, index) => {
          const isFirst = index === 0;
          const isCurrent = index === lastIndex;
          const isParent = !isFirst && index === parentIndex;
          const isCollapsedOnMobile = !isFirst && !isParent && !isCurrent;

          return (
            <li
              key={item.text}
              className={`items-center gap-2 ${isCollapsedOnMobile ? "hidden md:flex" : "flex"}`}
            >
              {!isFirst ? (
                <span aria-hidden="true" className="text-white/[.42]">
                  ›
                </span>
              ) : null}
              {isCurrent ? (
                <span aria-current="page" className="font-semibold text-white">
                  {item.text}
                </span>
              ) : (
                <Link
                  href={item.href ?? "#"}
                  className={`text-white/[.78] hover:text-white hover:underline hover:underline-offset-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#01A8DC] focus-visible:outline-offset-[3px] ${
                    isParent ? "max-w-[120px] truncate md:max-w-none md:overflow-visible" : ""
                  }`}
                >
                  {item.text}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
