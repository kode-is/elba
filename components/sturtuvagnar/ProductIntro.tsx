import { Container } from "@/components/Container";
import { InquiryCard } from "@/components/sturtuvagnar/InquiryCard";
import type { Wagon, WagonGroup } from "@/lib/sturtuvagnar";

const PILL_BASE =
  "inline-flex items-center rounded-full px-3.5 py-[9px] font-ui text-[13px] font-medium md:px-4 md:py-2.5 md:text-sm";

// design.dc.html 1a/1b "Um <product>": the product's own blurb followed by
// its group's "Um X" paragraphs and the two fact pills, with the sticky
// inquiry card alongside it on desktop. On mobile the card moves to the
// top of the section via CSS `order` (not a second render — InquiryCard's
// own collapsed/expanded state, shared through InquiryContext, is the same
// instance the sticky MobileQuoteBar opens).
export function ProductIntro({ product, group }: { product: Wagon; group: WagonGroup }) {
  const lastAboutIndex = group.about.length - 1;

  return (
    <section className="pt-[28px] pb-[60px] md:pt-[100px] md:pb-[120px]">
      <Container className="grid gap-y-[60px] md:grid-cols-[1fr_400px] md:items-start md:gap-20">
        <div>
          <h2 className="mb-5 text-[32px] leading-[1.1] font-semibold text-[#171717] md:mb-7 md:text-[50px] md:leading-[1.06]">
            Um {product.title}
          </h2>
          <p className="mb-4 max-w-[640px] text-pretty text-[17px] leading-[1.6] text-[#171717] md:mb-[22px] md:text-lg">
            {product.blurb}
          </p>
          {group.about.map((paragraph, index) => (
            <p
              key={index}
              className={`max-w-[640px] text-pretty text-base leading-[1.65] text-[#444444] md:text-[17px] md:leading-[1.68] ${
                index === lastAboutIndex ? "mb-6 md:mb-8" : "mb-3.5 md:mb-5"
              }`}
            >
              {paragraph}
            </p>
          ))}
          <div className="flex flex-wrap gap-2 md:gap-2.5">
            <span className={`${PILL_BASE} bg-[#F0F4FA] text-brand-dark`}>Gigant · framleitt í Noregi</span>
            <span className={`${PILL_BASE} bg-[#EAF6F0] text-accent-green`}>5 ára ábyrgð</span>
          </div>
        </div>
        <div className="order-first md:order-none md:sticky md:top-6">
          <InquiryCard productTitle={product.title} />
        </div>
      </Container>
    </section>
  );
}
