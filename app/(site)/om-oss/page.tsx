import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { StorySection } from "@/components/om-oss/StorySection";
import { StatsSection } from "@/components/StatsSection";
import { TeamGrid } from "@/components/om-oss/TeamGrid";
import { ContactCta } from "@/components/ContactCta";
import { team } from "@/lib/team";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ELBA - I INDUSTRIENS TJENESTE",
  description:
    "ELBA - Din partner innen smøreteknikk i Norge. Fra den minste minigraver til Norges største produksjonsanlegg er vi klare til å møte utfordringen med deg.",
  path: "/om-oss",
});

// docs/scrape/om-oss.json blocks 27: "Vårt team" intro paragraph.
const TEAM_INTRO =
  "Hos oss jobber et sterkt team av fagfolk som er klare til å ta på seg alle typer utfordringer. Vi legger stor vekt på å sikre høyest mulig kvalitet og service.";

export default function OmOss() {
  return (
    <main id="main">
      <PageHero
        image={{ src: "/images/om-oss/01-143b289f.png", alt: "", width: 1440, height: 642 }}
        title="Om oss"
        crumbs={[{ text: "Om oss" }]}
      />
      <Container narrow>
        <div className="py-12 md:py-16">
          {/* docs/scrape/om-oss.json blocks 4-14. */}
          <StorySection
            heading1="Kvalitet og profesjonalitet."
            text1="Vi er opptatt av å levere førsteklasses service og skape en positiv opplevelse for kundene våre. Vårt tekniske team i samarbeid med våre montører har mange års erfaring fra alt innen smøreteknikk."
            image1={{ src: "/images/om-oss/02-34e18c82.png", alt: "Aðstaða", width: 200, height: 266 }}
            image2={{ src: "/images/om-oss/03-9b3d1db5.jpeg", alt: "Aðstaða", width: 200, height: 266 }}
            heading2="Din drift er vår ambisjon."
            text2="Fra den minste minigraver til Norges største produksjonsanlegg er vi klare til å møte utfordringen du har til oss. Elba har lang erfaring med å levere alt fra enkelt håndutstyr for fett til uortodokse smøresystemer til enestående applikasjoner."
            mainImage={{ src: "/images/om-oss/04-ab45b0b4.jpeg", alt: "Maskiner med smøreutstyr", width: 388, height: 518 }}
            insetImage={{ src: "/images/om-oss/05-55228eb9.jpeg", alt: "ELBA på fabrikk", width: 172, height: 229 }}
          />
        </div>
      </Container>

      {/* docs/scrape/om-oss.json blocks 15-25: the four stat counters, same
          animated values as the home page — see lib/stats.ts. */}
      <StatsSection />

      <Container narrow>
        <div className="py-14 md:py-20">
          <h2 className="text-center text-section font-semibold text-black md:text-section-lg">Vårt team</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lead text-ink-muted md:text-lead-lg">
            {TEAM_INTRO}
          </p>
          <TeamGrid members={team} className="mt-10" />
        </div>
      </Container>

      <ContactCta />
    </main>
  );
}
