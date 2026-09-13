import Link from "next/link";

export type BreadcrumbItem = { text: string; href?: string };

// docs/scrape/svg/f9706e44.svg — the same house-outline path used for the
// footer's address icon (Footer.tsx's HouseIcon); the live site's own
// breadcrumb "Home" icon (docs/scrape/svg/30fba5c6.svg) is a `<use>`
// reference into a Framer icon sprite the scraper never captured, so this
// is the closest faithful stand-in confirmed against the scrape.
function HouseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 9.5L12 4l9 5.5M19 13v6.4a.6.6 0 01-.6.6H5.6a.6.6 0 01-.6-.6V13" />
    </svg>
  );
}

// docs/scrape/svg/fcebcd9e.svg — the chevron separator between breadcrumb
// crumbs (docs/scrape/inline-svg.json's /kontakt-oss entry, verified against
// docs/reference/kontakt-oss.desktop.jpg below the hero).
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M0 12L6 6L0 0"
        fill="transparent"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(9 6)"
      />
    </svg>
  );
}

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /**
   * "plain": the standard trail — house icon + `›`-style separators in
   * brand red, rendered as a plain block above the hero (see
   * docs/reference/kontakt-oss.desktop.jpg, below the hero). Used by every
   * elba.no inner page.
   * "hero": a hero-edge breadcrumb (design.dc.html board 1c) — white-on-dark,
   * rendered inside PageHero's bottom bar instead of a plain white block
   * above the hero. Not used by any current elba.no route; kept for a future
   * page that needs its hero to carry the trail.
   */
  variant?: "plain" | "hero";
};

export function Breadcrumb({ items, variant = "plain" }: BreadcrumbProps) {
  if (variant === "hero") {
    return <HeroBreadcrumb items={items} />;
  }

  return (
    <nav aria-label="Brødsmulesti" className="font-ui text-eyebrow font-medium">
      <ol className="flex flex-wrap items-center gap-2 text-brand">
        <li>
          <Link href="/" aria-label="Hjem" className="flex items-center transition hover:opacity-75">
            <HouseIcon className="h-4 w-4" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.text} className="flex items-center gap-2">
              <ChevronIcon className="h-3 w-3" />
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:opacity-75">
                  {item.text}
                </Link>
              ) : (
                <span>{item.text}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// design.dc.html 1c + 1a/1b: full breadcrumb trail (Hjem + `items`) rendered
// white-on-dark in the hero's bottom edge bar. Mobile (1b) collapses the
// middle of the trail away, keeping only the first item (Hjem), the
// immediate parent of the current page, and the current page itself — every
// item stays in the DOM (`hidden md:flex`), so this never diverges from the
// desktop trail's link targets or order.
function HeroBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const entries: BreadcrumbItem[] = [{ text: "Hjem", href: "/" }, ...items];
  const lastIndex = entries.length - 1;
  const parentIndex = Math.max(lastIndex - 1, 0);

  return (
    <nav aria-label="Brødsmulesti" className="font-ui text-[13px] md:text-sm">
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
