"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Lessons", matches: (path: string) => path === "/" || path.startsWith("/lessons") },
  { href: "/run-it", label: "Run it", matches: (path: string) => path.startsWith("/run-it") },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-0.5 sm:gap-1">
      {links.map(({ href, label, matches }) => {
        const current = matches(pathname);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={current ? "page" : undefined}
              className="rounded-full px-2 py-1.5 font-bold text-muted transition-colors hover:text-ink sm:px-3 aria-[current=page]:bg-accent aria-[current=page]:text-on-accent"
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
