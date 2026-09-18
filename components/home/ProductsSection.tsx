import Link from "next/link";
import { Container } from "@/components/Container";
import { CatalogSearchForm } from "@/components/produkter/CatalogSearchForm";
import { produkter } from "@/lib/produkter";

/**
 * The home page's "Produkter" section — not on live, where Produkter is the
 * third "Våre tjenester" card. Products are not a service, so they get their
 * own block: the card's own line of copy, a search across the whole catalog
 * (→ /produkter?q=…) and a pill per product category. Approved deviation —
 * docs/superpowers/specs/2026-09-18-produkter-catalog-search-design.md.
 */
export function ProductsSection() {
  return (
    <section className="bg-white pt-16 md:pt-24">
      <Container>
        <div className="rounded-[20px] bg-surface-cool px-6 py-10 md:px-14 md:py-14">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-section font-semibold text-black md:text-section-lg">Produkter</h2>
              <p className="mt-2 text-lead text-ink-muted md:text-lead-lg">
                Alt du trenger til installasjon, vedlikehold og drift
              </p>
            </div>
            <Link
              href="/produkter"
              className="inline-flex items-center justify-center rounded-[10px] bg-brand px-[30px] py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50"
            >
              Se alle produkter
            </Link>
          </div>

          <CatalogSearchForm id="hjem-produkt-sok" className="mt-8 max-w-2xl" />

          <ul className="mt-6 flex flex-wrap gap-2">
            {produkter.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/produkter/${p.id}`}
                  className="block rounded-full bg-white px-4 py-2 font-ui text-[14px] leading-[1.4] font-medium text-ink-muted transition hover:text-brand"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
