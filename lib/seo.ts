// Shared per-page <head> boilerplate: canonical link, Open Graph, Twitter
// card and the robots meta tag, all derived from a page's own title,
// description and path. Reproduces what every route on the live site
// (skralli.is) emits — confirmed against curl'd <head> output for `/`,
// `/vorumerki/bmair`, `/sturtuvagnar/gw-100` and
// `/hifi-festibunadur/hifikedjur`:
//   <link rel="canonical" href="https://skralli.is<path>">
//   <meta property="og:title" content="<title>">
//   <meta property="og:description" content="<description>">
//   <meta property="og:type" content="website">
//   <meta property="og:url" content="https://skralli.is<path>">
//   <meta name="twitter:card" content="summary_large_image">
//   <meta name="twitter:title" content="<title>">
//   <meta name="twitter:description" content="<description>">
//   <meta name="robots" content="max-image-preview:large">
// The live site has no og:image; this recreation adds one site-wide (the
// home hero still) since link-preview cards with no image look broken on
// every platform that surfaces them.
// apple-touch-icon (`app/apple-icon.png`) is a separate Next.js
// file-convention icon and isn't part of this helper.
import type { Metadata } from "next";

const SITE_URL = "https://skralli.is";

// Home hero still (components/home/Hero.tsx), reused site-wide as the
// Open Graph / Twitter card image since the live site has none of its own.
const OG_IMAGE = {
  url: "/images/home/01-087a3e5c.png",
  width: 1440,
  height: 807,
  alt: "Skralli - Þinn samstarfsaðili",
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
      siteName: "Skralli",
      locale: "is_IS",
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
