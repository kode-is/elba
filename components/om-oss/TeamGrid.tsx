import Image from "next/image";
import type { TeamMember } from "@/lib/team";

type TeamGridProps = {
  members: TeamMember[];
  className?: string;
};

/**
 * "Vårt team" nine-card grid (docs/scrape/om-oss.json blocks 28-64,
 * docs/reference/om-oss.desktop.jpg / .mobile.jpg): a landscape photo card
 * with a bottom-anchored dark gradient carrying the name, role, email
 * (mailto) and — for Christoffer Iversen only — a phone (tel). Same
 * image+gradient+bottom-text-block shape as IndustryGrid's photo cards, one
 * column on mobile and three on desktop per the reference screenshots.
 */
export function TeamGrid({ members, className }: TeamGridProps) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8${className ? ` ${className}` : ""}`}>
      {members.map((member) => (
        <div key={member.email} className="relative aspect-[8/5] w-full overflow-hidden rounded-2xl">
          <Image
            src={member.image.src}
            alt={member.image.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-ui text-lg font-semibold text-white">{member.name}</h3>
            <h6 className="mt-1 text-xs font-medium uppercase tracking-wide text-white/70">{member.role}</h6>
            <h6 className="text-xs font-medium uppercase tracking-wide text-white/70">
              <a href={`mailto:${member.email}`} className="hover:text-white">
                {member.email}
              </a>
            </h6>
            {member.phone ? (
              <h6 className="text-xs font-medium uppercase tracking-wide text-white/70">
                <a href={`tel:${member.phone.replace(/\s+/g, "")}`} className="hover:text-white">
                  {member.phone}
                </a>
              </h6>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
