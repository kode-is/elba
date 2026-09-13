// Shared per-page <head> boilerplate: canonical link, Open Graph, Twitter
// card and the robots meta tag, all derived from a page's own title,
// description and path.
import type { Metadata } from "next";

const SITE_URL = "https://www.elba.no";

// Home hero still. Placeholder for now — Task 6 sets the real hero still
// path from the elba.no scrape.
const OG_IMAGE = {
  url: "/images/home/01-placeholder.png",
  width: 1440,
  height: 807,
  alt: "ELBA - I INDUSTRIENS TJENESTE",
};

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "ELBA",
      locale: "nb_NO",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    robots: {
      "max-image-preview": "large",
    },
  };
}
