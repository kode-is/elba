"use client";

import { Suspense, useId, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

// The sub-category pills above a product's tables. On the original Framer site
// these are a tab control that swaps the tables, drawings and photos below;
// this is the same control, rebuilt as `aria-pressed` buttons.
//
// Every tab's tables are rendered on the server and kept mounted — the
// inactive ones are `hidden` — so the prerendered HTML carries the whole
// catalogue (77 tables across the product pages) and switching is instant.
//
// The selected tab lives in the URL as ?type=<slug>, so the header search can
// link straight to one; the first tab is the default and carries no parameter.
// Same URL pattern as ProductCatalog: read with useSearchParams inside
// Suspense (the fallback is the default view, which is also what prerenders),
// written with history.replaceState.

export type SubnavTab = { label: string | null; slug: string; tables: ReactNode[] };

type SubnavFilterProps = { tabs: SubnavTab[] };

export function SubnavFilter(props: SubnavFilterProps) {
  return (
    <Suspense fallback={<SubnavView {...props} activeSlug={null} onSelect={() => {}} />}>
      <SubnavFromUrl {...props} />
    </Suspense>
  );
}

function SubnavFromUrl(props: SubnavFilterProps) {
  const activeSlug = useSearchParams().get("type");
  return (
    <SubnavView
      {...props}
      activeSlug={activeSlug}
      onSelect={(slug) => {
        const search = slug === props.tabs[0].slug ? "" : `?type=${encodeURIComponent(slug)}`;
        window.history.replaceState(null, "", `${window.location.pathname}${search}`);
      }}
    />
  );
}

type SubnavViewProps = SubnavFilterProps & { activeSlug: string | null; onSelect: (slug: string) => void };

function SubnavView({ tabs, activeSlug, onSelect }: SubnavViewProps) {
  const regionId = useId();
  const active = Math.max(0, tabs.findIndex((tab) => tab.slug === activeSlug));

  return (
    <div>
      <div role="group" aria-label="Underkategorier" className="mb-10 flex flex-wrap gap-3">
        {tabs.map((tab, index) => (
          <button
            key={tab.slug}
            type="button"
            aria-pressed={index === active}
            aria-controls={regionId}
            onClick={() => onSelect(tab.slug)}
            className={`rounded-full border px-5 py-2 text-[16px] leading-[1.2] font-semibold transition ${
              index === active
                ? "border-brand bg-brand text-white"
                : "border-neutral-300 text-black hover:border-brand hover:text-brand"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id={regionId}>
        {tabs.map((tab, index) => (
          <div key={tab.slug} hidden={index !== active} className="flex flex-col gap-14 md:gap-20">
            {tab.tables}
          </div>
        ))}
      </div>
    </div>
  );
}
