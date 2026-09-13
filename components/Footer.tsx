import Link from "next/link";
import { Container } from "./Container";
import { site, footerColumns } from "@/lib/site";

type FooterColumn = (typeof footerColumns)[number];

function FooterLinkColumn({ column, className }: { column: FooterColumn; className?: string }) {
  return (
    <div className={className}>
      <h4 className="mb-4 font-ui font-semibold text-neutral-900">{column.heading}</h4>
      <ul className="space-y-3">
        {column.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-ui text-sm text-neutral-600 transition hover:text-brand"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [selskapet] = footerColumns;

  return (
    <footer className="bg-white py-16 md:py-20">
      <Container>
        <div className="flex flex-col items-center gap-12 text-center md:grid md:grid-cols-[1.3fr_1fr] md:items-start md:gap-8 md:text-left">
          <div className="order-2 flex flex-col items-center gap-4 md:order-1 md:items-start">
            <Link href="/" aria-label="ELBA - Hjem">
              <span className="text-2xl font-bold text-brand">ELBA</span>
            </Link>
            <div className="space-y-1 text-sm text-neutral-600">
              <p>{site.address}</p>
              <p>{site.phone}</p>
              <p>{site.email}</p>
            </div>
          </div>

          <FooterLinkColumn column={selskapet} className="order-1 md:order-2" />
        </div>

        <p className="mt-12 text-center text-sm text-neutral-500 md:text-left">
          © {new Date().getFullYear()} {site.copyright}
        </p>
      </Container>
    </footer>
  );
}
