import Image from "next/image";
import Link from "next/link";
import type { LogoFiles } from "@/lib/logo";
import { site } from "@/lib/site";

// Grouped like a formal site footer. Contact us is added to the last group
// below, because it goes to site.contactHref rather than a page.
const groups = [
  {
    title: "Learn",
    links: [
      { href: "/help", label: "Help" },
      { href: "/glossary", label: "Glossary" },
      { href: "/move-progress", label: "Move my progress" },
    ],
  },
  { title: "Teach", links: [{ href: "/run-it", label: "Run a session" }] },
  {
    title: "Code for All",
    links: [
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter({ logo }: { logo: LogoFiles }) {
  // The same artwork as the header (lib/logo.ts), light or dark to match the
  // theme, a little smaller. Lazy, so neither file loads until it's near.
  const image = (src: string) => (
    <Image src={src} alt="" width={401} height={126} unoptimized loading="lazy" className="block h-9 w-auto max-w-none" />
  );
  return (
    <footer className="border-t border-border bg-surface2 text-[16px] leading-[1.5] text-muted print:hidden">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-x-16 gap-y-8 px-(--gut) pt-10 pb-12">
        <div className="flex max-w-[26em] flex-col items-start gap-3">
          <Link href="/" aria-label="Code for All home" className="flex min-h-11 items-center rounded-lg no-underline">
            <span className="dark:hidden">{image(logo.light)}</span>
            <span className="hidden dark:block">{image(logo.dark)}</span>
          </Link>
          <p className="m-0">{site.madeBy}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-14 gap-y-6">
          {groups.map((group, index) => (
            <div key={group.title} className="flex min-w-[9em] flex-col gap-1">
              <p id={`footer-${index}`} className="m-0 text-[13px] font-bold tracking-[.1em] text-fg uppercase">
                {group.title}
              </p>
              <ul aria-labelledby={`footer-${index}`} className="m-0 flex list-none flex-col p-0">
                {group.links.map(({ href, label }) => (
                  <li key={href}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                ))}
                {index === groups.length - 1 && (
                  <li>
                    <a href={site.contactHref} className={FOOTER_LINK}>
                      Contact us
                    </a>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}

const FOOTER_LINK = "flex min-h-11 items-center text-muted no-underline hover:text-accent hover:underline";

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} prefetch={false} className={FOOTER_LINK}>
      {children}
    </Link>
  );
}
