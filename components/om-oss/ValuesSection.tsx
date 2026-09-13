import { CheckList } from "@/components/CheckList";

// docs/scrape/om-oss.json blocks 12-14: three H4 values with no body copy.
// docs/reference/om-oss.desktop.jpg / .mobile.jpg both show only
// "Samarbeid" and "Pålitelighet" with a plain checkmark — visually
// identical to CheckList's existing checkmark + bold H4 shape (no unique
// per-item icon, unlike the badge-style IconCardGrid). "Kvalitet" doesn't
// render as a third checked row in either reference screenshot (a live-site
// quirk), but it's still rendered here since docs/scrape/om-oss.json is the
// content authority and the task's completeness bar covers every block.
const VALUES = ["Samarbeid", "Pålitelighet", "Kvalitet"];

type ValuesSectionProps = {
  className?: string;
};

export function ValuesSection({ className }: ValuesSectionProps) {
  return <CheckList items={VALUES} className={className} />;
}
