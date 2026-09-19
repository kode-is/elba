// Site-wide search index and ranking for the header's search palette
// (components/SearchPalette.tsx) — pages, product categories, every product
// table row and the articles. Modelled on kode-is/totus's lib/search.ts, with
// the catalog's matching rules (lib/catalog.ts: `ø` ≈ `o`, "04014701013" finds
// "0401 4701 013"), article-number-aware ranking and match highlighting.
//
// Pure functions, type-only data imports: the index is built on the server by
// app/search-index.json/route.ts and fetched by the palette the first time it
// opens, so none of the product or article data lands in a page's own bundle.
import type { Product } from "@/lib/produkter";
import type { Article } from "@/lib/artikler";
import { buildCatalog, normalize, toSearchString } from "@/lib/catalog";

export type SearchType = "kategori" | "produkt" | "artikkel" | "side";

/** Tie-break order between groups whose best hits score the same. */
const TYPE_ORDER: SearchType[] = ["kategori", "produkt", "artikkel", "side"];

export const GROUP_LABEL: Record<SearchType, string> = {
  kategori: "Produktkategorier",
  produkt: "Produkter",
  artikkel: "Artikler",
  side: "Sider",
};

export type SearchItem = {
  type: SearchType;
  title: string;
  subtitle?: string;
  href: string;
  /** Normalised text every query word must occur in. */
  blob: string;
  /** Product rows only: the normalised, whitespace-free Art.Nr., for exact-match ranking. */
  artNr?: string;
};

export type SearchGroup = { type: SearchType; total: number; items: SearchItem[] };
export type SearchResult = { groups: SearchGroup[]; total: number };

// Keywords are search-only — they are never rendered.
const PAGES: { title: string; href: string; keywords: string }[] = [
  { title: "Hjem", href: "/", keywords: "forside elba sentralsmøring smøreanlegg smøreteknikk" },
  { title: "Om oss", href: "/om-oss", keywords: "team ansatte historie verdier kvalitet" },
  { title: "Tjenester", href: "/tjenester", keywords: "anlegg industri løsninger" },
  { title: "Anlegg", href: "/anlegg", keywords: "anleggsmaskin gravemaskin maskin sentralsmøring overvåking montering" },
  { title: "Industri", href: "/industri", keywords: "produksjon fabrikk smøresystem industrien havn" },
  { title: "Produkter", href: "/produkter", keywords: "katalog sortiment deler varer art.nr. søk" },
  { title: "Artikler", href: "/artikler", keywords: "nyheter fagstoff blogg" },
  { title: "Etikk og ansvar", href: "/etikk-og-ansvar", keywords: "code of conduct miljø bærekraft retningslinjer" },
  { title: "Kontakt oss", href: "/kontakt-oss", keywords: "telefon e-post adresse forespørsel tilbud skjema" },
];

const squeeze = (s: string) => s.replace(/ /g, "");

const excerpt = (text: string, max = 110) => (text.length <= max ? text : `${text.slice(0, max).trimEnd()}…`);

export function buildSearchIndex({ products, articles }: { products: Product[]; articles: Article[] }): SearchItem[] {
  const items: SearchItem[] = [];

  for (const page of PAGES) {
    items.push({ type: "side", title: page.title, href: page.href, blob: normalize(`${page.title} ${page.keywords}`) });
  }

  for (const product of products) {
    const rowCount = product.tables.reduce((n, t) => n + t.rows.length, 0);
    const headings = product.tables.map((t) => t.heading ?? "");
    items.push({
      type: "kategori",
      title: product.title,
      subtitle: [`${rowCount} produkter`, ...product.subnav].join(" · "),
      href: `/produkter/${product.id}`,
      blob: normalize([product.title, "produkter", ...product.subnav, ...headings, ...product.intro].join(" ")),
    });
  }

  // One item per table row, sharing the catalog's haystack so the palette and
  // /produkter match exactly the same things. A row opens the catalog filtered
  // down to itself — by Art.Nr. where it has one, else by its own cells.
  for (const row of buildCatalog(products)) {
    const hasArtNr = /\d/.test(row.artNr);
    const specs = row.headers
      .map((header, i) => ({ header, cell: row.cells[i] ?? "" }))
      .filter(({ cell }) => cell !== "" && cell !== row.artNr);
    items.push({
      type: "produkt",
      title: hasArtNr ? `Art.nr. ${row.artNr}` : `${row.categoryTitle} – på forespørsel`,
      subtitle: [row.categoryTitle, row.heading, ...specs.map(({ header, cell }) => `${header} ${cell}`)]
        .filter(Boolean)
        .join(" · "),
      href: `/produkter${toSearchString({
        q: hasArtNr ? row.artNr : specs.map(({ cell }) => cell).join(" "),
        categories: [row.categoryId],
        materials: [],
      })}`,
      blob: row.haystack,
      artNr: hasArtNr ? squeeze(normalize(row.artNr)) : undefined,
    });
  }

  for (const article of articles) {
    const texts = article.body.flatMap((block) => (block.type === "heading" || block.type === "text" ? [block.text] : []));
    const lead = article.subtitle && article.subtitle !== article.title ? article.subtitle : (texts[0] ?? "");
    items.push({
      type: "artikkel",
      title: article.title,
      subtitle: lead ? excerpt(lead) : undefined,
      href: `/artikler/${article.id}`,
      blob: normalize([article.title, article.subtitle ?? "", ...texts].join(" ")),
    });
  }

  return items;
}

