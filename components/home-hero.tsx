"use client";

import Link from "next/link";
import { Hex } from "@/components/hex";
import { formatCount } from "@/lib/format";
import { type Outline, allLessons, partCompleteHref, resumeTarget } from "@/lib/outline";
import { useCompletedLessons } from "@/lib/progress";

// The hero's words and button: "Start lesson 1" for a new visitor,
// "Continue: <lesson>" for a returning one. Server-rendered as new.
export function HomeHero({ outline }: { outline: Outline }) {
  const { completed, ready } = useCompletedLessons();
  const lessons = allLessons(outline);
  const first = lessons[0];
  const doneAny = ready && lessons.some((lesson) => completed.has(lesson.id));
  const resume = doneAny ? resumeTarget(outline, completed) : null;
  const lastPart = outline.parts.at(-1);

  let eyebrow = "A free course for beginners";
  let lead = "No experience needed. Learn how AI tools work, then use one to build your own website by the end of Part 1.";
  let cta = first ? { href: first.href, label: `Start lesson ${first.number}` } : null;

  if (doneAny && resume) {
    const part = outline.parts.find((p) => p.number === resume.part)!;
    const doneInPart = part.lessons.filter((lesson) => completed.has(lesson.id)).length;
    eyebrow = "Welcome back";
    lead = `You've done ${doneInPart} of ${formatCount(part.lessons.length, "lesson")} in Part ${part.number}. The next one takes about ${formatCount(resume.duration, "minute")}.`;
    cta = { href: resume.href, label: `Continue: ${resume.title}` };
  } else if (doneAny && lastPart) {
    eyebrow = "Welcome back";
    lead = `You've finished every lesson so far. Part ${outline.upcoming.number} is on the way.`;
    cta = { href: partCompleteHref(lastPart.number), label: "See what you built" };
  }

  return (
    <div className="flex max-w-[600px] flex-[1_1_420px] flex-col gap-5">
      <span className="flex items-center gap-2">
        <Hex width={16} height={18} shape="fill-deco" />
        <span className="eyebrow">{eyebrow}</span>
      </span>
      <h1 className="t-hero m-0">Build real things with AI.</h1>
      <p className="t-lead m-0">{lead}</p>
      {cta && (
        <div className="mt-1 flex flex-col items-start gap-3">
          <Link href={cta.href} className="btn btn-hero max-w-full min-w-[min(100%,280px)]">
            {cta.label} <span aria-hidden="true">→</span>
          </Link>
          <p className="t-meta m-0 text-muted">Free. No sign-up. Your progress saves on this device.</p>
        </div>
      )}
    </div>
  );
}
