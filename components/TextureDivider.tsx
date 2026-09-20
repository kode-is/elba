type TextureDividerProps = {
  /** Local path to the scraped 96px dot tile, e.g. "/images/anlegg/05-463dd036.svg". */
  src: string;
  /**
   * "strong" (default): /anlegg's and /industri's separator — 10% opacity,
   * 100px tall from lg, 75px below. "faint": the home page's — 5% opacity,
   * 69px tall from lg, 75px below.
   */
  tone?: "strong" | "faint";
  className?: string;
};

const TONE = {
  strong: "h-[75px] opacity-10 lg:h-[100px]",
  faint: "h-[75px] opacity-5 lg:h-[69px]",
};

/**
 * Live's "Separator": a full-width band of small, faint dots on the white
 * page, closing a white section just above a cream one — under /anlegg's and
 * /industri's feature tiles (docs/scrape/anlegg.json block 14 /
 * industri.json block 15) and under the home page's "Få fast pris i dag"
 * steps (home.json block 46). Every number here is a computed style measured
 * on www.elba.no: the scraped tile is 96px with four 8px black dots, but live
 * paints it at `background-size: 48px` (4px dots on a 24px grid, about four
 * rows) and at 5-10% opacity, so it reads as a soft grey texture. Painting the
 * tile at its natural size and full black — what this component used to do —
 * gives one row of heavy black dots instead.
 */
export function TextureDivider({ src, tone = "strong", className }: TextureDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`w-full ${TONE[tone]}${className ? ` ${className}` : ""}`}
      style={{ backgroundImage: `url(${src})`, backgroundRepeat: "repeat", backgroundSize: "48px auto" }}
    />
  );
}
