"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { navCta } from "@/lib/site";

type NavItem = { text: string; href: string };

type MobileMenuProps = {
  nav: readonly NavItem[];
};

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ nav }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the menu and Tab/Shift+Tab is trapped inside this
  // container — the toggle button plus (while open) the floating card's
  // links, since the card floats over the still-visible page rather than
  // covering it with a full-screen panel.
  const close = useCallback(() => {
    setOpen(false);
    toggleButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !containerRef.current) return;
      const focusable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Move focus into the card when it opens: to the close button if it exists,
  // otherwise to the first link.
  useEffect(() => {
    if (!open) return;
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    } else {
      const firstLink = containerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstLink?.focus();
    }
  }, [open]);

  // Lock background scroll while the card is open, restoring whatever the
  // body's own overflow was set to beforehand.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div ref={containerRef} className="ml-auto md:hidden">
      <button
        ref={toggleButtonRef}
        type="button"
        aria-label={open ? "Loka valmynd" : "Opna valmynd"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative z-10 flex h-10 w-10 items-center justify-center text-white"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Valmynd"
          className="fixed inset-x-[30px] top-[95px] z-[60] rounded-3xl bg-neutral-100 px-8 py-8 shadow-xl"
        >
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Loka valmynd"
            onClick={close}
            className="absolute right-8 top-8 flex h-6 w-6 items-center justify-center text-neutral-900 transition hover:text-brand-dark"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
              />
            </svg>
          </button>
          <nav className="flex flex-col items-center gap-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="inline-flex items-center gap-1.5 font-ui text-lg font-medium text-neutral-900"
              >
                {item.text}
                {item.text === "Þjónusta" ? (
                  <svg viewBox="0 0 12 8" fill="none" className="h-2.5 w-2.5" aria-hidden="true">
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </Link>
            ))}
          </nav>
          <Link
            href={navCta.href}
            onClick={close}
            className="mt-6 block rounded-md bg-brand-dark py-3 text-center text-base font-semibold text-white"
          >
            {navCta.text}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
