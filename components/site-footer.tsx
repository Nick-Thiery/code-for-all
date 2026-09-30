"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

// The footer: an ink block. On most pages it's the full one: who made the
// site, Contact us, three columns of links, then CODE FOR ALL set as wide as
// the page. At the end of a lesson it's one quiet strip with the same links,
// so the "Next up" card stays the loudest thing there.

type FooterLink = { href: string; label: string };

/** A lesson's address: /module-3/what-it-can-do, but not a module's quiz, certificate and so on. */
const LESSON_PATH = /^\/module-\d+\/(?!quiz$|complete$|check-your-skills$|certificate$)[^/]+$/;

export function SiteFooter({ firstLesson }: { firstLesson: string | null }) {
  const pathname = usePathname();
  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: "Learn",
      links: [
        ...(firstLesson ? [{ href: firstLesson, label: "Start lesson 1" }] : []),
        { href: "/#contents", label: "Contents" },
        { href: "/quizzes", label: "Quizzes" },
        { href: "/glossary", label: "Glossary" },
        { href: "/help", label: "Help" },
      ],
    },
    {
      title: "Groups",
      links: [
        { href: "/run-it", label: "Run a session" },
        { href: "/run-it#kit", label: "Session kit" },
      ],
    },
    {
      title: "About",
      links: [
        { href: "/about", label: "About" },
        { href: "/move-progress", label: "Move my progress" },
        { href: "/privacy", label: "Privacy" },
      ],
    },
  ];

  if (LESSON_PATH.test(pathname)) {
    // Everything the full footer links to, less the two that are a step away from another link here.
    const links = columns
      .flatMap((column) => column.links)
      .filter((link) => link.label !== "Start lesson 1" && link.label !== "Session kit");
    return (
      <footer className="on-ink px-(--gut) text-[16px] leading-[1.5] print:hidden">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-x-10 gap-y-3 py-7 wide:min-h-24 wide:flex-row wide:items-center wide:justify-between wide:py-5">
          <div className="flex flex-col gap-x-8 gap-y-2 tablet:flex-row tablet:items-baseline">
            <span className="font-display text-[26px] leading-none font-extrabold tracking-[.01em] whitespace-nowrap uppercase [font-stretch:72%] desktop:text-[28px]">
              {site.name}
            </span>
            <span className="text-[14px] whitespace-nowrap text-muted desktop:text-[15px]">{site.issueLine}</span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-[22px] wide:justify-end">
            {links.map(({ href, label }) => (
              <FooterLink key={label} href={href}>
                {label}
              </FooterLink>
            ))}
            <a href={site.contactHref} className="flex min-h-11 items-center text-fg hover:text-accent wide:min-h-10">
              Contact us
            </a>
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="on-ink px-(--gut) text-[16px] leading-[1.5] desktop:text-[17px] print:hidden">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[34px] pt-[50px] pb-9 desktop:gap-12 desktop:pt-20 desktop:pb-14">
        <div className="flex flex-col gap-[34px] desktop:flex-row desktop:justify-between desktop:gap-[60px]">
          <div className="flex max-w-[420px] flex-col gap-3 desktop:gap-3.5">
            <p className="m-0 leading-[1.55] text-muted">{site.madeBy}</p>
            <a href={site.contactHref} className="flex min-h-11 items-center self-start hover:text-fg">
              Contact us
            </a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-5 gap-y-7 desktop:flex desktop:gap-[72px]">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-0.5">
                <span className="kicker mb-1.5 text-[13px] tracking-[.14em] text-on-navy-muted desktop:text-[14px]">
                  {column.title}
                </span>
                {column.links.map(({ href, label }) => (
                  <FooterLink key={label} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </div>
            ))}
          </nav>
        </div>
        {/* The name, as wide as the page. Decoration: the header already says it. */}
        <div aria-hidden="true" className="footer-wordmark">
          <span>{site.name}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="flex min-h-11 items-center text-fg no-underline hover:text-accent hover:underline wide:min-h-10"
    >
      {children}
    </Link>
  );
}
