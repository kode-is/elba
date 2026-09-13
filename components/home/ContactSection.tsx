import { ContactForm } from "@/components/ContactForm";

// docs/scrape/home.json block 68: the mini contact form's heading. Card
// background is white (not the surface/cream tone used elsewhere on this
// page) so ContactForm's own bg-surface fields — shared verbatim with
// /kontakt-oss (Task 2), unchanged here — stay visibly distinct inside it,
// matching the two-tone card the live screenshot shows.
export function ContactSection() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <h3 className="text-center font-ui text-xl font-semibold text-neutral-900">Kontakt oss</h3>
      <div className="mt-6">
        <ContactForm submitLabel="Send" />
      </div>
    </div>
  );
}
