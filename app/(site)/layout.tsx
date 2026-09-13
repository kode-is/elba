import { Footer } from "@/components/Footer";

// Route group layout: every real page route lives under app/(site)/ and
// gets the footer. app/not-found.tsx stays outside this group (at the app
// root) so unmatched paths render through app/layout.tsx only, with no
// footer — matching the live site's Framer 404 template.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
