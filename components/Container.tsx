import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /**
   * Use live's narrower inner-page column (960px, `--container-narrow`)
   * instead of the 1240px band — /anlegg, /industri, /om-oss and /produkter
   * lay their body sections out that way (measured Task 11), the same width
   * the article pages read in.
   */
  narrow?: boolean;
};

/**
 * The site's centred content column. Measured on live www.elba.no (Task 11,
 * docs/measure.txt): the content band is 1240px wide — `--container-site` —
 * and sits at x=100..1340 at a 1440px viewport, x=50..1230 at 1280px and
 * x=20..370 at 390px. That is a 1240px max-width column with 50px desktop
 * page gutters (20px on mobile), so this element's own max-width is the
 * measured column plus those two gutters.
 */
export function Container({ children, className, narrow }: ContainerProps) {
  const width = narrow
    ? "max-w-[calc(var(--container-narrow)+100px)]"
    : "max-w-[calc(var(--container-site)+100px)]";
  return (
    <div className={`mx-auto ${width} px-5 md:px-[50px] ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
