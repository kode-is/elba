"use client";
import { useEffect, useState } from "react";

// Footer.tsx is a statically prerendered server component, so
// `new Date().getFullYear()` would freeze at build time (the live site's
// own footer year is rendered client-side and drifts the same way — see
// docs/superpowers/specs/…design.md's "Footer year" note). Render the build
// year on the server (identical markup on first client render, so no
// hydration warning), then correct it on the client once mounted.
export function CurrentYear() {
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return year;
}
