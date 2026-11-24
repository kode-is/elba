/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // Short address for print and QR codes (the Vei og Anlegg stand, ads):
  // elba.no/jobb → /jobb-hos-oss. Temporary (307) so the target can move
  // without browsers having cached the old one; query strings (e.g. a
  // ?kilde=vei-og-anlegg tag on the QR) pass through to the page.
  async redirects() {
    return [{ source: "/jobb", destination: "/jobb-hos-oss", permanent: false }];
  },
};
export default nextConfig;
