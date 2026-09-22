"use client";

import Link from "next/link";
import { Children, Suspense, useId, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { SubnavPill } from "@/lib/subnav";

// The sub-category pills above a product's tables, made pressable (on live
// elba.no they are inert labels). `children` are the page's table groups,
// rendered on the server in table order; a pill shows the groups it covers
// (lib/subnav.ts) and hides the rest — kept mounted with `hidden`, so switching
// back is instant and the static HTML carries every table. A pill with nothing
// published shows a "ta kontakt" panel instead.
//
// The selected pill lives in the URL as ?type=<slug>, so the header search can
// link straight to one; the first pill (the one live draws as selected, which
// holds every table) is the default and carries no parameter. Same URL pattern
// as ProductCatalog: read with useSearchParams inside Suspense (the fallback is
// the default view, which is also what prerenders), written with
// history.replaceState.

type SubnavFilterProps = {
  pills: SubnavPill[];
  children: ReactNode;
};

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
        const search = slug === props.pills[0].slug ? "" : `?type=${encodeURIComponent(slug)}`;
        window.history.replaceState(null, "", `${window.location.pathname}${search}`);
      }}
    />
  );
}

type SubnavViewProps = SubnavFilterProps & { activeSlug: string | null; onSelect: (slug: string) => void };

function SubnavView({ pills, children, activeSlug, onSelect }: SubnavViewProps) {
  const regionId = useId();
  const active = Math.max(0, pills.findIndex((pill) => pill.slug === activeSlug));
  const pill = pills[active];
  const visible = new Set(pill.tables);
  const groups = Children.toArray(children);

  return (
    <div>
      <div role="group" aria-label="Underkategorier" className="mb-10 flex flex-wrap gap-3">
        {pills.map((p, index) => (
          <button
            key={p.slug}
            type="button"
            aria-pressed={index === active}
            aria-controls={regionId}
            onClick={() => onSelect(p.slug)}
            className={`rounded-full border px-5 py-2 text-[16px] leading-[1.2] font-semibold transition ${
              index === active
                ? "border-brand bg-brand text-white"
                : "border-neutral-300 text-black hover:border-brand hover:text-brand"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div id={regionId}>
        {pill.tables.length === 0 ? (
          <div role="status" className="rounded-2xl bg-surface px-6 py-12 text-center md:px-12 md:py-16">
            <h3 className="text-[23px] leading-[1.3] font-semibold text-black md:text-[36px]">{pill.label}</h3>
            <p className="mx-auto mt-3 max-w-xl font-ui text-body-lg text-ink-muted">
              Disse artiklene ligger ikke i nettkatalogen ennå, men vi skaffer det meste. Ta kontakt, så hjelper vi deg.
            </p>
            <Link
              href="/kontakt-oss"
              className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-brand px-[30px] py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-50"
            >
              Kontakt oss
            </Link>
          </div>
        ) : null}
        <div className="flex flex-col gap-14 md:gap-20">
          {groups.map((group, index) => (
            <div key={index} hidden={!visible.has(index)}>
              {group}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
