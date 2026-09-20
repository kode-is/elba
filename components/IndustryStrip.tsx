// Home hero's industry marquee (docs/scrape/home.json blocks 9-32): the live
// page loops the same eight H3s three times in the DOM for a seamless
// scroll — see app/globals.css's `.animate-marquee` keyframes (translate by
// -33.3333%, i.e. exactly one of the three copies).
//
// Each segment now also carries its icon from the ELBA brand folder
// ("Graphics/Icons/SVG", the *_SMALL_FLAT variants — the set drawn for small
// sizes, which is what a 28px marquee row wants). The files in
// public/images/icons/segments/ are byte-identical copies of the brand
// originals, only renamed to the Norwegian segment they label, so refreshing
// them later is a straight re-copy with no edits to re-apply.
//
// They are painted as CSS masks rather than inlined as SVG. The brand icons
// are a single flat fill (#060707) on a 50x50 viewBox, so masking recolours
// them to the band's white without touching the files, and — because this
// list is duplicated three times — keeps ~34KB of path data out of the HTML,
// fetched once and cached instead.
const INDUSTRIES = [
  { name: "Landbruk", icon: "/images/icons/segments/landbruk.svg" },
  { name: "Sagbruk", icon: "/images/icons/segments/sagbruk.svg" },
  { name: "Offshore", icon: "/images/icons/segments/offshore.svg" },
  { name: "Papir/cellulose", icon: "/images/icons/segments/papir-cellulose.svg" },
  { name: "Metall", icon: "/images/icons/segments/metall.svg" },
  { name: "Maritim", icon: "/images/icons/segments/maritim.svg" },
  { name: "Jernbane", icon: "/images/icons/segments/jernbane.svg" },
  { name: "Gjenvinning", icon: "/images/icons/segments/gjenvinning.svg" },
];

/** Decorative — the segment is already named by the <h3> beside it. */
function SegmentIcon({ src }: { src: string }) {
  const mask = {
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskSize: "contain",
    WebkitMaskSize: "contain",
  };
  return <span aria-hidden="true" className="h-8 w-8 shrink-0 bg-white md:h-9 md:w-9" style={mask} />;
}

function IndustryList({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden ? true : undefined} className="flex shrink-0 items-center gap-x-10 px-5">
      {INDUSTRIES.map((industry, index) => (
        <div key={index} className="flex shrink-0 items-center gap-x-10">
          <div className="flex shrink-0 items-center gap-x-3">
            <SegmentIcon src={industry.icon} />
            <h3 className="whitespace-nowrap text-[28px] leading-[1.3] font-semibold text-white">
              {industry.name}
            </h3>
          </div>
          <span aria-hidden="true" className="text-white/50">
            •
          </span>
        </div>
      ))}
    </div>
  );
}

export function IndustryStrip() {
  return (
    <div className="relative z-10 mx-auto -mt-16 max-w-[calc(var(--container-site)+100px)] md:px-[50px]">
      <div className="overflow-hidden rounded-[15px] bg-brand py-[29px] md:py-[50px]">
        <div className="flex w-max animate-marquee">
          <IndustryList />
          <IndustryList hidden />
          <IndustryList hidden />
        </div>
      </div>
    </div>
  );
}
