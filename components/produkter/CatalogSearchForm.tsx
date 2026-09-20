import Form from "next/form";

type CatalogSearchFormProps = {
  /** Unique per page — wires the sr-only label to the input. */
  id: string;
  /**
   * Product id to scope the search to (e.g. "rørender"). On a category page
   * the box searches inside that category; the results page shows its
   * Kategori chip active, so "Nullstill" widens the search to all products.
   * Omit for the site-wide form on the home page.
   */
  categoryId?: string;
  /** That category's title, for the visible label ("Søk i Rørender"). */
  categoryTitle?: string;
  className?: string;
};

/**
 * Compact search form for pages other than /produkter (the home page's
 * Produkter section, every /produkter/<kategori> page): submits `q` — and,
 * on a category page, `kategori` — to /produkter, where ProductCatalog reads
 * both from the URL.
 */
export function CatalogSearchForm({ id, categoryId, categoryTitle, className }: CatalogSearchFormProps) {
  const label = categoryTitle ? `Søk i ${categoryTitle}` : "Søk i alle produkter";
  return (
    <Form action="/produkter" role="search" className={`flex gap-3${className ? ` ${className}` : ""}`}>
      {categoryId ? <input type="hidden" name="kategori" value={categoryId} /> : null}
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name="q"
        type="search"
        autoComplete="off"
        placeholder={categoryTitle ? `Søk i ${categoryTitle} — art.nr., gjenge, dimensjon …` : "Art.nr., gjenge, dimensjon, materiale …"}
        className="min-w-0 flex-1 rounded-[10px] border border-line bg-white px-5 py-4 font-ui text-body-lg text-black placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-brand"
      />
      <button
        type="submit"
        className="rounded-[10px] bg-brand px-[30px] py-4 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50"
      >
        Søk
      </button>
    </Form>
  );
}
