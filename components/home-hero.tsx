"use client";

import Link from "next/link";
import { Hex } from "@/components/hex";
import { formatCount } from "@/lib/format";
import { type Outline, allLessons, moduleCompleteHref, resumeTarget } from "@/lib/outline";
import { useCompletedLessons } from "@/lib/progress";

type Cta = { href: string; label: string; short?: string };

// The hero's words and button: "Start lesson 1" for a new visitor,
// "Continue: <lesson>" for a returning one. Server-rendered as new.
export function HomeHero({ outline }: { outline: Outline }) {
  const { completed, ready } = useCompletedLessons();
  const lessons = allLessons(outline);
  const first = lessons[0];
  const doneAny = ready && lessons.some((lesson) => completed.has(lesson.id));
  const resume = doneAny ? resumeTarget(outline, completed) : null;
  const lastModule = outline.modules.at(-1);

  const fresh: { eyebrow: string; lead: string; cta: Cta | null } = {
    eyebrow: "A free course for beginners",
    lead: "No experience needed. Learn how AI tools work, then use one to build your own website by the end of Module 1.",
    cta: first ? { href: first.href, label: `Start lesson ${first.number}` } : null,
  };
  let { eyebrow, lead, cta } = fresh;

  if (doneAny && resume) {
    const mod = outline.modules.find((m) => m.number === resume.module)!;
    const doneInModule = mod.lessons.filter((lesson) => completed.has(lesson.id)).length;
    eyebrow = "Welcome back";
    lead = `You've done ${doneInModule} of ${formatCount(mod.lessons.length, "lesson")} in Module ${mod.number}. The next one takes about ${formatCount(resume.duration, "minute")}.`;
    cta = { href: resume.href, label: `Continue: ${resume.title}`, short: `Continue lesson ${resume.number}` };
  } else if (doneAny && lastModule) {
    eyebrow = "Welcome back";
    lead = "You've finished every lesson that's out so far. More modules are on the way.";
    cta = { href: moduleCompleteHref(lastModule.number), label: "See what's next" };
  }

  return (
    <div className="flex max-w-[600px] flex-[1_1_420px] flex-col gap-5">
      <span className="flex items-center gap-2">
        <Hex width={16} height={18} shape="fill-deco" />
        <span className="eyebrow">{eyebrow}</span>
      </span>
      <h1 className="t-hero m-0">Build real things with AI.</h1>
      {/* A returning learner's words replace the new visitor's after the page
          loads. The new visitor's stay underneath, invisible, so the lead and
          the button keep their places and nothing below them jumps. */}
      <Stack under={doneAny ? <p className="t-lead m-0">{fresh.lead}</p> : null}>
        <p className="t-lead m-0">{lead}</p>
      </Stack>
      {cta && (
        <div className="mt-1 flex flex-col items-start gap-3">
          <Stack under={doneAny && fresh.cta ? <HeroButton cta={fresh.cta} /> : null}>
            <HeroButton cta={cta} />
          </Stack>
          <p className="t-meta m-0 text-muted">Free. No sign-up. Your progress saves on this device.</p>
        </div>
      )}
    </div>
  );
}

/** Children on top of `under`, in one grid cell, sized to the larger of the two. */
function Stack({ under, children }: { under: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid max-w-full *:col-start-1 *:row-start-1">
      {under && (
        <div aria-hidden="true" inert className="invisible">
          {under}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

// On phones a returning learner's button says "Continue lesson 3", so a long
// lesson title never wraps it onto a second line.
function HeroButton({ cta }: { cta: Cta }) {
  return (
    <Link href={cta.href} className="btn btn-hero max-w-full min-w-[min(100%,280px)]">
      {cta.short ? (
        <>
          <span className="tablet:hidden">{cta.short}</span>
          <span className="hidden tablet:inline">{cta.label}</span>
        </>
      ) : (
        cta.label
      )}{" "}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
