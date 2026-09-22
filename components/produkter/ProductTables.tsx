import Image from "next/image";
import { SpecTable } from "@/components/SpecTable";
import { SubnavFilter } from "@/components/produkter/SubnavFilter";
import type { Product, ProductTable } from "@/lib/produkter";

/**
 * The repeated "variant" groups on a product page: an images row (the
 * technical line-drawing plus a product photo, where present), an optional
 * H3 heading (e.g. "Forsinket stål (Zn-Ni)"), and the spec table itself.
 * lib/produkter.ts's generator keeps every image gathered since the
 * previous table (not capped to two) — most groups have 0-2, but
 * skruhylser's and fylleutstyr's first groups have 3-4 (confirmed against
 * a live image-count probe: capping would undercount the page's visible
 * images and fail scripts/verify.mjs). A single image (e.g. fett's one
 * product photo) renders full-width with no card, matching the reference
 * screenshot; two or more sit in a two-column grid, each on the light card
 * background the live site uses behind its product photos (sampled from
 * docs/reference/produkter__skruhylser.desktop.jpg: rgb(235,238,245),
 * declared as the `--color-surface-cool` token in app/globals.css) — the
 * scrape doesn't distinguish "diagram" from "photo" blocks, so the same
 * card is used for both rather than inventing that distinction.
 */
export function ProductTables({ product }: { product: Product }) {
  // The page's caption (only fylleutstyr has one) describes the first table of
  // the first tab, so it renders inside that group and hides along with it.
  const tabs = product.tabs.map((tab, tabIndex) => ({
    label: tab.label,
    slug: tab.slug,
    tables: tab.tables.map((table, index) => (
      <TableGroup key={index} table={table} index={index} intro={tabIndex === 0 && index === 0 ? product.intro : []} />
    )),
  }));
  if (tabs.length === 1) return <div className="flex flex-col gap-14 md:gap-20">{tabs[0].tables}</div>;
  return <SubnavFilter tabs={tabs} />;
}

function TableGroup({ table, index, intro }: { table: ProductTable; index: number; intro: string[] }) {
  const headingId = table.heading ? `produkt-tabell-${index}` : undefined;
  return (
    <div>
      {intro.map((text) => (
        <p key={text} className="mb-4 font-ui text-body-lg text-ink-muted">
          {text}
        </p>
      ))}
      {table.images.length === 1 ? (
        <div className="mb-6 flex justify-center">
          <Image
            src={table.images[0].src}
            alt={table.images[0].alt}
            width={table.images[0].width}
            height={table.images[0].height}
            sizes="(min-width: 768px) 1152px, 100vw"
            className="h-auto w-auto max-w-full rounded-2xl object-contain"
          />
        </div>
      ) : table.images.length > 1 ? (
        <div className="mb-6 grid grid-cols-2 gap-4 md:gap-6">
          {table.images.map((image, imageIndex) => (
            <div key={imageIndex} className="flex items-center justify-center rounded-2xl bg-surface-cool p-6">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 768px) 600px, 50vw"
                className="h-auto w-full object-contain"
              />
            </div>
          ))}
        </div>
      ) : null}
      {table.heading ? (
        <h3 id={headingId} className="mb-4 text-[23px] leading-[1.3] font-semibold text-black md:text-[36px]">
          {table.heading}
        </h3>
      ) : null}
      <SpecTable headers={table.headers} rows={table.rows} ariaLabelledBy={headingId} />
    </div>
  );
}
