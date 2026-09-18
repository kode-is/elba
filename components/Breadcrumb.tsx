import Link from "next/link";
import { Container } from "./Container";

export type BreadcrumbItem = { text: string; href?: string };

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

/**
 * The breadcrumb band from kode-is/skralli-v2's PageHero: a full-width cream
 * strip directly under the hero, closed by a rule, holding a plain text trail
 * — "Hjem › Produkter › Rørender" — in muted ink, links turning brand red on
 * hover and the current page in medium-weight black. Rendered by PageHero
 * (its `crumbs` prop), not by the pages themselves. An approved deviation
 * from live's red house-icon trail (docs/handover.md).
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Brødsmulesti" className="border-b border-line bg-surface">
      <Container>
        <ol className="flex flex-wrap items-center gap-2 py-4 font-ui text-eyebrow text-ink-muted">
          <li>
            <Link href="/" className="transition hover:text-brand">
              Hjem
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.text} className="flex items-center gap-2">
                <span aria-hidden="true">›</span>
                {item.href && !isLast ? (
                  <Link href={item.href} className="transition hover:text-brand">
                    {item.text}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-black">
                    {item.text}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
