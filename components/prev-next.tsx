import Link from "next/link";

/** Where a Previous or Next card goes, and what it says. */
export type NavTarget = {
  /** The small line: "Next · Lesson 3", "You've finished Module 1". */
  label: string;
  title: string;
  href: string;
  /** Marks the link rel="next"/"prev": set when it's the neighbouring lesson. */
  lesson?: boolean;
};

type Props = {
  /** Names the navigation for screen readers. */
  label?: string;
  previous: NavTarget | null;
  next: NavTarget;
};

export function PrevNext({ label = "Lessons", previous, next }: Props) {
  return (
    <nav aria-label={label} className="flex flex-row-reverse flex-wrap gap-4 leading-[1.4]">
      <Link
        href={next.href}
        rel={next.lesson ? "next" : undefined}
        className="flex min-h-24 flex-[1.4_1_280px] items-center justify-between gap-4 rounded-2xl bg-accent px-[22px] py-[18px] text-on-accent no-underline hover:text-on-accent hover:brightness-[1.15]"
      >
        <span className="flex flex-col gap-1">
          <span className="text-[15px] font-bold tracking-[.03em]">{next.label}</span>
          <span className="display text-[22px] leading-[1.25] font-[650]">{next.title}</span>
        </span>
        <span aria-hidden="true" className="text-[26px] font-bold">
          →
        </span>
      </Link>
      {previous && (
        <Link
          href={previous.href}
          rel={previous.lesson ? "prev" : undefined}
          className="flex min-h-24 flex-[1_1_240px] items-center gap-4 rounded-2xl border-[1.5px] border-border px-[22px] py-[18px] text-fg no-underline hover:bg-surface2 hover:text-fg"
        >
          <span aria-hidden="true" className="text-[22px] text-muted">
            ←
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-[15px] font-bold text-muted">{previous.label}</span>
            <span className="text-[19px] leading-[1.3] font-bold">{previous.title}</span>
          </span>
        </Link>
      )}
    </nav>
  );
}
