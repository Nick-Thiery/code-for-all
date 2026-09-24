import Link from "next/link";
import { TodoLink } from "@/components/todo-link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-bg text-[16px] leading-[1.5] text-muted">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-(--gut) pt-7 pb-9">
        <p className="m-0 max-w-[34em]">{site.madeBy}</p>
        <nav aria-label="Footer" className="-mx-2.5 flex flex-wrap gap-x-1">
          <Link href="/about" className="flex min-h-11 items-center px-2.5 text-muted hover:text-fg">
            About
          </Link>
          <Link href="/run-it" className="flex min-h-11 items-center px-2.5 text-muted hover:text-fg">
            Run a session
          </Link>
          <TodoLink href={site.contactHref} className="flex min-h-11 items-center px-2.5 text-muted hover:text-fg">
            Contact
          </TodoLink>
        </nav>
      </div>
    </footer>
  );
}
