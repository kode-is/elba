// An icon from the ELBA brand folder ("Graphics/Icons/SVG"), painted as a CSS
// mask so it takes whatever background colour `className` gives it. The brand
// icons are a single flat fill (#060707) on a 50x50 viewBox, so masking
// recolours them — white on a red badge, red on white — without touching the
// files, and keeps their path data out of the HTML (fetched once, cached).
// public/images/icons/segments/ holds the *_SMALL_FLAT segment icons and
// public/images/icons/brand/ the rest, byte-identical to the originals and
// only renamed.

const MASK = {
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
  maskSize: "contain",
  WebkitMaskSize: "contain",
};

/** Decorative — label it with text beside it. Size and colour come from `className`, e.g. "h-8 w-8 bg-white". */
export function BrandIcon({ src, className }: { src: string; className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      style={{ ...MASK, maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
    />
  );
}