function score(item: SearchItem, tokens: string[], squeezedQuery: string): number {
  if (item.artNr) {
    if (item.artNr === squeezedQuery) return 100;
    return tokens.reduce((sum, t) => sum + (item.artNr!.startsWith(t) ? 6 : 1), 0);
  }
  const title = normalize(item.title);
  return tokens.reduce(
    (sum, t) => sum + (title.startsWith(t) ? 8 : title.includes(` ${t}`) ? 5 : title.includes(t) ? 3 : 1),
    0,
  );
}

/**
 * Every query word must occur in an item's blob. Items are ranked by where
 * the words hit (an exact Art.Nr. beats everything; a title that starts with
 * the word beats one that merely contains it, which beats a body-only hit),
 * grouped by type, and the groups ordered by their best hit — so "rørender"
 * leads with the category, "04014701013" with the product row.
 */
export function searchIndex(items: SearchItem[], query: string, perGroup = 6): SearchResult {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return { groups: [], total: 0 };
  const squeezedQuery = tokens.join("");

  const byType = new Map<SearchType, { item: SearchItem; score: number }[]>();
  for (const item of items) {
    if (!tokens.every((t) => item.blob.includes(t))) continue;
    const hits = byType.get(item.type) ?? [];
    hits.push({ item, score: score(item, tokens, squeezedQuery) });
    byType.set(item.type, hits);
  }

  const groups = [...byType.entries()]
    .map(([type, hits]) => {
      hits.sort((a, b) => b.score - a.score); // stable: equal scores keep index order
      return { type, total: hits.length, best: hits[0].score, items: hits.slice(0, perGroup).map((h) => h.item) };
    })
    .sort((a, b) => b.best - a.best || TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type))
    .map(({ type, total, items: groupItems }) => ({ type, total, items: groupItems }));

  return { groups, total: groups.reduce((n, g) => n + g.total, 0) };
}

export type HighlightSegment = { text: string; match: boolean };

/**
 * Splits `text` into matched / unmatched runs for the query's words, using
 * the same folding as the search itself, so "ror" marks "Rør" and
 * "04014701013" marks "0401 4701 013" (a second pass ignores the text's own
 * spaces). Folding is done per character with a map back to the original
 * index, since `æ` folds to two characters.
 */
export function highlight(text: string, query: string): HighlightSegment[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  const marked = new Array<boolean>(text.length).fill(false);

  for (const skipSpaces of [false, true]) {
    let folded = "";
    const origin: number[] = [];
    for (let i = 0; i < text.length; i++) {
      if (skipSpaces && /\s/.test(text[i])) continue;
      // normalize() trims, so a lone space would fold to "" — keep it as a space.
      for (const ch of /\s/.test(text[i]) ? " " : normalize(text[i])) {
        folded += ch;
        origin.push(i);
      }
    }
    // The space-blind pass is for codes ("04014701013", "m10x1"); letting plain
    // words through it would mark stray letters across word boundaries.
    for (const token of skipSpaces ? tokens.filter((t) => /\d/.test(t)) : tokens) {
      for (let at = folded.indexOf(token); at !== -1; at = folded.indexOf(token, at + 1)) {
        for (let i = origin[at]; i <= origin[at + token.length - 1]; i++) marked[i] = true;
      }
    }
  }

  const segments: HighlightSegment[] = [];
  for (let i = 0; i < text.length; i++) {
    const last = segments.at(-1);
    if (last && last.match === marked[i]) last.text += text[i];
    else segments.push({ text: text[i], match: marked[i] });
  }
  return segments.length ? segments : [{ text, match: false }];
}
