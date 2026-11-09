import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { BrandIcon } from "@/components/BrandIcon";
import { CheckIcon } from "@/components/icons";
import { ICONS } from "@/lib/brannslukking";

type ProtegaBandProps = {
  heading: string;
  text: string;
  points: string[];
  className?: string;
};

/**
 * Introduces fire suppression where ELBA's customers already are: on the home
 * page, and on /anlegg and /industri with copy for that audience. A red tile
 * as in FeatureTileGrid (white heading, `brand-soft` copy) beside a photo,
 * with the white outlined button ContactCta uses on red; links to
 * /brannslukking.
 */
export function ProtegaBand({ heading, text, points, className = "" }: ProtegaBandProps) {
  return (
    <section className={className}>
      <Container>
        <div className="group grid overflow-hidden rounded-[20px] bg-brand md:grid-cols-[1.2fr_1fr]">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3">
              <span className="flex h-[55px] w-[55px] items-center justify-center rounded-[10px] bg-white">
                <BrandIcon src={ICONS.extinguisher} className="h-8 w-8 bg-brand" />
              </span>
              <span className="rounded-full border border-white/40 px-3 py-1 font-ui text-[13px] font-semibold text-white">
                Ny tjeneste
              </span>
            </div>
            <h2 className="mt-6 text-section font-semibold text-white md:text-[40px] md:leading-[1.2]">{heading}</h2>
            <p className="mt-4 text-lead text-brand-soft md:text-lead-lg">{text}</p>
            <ul className="mt-6 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <CheckIcon className="h-4 w-4 shrink-0 text-white" />
                  <h4 className="font-ui text-label font-semibold text-white md:text-label-lg">{p}</h4>
                </li>
              ))}
            </ul>
            <Link
              href="/brannslukking"
              className="mt-8 inline-flex items-center justify-center rounded-[10px] border border-white px-[30px] py-5 text-[16px] leading-[1.2] font-semibold text-white transition hover:bg-white hover:text-brand"
            >
              Les om brannslukking
            </Link>
          </div>
          <div className="relative min-h-[260px] overflow-hidden md:min-h-full">
            <Image
              src="/images/brannslukking/beltemaskin.webp"
              alt="Beltemaskin med tre automatiske slukkesylindre montert"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
