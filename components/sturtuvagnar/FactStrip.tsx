import { Container } from "@/components/Container";
import { productFacts } from "@/lib/product-facts";
import type { Wagon, WagonGroup } from "@/lib/sturtuvagnar";

// design.dc.html 1a/1d "Staðreyndastrimill": a white card of N fact cells
// below the hero. Desktop lays the (present-only) facts out in one row of
// N equal columns divided by vertical rules; mobile switches to a 2-column
// grid with no dividers and moves "Flokkur" (the longest value) to its own
// full-width row at the end. N varies per product (4, 5 or 6 — see
// lib/product-facts.ts), so the desktop column count is threaded through a
// CSS custom property rather than a hardcoded Tailwind class.
//
// design.dc.html 1b merges "Framleiðandi" and "Framleitt í" below `md`
// (phones show one "Gigant · Noregi" cell, no separate origin cell) so the
// 2-column grid never has an empty trailing slot: `productFacts` still
// returns its fixed 6-entry order (lib/product-facts.ts's tests pin it),
// this component just hides the "Framleitt í" cell and swaps in the merged
// value below `md`, and reorders the visible mobile cells via `order-*`
// (Stærð, Sturtuhalli, Framleiðandi, Ábyrgð, then Flokkur full-width) while
// every cell resets to `md:order-none` so the desktop row keeps the
// original array order.
const MOBILE_ORDER: Record<string, string> = {
  "Stærð": "order-1 md:order-none",
  Sturtuhalli: "order-2 md:order-none",
  "Framleiðandi": "order-3 md:order-none",
  "Ábyrgð": "order-4 md:order-none",
};

export function FactStrip({ product, group }: { product: Wagon; group: WagonGroup }) {
  const facts = productFacts(product, group);
  const lastIndex = facts.length - 1;

  return (
    <Container>
      <div
        className="mt-8 grid grid-cols-2 gap-x-4 gap-y-[18px] rounded-[15px] border border-[#E3E9F2] bg-white p-5 md:grid-cols-[repeat(var(--fact-cols),1fr)] md:gap-x-0 md:gap-y-0 md:px-10 md:py-[30px]"
        style={{ "--fact-cols": facts.length } as React.CSSProperties}
      >
        {facts.map((fact, index) => {
          const isFlokkur = fact.label === "Flokkur";
          const isFramleittI = fact.label === "Framleitt í";
          const isFramleidandi = fact.label === "Framleiðandi";
          const dividerClass =
            index === 0
              ? "md:pr-6"
              : index === lastIndex
                ? "md:border-l md:border-[#E3E9F2] md:pl-6"
                : "md:border-l md:border-[#E3E9F2] md:px-6";

          return (
            <div
              key={fact.label}
              className={`${dividerClass} ${MOBILE_ORDER[fact.label] ?? ""} ${
                isFramleittI ? "hidden md:block" : ""
              } ${
                isFlokkur
                  ? "order-last col-span-2 border-t border-[#E3E9F2] pt-3.5 md:order-none md:col-span-1 md:border-t-0 md:pt-0"
                  : ""
              }`}
            >
              <div className="font-ui text-[10px] font-semibold uppercase tracking-[.1em] text-brand-dark md:text-[11px]">
                {fact.label}
              </div>
              <div
                className={`mt-[5px] font-ui text-[15px] font-semibold leading-[1.3] md:mt-2 md:text-[17px] ${
                  fact.tone === "green" ? "text-accent-green" : "text-[#171717]"
                }`}
              >
                {isFramleidandi ? (
                  <>
                    <span className="md:hidden">Gigant · Noregi</span>
                    <span className="hidden md:inline">{fact.value}</span>
                  </>
                ) : (
                  fact.value
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
