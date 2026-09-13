"use client";

import { useId, useState } from "react";

export type FaqItem = { question: string; answer: string };

type FaqProps = {
  items: FaqItem[];
};

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`h-5 w-5 shrink-0 text-neutral-900 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const rowId = useId();
  const questionId = `faq-q-${rowId}`;
  const answerId = `faq-a-${rowId}`;

  return (
    <div className="rounded-2xl bg-white shadow-sm">
      <button
        type="button"
        id={questionId}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-start justify-between gap-4 px-6 py-6 text-left"
      >
        <span className="font-ui font-semibold text-neutral-900">{item.question}</span>
        <ToggleIcon open={isOpen} />
      </button>
      {isOpen ? (
        <div
          id={answerId}
          role="region"
          aria-labelledby={questionId}
          className="whitespace-pre-line px-6 pb-6 text-sm leading-relaxed text-neutral-600"
        >
          {item.answer}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Accordion for /anlegg's "Hvordan fungerer det?" (docs/scrape/anlegg.json)
 * and "Spurt & Svarað" (docs/scrape/smurkerfi.json). Each row opens
 * independently (docs/reference/anlegg.desktop.jpg shows each question as
 * its own separate rounded white card with a right-aligned chevron, not a
 * single seamless divided list) — that also matters functionally:
 * scripts/lib/accordion.mjs clicks every question in one DOM pass, and a
 * mutually-exclusive accordion would end that pass with only the
 * last-clicked answer still in the DOM, failing `npm run verify`'s text
 * diff for the other rows. The button's visible text is exactly the
 * question — the toggle icon is aria-hidden and the answer renders in a
 * sibling element outside the button — because accordion.mjs opens rows by
 * clicking whichever element's full textContent ends in "?".
 */
export function Faq({ items }: FaqProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <FaqRow key={item.question} item={item} />
      ))}
    </div>
  );
}
