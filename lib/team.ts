// Team members scraped verbatim from docs/scrape/um-okkur.json (blocks 31-59).
// Portraits for Vilmundur/Örvar/Þórir are shared with the home page's
// AdvisorySection (docs/scrape/home.json); the rest are um-okkur-only crops.
// Two of the live scrape's photo `alt` attributes are wrong (a leftover stock
// name "Alex Peterson" on Vilmundur's photo, and "Hlynur Ísak" on Þórir's) —
// left empty here so TeamCard's `image.alt || name` fallback shows the right
// name instead of repeating the site's own mistake. Kormákur has no portrait
// on the live site either: his "photo" is a generic placeholder-avatar image
// (um-okkur/12-25d30121.png), rendered like any other team image.
// Email/phone render as plain text, not links — the scrape has them as plain
// <h6> headings, not <a> blocks (confirmed against the live server-rendered
// HTML, which has no mailto:/tel: hrefs on this page).

import type { Img } from "./types";

export type Member = {
  role: string;
  name: string;
  email?: string;
  phone?: string;
  image: Img;
};

export const team: Member[] = [
  {
    role: "Framkvæmdastjóri",
    name: "Vilmundur Theodórsson",
    email: "villi@skralli.is",
    phone: "779 1886",
    image: { src: "/images/home/27-d812c419.jpg", alt: "", width: 393, height: 261 },
  },
  {
    role: "Sölustjóri",
    name: "Örvar S. Haraldsson",
    email: "orvar@skralli.is",
    phone: "862 4046",
    image: {
      src: "/images/home/28-23d4abab.jpg",
      alt: "Örvar S. Haraldsson",
      width: 393,
      height: 261,
    },
  },
  {
    role: "Lagerstjóri",
    name: "Þórir Ágúst Þórðarson",
    email: "thorir@skralli.is",
    phone: "862 4044",
    image: { src: "/images/home/29-ad270c68.jpg", alt: "", width: 393, height: 261 },
  },
  {
    role: "Þjónustufulltrúi",
    name: "Adam Orri Guðmundsson",
    image: { src: "/images/um-okkur/09-1fa8df66.jpg", alt: "", width: 393, height: 261 },
  },
  {
    role: "Markaðssvið",
    name: "Hlynur Ísak Vilmundarson",
    email: "hlynur@skralli.is",
    phone: "776 4836",
    image: { src: "/images/um-okkur/10-99c4fe50.jpg", alt: "", width: 393, height: 261 },
  },
  {
    role: "Verkstæði",
    name: "Steinar Ingi",
    image: { src: "/images/um-okkur/11-1411f97b.jpg", alt: "", width: 393, height: 261 },
  },
  {
    role: "Verkstæði",
    name: "Kormákur",
    image: { src: "/images/um-okkur/12-25d30121.png", alt: "", width: 393, height: 409 },
  },
];
