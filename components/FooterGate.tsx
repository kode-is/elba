"use client";
import { usePathname } from "next/navigation";
export function FooterGate({ hideOn, children }: { hideOn: string[]; children: React.ReactNode }) {
  const pathname = usePathname();
  return hideOn.includes(pathname) ? null : <>{children}</>;
}
