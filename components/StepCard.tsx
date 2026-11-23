import Link from "next/link";

type StepCardProps = {
  number: string;
  title: string;
  text: string;
  /** Verbatim scrape link text, arrow included (e.g. "Senda fyrirspurn →"). */
  linkText: string;
  href: string;
  /** Card colour: cream on white sections (default), white on cream ones (/brannslukking). */
  tone?: "cream" | "white";
};

export function StepCard({ number, title, text, linkText, href, tone = "cream" }: StepCardProps) {
  return (
    <div className={`flex flex-col rounded-[20px] p-6 md:p-8 ${tone === "white" ? "bg-white" : "bg-surface"}`}>
      <div className="flex items-start gap-3">
        <h3 className="text-[20px] leading-[1.3] font-semibold text-brand md:text-[28px]">{number}</h3>
        <h5 className="font-ui text-sub font-semibold text-black md:text-sub-lg">{title}</h5>
      </div>
      <p className="mt-4 font-ui text-body text-ink-muted md:text-body-lg">{text}</p>
      <Link
        href={href}
        className="mt-6 inline-flex w-fit items-center text-body font-semibold text-brand transition hover:underline md:text-body-lg"
      >
        {linkText}
      </Link>
    </div>
  );
}
