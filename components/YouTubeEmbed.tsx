type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  /** Extra query string appended to the embed URL, e.g. "v=<id>" or "iv_load_policy=3". */
  params?: string;
  className?: string;
};

/**
 * 16:9 lazy-loaded YouTube player embedded on /siubunadur and
 * /fyrirokumannin. Neither route's scrape captured a block for its video —
 * the block scraper only walks Framer's own DOM nodes (headings, text,
 * images, links) and an <iframe> falls outside that — so this is a small
 * shared component instead of a scrape-derived one. Video ids and query
 * params come from a live fetch of each page's HTML (see the call sites),
 * and placement comes from docs/reference/<route>.desktop.jpg plus
 * docs/scrape/inline-svg.json's "nearbyText" for the 3425485f play-glyph
 * SVG (the YouTube facade's own play icon — not reproduced here since the
 * iframe already renders it).
 */
export function YouTubeEmbed({ videoId, title, params, className }: YouTubeEmbedProps) {
  const src = `https://www.youtube.com/embed/${videoId}${params ? `?${params}` : ""}`;
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-neutral-900${
        className ? ` ${className}` : ""
      }`}
      style={{ aspectRatio: "16 / 9" }}
    >
      {/* YouTube's own thumbnail, shown behind the iframe while it loads —
          the live site renders the same i.ytimg.com poster as a real <img>
          under its player (confirmed via a live fetch of
          https://skralli.is/siubunadur). Decorative/aria-hidden since the
          iframe below is the actual interactive content; a plain <img> is
          used rather than next/image since i.ytimg.com isn't a configured
          image-optimizer domain. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
