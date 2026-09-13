import { Figtree, Inter } from "next/font/google";
import localFont from "next/font/local";

// Matches the live skralli.is (measured via computed styles on 5 pages at
// 1440px — see docs/handover.md): Figtree is the site's default body/heading
// font, Inter is Framer's default token font used for card-level titles,
// breadcrumbs, footer links and table text, and Satoshi (self-hosted below)
// is used only for the animated StatCounter digits. `next/font/google`
// downloads these at build time and self-hosts them — no runtime request to
// Google — so no `<link>` tag is needed or added.
export const figtree = Figtree({
  weight: ["400", "600"],
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
