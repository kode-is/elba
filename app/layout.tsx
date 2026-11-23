import type { Metadata } from "next";
import { figtree, inter, satoshi } from "./fonts";
import { Header } from "@/components/Header";
import { jsonLdString, siteJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  title: "ELBA – sentralsmøring og smøresystemer for anlegg og industri",
  description:
    "ELBA leverer, monterer og servicerer sentralsmøreanlegg og smøreutstyr til anleggsmaskiner og norsk industri – siden 1991.",
  metadataBase: new URL("https://www.elba.no"),
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" className={`${figtree.variable} ${inter.variable} ${satoshi.variable}`}>
      <body className="font-sans antialiased text-black bg-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(siteJsonLd) }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black focus:shadow-md"
        >
          Gå til innhold
        </a>
        <Header />
        {children}
      </body>
    </html>
  );
}
