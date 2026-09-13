import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/routes";

const SITE_URL = "https://www.elba.no";

// All real routes (everything in ROUTES except the /404 not-found page).
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.filter((route) => route !== "/404").map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
