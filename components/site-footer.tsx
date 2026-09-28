import Image from "next/image";
import Link from "next/link";
import type { LogoFiles } from "@/lib/logo";
import { site } from "@/lib/site";

const links = [
  { href: "/about", label: "About" },
  { href: "/help", label: "Help" },
  { href: "/run-it", label: "Run a session" },
  { href: "/glossary", label: "Glossary" },
  { href: "/move-progress", label: "Move my progress" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter({ logo }: { logo: LogoFiles }) {
  // The same artwork as the header (lib/logo.ts), light or dark to match the
  // theme, a little smaller. Lazy, so neither file loads until it's near.
  const image = (src: string) => (
    <Image src={src} alt="" width={401} height={126} unoptimized loading="lazy" className="block h-9 w-auto max-w-none" />
  );
  return (
    <footer className="border-t border-border bg-bg text-[16px] leading-[1.5] text-muted print:hidden">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-(--gut) pt-7 pb-9">
        <div className="flex flex-col items-start gap-3">
          <Link href="/" aria-label="Code for All home" className="flex min-h-11 items-center rounded-lg no-underline">
            <span className="dark:hidden">{image(logo.light)}</span>
            <span className="hidden dark:block">{image(logo.dark)}</span>
          </Link>
          <p className="m-0 max-w-[34em]">{site.madeBy}</p>
        </div>
        <nav aria-label="Footer" className="-mx-2.5 flex flex-wrap items-center gap-x-1">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} prefetch={false} className="flex min-h-11 items-center px-2.5 text-muted hover:text-fg">
              {label}
            </Link>
          ))}
          <a href={site.contactHref} className="flex min-h-11 items-center px-2.5 text-muted hover:text-fg">
            Contact us
          </a>
        </nav>
      </div>
    </footer>
  );
}
