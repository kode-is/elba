"use client";

import { useEffect, useRef } from "react";
import { ContactForm } from "@/components/ContactForm";
import { useInquiry } from "./InquiryContext";

// design.dc.html 1a/1b/1d "Fyrirspurnarkort — stöður": below md, a collapsed
// bg-[#F0F4FA] toggle row (the "＋"/"－" bar) sits above the full white
// card, which only shows once expanded; at md+ the toggle row is gone and
// the card is always shown (InquiryContext's `expanded` only ever matters
// below md). The same state is shared with MobileQuoteBar so its sticky
// "Fá tilboð" button opens this exact card instead of a second form — but
// only THAT trigger should scroll/focus, not a manual tap on this card's
// own header, so this effect keys off `focusRequest` (bumped only by
// MobileQuoteBar) rather than `expanded` itself: a ref remembers the last
// `focusRequest` it acted on, so a header tap (which changes `expanded`
// but not `focusRequest`) is a no-op here (a plain requestAnimationFrame
// chain in the click handler proved unreliable off-screen/backgrounded, so
// this reacts to the committed DOM instead of guessing at paint timing).
export function InquiryCard({ productTitle }: { productTitle: string }) {
  const { expanded, setExpanded, focusRequest } = useInquiry();
  const cardRef = useRef<HTMLDivElement>(null);
  const handledFocusRequest = useRef(0);

  useEffect(() => {
    if (!expanded) return;
    if (focusRequest === handledFocusRequest.current) return;
    handledFocusRequest.current = focusRequest;
    const card = cardRef.current;
    card?.scrollIntoView({ behavior: "smooth", block: "start" });
    card?.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea")?.focus();
  }, [expanded, focusRequest]);

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="inquiry-card"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3.5 rounded-[15px] bg-[#F0F4FA] p-5 text-left md:hidden"
      >
        <div>
          <div className="font-sans text-lg font-semibold text-[#171717]">Fá tilboð í {productTitle}</div>
          <div className="mt-1 font-ui text-[13px] text-[#444444]">Fast verð í verkið</div>
        </div>
        <span aria-hidden="true" className="font-ui text-[22px] font-semibold text-brand-dark">
          {expanded ? "－" : "＋"}
        </span>
      </button>

      <div
        id="inquiry-card"
        ref={cardRef}
        className={`mt-3.5 rounded-[15px] border border-[#E3E9F2] p-6 md:mt-0 md:block md:p-8 ${
          expanded ? "block" : "hidden"
        }`}
      >
        <h3 className="mb-2.5 font-sans text-2xl font-semibold text-[#171717]">Fá tilboð í {productTitle}</h3>
        <p className="mb-6 font-ui text-sm text-[#444444]">
          Við bjóðum fast verð í verkið. Vörunafnið fylgir fyrirspurninni sjálfkrafa.
        </p>
        <ContactForm
          variant="card"
          showPhone
          submitLabel="Senda!"
          defaultMessage={`Fyrirspurn um ${productTitle}`}
        />
      </div>
    </div>
  );
}
