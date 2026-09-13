import Link from "next/link";

type StepCardProps = {
  number: string;
  title: string;
  text: string;
  /** Verbatim scrape link text, arrow included (e.g. "Senda fyrirspurn →"). */
  linkText: string;
  href: string;
};

export function StepCard({ number, title, text, linkText, href }: StepCardProps) {
  return (
    <div className="flex flex-col rounded-2xl bg-[#f0f4fa] p-6 md:p-8">
      <div className="flex items-start gap-3">
        <h3 className="text-2xl font-semibold text-brand-dark">{number}</h3>
        <h5 className="font-ui text-lg font-semibold text-neutral-900">{title}</h5>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-neutral-600">{text}</p>
      <Link
        href={href}
        className="mt-6 inline-flex w-fit items-center text-sm font-semibold text-brand-dark transition hover:underline"
      >
        {linkText}
      </Link>
    </div>
  );
}
