"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// The parts every animated demo on the site shares — /brannslukking's
// suppression demo and /anlegg's lubrication and divider demos: the status
// line over the drawing, the pill toggle and the play control under it, the
// numbered steps beside it, and a clock that only runs while the drawing is
// on screen.

/** Whether the element is on screen (at least a quarter of it). */
export function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

/** Milliseconds that tick while `running`, wrapping at `loopMs`. */
export function useLoopClock(running: boolean, loopMs: number) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // A frame's timestamp can be a little earlier than the moment the
      // clock started, so never step backwards (a negative time right after
      // a reset would index outside a demo's timeline).
      const dt = Math.max(0, Math.min(64, now - last));
      last = Math.max(last, now);
      setMs((m) => (((m + dt) % loopMs) + loopMs) % loopMs);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, loopMs]);
  return [ms, setMs] as const;
}

/** Below the `sm` breakpoint the drawings enlarge their labels and marks. */
export function useSmallScreen() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setSmall(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return small;
}

export type DemoTone = "idle" | "active" | "alarm";

/** The line over a drawing: a dot (black, grease amber while something happens, pulsing red on a fault) and what is going on. */
export function DemoStatus({ tone, text, aside }: { tone: DemoTone; text: string; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3 px-2 pt-1">
      <div className="flex min-w-0 items-start gap-2.5">
        <span
          aria-hidden="true"
          className={`mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-300 ${
            tone === "alarm" ? "bg-brand motion-safe:animate-pulse" : tone === "active" ? "bg-grease" : "bg-black"
          }`}
        />
        <span className="font-ui text-[14px] leading-[1.6] font-semibold text-black">
          {text}
        </span>
      </div>
      {aside ? <span className="shrink-0 font-ui text-[14px] leading-[1.6] text-ink-muted tabular-nums">{aside}</span> : null}
    </div>
  );
}

/** The pill toggle under a drawing. */
export function DemoToggle<K extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
          className={`rounded-full border px-5 py-2 text-[16px] leading-[1.2] font-semibold transition ${
            value === o.key ? "border-brand bg-brand text-white" : "border-neutral-300 text-black hover:border-brand hover:text-brand"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A text button beside the toggle: pause/play, or replay. */
export function DemoControl({ kind, onClick }: { kind: "pause" | "play" | "replay"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full px-3 py-2 font-ui text-[14px] font-semibold text-brand transition hover:underline"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill={kind === "replay" ? "none" : "currentColor"} stroke={kind === "replay" ? "currentColor" : "none"} strokeWidth={2}>
        {kind === "replay" ? (
          <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" strokeLinecap="round" strokeLinejoin="round" />
        ) : kind === "play" ? (
          <path d="M7 5v14l12-7z" />
        ) : (
          <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
        )}
      </svg>
      {kind === "replay" ? "Spill av igjen" : kind === "play" ? "Spill av" : "Pause"}
    </button>
  );
}

/** The numbered steps beside a drawing; the current one is outlined in red. White cards for a cream band, cream for a white one. */
export function DemoSteps({
  steps,
  current,
  tone = "white",
}: {
  steps: { heading: string; text: string }[];
  current: number | null;
  tone?: "white" | "cream";
}) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const on = current === i;
        return (
          <li
            key={s.heading}
            aria-current={on ? "step" : undefined}
            className={`flex gap-4 rounded-[20px] border-2 p-5 transition-colors duration-500 ${tone === "white" ? "bg-white" : "bg-surface"} ${
              on ? "border-brand" : "border-transparent"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[18px] font-semibold transition-colors duration-500 ${
                on ? "bg-brand text-white" : `${tone === "white" ? "bg-surface" : "bg-white"} text-brand`
              }`}
            >
              {i + 1}
            </span>
            <div>
              <h3 className="font-ui text-label font-semibold text-black md:text-label-lg">{s.heading}</h3>
              <p className="mt-1 font-ui text-body text-ink-muted md:text-body-lg">{s.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
