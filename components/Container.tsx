import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * The site's centred content column. Measured on live www.elba.no (Task 11,
 * docs/measure.txt): the content band is 1240px wide — `--container-site` —
 * and sits at x=100..1340 at a 1440px viewport, x=50..1230 at 1280px and
 * x=20..370 at 390px. That is a 1240px max-width column with 50px desktop
 * page gutters (20px on mobile), so this element's own max-width is the
 * measured column plus those two gutters.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={`mx-auto max-w-[calc(var(--container-site)+100px)] px-5 md:px-[50px] ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}
