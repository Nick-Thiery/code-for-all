import Link from "next/link";
import { partCompleteHref } from "@/lib/outline";

type Neighbour = { number: number; title: string; href: string };

type Props = {
  part: number;
  previous: Neighbour | null;
  /** Null on the last lesson of a part: next goes to Part complete. */
  next: Neighbour | null;
};

export function PrevNext({ part, previous, next }: Props) {
  return (
    <nav aria-label="Lessons" className="flex flex-row-reverse flex-wrap gap-4 leading-[1.4]">
      <Link
        href={next ? next.href : partCompleteHref(part)}
        rel={next ? "next" : undefined}
        className="flex min-h-24 flex-[1.4_1_280px] items-center justify-between gap-4 rounded-2xl bg-accent px-[22px] py-[18px] text-on-accent no-underline hover:text-on-accent hover:brightness-[1.15]"
      >
        <span className="flex flex-col gap-1">
          <span className="text-[15px] font-bold tracking-[.03em]">
            {next ? `Next · Lesson ${next.number}` : `You've finished Part ${part}`}
          </span>
          <span className="display text-[22px] leading-[1.25] font-[650]">{next ? next.title : "See what you built"}</span>
        </span>
        <span aria-hidden="true" className="text-[26px] font-bold">
          →
        </span>
      </Link>
      {previous && (
        <Link
          href={previous.href}
          rel="prev"
          className="flex min-h-24 flex-[1_1_240px] items-center gap-4 rounded-2xl border-[1.5px] border-border px-[22px] py-[18px] text-fg no-underline hover:bg-surface2 hover:text-fg"
        >
          <span aria-hidden="true" className="text-[22px] text-muted">
            ←
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-[15px] font-bold text-muted">Previous · Lesson {previous.number}</span>
            <span className="text-[19px] leading-[1.3] font-bold">{previous.title}</span>
          </span>
        </Link>
      )}
    </nav>
  );
}
