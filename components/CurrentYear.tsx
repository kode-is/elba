"use client";
import { useSyncExternalStore } from "react";

// Footer.tsx is a statically prerendered server component, so
// `new Date().getFullYear()` would freeze at build time forever (the live
// site's own footer year is rendered client-side and drifts the same way —
// see docs/superpowers/specs/…design.md's "Footer year" note).
// `useSyncExternalStore` is React's own recommended pattern for a value that
// legitimately differs between the server-rendered markup and the client
// (see the "force update / external sync" guidance from
// eslint-plugin-react-hooks' set-state-in-effect rule, which a plain
// useState+useEffect pair trips): `getServerSnapshot` reproduces the build
// year so the client's first render matches the server markup exactly (no
// hydration warning), then React swaps in `getSnapshot`'s real client year
// right after.
const BUILD_YEAR = new Date().getFullYear();

const getSnapshot = () => new Date().getFullYear();
const getServerSnapshot = () => BUILD_YEAR;
// The year can only change if a tab stays open across a New Year's
// midnight; a daily check is more than enough to catch that.
const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 24 * 60 * 60 * 1000);
  return () => clearInterval(id);
};

export function CurrentYear() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
