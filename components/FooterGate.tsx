"use client";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
export function FooterGate({ hideOn }: { hideOn: string[] }) {
  const pathname = usePathname();
  return hideOn.includes(pathname) ? null : <Footer />;
}
