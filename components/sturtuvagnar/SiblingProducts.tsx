import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { productSize } from "@/lib/product-facts";
import type { Wagon, WagonGroup } from "@/lib/sturtuvagnar";

type CardVariant = "wide" | "normal" | "compact";

function SeeAllLink({ group, className }: { group: WagonGroup; className?: string }) {
  return (
    <Link
      href={`/sturtuvagnar/${group.slug}`}
      className={`text-base font-semibold text-brand-dark hover:text-brand-mid ${className ?? ""}`}
    >
      Sjá alla {group.title.toLowerCase()} →
    </Link>
  );
}

function SiblingCard({
  product,
  isCurrent,
  variant,
}: {
  product: Wagon;
  isCurrent: boolean;
  variant: CardVariant;
}) {
  const size = productSize(product.blurb);
  const isCompact = variant === "compact";
  const isWide = variant === "wide";

  const imageBoxClass = isWide ? "h-[220px]" : isCompact ? "h-[140px]" : "h-[170px] md:h-[210px]";
  const bodyClass = isWide ? "p-[26px]" : isCompact ? "p-[18px]" : "p-5 md:p-6";
  const titleSizeClass = isCompact ? "text-[17px]" : "text-[19px] md:text-xl";
  const sizeTextClass = isCompact ? "text-sm" : "text-[15px]";
  const linkTextClass = isCompact ? "text-[13px]" : "text-sm";
  const imageSizes = isWide ? "300px" : isCompact ? "(min-width: 768px) 25vw, 100vw" : "(min-width: 768px) 33vw, 100vw";

  const image = (
    <div className={`relative w-full ${imageBoxClass}`}>
      <Image
        src={product.cardImage.src}
        alt={product.cardImage.alt || product.title}
        fill
        sizes={imageSizes}
        className="object-cover"
      />
    </div>
  );

  const body = (
    <div className={bodyClass}>
      <div className="flex items-center justify-between gap-3">
        <h3
          className={`font-ui font-bold text-[#171717] ${titleSizeClass} ${
            isCurrent ? "" : "group-hover:text-brand-dark"
          }`}
        >
          {product.title}
        </h3>
        {isCurrent ? (
          <span className="shrink-0 rounded-full bg-[#F0F4FA] px-2.5 py-[5px] font-ui text-xs font-semibold text-brand-dark">
            þessi vara
          </span>
        ) : null}
      </div>
      {size ? (
        <div className={`mt-3 font-ui font-semibold text-[#171717] md:mt-3.5 ${sizeTextClass}`}>{size}</div>
      ) : null}
      {isCompact ? null : (
        <p className="mt-4 font-ui text-sm leading-[1.6] text-[#444444]">{product.blurb}</p>
      )}
      {isCurrent ? null : (
        <span
          className={`mt-4 inline-block font-ui font-semibold text-brand-dark group-hover:text-brand-mid group-hover:underline group-hover:underline-offset-[3px] ${linkTextClass}`}
        >
          Skoða nánar →
        </span>
      )}
    </div>
  );

  const shellClass = `overflow-hidden rounded-[15px] border border-[#E3E9F2] bg-white ${
    isWide ? "grid grid-cols-[300px_1fr] max-w-[760px]" : "block"
  }`;

  if (isCurrent) {
    return (
      <div className={shellClass}>
        {image}
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/sturtuvagnar/${product.slug}`}
      className={`group transition hover:border-brand-mid focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-mid focus-visible:outline-offset-[3px] ${shellClass}`}
    >
      {image}
      {body}
    </Link>
  );
}

// design.dc.html 1a/1b/1e "Tegundir í boði": the WHOLE group, current
// product included, in group.products order — so the page always shows
// where the current product sits among its siblings (1a: the current
// card carries a "þessi vara" pill instead of a link, no "Skoða nánar").
// Layout (from 1e's degradation variants) depends only on the group's
// total size (n = products.length), per the brief's ruling: n == 2 (one
// sibling; unreached by today's 5 real groups of 3/4/5/6/7, but kept since
// it's in the spec) renders just that one sibling as a wide horizontal
// card; n == 3 uses a 3-column grid of normal cards; n >= 4 switches to a
// 4-column grid of compact, blurb-less cards. Today's real groups: 3
// (fjórhjóla-/minigröfuvagnar), 4 (hjólagröfuvagnar) -> one row of 4, 5
// (landbúnaðarvagnar) -> 4+1, 6 (verktakavagnar) -> 4+2, 7
// (vélaflutningavagnar) -> 4+3. Mobile is always one column.
export function SiblingProducts({
  group,
  products,
  currentSlug,
}: {
  group: WagonGroup;
  products: Wagon[];
  currentSlug: string;
}) {
  const n = products.length;

  if (n === 2) {
    const sibling = products.find((product) => product.slug !== currentSlug);
    if (!sibling) return null;
    return (
      <section className="bg-[#F0F4FA] py-[60px] md:py-[110px]">
        <Container>
          <div className="mb-[22px] flex items-end justify-between md:mb-11">
            <h2 className="text-[32px] font-semibold text-[#171717] md:text-[50px]">Tegundir í boði</h2>
            <SeeAllLink group={group} className="hidden md:inline-block" />
          </div>
          <SiblingCard product={sibling} isCurrent={false} variant="wide" />
          <SeeAllLink group={group} className="mt-6 block md:hidden" />
        </Container>
      </section>
    );
  }

  const variant: CardVariant = n >= 4 ? "compact" : "normal";
  const gridClass = n >= 4 ? "md:grid-cols-4 md:gap-5" : "md:grid-cols-3 md:gap-7";

  return (
    <section className="bg-[#F0F4FA] py-[60px] md:py-[110px]">
      <Container>
        <div className="mb-[22px] flex items-end justify-between md:mb-11">
          <h2 className="text-[32px] font-semibold text-[#171717] md:text-[50px]">Tegundir í boði</h2>
          <SeeAllLink group={group} className="hidden md:inline-block" />
        </div>
        <div className={`grid grid-cols-1 gap-[18px] ${gridClass}`}>
          {products.map((product) => (
            <SiblingCard
              key={product.slug}
              product={product}
              isCurrent={product.slug === currentSlug}
              variant={variant}
            />
          ))}
        </div>
        <SeeAllLink group={group} className="mt-6 block md:hidden" />
      </Container>
    </section>
  );
}
