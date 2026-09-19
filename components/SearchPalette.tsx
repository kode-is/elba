"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { GROUP_LABEL, highlight, searchIndex, type SearchGroup, type SearchItem } from "@/lib/search";

// Site-wide search: a header button that opens a command palette over pages,
// product categories, every product row and the articles. Modelled on
// kode-is/totus's components/Search.tsx (⌘K / Ctrl+K, grouped client-side
// results), with what that one lacks:
//  - a native modal <dialog>, so focus trapping, Esc, the inert page behind it
//    and focus returning to the button come from the browser;
//  - combobox/listbox semantics and ↑ ↓ Home End Enter, with the input keeping
//    focus (aria-activedescendant);
//  - the index is fetched from /search-index.json on first open (warmed when
//    the button is hovered or focused) instead of shipping in every page;
//  - matched words are highlighted, an exact Art.Nr. ranks first, and the
//    product group links on to the full catalog search on /produkter;
//  - "/" opens it too, and before anything is typed it lists the product
//    categories and pages as shortcuts.
// Not on live elba.no — approved deviation, docs/handover.md.

type Option = { id: string; href: string };

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

export function SearchPalette() {
  const router = useRouter();
  const uid = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loading = useRef<Promise<void> | null>(null);
  const [index, setIndex] = useState<SearchItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const load = useCallback(() => {
    loading.current ??= fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<SearchItem[]>;
      })
      .then((items) => {
        setIndex(items);
        setFailed(false);
      })
      .catch(() => {
        loading.current = null; // let the next open retry
        setFailed(true);
      });
  }, []);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    load();
    dialog.showModal();
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
  }, [load]);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      } else if (event.key === "/" && !dialogRef.current?.open && !isTypingTarget(event.target)) {
        event.preventDefault();
        open();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const searching = query.trim() !== "";
  // Nothing typed yet: the product categories and the pages, as shortcuts.
  const groups: SearchGroup[] = !index
    ? []
    : searching
      ? searchIndex(index, query).groups
      : (["kategori", "side"] as const).map((type) => {
          const items = index.filter((item) => item.type === type);
          return { type, total: items.length, items };
        });

  // The flat option list the arrow keys walk: every hit, plus the product
  // group's "see all" row, in the order they are rendered.
  const catalogHref = `/produkter?q=${encodeURIComponent(query.trim())}`;
  const options: Option[] = [];
  const optionId = (n: number) => `${uid}-option-${n}`;
  const add = (href: string) => options.push({ id: optionId(options.length), href }) - 1;
  const rendered = [];
  for (const group of groups) {
    const items = group.items.map((item) => ({ item, n: add(item.href) }));
    const seeAll = searching && group.type === "produkt" ? add(catalogHref) : null;
    rendered.push({ type: group.type, total: group.total, items, seeAll });
  }
  const current = Math.min(active, options.length - 1);

  function move(to: number) {
    const next = (to + options.length) % options.length;
    setActive(next);
    document.getElementById(options[next].id)?.scrollIntoView({ block: "nearest" });
  }

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (options.length === 0) return;
    if (event.key === "ArrowDown") move(current + 1);
    else if (event.key === "ArrowUp") move(current - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(options.length - 1);
    else if (event.key === "Enter") {
      close();
      router.push(options[current].href);
    } else return;
    event.preventDefault();
  }

  const optionClass = (n: number) =>
    `flex items-center justify-between gap-4 px-5 py-2.5 ${n === current ? "bg-surface" : ""}`;

  return (
    <>
      <button
        type="button"
        aria-label="Søk"
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K /"
        title="Søk (⌘K)"
        onClick={open}
        onMouseEnter={load}
        onFocus={load}
        className="flex h-10 w-10 items-center justify-center text-white transition hover:text-white/80"
      >
        <SearchIcon className="h-[22px] w-[22px]" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Søk"
        onClose={() => {
          document.body.style.overflow = "";
          setQuery("");
          setActive(0);
        }}
        // The browser closes a modal dialog on Esc itself; handled here as well
        // so it never depends on that (a no-op when the browser got there first).
        onKeyDown={(event) => {
          if (event.key === "Escape") close();
        }}
        // A click on the ::backdrop reports the <dialog> itself as its target.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-0 mx-auto mt-[10vh] max-h-[78vh] w-[min(680px,calc(100vw-32px))] max-w-none flex-col overflow-hidden rounded-[16px] bg-white p-0 font-ui text-black shadow-2xl backdrop:bg-black/50 open:flex"
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <SearchIcon className="h-5 w-5 shrink-0 text-ink-faint" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={options.length > 0}
            aria-controls={`${uid}-listbox`}
            aria-activedescendant={options.length > 0 ? options[current].id : undefined}
            aria-autocomplete="list"
            aria-label="Søk etter produkt, art.nr., artikkel eller side"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Søk etter produkt, art.nr., artikkel eller side …"
            className="h-[60px] min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-ink-faint"
          />
          <button
            type="button"
            aria-label="Lukk søk"
            onClick={close}
            className="rounded-[6px] border border-line px-2 py-1 text-[12px] leading-none font-medium text-ink-faint transition hover:text-black"
          >
            esc
          </button>
        </div>

        <div id={`${uid}-listbox`} role="listbox" aria-label="Søkeresultater" className="min-h-0 flex-1 overflow-y-auto py-2">
          {!index ? (
            <p role="status" className="px-5 py-8 text-center text-[14px] text-ink-muted">
              {failed ? "Kunne ikke laste søket. Lukk og prøv igjen." : "Laster søk …"}
            </p>
          ) : options.length === 0 ? (
            <p role="status" className="px-5 py-8 text-center text-[14px] text-ink-muted">
              Ingen treff for «{query.trim()}». Prøv et annet søkeord, eller{" "}
              <Link href="/kontakt-oss" onClick={close} className="font-medium text-brand underline underline-offset-4">
                ta kontakt
              </Link>
              .
            </p>
          ) : (
            rendered.map((group) => (
              <div key={group.type} role="group" aria-label={GROUP_LABEL[group.type]} className="py-1">
                <div
                  aria-hidden="true"
                  className="flex items-baseline justify-between px-5 pt-2 pb-1 text-[11px] font-semibold tracking-[0.1em] text-ink-faint uppercase"
                >
                  <span>{GROUP_LABEL[group.type]}</span>
                  {searching && group.total > group.items.length ? (
                    <span className="tracking-normal normal-case">
                      {group.items.length} av {group.total}
                    </span>
                  ) : null}
                </div>
                {group.items.map(({ item, n }) => (
                  <Link
                    key={`${item.href}-${n}`}
                    id={optionId(n)}
                    role="option"
                    aria-selected={n === current}
                    tabIndex={-1}
                    href={item.href}
                    onClick={close}
                    onMouseMove={() => setActive(n)}
                    className={optionClass(n)}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] leading-[1.4] font-medium">
                        <Marked text={item.title} query={query} />
                      </span>
                      {item.subtitle ? (
                        <span className="block truncate text-[13px] leading-[1.5] text-ink-muted">
                          <Marked text={item.subtitle} query={query} />
                        </span>
                      ) : null}
                    </span>
                    <ReturnIcon className={`h-4 w-4 shrink-0 text-ink-faint ${n === current ? "" : "invisible"}`} />
                  </Link>
                ))}
                {group.seeAll !== null ? (
                  <Link
                    id={optionId(group.seeAll)}
                    role="option"
                    aria-selected={group.seeAll === current}
                    tabIndex={-1}
                    href={catalogHref}
                    onClick={close}
                    onMouseMove={() => setActive(group.seeAll!)}
                    className={`${optionClass(group.seeAll)} text-[14px] font-medium text-brand`}
                  >
                    <span>
                      Se {group.total === 1 ? "treffet" : `alle ${group.total} treff`} i produktkatalogen
                    </span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </div>
            ))
          )}
        </div>

        <div className="hidden items-center gap-5 border-t border-line px-5 py-3 text-[12px] text-ink-faint md:flex">
          <Hint keys="↑ ↓" label="naviger" />
          <Hint keys="↵" label="åpne" />
          <Hint keys="esc" label="lukk" />
          <span className="ml-auto">
            <Hint keys="⌘K" label="eller / åpner søket" />
          </span>
        </div>
      </dialog>
    </>
  );
}

function Marked({ text, query }: { text: string; query: string }) {
  return highlight(text, query).map((segment, i) =>
    segment.match ? (
      <mark key={i} className="bg-transparent text-brand">
        {segment.text}
      </mark>
    ) : (
      segment.text
    ),
  );
}

function Hint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <kbd className="rounded-[5px] border border-line bg-table-head px-1.5 py-0.5 font-ui text-[11px] leading-none text-ink-muted">
        {keys}
      </kbd>
      {label}
    </span>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function ReturnIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 5v7a3 3 0 01-3 3H5" />
      <path d="M9 11l-4 4 4 4" />
    </svg>
  );
}
