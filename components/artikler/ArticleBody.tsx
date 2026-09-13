import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import type { ArticleBlock } from "@/lib/artikler";
import { BulletList } from "@/components/BulletList";

const HEADING_CLASS: Record<2 | 3 | 4, string> = {
  2: "mt-10 mb-4 text-2xl leading-tight font-semibold text-neutral-900 first:mt-0 md:text-3xl",
  3: "mt-8 mb-3 text-xl leading-tight font-semibold text-neutral-900 md:text-2xl",
  4: "mt-6 mb-2 text-lg leading-tight font-semibold text-neutral-900",
};

/**
 * Renders an article's `body` blocks in order (docs/scrape/artikler__<id>.json,
 * after the subtitle H1 and before the closing "Send oss en forespørsel" CTA
 * that `<ContactCta />` renders instead). Consecutive `text` blocks sharing
 * the same `list` group number are batched into one `<BulletList>` — dead
 * code against today's scrape (no artikler route currently carries `list`
 * annotations, see scripts/gen-artikler.mjs's header comment) but correct
 * per the `ArticleBlock` type for whenever scrape-formatting is re-run.
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
      nodes.push(
        <p key={i} className="mb-4 text-sm leading-relaxed text-neutral-700 md:text-base">
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
            <figcaption className="mt-3 text-sm italic text-neutral-500">{block.caption}</figcaption>
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
