"use client";

import { productSize } from "@/lib/product-facts";
import type { Wagon } from "@/lib/sturtuvagnar";
import { useInquiry } from "./InquiryContext";

// design.dc.html 1a/1b/1d: the sticky "Fá tilboð" bar, rendered as the last
// child of <main> on product pages so `sticky bottom-0` pins it to the
// viewport bottom only while <main> is on screen — the footer scrolls up
// over it once the page bottoms out, which is the design's intent (hence
// `sticky`, never `fixed`). Its button expands the shared card and bumps
// `focusRequest` so InquiryCard's effect knows to scroll into view and
// focus the first field — a manual tap on the card's own collapsed header
// only calls `setExpanded`, so it expands in place without stealing scroll.
export function MobileQuoteBar({ product }: { product: Wagon }) {
  const { setExpanded, requestFocus } = useInquiry();
  const size = productSize(product.blurb);
  const factsLine = [size, "5 ára ábyrgð"].filter(Boolean).join(" · ");

  return (
    <div className="sticky bottom-0 z-10 flex items-center gap-3.5 border-t border-[#E3E9F2] bg-white px-5 py-3 md:hidden">
      <div className="min-w-0 flex-1">
        <div className="font-ui text-sm font-bold text-[#171717]">{product.title}</div>
        <div className="truncate font-ui text-xs text-[#444444]">{factsLine}</div>
      </div>
      <button
        type="button"
        onClick={() => {
          setExpanded(true);
          requestFocus();
        }}
        className="bg-brand-dark px-6 py-4 text-base font-semibold text-white hover:bg-brand-mid"
      >
        Fá tilboð
      </button>
    </div>
  );
}
