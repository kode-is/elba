import { Figtree, Inter } from "next/font/google";
import localFont from "next/font/local";

// Matches live www.elba.no, measured via computed styles on six pages at
// 1440px and 390px (`node scripts/measure.mjs`, output in docs/measure.txt):
// Figtree is the site's default body/heading font, Inter is Framer's default
// token font used for card-level titles, breadcrumbs, footer links, article
// body copy and table text, and Satoshi (self-hosted below) is used by the
// stats band only — the counter digits (Satoshi 700 64px) and their labels
// (Satoshi 500 18px/28px) on the home page and /om-oss. `next/font/google`
// downloads Figtree and Inter at build time and self-hosts them — no runtime
// request to Google — so no `<link>` tag is needed or added.
export const figtree = Figtree({
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-figtree",
});

export const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

// Satoshi isn't on Google Fonts — Fontshare's free-for-commercial-use woff2
// files are downloaded once into assets/fonts/ (see README.md) and served
// the same self-hosted way via next/font/local.
export const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  src: [
    { path: "../assets/fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
});
