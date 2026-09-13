import type { Metadata } from "next";
import { figtree, inter, satoshi } from "./fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FooterGate } from "@/components/FooterGate";
import "./globals.css";

export const metadata: Metadata = {
  title: "ELBA - I INDUSTRIENS TJENESTE",
  description:
    "Hvert år leverer vi sentralsmøreanlegg til mange tusen smørepunkter, enten montert av egne montører eller hvor du selv setter opp systemet.",
  metadataBase: new URL("https://www.elba.no"),
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" className={`${figtree.variable} ${inter.variable} ${satoshi.variable}`}>
      <body className="font-sans antialiased text-black bg-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black focus:shadow-md"
        >
          Gå til innhold
        </a>
        <Header />
        {children}
        <FooterGate hideOn={["/404"]}>
          <Footer />
        </FooterGate>
      </body>
    </html>
  );
}
