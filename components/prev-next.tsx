import Link from "next/link";
import { Icon } from "@/components/icons";
import { MarkDoneLink } from "@/components/mark-done-link";
import type { ModuleInfo } from "@/lib/celebration";
import { fitStep } from "@/lib/format";

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
  /** At the end of a lesson: following "Next" marks this lesson done. */
  markDone?: { lessonId: string; module: ModuleInfo };
};

// The big title's sizes, phone then desktop. It takes the biggest that fits
// the card on the narrowest phone (about 200px beside the arrow) in three lines.
const NEXT_SIZES = [
  [40, "text-[40px] desktop:text-[72px]"],
  [34, "text-[34px] desktop:text-[56px]"],
  [28, "text-[28px] desktop:text-[44px]"],
  [24, "text-[24px] desktop:text-[36px]"],
] as const;

function nextSize(title: string) {
  return NEXT_SIZES[fitStep(title, NEXT_SIZES.map(([size]) => size), 200, 3)][1];
}

// The navy "next up" card with its marigold arrow, then the way back as a plain link.
export function PrevNext({ label = "Lessons", previous, next, markDone }: Props) {
  const nextProps = {
    href: next.href,
    rel: next.lesson ? "next" : undefined,
    className:
      "on-navy lift flex items-center gap-4 rounded-md border-2 border-line px-5 pt-[22px] pb-6 text-fg no-underline shadow-h6 hover:text-fg desktop:gap-6 desktop:px-[30px] desktop:pt-7 desktop:pb-[30px] desktop:shadow-h8",
    children: (
      <>
        <span className="flex min-w-0 flex-1 flex-col gap-2 desktop:gap-2.5">
          <span className="eyebrow desktop:tracking-[.14em]">{next.label}</span>
          <span className={`head leading-[.9] ${nextSize(next.title)}`}>{next.title}</span>
        </span>
        <span
          aria-hidden="true"
          className="lift-arrow box-border grid size-14 flex-none place-items-center rounded-full border-2 border-line bg-marigold text-on-marigold shadow-h3 desktop:size-[76px] desktop:shadow-h4"
        >
          <Icon name="arrow-right" size={28} stroke={2.6} />
        </span>
      </>
    ),
  };
  return (
    <nav aria-label={label} className="flex flex-col gap-3 leading-[1.4] print:hidden">
      {markDone ? <MarkDoneLink {...nextProps} lessonId={markDone.lessonId} module={markDone.module} /> : <Link {...nextProps} />}
      {previous && (
        <Link
          href={previous.href}
          rel={previous.lesson ? "prev" : undefined}
          className="flex min-h-11 items-center gap-2 self-start text-[16px] text-fg desktop:text-[17px]"
        >
          <Icon name="arrow-left" size={18} stroke={2.4} />
          <span>
            {previous.label} · {previous.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
