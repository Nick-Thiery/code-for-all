"use client";

import Link from "next/link";
import { HandsOnChip, PracticeChip } from "@/components/chip";
import { Hex, HexCheck } from "@/components/hex";
import { LevelChip } from "@/components/mastery";
import { formatAbout, formatCount } from "@/lib/format";
import { type Level, levelOf } from "@/lib/mastery";
import { type Outline, type OutlineLesson, type OutlineQuiz, allLessons, moduleHref, resumeTarget } from "@/lib/outline";
import { useCompletedLessons } from "@/lib/progress";
import { type QuizResult, useMastery, useQuizResults } from "@/lib/quiz-results";

type Props = {
  outline: Outline;
  module: number;
};

/**
 * One released module: its title on the left, its lessons on the track,
 * then its quiz and any Check your skills page. Quizzes aren't lessons:
 * they don't count towards progress and are never "up next".
 */
export function CourseTrack({ outline, module: moduleNumber }: Props) {
  const mod = outline.modules.find((m) => m.number === moduleNumber);
  const { completed, ready } = useCompletedLessons();
  const { results } = useQuizResults();
  const { levels } = useMastery();
  if (!mod) return null;

  // Before progress loads (and with no JavaScript) this renders as a new
  // visitor sees it.
  const done = ready ? completed : new Set<string>();
  const everything = allLessons(outline);
  const startedCourse = everything.some((lesson) => done.has(lesson.id));
  const nextId = startedCourse ? resumeTarget(outline, done)?.id : everything[0]?.id;

  const doneCount = mod.lessons.filter((lesson) => done.has(lesson.id)).length;
  const totalMinutes = mod.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

  return (
    <div className="flex flex-wrap items-start gap-x-14 gap-y-6">
      <div className="flex max-w-[380px] flex-[1_1_260px] flex-col gap-2.5">
        <h3 id={`module-${mod.number}`} className="t-h2 m-0 scroll-mt-6">
          <span className="block text-[0.6em] leading-[1.4] text-muted">Module {mod.number}</span>
          {mod.title}
        </h3>
        <p className="m-0">{mod.summary}</p>
        <p className="t-meta m-0 text-muted">
          {formatCount(mod.lessons.length, "lesson")} · {formatAbout(totalMinutes)} in total
        </p>
        {doneCount > 0 && (
          <div className="mt-2.5 flex flex-col gap-2">
            <span className="font-bold">
              {doneCount} of {mod.lessons.length} lessons done
            </span>
            <span aria-hidden="true" className="flex gap-1">
              {mod.lessons.map((lesson) => (
                <span
                  key={lesson.id}
                  className={`h-2 flex-1 rounded ${done.has(lesson.id) ? "bg-accent" : "bg-track"}`}
                />
              ))}
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-[999_1_420px]">
        <ol className="m-0 list-none p-0">
          {mod.lessons.map((lesson, index) => {
            const isDone = done.has(lesson.id);
            const isNext = lesson.id === nextId;
            const previousDone = index > 0 && done.has(mod.lessons[index - 1].id);
            const isLast = index === mod.lessons.length - 1 && !mod.quiz;
            return (
              <li key={lesson.id} className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-x-3.5">
                <div aria-hidden="true" className="relative flex justify-center">
                  {index > 0 && (
                    <span className={`absolute top-0 left-[21px] h-3.5 w-0.5 ${previousDone ? "bg-accent" : "bg-border"}`} />
                  )}
                  {!isLast && (
                    <span className={`absolute top-[58px] bottom-0 left-[21px] w-0.5 ${isDone ? "bg-accent" : "bg-border"}`} />
                  )}
                  <TrackHex number={lesson.number} state={isDone ? "done" : isNext ? "next" : "todo"} />
                </div>
                <div className="min-w-0 pt-1 pb-2">
                  {isNext ? (
                    <UpNextCard lesson={lesson} startedCourse={startedCourse} level={levelOf(levels, lesson.id)} />
                  ) : (
                    // The whole row opens the lesson (the title link stretches over
                    // it), while the hands-on chip stays its own link on top.
                    <div className="relative flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[14px] px-3.5 py-2.5 text-fg hover:bg-surface2 has-[.row-link:focus-visible]:outline-3 has-[.row-link:focus-visible]:outline-offset-3 has-[.row-link:focus-visible]:outline-accent">
                      <span className="flex min-w-0 flex-col gap-1">
                        <Link
                          href={lesson.href}
                          className="row-link display text-[21px] leading-[1.3] font-semibold text-fg no-underline after:absolute after:inset-0 after:rounded-[14px] hover:text-fg focus-visible:outline-none"
                        >
                          <span className="sr-only">
                            Lesson {lesson.number}, {isDone ? "done" : "not started"}:{" "}
                          </span>
                          {lesson.title}
                        </Link>
                        <LessonMeta lesson={lesson} level={levelOf(levels, lesson.id)} />
                      </span>
                      {isDone && (
                        <span aria-hidden="true" className="text-[16px] font-bold text-accent">
                          ✓ Done
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
          {mod.quiz && (
            <QuizRow
              quiz={mod.quiz}
              module={mod.number}
              result={results[mod.quiz.id]}
              previousDone={done.has(mod.lessons.at(-1)?.id ?? "")}
            />
          )}
        </ol>
        {mod.skillsCheck && (
          <SkillsCheckCard check={mod.skillsCheck} module={mod.number} result={results[mod.skillsCheck.id]} />
        )}
      </div>
    </div>
  );
}

/** The module quiz, after the last lesson. Shows the last result once taken. */
function QuizRow({
  quiz,
  module,
  result,
  previousDone,
}: {
  quiz: OutlineQuiz;
  module: number;
  result: QuizResult | undefined;
  previousDone: boolean;
}) {
  return (
    <li className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-x-3.5">
      <div aria-hidden="true" className="relative flex justify-center">
        <span className={`absolute top-0 left-[21px] h-3.5 w-0.5 ${previousDone ? "bg-accent" : "bg-border"}`} />
        <span className="relative mt-3.5 block h-11 w-10">
          <Hex
            width={40}
            height={44}
            shape={result ? "fill-surface stroke-accent stroke-[1.5]" : "fill-surface stroke-pip stroke-[1.5]"}
            className="block"
          />
          <span
            className={`absolute inset-0 grid place-items-center font-sans text-[19px] leading-none font-bold ${result ? "text-accent" : "text-muted"}`}
          >
            ?
          </span>
        </span>
      </div>
      <div className="min-w-0 pt-1 pb-2">
        <div className="relative flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[14px] px-3.5 py-2.5 text-fg hover:bg-surface2 has-[.row-link:focus-visible]:outline-3 has-[.row-link:focus-visible]:outline-offset-3 has-[.row-link:focus-visible]:outline-accent">
          <span className="flex min-w-0 flex-col gap-1">
            <Link
              href={quiz.href}
              className="row-link display text-[21px] leading-[1.3] font-semibold text-fg no-underline after:absolute after:inset-0 after:rounded-[14px] hover:text-fg focus-visible:outline-none"
            >
              Module {module} quiz
            </Link>
            <QuizMeta quiz={quiz} result={result} />
          </span>
        </div>
      </div>
    </li>
  );
}

/** A Check your skills page, after the module's track. */
function SkillsCheckCard({ check, module, result }: { check: OutlineQuiz; module: number; result: QuizResult | undefined }) {
  const range = module === 1 ? "Module 1" : `Modules 1 to ${module}`;
  return (
    <Link
      href={check.href}
      className="mt-4 grid grid-cols-[44px_minmax(0,1fr)] gap-x-3.5 rounded-2xl border-[1.5px] border-border p-4 text-fg no-underline hover:border-accent hover:text-fg"
    >
      <span aria-hidden="true" className="flex justify-center pt-0.5">
        <Hex width={40} height={44} shape="fill-tint stroke-accent stroke-[1.5]">
          <HexCheck className="stroke-accent stroke-2" />
        </Hex>
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="display text-[21px] leading-[1.3] font-semibold">Check your skills</span>
        <span className="text-[16px] leading-[1.4] text-muted">
          {check.questions > 0
            ? `A mixed quiz on ${range}, and a checklist for your final project`
            : "A checklist for your final project"}
        </span>
        {result && <QuizMeta quiz={check} result={result} hideCount />}
      </span>
    </Link>
  );
}

function QuizMeta({ quiz, result, hideCount = false }: { quiz: OutlineQuiz; result: QuizResult | undefined; hideCount?: boolean }) {
  return (
    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[16px] leading-[1.4] text-muted">
      {!hideCount && <span>{formatCount(quiz.questions, "question")}</span>}
      {result && (
        <span className="font-bold text-fg">
          Last try: {result.correct} of {result.total}
        </span>
      )}
    </span>
  );
}

/**
 * A module in the course plan that isn't out yet. Same dashed look as the
 * design's "Coming soon" card.
 */
export function UpcomingModule({ number, title, summary }: { number: number; title: string; summary: string }) {
  return (
    <Link
      href={moduleHref(number)}
      className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-3.5 rounded-2xl border-2 border-dashed border-border p-4 text-fg no-underline hover:border-accent hover:text-fg"
    >
      <span aria-hidden="true" className="flex justify-center pt-0.5">
        <Hex width={40} height={44} shape="fill-none stroke-pip stroke-[1.5] [stroke-dasharray:3_2.5]" />
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="display text-[21px] leading-[1.3] font-semibold">
            <span className="text-muted">Module {number}: </span>
            {title}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface2 px-2.5 py-0.5 text-[15px] font-bold text-muted">
            <svg width="12" height="14" viewBox="0 0 14 16" aria-hidden="true">
              <rect x="1.5" y="7" width="11" height="8" rx="2" className="fill-current" />
              <path d="M4 7V5a3 3 0 0 1 6 0v2" className="fill-none stroke-current stroke-[1.8]" />
            </svg>
            Coming soon
          </span>
        </span>
        <span className="t-meta text-muted">{summary}</span>
      </span>
    </Link>
  );
}

function UpNextCard({ lesson, startedCourse, level }: { lesson: OutlineLesson; startedCourse: boolean; level: Level }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl bg-tint px-[18px] pt-4 pb-[18px]">
      <span className="eyebrow">{startedCourse ? "Up next" : "Start here"}</span>
      <span className="display text-[24px] leading-[1.25] font-[650]">{lesson.title}</span>
      <LessonMeta lesson={lesson} level={level} />
      <Link href={lesson.href} className="btn btn-primary mt-2 min-h-12 self-start px-[22px] text-[18px]">
        {startedCourse ? "Continue" : `Start lesson ${lesson.number}`} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

function LessonMeta({ lesson, level }: { lesson: OutlineLesson; level: Level }) {
  return (
    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[16px] leading-[1.4] text-muted">
      <span>{lesson.duration} min</span>
      {lesson.requiresAccount && <HandsOnChip lessonId={lesson.id} className="relative z-10" />}
      {lesson.hasPractice && <PracticeChip />}
      <LevelChip level={level} />
    </span>
  );
}

// accent fill = done · tint + accent ring = current · gray outline = not
// started. The number stays in every state; done adds a check badge.
function TrackHex({ number, state }: { number: number; state: "done" | "next" | "todo" }) {
  const shape = {
    done: "fill-accent stroke-accent stroke-[1.5]",
    next: "fill-tint stroke-accent stroke-2",
    todo: "fill-surface stroke-pip stroke-[1.5]",
  }[state];
  const color = { done: "text-on-accent", next: "text-accent", todo: "text-muted" }[state];

  return (
    <span className="relative mt-3.5 block h-11 w-10">
      <Hex width={40} height={44} shape={shape} className="block" />
      <span
        className={`absolute inset-0 grid place-items-center font-sans text-[17px] leading-none font-bold tabular-nums ${color}`}
      >
        {number}
      </span>
      {state === "done" && (
        <svg width="18" height="18" viewBox="0 0 18 18" className="absolute -right-1.5 -bottom-1">
          <circle cx="9" cy="9" r="8" className="fill-bg stroke-accent stroke-[1.5]" />
          <path
            d="M5.3 9.2l2.4 2.4 5-5.1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-accent stroke-2"
          />
        </svg>
      )}
    </span>
  );
}
