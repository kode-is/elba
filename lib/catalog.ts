// Search and filter logic for the cross-category product catalog on
// /produkter (docs/superpowers/specs/2026-09-18-produkter-catalog-search-design.md).
// Pure functions only: `Product` is a type-only import, so a client component
// can import this file without pulling the generated lib/produkter.ts data
// into its bundle — the server page calls buildCatalog() and passes the items
// down as props.
import type { Product } from "@/lib/produkter";

export type Material = "forsinket" | "syrefast" | "messing";

export const MATERIALS: { id: Material; label: string }[] = [
  { id: "forsinket", label: "Forsinket stål" },
  { id: "syrefast", label: "Syrefast" },
  { id: "messing", label: "Messing" },
];

export type CatalogItem = {
  /** `${categoryId}:${tableIndex}:${rowIndex}` — Art.Nr. repeats across tables, so it can't be the key. */
  key: string;
  categoryId: string;
  categoryTitle: string;
  tableIndex: number;
  heading: string | null;
  headers: string[];
  cells: string[];
  artNr: string;
  material: Material | null;
  /** Normalised text a query token is matched against — see buildCatalog. */
  haystack: string;
};

export type CatalogQuery = { q: string; categories: string[]; materials: Material[] };

export const EMPTY_QUERY: CatalogQuery = { q: "", categories: [], materials: [] };

export type CatalogGroup = {
  categoryId: string;
  categoryTitle: string;
  count: number;
  tables: { tableIndex: number; heading: string | null; headers: string[]; rows: string[][] }[];
};

/** Lower-case, fold Norwegian letters and diacritics, unify `,`/`.` and `×`/`x`, collapse whitespace. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ø/g, "o")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/,/g, ".")
    .replace(/×/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

function materialOf(text: string | null | undefined): Material | null {
  const t = normalize(text ?? "");
  if (t.startsWith("forsinket")) return "forsinket";
  if (t.startsWith("syrefast")) return "syrefast";
  if (t.startsWith("messing")) return "messing";
  return null;
}

/**
 * One item per table row. The haystack holds the category title, the table
 * heading and every cell, normalised — plus a whitespace-free copy of each, so
 * "0401 4701 013" is found by "04014701013" and "M 10x1" by "M10x1". Column
 * headers stay out of it: "SW" or "L" would match nearly every row. With a
 * pill map (lib/subnav.ts's SUBNAV_TABLES, passed in rather than imported so
 * this file stays free of data), a row is also found by its sub-category pill,
 * e.g. "Rørender rette" or 'Vinkel "WE"'.
 */
export function buildCatalog(products: Product[], subnav: Record<string, Record<string, number[]>> = {}): CatalogItem[] {
  const items: CatalogItem[] = [];
  for (const product of products) {
    const pills = Object.entries(subnav[product.id] ?? {});
    product.tables.forEach((table, tableIndex) => {
      const pillLabels = pills.filter(([, tables]) => tables.includes(tableIndex)).map(([label]) => label);
      const artIndex = table.headers.findIndex((h) => /^art\.?\s*nr\.?$/i.test(h.trim()));
      const materialIndex = table.headers.findIndex((h) => /^material/i.test(h.trim()));
      table.rows.forEach((cells, rowIndex) => {
        const parts = [product.title, table.heading ?? "", ...pillLabels, ...cells].map(normalize).filter(Boolean);
        const haystack = [...new Set([...parts, ...parts.map((p) => p.replace(/ /g, ""))])].join(" ");
        items.push({
          key: `${product.id}:${tableIndex}:${rowIndex}`,
          categoryId: product.id,
          categoryTitle: product.title,
          tableIndex,
          heading: table.heading,
          headers: table.headers,
          cells,
          artNr: artIndex >= 0 ? (cells[artIndex] ?? "") : "",
          material: materialOf(table.heading) ?? (materialIndex >= 0 ? materialOf(cells[materialIndex]) : null),
          haystack,
        });
      });
    });
  }
  return items;
}

/** Tokens AND; values OR within a facet; facets AND. An item without a material only drops out while a material filter is on. */
export function searchCatalog(items: CatalogItem[], query: CatalogQuery): CatalogItem[] {
  const tokens = normalize(query.q).split(" ").filter(Boolean);
  return items.filter(
    (item) =>
      (query.categories.length === 0 || query.categories.includes(item.categoryId)) &&
      (query.materials.length === 0 || (item.material !== null && query.materials.includes(item.material))) &&
      tokens.every((token) => item.haystack.includes(token)),
  );
}

/** Category → table, in the order the items arrive (catalog order). */
export function groupResults(items: CatalogItem[]): CatalogGroup[] {
  const groups: CatalogGroup[] = [];
  for (const item of items) {
    let group = groups.at(-1);
    if (!group || group.categoryId !== item.categoryId) {
      group = { categoryId: item.categoryId, categoryTitle: item.categoryTitle, count: 0, tables: [] };
      groups.push(group);
    }
    let table = group.tables.at(-1);
    if (!table || table.tableIndex !== item.tableIndex) {
      table = { tableIndex: item.tableIndex, heading: item.heading, headers: item.headers, rows: [] };
      group.tables.push(table);
    }
    table.rows.push(item.cells);
    group.count += 1;
  }
  return groups;
}

const list = (value: string | null) =>
  (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export function parseQuery(params: { get(name: string): string | null }): CatalogQuery {
  return {
    q: params.get("q") ?? "",
    categories: list(params.get("kategori")),
    materials: list(params.get("materiale")).filter((m): m is Material => MATERIALS.some((known) => known.id === m)),
  };
}

export function toSearchString(query: CatalogQuery): string {
  const params = new URLSearchParams();
  if (query.q.trim()) params.set("q", query.q);
  if (query.categories.length) params.set("kategori", query.categories.join(","));
  if (query.materials.length) params.set("materiale", query.materials.join(","));
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const isActive = (query: CatalogQuery): boolean =>
  query.q.trim() !== "" || query.categories.length > 0 || query.materials.length > 0;
