"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { SpecTable } from "@/components/SpecTable";
import {
  EMPTY_QUERY, MATERIALS, groupResults, isActive, parseQuery, searchCatalog, toSearchString,
  type CatalogItem, type CatalogQuery,
} from "@/lib/catalog";

// The cross-category search on /produkter
// (docs/superpowers/specs/2026-09-18-produkter-catalog-search-design.md).
//
// The URL is the single source of truth: `?q=…&kategori=a,b&materiale=x` is
// read with useSearchParams and written with window.history.replaceState, so
// a search can be shared and the home / category-page forms can deep-link
// here. useSearchParams on a prerendered route needs a Suspense boundary; its
// fallback is this same view with an empty query, so the static HTML still
// carries the category cards.
//
// Next applies a replaceState write inside a transition, so a *controlled*
// input fed from it would lag behind the keyboard and drop characters. The
// text input is therefore uncontrolled (`defaultValue`), and an effect copies
// the URL's `q` back into it only while it is not focused — which is what
// makes "Nullstill", and a click on the header's Produkter link, clear it.

type Category = { id: string; title: string };

type ProductCatalogProps = {
  items: CatalogItem[];
  categories: Category[];
  /** The idle view — the category cards — shown until a search or filter is active. */
  children: ReactNode;
};

export function ProductCatalog(props: ProductCatalogProps) {
  return (
    <Suspense fallback={<CatalogView {...props} query={EMPTY_QUERY} onChange={() => {}} />}>
      <CatalogFromUrl {...props} />
    </Suspense>
  );
}

function CatalogFromUrl(props: ProductCatalogProps) {
  const query = parseQuery(useSearchParams());
  return (
    <CatalogView
      {...props}
      query={query}
      onChange={(next) => window.history.replaceState(null, "", `${window.location.pathname}${toSearchString(next)}`)}
    />
  );
}

const toggle = <T extends string>(values: T[], value: T): T[] =>
  values.includes(value) ? values.filter((v) => v !== value) : [...values, value];

type CatalogViewProps = ProductCatalogProps & { query: CatalogQuery; onChange: (next: CatalogQuery) => void };

function CatalogView({ items, categories, children, query, onChange }: CatalogViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement !== input && input.value !== query.q) input.value = query.q;
  }, [query.q]);

  // The input owns its text (see the comment at the top), so facet changes
  // take `q` from the DOM, not from the URL.
  const current = (): CatalogQuery => ({ ...query, q: inputRef.current?.value ?? query.q });
  const active = isActive(query);
  const results = active ? searchCatalog(items, query) : [];
  const groups = groupResults(results);

  return (
    <div>
      <h2 id="katalog-sok" className="text-section font-semibold text-black md:text-section-lg">
        Søk i alle produkter
      </h2>
      <form role="search" className="mt-6" onSubmit={(event) => event.preventDefault()}>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-ink-faint" />
          <input
            ref={inputRef}
            type="search"
            name="q"
            aria-labelledby="katalog-sok"
            autoComplete="off"
            defaultValue={query.q}
            onChange={(event) => onChange({ ...query, q: event.target.value })}
            placeholder="Art.nr., gjenge, dimensjon, materiale …"
            className="w-full rounded-[10px] border border-line bg-white py-4 pr-5 pl-14 font-ui text-body-lg text-black placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-brand"
          />
        </div>
      </form>

      <div className="mt-6 space-y-4">
        <ChipRow label="Kategori">
          {categories.map((category) => (
            <Chip
              key={category.id}
              pressed={query.categories.includes(category.id)}
              onClick={() => onChange({ ...current(), categories: toggle(query.categories, category.id) })}
            >
              {category.title}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow label="Materiale">
          {MATERIALS.map((material) => (
            <Chip
              key={material.id}
              pressed={query.materials.includes(material.id)}
              onClick={() => onChange({ ...current(), materials: toggle(query.materials, material.id) })}
            >
              {material.label}
            </Chip>
          ))}
        </ChipRow>
      </div>

      <div className="mt-10 md:mt-12">
        {active ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
              <p role="status" className="font-ui text-body-lg text-ink-muted">
                Viser {results.length} av {items.length} produkter
              </p>
              <button
                type="button"
                onClick={() => onChange(EMPTY_QUERY)}
                className="font-ui text-body-lg font-medium text-brand transition hover:opacity-50"
              >
                Nullstill
              </button>
            </div>
            {groups.length === 0 ? (
              <div className="py-14 text-center">
                <h3 className="text-[23px] leading-[1.3] font-semibold text-black">Ingen treff</h3>
                <p className="mt-3 font-ui text-body-lg text-ink-muted">
                  Finner du ikke det du leter etter?{" "}
                  <Link href="/kontakt-oss" className="text-brand underline underline-offset-4">
                    Ta kontakt, så hjelper vi deg.
                  </Link>
                </p>
              </div>
            ) : (
              <div className="mt-10 space-y-14">
                {groups.map((group) => (
                  <section key={group.categoryId} aria-labelledby={`katalog-${group.categoryId}`}>
                    <h3 id={`katalog-${group.categoryId}`} className="text-[23px] leading-[1.3] font-semibold text-black md:text-[36px]">
                      <Link href={`/produkter/${group.categoryId}`} className="transition hover:text-brand">
                        {group.categoryTitle}
                      </Link>{" "}
                      <span className="font-ui text-body-lg font-normal text-ink-faint">({group.count})</span>
                    </h3>
                    <div className="mt-6 space-y-8">
                      {group.tables.map((table) => {
                        const headingId = table.heading ? `katalog-${group.categoryId}-${table.tableIndex}` : undefined;
                        return (
                          <div key={table.tableIndex}>
                            {table.heading ? (
                              <h4 id={headingId} className="mb-3 font-ui text-label font-semibold text-black md:text-label-lg">
                                {table.heading}
                              </h4>
                            ) : null}
                            {/* SpecTable is borderless (it sits on a tinted card on the
                                category pages); on this white section it needs an edge. */}
                            <div className="overflow-hidden rounded-[12px] border border-line">
                              <SpecTable headers={table.headers} rows={table.rows} ariaLabelledBy={headingId} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function ChipRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-5">
      <span className="w-[84px] shrink-0 font-ui text-[14px] leading-[1.4] font-semibold text-black">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 font-ui text-[14px] leading-[1.4] font-medium transition ${
        pressed
          ? "border-brand bg-brand text-white"
          : "border-line bg-white text-ink-muted hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}
