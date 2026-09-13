type BulletListProps = {
  items: string[];
  className?: string;
};

/**
 * Plain bulleted list for the block-level `"list": <n>` annotations
 * `npm run scrape-formatting` writes onto the article scrapes
 * (docs/scrape/artikler__*.json). A simple disc marker matches the reference
 * screenshots exactly, so no custom bullet glyph is needed.
 */
export function BulletList({ items, className }: BulletListProps) {
  return (
    <ul
      className={`list-disc space-y-1.5 pl-5 font-ui text-body-lg text-ink-muted${
        className ? ` ${className}` : ""
      }`}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
