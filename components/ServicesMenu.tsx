"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { servicesMenu } from "@/lib/site";

type ServicesMenuProps = {
  href: string;
  text: string;
};

// Desktop-only hover/keyboard menu for the "Þjónusta" nav item. Renders
// inside the header's nav+CTA group (see Header.tsx), which must be
// `position: relative` so the panel's `right-0` aligns to that group's
// right edge (the "Hafa samband" button) rather than under this item.
export function ServicesMenu({ href, text }: ServicesMenuProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, [clearCloseTimer]);

  const closeNow = useCallback(
    (refocus: boolean) => {
      clearCloseTimer();
      setOpen(false);
      if (refocus) triggerRef.current?.focus();
    },
    [clearCloseTimer],
  );

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeNow(true);
    }

    function onFocusOut(event: FocusEvent) {
      const next = event.relatedTarget as Node | null;
      if (groupRef.current && !groupRef.current.contains(next)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const node = groupRef.current;
    node?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      node?.removeEventListener("focusout", onFocusOut);
    };
  }, [open, closeNow]);

  return (
    <div
      ref={groupRef}
      className="flex items-center gap-1"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <Link href={href} className="text-base font-normal text-white transition hover:text-white/80">
        {text}
      </Link>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Sýna ${text} valmynd`}
        onFocus={openMenu}
        onClick={openMenu}
        className="flex h-4 w-4 items-center justify-center text-white"
      >
        <svg viewBox="0 0 12 8" fill="none" className="h-2.5 w-2.5" aria-hidden="true">
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <nav
          id={panelId}
          aria-label={servicesMenu.heading}
          className="absolute right-0 top-full z-50 mt-6 w-[850px] rounded-[15px] bg-white px-10 pt-[30px] pb-10"
        >
          <div className="flex gap-x-20">
            <div className="w-[227px]">
              <h6 className="font-ui text-base font-semibold text-black">{servicesMenu.heading}</h6>
              <p className="mt-3 font-ui text-sm font-normal text-[#444]">{servicesMenu.description}</p>
            </div>
            <div className="flex gap-x-9">
              {servicesMenu.columns.map((column, index) => (
                <ul key={index} className="w-[200px] space-y-[11px]">
                  {column.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => closeNow(false)}
                        className="block font-ui text-base font-normal text-[#444] transition hover:text-brand-dark"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
