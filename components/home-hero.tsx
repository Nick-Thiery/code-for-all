"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "@/components/icons";
import s from "@/components/home.module.css";
import { formatCount } from "@/lib/format";
import { type Outline, type OutlineLesson, allLessons, moduleCompleteHref, resumeTarget } from "@/lib/outline";
import { useCompletedLessons } from "@/lib/progress";
import { site } from "@/lib/site";

type Cta = { href: string; label: string; short?: string };

// The cover: the issue line, the headline, the words and button, and three
// lesson cards fanned out beside them. "Start lesson 1" for a new visitor;
// for a returning one the button and the front card say "Continue" with
// their next lesson. Server-rendered as new.
export function HomeHero({ outline }: { outline: Outline }) {
  const { completed, ready } = useCompletedLessons();
  const lessons = allLessons(outline);
  const first = lessons[0];
  const doneAny = ready && lessons.some((lesson) => completed.has(lesson.id));
  const resume = doneAny ? resumeTarget(outline, completed) : null;
  const lastModule = outline.modules.at(-1);
  const moduleCount = outline.phases.reduce((sum, phase) => sum + phase.modules.length, 0);

  const fresh: { eyebrow: string; lead: string; cta: Cta | null } = {
    eyebrow: site.issueLine,
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

  // The cards: the learner's next lesson in front, then the two after it. A
  // new visitor gets lessons 1 to 3; someone who's finished everything gets
  // the last three, to look back over.
  const from = resume ? lessons.indexOf(resume) : doneAny ? Math.max(0, lessons.length - 3) : 0;
  const cards = lessons.slice(from, from + 3);
  const chip = !doneAny ? "Start here" : resume ? "Continue" : null;

  return (
    <section className="on-navy overflow-hidden px-(--gut)">
      <div className="mx-auto max-w-[1200px] pt-[22px] pb-[54px] desktop:pt-[34px] desktop:pb-24">
        <div className="a-fade flex justify-between gap-6 border-b border-rule-on-navy pb-3 font-display text-[12px] leading-[1.35] font-bold tracking-[.14em] text-on-navy-muted uppercase [font-stretch:85%] desktop:pb-3.5 desktop:text-[15px]">
          <span>{eyebrow}</span>
          <span className="hidden text-right tablet:inline">
            {formatCount(moduleCount, "module")} · {formatCount(lessons.length, "lesson")} so far
          </span>
        </div>

        <h1 className={s.title}>
          <Word delay={0.15}>Build</Word> <span className={s.breakPhone} />
          <Word delay={0.28} className={s.indent}>
            <span className={s.real}>real</span>
          </Word>{" "}
          <span className={s.break} />
          <Word delay={0.41}>things</Word> <span className={s.breakPhone} />
          <Word delay={0.47}>with</Word> <span className={s.breakWide} />
          <Word delay={0.54}>AI.</Word>
        </h1>

        <div className="mt-7 grid gap-x-10 desktop:mt-11 desktop:grid-cols-2">
          <div className="a-rise flex flex-col gap-[22px] desktop:gap-7" style={{ "--d": ".8s" } as CSSProperties}>
            {/* A returning learner's words replace the new visitor's after the page
                loads. The new visitor's stay underneath, invisible, so the lead and
                the button keep their places and nothing below them jumps. */}
            <Stack under={doneAny ? <Lead>{fresh.lead}</Lead> : null}>
              <Lead>{lead}</Lead>
            </Stack>
            {cta && (
              <div className="flex flex-col gap-x-7 gap-y-3 tablet:flex-row tablet:flex-wrap tablet:items-center">
                <Stack under={doneAny && fresh.cta ? <HeroButton cta={fresh.cta} /> : null}>
                  <HeroButton cta={cta} />
                </Stack>
                <div className="flex items-center justify-between gap-3">
                  <a
                    href="#inside"
                    className="flex min-h-11 items-center text-[17px] font-bold text-fg underline-offset-[5px] hover:text-accent desktop:text-[18px] desktop:underline-offset-[6px]"
                  >
                    See what&apos;s inside
                  </a>
                  <span className="text-[14px] text-on-navy-muted tablet:hidden">
                    {formatCount(moduleCount, "module")} · {formatCount(lessons.length, "lesson")}
                  </span>
                </div>
              </div>
            )}
            <p className="m-0 text-[15px] leading-[1.5] text-on-navy-muted desktop:text-[16px]">
              Free. No sign-up. Your progress saves on this device.
            </p>
          </div>

          <div className={s.fanColumn}>
            <div className={s.fan}>
              {cards.map((lesson, index) => (
                <FanCard key={lesson.id} lesson={lesson} place={index} chip={index === 0 ? chip : null} />
              ))}
              <span aria-hidden="true" className={`sticker a-spin ${s.fanSticker}`} style={{ "--d": "1.5s" } as CSSProperties}>
                <span className={s.stickerBig}>Free</span>
                <span className={s.stickerSmall}>No sign-up</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One word of the headline, sliding up out of its mask. */
function Word({ delay, className = "", children }: { delay: number; className?: string; children: ReactNode }) {
  return (
    <span className={`mask ${className}`} style={{ "--d": `${delay}s` } as CSSProperties}>
      <span>{children}</span>
    </span>
  );
}

function Lead({ children }: { children: string }) {
  return <p className="m-0 max-w-[560px] text-[19px] leading-[1.5] desktop:text-[23px]">{children}</p>;
}

/** Children on top of `under`, in one grid cell, sized to the larger of the two. */
function Stack({ under, children }: { under: ReactNode; children: ReactNode }) {
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
    <Link href={cta.href} className="btn btn-hero w-full tablet:w-auto">
      <span>
        {cta.short ? (
          <>
            <span className="tablet:hidden">{cta.short}</span>
            <span className="hidden tablet:inline">{cta.label}</span>
          </>
        ) : (
          cta.label
        )}
      </span>
      <Icon name="arrow-right" size={22} stroke={2.6} />
    </Link>
  );
}

const PLACES = [s.front, s.middle, s.back];

function FanCard({ lesson, place, chip }: { lesson: OutlineLesson; place: number; chip: string | null }) {
  return (
    <Link href={lesson.href} className={`on-surface ${s.card} ${PLACES[place]}`}>
      <span className={s.cardKicker}>
        <span>
          Lesson {lesson.module}.{lesson.number} · {lesson.duration} min
        </span>
        {chip && <span className="stamp px-2 py-[3px] text-[11px] desktop:px-2.5 desktop:py-1 desktop:text-[13px]">{chip}</span>}
      </span>
      <span className={s.cardTitle}>{lesson.title}</span>
    </Link>
  );
}
