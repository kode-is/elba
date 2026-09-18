import Form from "next/form";

type CatalogSearchFormProps = {
  /** Unique per page — wires the sr-only label to the input. */
  id: string;
  className?: string;
};

/**
 * Compact "search all products" form for pages other than /produkter (the
 * home page's Produkter section, every /produkter/<kategori> page): submits
 * `q` to /produkter, where ProductCatalog reads it from the URL.
 */
export function CatalogSearchForm({ id, className }: CatalogSearchFormProps) {
  return (
    <Form action="/produkter" role="search" className={`flex gap-3${className ? ` ${className}` : ""}`}>
      <label htmlFor={id} className="sr-only">
        Søk i alle produkter
      </label>
      <input
        id={id}
        name="q"
        type="search"
        autoComplete="off"
        placeholder="Art.nr., gjenge, dimensjon, materiale …"
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
