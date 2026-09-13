// Small decorative line icons for the category-card badge (bottom-left of
// the image on CategoryCard). The live site renders these from a Framer icon
// set that the scraper couldn't capture (no <img> or inline <svg> block), so
// these are hand-drawn stand-ins matching each badge's glyph on
// docs/reference/thjonusta.desktop.jpg — decorative only (aria-hidden).

import type { SVGProps } from "react";

function WindIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 8h11a2.5 2.5 0 1 0-2.5-2.5"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12.5h14a2.5 2.5 0 1 1-2.5 2.5"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 17h9a2 2 0 1 1-2 2"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropletIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3.5s6 6.8 6 11a6 6 0 1 1-12 0c0-4.2 6-11 6-11Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path
        d="M4 8l8 4.5L20 8M12 12.5V21"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExpandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth={1.6} />
      <path
        d="M9.5 14.5 6.5 17.5m0 0v-2.4m0 2.4h2.4M14.5 9.5l3-3m0 0v2.4m0-2.4h-2.4"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9.5 14.5 14.5 9.5"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <path
        d="M11 7.5 12.6 5.9a3 3 0 0 1 4.24 4.24L15.2 11.7"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 16.5 11.4 18.1a3 3 0 1 1-4.24-4.24L8.8 12.3"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 16v-3.2c0-.5.2-1 .5-1.4l1.6-2A2 2 0 0 1 8.7 8.6h6.6a2 2 0 0 1 1.6.8l1.6 2c.3.4.5.9.5 1.4V16"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 16h15v1.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V17h-9v.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V16Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path d="M7 12.5h10" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}

function SnowflakeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3v18M4.8 7.5l14.4 9M4.8 16.5l14.4-9"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <path
        d="m12 3 1.8 1.8M12 3l-1.8 1.8M12 21l1.8-1.8M12 21l-1.8-1.8M4.8 7.5l2.4.6M4.8 7.5l.6-2.4M19.2 16.5l-2.4-.6M19.2 16.5l-.6 2.4M19.2 7.5l-2.4.6M19.2 7.5l-.6-2.4M4.8 16.5l2.4-.6M4.8 16.5l.6 2.4"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const CATEGORY_ICONS: Record<string, (props: SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  siubunadur: WindIcon,
  smurkerfi: DropletIcon,
  sturtuvagnar: CubeIcon,
  oryggisrudur: ExpandIcon,
  "hifi-festibunadur": LinkIcon,
  fyrirokumannin: CarIcon,
  vetrarbunadur: SnowflakeIcon,
};
