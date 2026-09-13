import Link from "next/link";
import { Container } from "./Container";
import { navCta } from "@/lib/site";

export function ContactCta() {
  return (
    <section className="bg-brand">
      <Container className="flex flex-col items-start gap-6 py-10 md:flex-row md:items-center md:justify-between md:py-12">
        <h2 className="text-section font-semibold text-white md:text-section-lg">
          Send oss en forespørsel
        </h2>
        <Link
          href={navCta.href}
          className="inline-flex items-center justify-center rounded-[10px] border border-white px-[30px] py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:bg-white hover:text-brand"
        >
          {navCta.text}
        </Link>
      </Container>
    </section>
  );
}
