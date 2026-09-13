import type { MetadataRoute } from "next";

// Mirrors the live skralli.is/robots.txt: allow everything, point at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://skralli.is/sitemap.xml",
  };
}
