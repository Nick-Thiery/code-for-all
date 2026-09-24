import Link from "next/link";
import type { Lesson } from "@/lib/lessons";

type Props = { previous: Lesson | null; next: Lesson | null };

export function LessonNav({ previous, next }: Props) {
  return (
    <nav aria-label="Previous and next lesson" className="mt-12 grid gap-3 sm:grid-cols-2">
      {previous && (
        <NavCard href={`/lessons/${previous.slug}`} rel="prev" label="Previous lesson" title={previous.title} />
      )}
      {next ? (
        <NavCard href={`/lessons/${next.slug}`} rel="next" label="Next lesson" title={next.title} alignEnd />
      ) : (
        <NavCard href="/" label="That's the last one" title="Back to all lessons" alignEnd />
      )}
    </nav>
  );
}

type NavCardProps = { href: string; label: string; title: string; rel?: string; alignEnd?: boolean };

function NavCard({ href, label, title, rel, alignEnd }: NavCardProps) {
  return (
    <Link
      href={href}
      rel={rel}
      className={`group block rounded-xl border-2 border-rule px-5 py-4 transition-colors hover:border-emphasis ${
        alignEnd ? "sm:col-start-2 sm:text-right" : ""
      }`}
    >
      <span className="block text-base text-muted">{label}</span>
      <span className="display mt-1 block text-xl leading-snug">{title}</span>
    </Link>
  );
}
