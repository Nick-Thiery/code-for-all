import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/about", label: "About" },
  { href: "/run-it", label: "Run a session" },
  { href: "/glossary", label: "Glossary" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-bg text-[16px] leading-[1.5] text-muted print:hidden">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-(--gut) pt-7 pb-9">
        <p className="m-0 max-w-[34em]">{site.madeBy}</p>
        <nav aria-label="Footer" className="-mx-2.5 flex flex-wrap items-center gap-x-1">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="flex min-h-11 items-center px-2.5 text-muted hover:text-fg">
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
