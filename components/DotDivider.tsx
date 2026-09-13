/**
 * Decorative dot-pattern band used between sections on the home page and on
 * smurkerfi, oryggisrudur, siubunadur and fyrirokumannin. On the live site
 * every instance is the same element: the 96 px Framer SVG tile drawn at
 * `background-size: 48px auto` (4 px dots on a 24 px grid), 100 px tall on
 * desktop and 75 px on mobile, full-bleed, with `opacity: 0.1` on the band
 * itself. Only the gap to the content above differs per page, so callers
 * pass their measured margin via `className`.
 */
export function DotDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-[75px] w-full bg-repeat opacity-10 md:h-[100px] ${className}`.trim()}
      style={{
        backgroundImage: "url(/images/home/20-463dd036.svg)",
        backgroundSize: "48px auto",
      }}
    />
  );
}
