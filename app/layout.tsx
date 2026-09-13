import type { Metadata } from "next";
import { figtree, inter, satoshi } from "./fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  metadataBase: new URL("https://skralli.is"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="is" className={`${figtree.variable} ${inter.variable} ${satoshi.variable}`}>
      <body className="font-sans antialiased text-neutral-900 bg-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-neutral-900 focus:shadow-md"
        >
          Fara í efni
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
