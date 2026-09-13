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
};

export function Breadcrumb({ items }: BreadcrumbProps) {
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
