// Home hero's industry marquee (docs/scrape/home.json blocks 9-32): the live
// page loops the same eight H3s three times in the DOM for a seamless
// scroll — see app/globals.css's `.animate-marquee` keyframes (translate by
// -33.3333%, i.e. exactly one of the three copies).
const INDUSTRIES = [
  "Landbruk",
  "Sagbruk",
  "Offshore",
  "Papir/cellulose",
  "Metall",
  "Maritim",
  "Jernbane",
  "Gjenvinning",
];

function IndustryList({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden ? true : undefined} className="flex shrink-0 items-center gap-x-10 px-5">
      {INDUSTRIES.map((name, index) => (
        <div key={index} className="flex shrink-0 items-center gap-x-10">
          <h3 className="whitespace-nowrap text-[28px] leading-[1.3] font-semibold text-white">{name}</h3>
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
    <div className="relative z-10 mx-auto max-w-site md:-mt-16 md:px-[50px]">
      <div className="overflow-hidden bg-brand py-6 md:rounded-3xl md:py-8">
        <div className="flex w-max animate-marquee">
          <IndustryList />
          <IndustryList hidden />
          <IndustryList hidden />
        </div>
      </div>
    </div>
  );
}
