import type { MetadataRoute } from "next";

// Mirrors the live www.elba.no/robots.txt: allow everything, point at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.elba.no/sitemap.xml",
  };
}
