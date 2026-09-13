type TextureDividerProps = {
  /** Local path to the scraped repeating-dot SVG, e.g. "/images/anlegg/05-463dd036.svg". */
  src: string;
};

/**
 * Thin repeating-dot texture strip that sits between /anlegg's and
 * /industri's feature-tile grid and the cream section below it
 * (docs/scrape/anlegg.json block 14 / docs/scrape/industri.json block 15 —
 * both scrape to the same background-role SVG,
 * "/images/anlegg/05-463dd036.svg"; docs/reference/anlegg.desktop.jpg and
 * industri.desktop.jpg both show a faint dotted band at that seam).
 */
export function TextureDivider({ src }: TextureDividerProps) {
  return (
    <div
      aria-hidden="true"
      className="h-8 w-full bg-surface md:h-10"
      style={{ backgroundImage: `url(${src})`, backgroundRepeat: "repeat" }}
    />
  );
}
