import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import type { ArticleBlock } from "@/lib/artikler";
import { BulletList } from "@/components/BulletList";

const HEADING_CLASS: Record<2 | 3 | 4, string> = {
  2: "mt-10 mb-4 font-ui text-[26px] leading-[1.3] font-semibold text-black first:mt-0",
  3: "mt-8 mb-3 font-ui text-card-lg font-semibold text-black",
  4: "mt-6 mb-2 font-ui text-label-lg font-semibold text-black",
};

/**
 * Renders an article's `body` blocks in order (docs/scrape/artikler__<id>.json,
 * after the subtitle H1 and before the closing "Send oss en forespørsel" CTA
 * that `<ContactCta />` renders instead). Consecutive `text` blocks sharing
 * the same `list` group number (from `npm run scrape-formatting`, see
 * scripts/gen-artikler.mjs's header comment) are batched into one
 * `<BulletList>` — e.g. velge-system's four system types each have a
 * "Styrker:"/"Begrensninger:" pair of short bullet lists. A `bold` text
 * block (those same "Styrker:"/"Begrensninger:" labels) renders as
 * `<p><strong>…</strong></p>`.
 */
export function ArticleBody({ body }: { body: ArticleBlock[] }) {
  const nodes: ReactNode[] = [];
  let i = 0;
  while (i < body.length) {
    const block = body[i];

    if (block.type === "text" && typeof block.list === "number") {
      const groupId = block.list;
      const items: string[] = [];
      let j = i;
      while (j < body.length) {
        const cur = body[j];
        if (cur.type === "text" && cur.list === groupId) {
          items.push(cur.text);
          j++;
        } else break;
      }
      nodes.push(<BulletList key={`list-${i}`} items={items} className="mb-4" />);
      i = j;
      continue;
    }

    if (block.type === "heading") {
      const Tag = `h${block.level}` as "h2" | "h3" | "h4";
      nodes.push(
        <Tag key={i} className={HEADING_CLASS[block.level]}>
          {block.text}
        </Tag>
      );
      i++;
      continue;
    }

    if (block.type === "text") {
      // Live styles a pull-quote paragraph — one that opens with a curly
      // quote mark — italic Inter 16px/1.8 in #999, indented 22px (measured
      // on /artikler/nytt-eierskap, docs/measure.txt). The scrape carries no
      // "quote" block role, so the opening character is the only signal; the
      // surrounding body paragraphs stay #444 upright.
      const isQuote = block.text.trimStart().startsWith("\u201C");
      nodes.push(
        <p
          key={i}
          className={
            isQuote
              ? "mb-4 pl-[22px] font-ui text-[16px] leading-[1.8] text-ink-quote italic"
              : "mb-4 font-ui text-body-lg text-ink-muted"
          }
        >
          {block.bold ? <strong>{block.text}</strong> : block.text}
        </p>
      );
      i++;
      continue;
    }

    if (block.type === "image") {
      nodes.push(
        <figure key={i} className="my-8">
          <Image
            src={block.image.src}
            alt={block.image.alt}
            width={block.image.width}
            height={block.image.height}
            sizes="(min-width: 768px) 960px, 100vw"
            className="h-auto w-full rounded-2xl object-cover"
          />
          {block.caption ? (
            <figcaption className="mt-3 font-ui text-body-lg text-ink-muted">{block.caption}</figcaption>
          ) : null}
        </figure>
      );
      i++;
      continue;
    }

    // block.type === "link"
    nodes.push(
      <p key={i} className="mb-4">
        <a href={block.href} className="font-semibold text-brand underline underline-offset-2">
          {block.text}
        </a>
      </p>
    );
    i++;
  }

  return <Fragment>{nodes}</Fragment>;
}
