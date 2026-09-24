import Link from "next/link";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 py-6 sm:py-8">
      <Link href="/" className="display flex items-center gap-2 text-lg sm:gap-2.5 sm:text-xl">
        {/* A finished stop from the course track, doubling as the logo. */}
        <span aria-hidden="true" className="size-4 rounded-full border-2 border-emphasis bg-accent" />
        {site.name}
      </Link>
      <nav aria-label="Main" className="-mr-2 flex items-center gap-0.5 sm:gap-1">
        <NavLinks />
        <ThemeToggle />
      </nav>
    </header>
  );
}
