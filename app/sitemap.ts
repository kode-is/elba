import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/routes";

const SITE_URL = "https://skralli.is";

// All 56 real routes (everything in ROUTES except the /404 not-found page).
// The live sitemap omits the 7 category pages and /404 (50 URLs); this one
// lists every real route instead — strictly better than live.
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.filter((route) => route !== "/404").map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
