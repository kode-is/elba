import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { FeatureTileGrid, type FeatureTile } from "@/components/FeatureTileGrid";
import { CheckList } from "@/components/CheckList";
import { StatsSection } from "@/components/StatsSection";
import { ApplicationForm } from "@/components/jobb/ApplicationForm";
import { pageMetadata } from "@/lib/seo";
import { PAGE_META } from "@/lib/seo-meta";
import { site, yearsInBusiness } from "@/lib/site";

export const metadata = pageMetadata(PAGE_META["/jobb-hos-oss"]);

// /jobb-hos-oss — for montører (technicians) who are thinking about working
// at ELBA. The page is the landing target for a QR code on the Vei og Anlegg
// stand (and later print/ads), which links to the short /jobb (next.config.mjs
// redirect). So it reads top-to-bottom on a phone: what the job is, who we
// want, then a short form that only needs a name and a phone number.
//
// The copy is ours, not scraped: every claim is something ELBA does today
// (lib/stats.ts, lib/site.ts, /anlegg, /industri). No pay, benefits or
// contract terms are promised here — those belong in a conversation.

const WORK: FeatureTile[] = [
  {
    type: "text",
    tone: "red",
    heading: "Montering på anleggsmaskiner",
    paragraphs: [
      "Du monterer sentralsmøreanlegg på gravemaskiner, hjullastere, dumpere og annet anleggsutstyr – både på nye maskiner og som ettermontering. Over 200 montasjer i året betyr at du får mye mengdetrening, raskt.",
    ],
  },
  { type: "image", image: { src: "/images/anlegg/04-c08775a5.jpeg", alt: "ELBA-montør monterer smørerør på en gravemaskin", width: 626, height: 835 } },
  { type: "image", image: { src: "/images/industri/07-a80a4311.jpeg", alt: "ELBA-montør på oppdrag i et industrianlegg", width: 626, height: 835 } },
  {
    type: "text",
    tone: "cream",
    heading: "Service og feilsøking i industrien",
    paragraphs: [
      "Fra sagbruk og papirfabrikker til maritim industri: du er ute hos kunden, finner ut hvorfor et smøresystem ikke gjør jobben sin, og får det i drift igjen.",
    ],
  },
];

const WHO = [
  "Mekanisk interessert og liker å skru",
  "Fagbrev som mekaniker er et pluss – ikke et krav",
  "Trives ute hos kunder, ikke bare på verkstedet",
  "Førerkort klasse B",
];

export default function JobbHosOss() {
  return (
    <main id="main">
      <PageHero
        image={{ src: "/images/home/06-d6adc654.jpeg", alt: "", width: 800, height: 742 }}
        title="Jobb hos oss"
        subtitle="Vi ser etter montører som vil jobbe med maskiner – fra den minste minigraveren til Norges største produksjonsanlegg."
        crumbs={[{ text: "Jobb hos oss" }]}
      />

      <Container narrow>
        <div className="py-12 md:py-16">
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Bli montør i ELBA</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lead text-ink-muted md:text-lead-lg">
            ELBA har jobbet med sentralsmøring i {yearsInBusiness} år. Det er montørene våre som gjør jobben ute hos
            kundene – og vi trenger flere av dem.
          </p>
          <p className="mt-6 text-center">
            <a
              href="#sok"
              className="inline-flex items-center justify-center rounded-[10px] bg-brand px-[30px] py-4 text-[16px] leading-[1.2] font-semibold text-white transition hover:opacity-80"
            >
              Søk nå
            </a>
          </p>
          <div className="mt-10">
            <FeatureTileGrid tiles={WORK} />
          </div>
        </div>
      </Container>

      <section className="bg-surface py-14 md:py-20">
        <Container narrow>
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-section font-semibold text-black md:text-section-lg">Hvem vi ser etter</h2>
              <p className="mt-4 text-lead text-ink-muted md:text-lead-lg">
                Du trenger ikke kunne smøresystemer fra før. Det lærer du hos oss.
              </p>
              <CheckList items={WHO} className="mt-8" />
            </div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[20px]">
              <Image
                src="/images/om-oss/03-9b3d1db5.jpeg"
                alt="Montør i arbeid på verkstedet"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <Container narrow>
        <div className="py-14 md:py-20">
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Du starter ikke alene</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lead text-ink-muted md:text-lead-lg">
            Som ny går du sammen med en av våre erfarne montører, på ekte oppdrag fra første uke. Du lærer
            systemene, maskinene og kundene underveis – og tar over mer etter hvert som du er klar for det.
          </p>
        </div>
      </Container>

      <StatsSection />

      <section id="sok" className="scroll-mt-24 bg-surface py-14 md:py-20">
        <Container narrow>
          <div className="mx-auto max-w-xl">
            <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Interessert?</h2>
            <p className="mt-4 text-center text-lead text-ink-muted md:text-lead-lg">
              Legg igjen navn og telefonnummer, så ringer vi deg for en uforpliktende prat. Ingen CV nødvendig.
            </p>
            <div className="mt-8">
              <ApplicationForm />
            </div>
            <p className="mt-6 text-center text-body text-ink-muted md:text-body-lg">
              Heller ringe? Ta kontakt på{" "}
              <a href={site.phoneHref} className="font-semibold text-brand hover:underline">
                {site.phone}
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
