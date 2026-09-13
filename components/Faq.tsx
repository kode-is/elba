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
      className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-200 ${
        open ? "rotate-45" : ""
      }`}
    >
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const rowId = useId();
  const questionId = `faq-q-${rowId}`;
  const answerId = `faq-a-${rowId}`;

  return (
    <div>
      <button
        type="button"
        id={questionId}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center gap-4 px-6 py-5 text-left"
      >
        <ToggleIcon open={isOpen} />
        <span className="font-ui font-semibold text-neutral-900">{item.question}</span>
      </button>
      {isOpen ? (
        <div
          id={answerId}
          role="region"
          aria-labelledby={questionId}
          className="whitespace-pre-line pb-5 pl-9 pr-6 text-sm leading-relaxed text-neutral-600"
        >
          {item.answer}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Accordion for "Spurt & Svarað" (docs/scrape/smurkerfi.json). Each row
 * opens independently (docs/reference/smurkerfi.desktop.jpg and
 * .mobile.jpg both show all three questions expanded at once, so this
 * matches "or all closable" rather than a mutually-exclusive accordion —
 * that choice also matters functionally: scripts/lib/accordion.mjs clicks
 * every question in one DOM pass, and a single-open accordion would end
 * that pass with only the last-clicked answer still in the DOM, failing
 * `npm run verify`'s text diff for the other two). The button's visible
 * text is exactly the question — the toggle icon is aria-hidden and the
 * answer renders in a sibling element outside the button — because
 * accordion.mjs opens rows by clicking whichever element's full
 * textContent ends in "?".
 */
export function Faq({ items }: FaqProps) {
  return (
    <div className="divide-y divide-neutral-200 overflow-hidden rounded-2xl bg-white">
      {items.map((item) => (
        <FaqRow key={item.question} item={item} />
      ))}
    </div>
  );
}
