type BulletListProps = {
  items: string[];
  className?: string;
};

/**
 * Plain bulleted list for block-level `"list": <n>` annotations in
 * docs/scrape/vetrarbunadur.json and docs/scrape/fyrirokumannin.json — a
 * simple disc marker matches both reference screenshots exactly, so no
 * custom bullet glyph is needed. Shared because both routes need it.
 */
export function BulletList({ items, className }: BulletListProps) {
  return (
    <ul
      className={`list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-neutral-600 md:text-base${
        className ? ` ${className}` : ""
      }`}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
