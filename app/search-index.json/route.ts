import { artikler } from "@/lib/artikler";
import { produkter } from "@/lib/produkter";
import { buildSearchIndex } from "@/lib/search";
import { SUBNAV_TABLES } from "@/lib/subnav";

// The search palette's index (components/SearchPalette.tsx), prerendered to a
// static JSON file at build time and fetched the first time the palette opens
// — so the product and article data never ride along in a page's own bundle.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex({ products: produkter, articles: artikler, subnav: SUBNAV_TABLES }));
}
