"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Hex, HexCheck } from "@/components/hex";
import { LevelLabel } from "@/components/mastery";
import { formatAbout, formatCount } from "@/lib/format";
import { type Levels, levelOf } from "@/lib/mastery";
import {
  type Outline,
  type OutlineLesson,
  type OutlineModule,
  type OutlineQuiz,
  allLessons,
  moduleCompleteHref,
  moduleHref,
  resumeTarget,
} from "@/lib/outline";
import { useCompletedLessons } from "@/lib/progress";
import { type QuizResult, useMastery, useQuizResults } from "@/lib/quiz-results";

// The homepage course section (design: "Course grid · desktop" and "Course
// list · phone"). A "pick up where you left off" card, then every module by
// phase. From tablet up, module cards are buttons that choose which module's
// lessons show below them; on phones, each module opens and closes in place.
// The learner's current module is chosen at first; /#module-N picks another.
//
// Progress comes from lib/progress.ts and lib/quiz-results.ts, unchanged.
// Before it loads (and without JavaScript) this renders as a new visitor
// sees it.

type Progress = {
  done: Set<string>;
  results: Record<string, QuizResult>;
  /** Each lesson's mastery level (lib/mastery.ts). */
  levels: Levels;
  /** The lesson the learner should do next: their resume point, or lesson 1. */
  nextId: string | undefined;
  startedCourse: boolean;
};

export function CourseGrid({ outline }: { outline: Outline }) {
  const { completed, ready } = useCompletedLessons();
  const { results } = useQuizResults();
  const { levels } = useMastery();
  const uid = useId();

  const done = ready ? completed : new Set<string>();
  const lessons = allLessons(outline);
  const startedCourse = lessons.some((lesson) => done.has(lesson.id));
  const resume = startedCourse ? resumeTarget(outline, done) : lessons[0];
  const progress: Progress = { done, results, levels, nextId: resume?.id, startedCourse };

  // Finished everything so far: the last module is "current".
  const currentModule = resume?.module ?? outline.modules.at(-1)?.number ?? 1;
  const [picked, setPicked] = useState<number | null>(null);
  const [open, setOpen] = useState<Set<number> | null>(null);
  const [scrollTo, setScrollTo] = useState<number | null>(null);
  const selected = picked ?? currentModule;
  const isOpen = (n: number) => (open ?? new Set([currentModule])).has(n);
  const panelId = `${uid}-panel`;
  const itemId = (n: number) => `${uid}-module-${n}`;

  // Lesson, quiz and Check your skills pages link back to /#module-N.
  useEffect(() => {
    const fromHash = () => {
      const n = Number(/^#module-(\d+)$/.exec(window.location.hash)?.[1]);
      if (!outline.modules.some((m) => m.number === n)) return;
      setPicked(n);
      setOpen(new Set([n]));
      setScrollTo(n);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [outline]);

  // Once progress has loaded and the chosen module has rendered, bring it
  // into view: the lesson panel from tablet up, the opened module on phones.
  // Scrolling waits a frame, so the list changes size while it's still off
  // screen and nothing jumps in view.
  useEffect(() => {
    if (scrollTo === null || !ready) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const panel = document.getElementById(panelId);
        const target = panel && panel.offsetParent !== null ? panel : document.getElementById(itemId(scrollTo));
        target?.scrollIntoView({ block: "start" });
        setScrollTo(null);
      });
    });
    return () => cancelAnimationFrame(frame);
    // itemId only depends on uid, which never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTo, ready, panelId]);

  const toggle = (n: number) => {
    const next = new Set(open ?? [currentModule]);
    if (next.has(n)) next.delete(n);
    else next.add(n);
    setOpen(next);
  };

  const selectedModule = outline.modules.find((m) => m.number === selected) ?? outline.modules[0];

  return (
    <div className="flex flex-col gap-10 tablet:gap-12">
      <ContinueCard outline={outline} progress={progress} resume={resume} />

      <section aria-labelledby={`${uid}-title`} className="flex flex-col gap-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 id={`${uid}-title`} className="t-h1 m-0">
            Your course
          </h2>
          <p className="t-meta m-0 text-muted">
            <span className="tablet:hidden">Tap a module to see its lessons</span>
            <span className="hidden tablet:inline">Pick a module to see its lessons</span>
          </p>
        </div>

        {/* Tablet and up: the grid of module cards, then the chosen module. */}
        <div className="hidden grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-4 tablet:grid desktop:grid-cols-5">
          {outline.phases.map((phase) => (
            <div
              key={phase.number}
              style={{ "--span": Math.min(phase.modules.length, 5) } as React.CSSProperties}
              className="col-span-full grid grid-cols-subgrid gap-4 desktop:col-span-(--span)"
            >
              <PhaseLabel number={phase.number} title={phase.title} className="col-span-full pt-2" />
              {phase.modules.map((m) => {
                const mod = outline.modules.find((x) => x.number === m.number);
                return mod && m.released ? (
                  <ModuleCard
                    key={m.number}
                    mod={mod}
                    progress={progress}
                    current={m.number === currentModule}
                    selected={m.number === selected}
                    controls={panelId}
                    onPick={() => setPicked(m.number)}
                  />
                ) : (
                  <ComingSoonCard key={m.number} number={m.number} title={m.title} />
                );
              })}
            </div>
          ))}
        </div>
        {selectedModule && <ModulePanel id={panelId} mod={selectedModule} progress={progress} />}

        {/* Phones: one list, each module opens in place. */}
        <div className="flex flex-col gap-6 tablet:hidden">
          {outline.phases.map((phase) => (
            <div key={phase.number} className="flex flex-col gap-2.5">
              <PhaseLabel number={phase.number} title={phase.title} />
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {phase.modules.map((m) => {
                  const mod = outline.modules.find((x) => x.number === m.number);
                  return mod && m.released ? (
                    <PhoneModule
                      key={m.number}
                      id={itemId(m.number)}
                      mod={mod}
                      progress={progress}
                      current={m.number === currentModule}
                      open={isOpen(m.number)}
                      onToggle={() => toggle(m.number)}
                    />
                  ) : (
                    <li key={m.number}>
                      <ComingSoonCard number={m.number} title={m.title} compact />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ContinueCard({
  outline,
  progress,
  resume,
}: {
  outline: Outline;
  progress: Progress;
  resume: OutlineLesson | undefined | null;
}) {
  const lessons = allLessons(outline);
  const doneCount = lessons.filter((lesson) => progress.done.has(lesson.id)).length;
  const lastModule = outline.modules.at(-1);
  const mod = resume && outline.modules.find((m) => m.number === resume.module);

  let eyebrow: string;
  let where: string | null = null;
  let title: string;
  let cta: { href: string; label: string } | null;
  if (resume && mod) {
    eyebrow = progress.startedCourse ? "Pick up where you left off" : "Start here";
    where = `Module ${mod.number} · Lesson ${resume.number} of ${mod.lessons.length}`;
    title = resume.title;
    cta = { href: resume.href, label: progress.startedCourse ? "Continue" : `Start lesson ${resume.number}` };
  } else {
    eyebrow = "All caught up";
    title = "You've finished every lesson that's out so far.";
    cta = lastModule ? { href: moduleCompleteHref(lastModule.number), label: "See what's next" } : null;
  }

  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-tint p-[18px] tablet:flex-row tablet:flex-wrap tablet:items-center tablet:gap-x-8 tablet:gap-y-4 tablet:rounded-3xl tablet:px-8 tablet:py-[26px]">
      <div className="flex min-w-0 flex-col gap-1 tablet:flex-[1_1_300px]">
        <span className="eyebrow text-[14px] tracking-[.1em]">{eyebrow}</span>
        {where && <span className="t-meta text-muted">{where}</span>}
        <span className="display text-[24px] leading-[1.2] font-extrabold tablet:text-[28px]">{title}</span>
      </div>
      <div className="flex flex-col gap-2 tablet:w-[280px]">
        <span className="t-meta font-bold text-muted">
          {progress.startedCourse
            ? `${doneCount} of ${formatCount(lessons.length, "lesson")} done`
            : `${formatCount(lessons.length, "lesson")} out so far`}
        </span>
        <span aria-hidden="true" className="block h-2.5 overflow-hidden rounded-full bg-surface">
          <span
            className="block h-full rounded-full bg-accent"
            style={{ width: `${lessons.length ? (100 * doneCount) / lessons.length : 0}%` }}
          />
        </span>
      </div>
      {cta && (
        <Link href={cta.href} className="btn btn-primary tablet:min-h-14 tablet:px-7">
          {cta.label} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

function PhaseLabel({ number, title, className = "" }: { number: number; title: string; className?: string }) {
  return (
    <h3 className={`eyebrow m-0 flex items-center gap-3 text-[14px] tracking-[.12em] ${className}`}>
      Phase {number} · {title}
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </h3>
  );
}

/** Where a module stands, for its card and its row on phones. */
function moduleStatus(mod: OutlineModule, progress: Progress, current: boolean) {
  const total = mod.lessons.length;
  const count = mod.lessons.filter((lesson) => progress.done.has(lesson.id)).length;
  if (count === total) return { count, label: "Done", started: true, finished: true };
  if (count > 0) return { count, label: `${count} of ${total} done`, started: true, finished: false };
  if (current) return { count, label: progress.startedCourse ? "Up next" : "Start here", started: false, finished: false };
  return { count, label: "Not started", started: false, finished: false };
}

function ModuleCard({
  mod,
  progress,
  current,
  selected,
  controls,
  onPick,
}: {
  mod: OutlineModule;
  progress: Progress;
  current: boolean;
  selected: boolean;
  controls: string;
  onPick: () => void;
}) {
  const status = moduleStatus(mod, progress, current);
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-controls={controls}
      onClick={onPick}
      className={`flex min-h-[188px] cursor-pointer flex-col items-start gap-2 rounded-[18px] border-[1.5px] p-4 text-left font-[inherit] text-fg ${
        selected ? "border-accent bg-tint shadow-[0_0_0_3px_var(--accent)]" : "border-border bg-surface hover:border-accent"
      }`}
    >
      <MiniHoneycomb mod={mod} progress={progress} />
      <span className="text-[15px] leading-[1.3] font-bold text-muted">Module {mod.number}</span>
      <span className="display text-[18px] leading-[1.2] font-extrabold">{mod.title}</span>
      <StatusLabel status={status} className="mt-auto" />
    </button>
  );
}

function StatusLabel({
  status,
  className = "",
}: {
  status: ReturnType<typeof moduleStatus>;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[15px] leading-[1.3] font-bold ${status.started ? "text-accent" : "text-muted"} ${className}`}
    >
      {status.finished && <DoneBadge />}
      {status.label}
    </span>
  );
}

function DoneBadge() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="flex-none">
      <circle cx="12" cy="12" r="11" className="fill-accent" />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-on-accent"
      />
    </svg>
  );
}

/** One small hexagon per lesson: filled when done, ringed for the next one. */
function MiniHoneycomb({ mod, progress, small = false }: { mod: OutlineModule; progress: Progress; small?: boolean }) {
  return (
    <span aria-hidden="true" className="flex flex-wrap gap-[3px]">
      {mod.lessons.map((lesson) => {
        const shape = progress.done.has(lesson.id)
          ? "fill-accent stroke-accent stroke-[1.6]"
          : lesson.id === progress.nextId
            ? "fill-surface stroke-accent stroke-2"
            : "fill-surface stroke-pip stroke-[1.4]";
        return <Hex key={lesson.id} width={small ? 12 : 14} height={small ? 13 : 15} shape={shape} />;
      })}
    </span>
  );
}

function ComingSoonCard({ number, title, compact = false }: { number: number; title: string; compact?: boolean }) {
  return (
    <Link
      href={moduleHref(number)}
      className={`flex flex-col items-start gap-2 rounded-[18px] border-[1.5px] border-dashed border-border text-fg no-underline hover:border-accent hover:text-fg ${
        compact ? "min-h-16 px-3.5 py-2.5" : "min-h-[188px] p-4"
      }`}
    >
      {!compact && (
        <Hex width={14} height={15} shape="fill-none stroke-pip stroke-[1.4] [stroke-dasharray:2_2]" />
      )}
      <span className="text-[15px] leading-[1.3] font-bold text-muted">
        Module {number}
        {compact && " · Coming soon"}
      </span>
      <span className="display text-[18px] leading-[1.2] font-extrabold text-muted">{title}</span>
      {!compact && (
        <span className="mt-auto inline-flex items-center gap-1.5 text-[15px] leading-[1.3] font-bold text-muted">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="flex-none">
            <rect x="5" y="11" width="14" height="10" rx="2" className="fill-none stroke-current stroke-[2.4]" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" className="fill-none stroke-current stroke-[2.4]" />
          </svg>
          Coming soon
        </span>
      )}
    </Link>
  );
}

/** The chosen module's lessons, under the grid (tablet and up). */
function ModulePanel({ id, mod, progress }: { id: string; mod: OutlineModule; progress: Progress }) {
  const doneCount = mod.lessons.filter((lesson) => progress.done.has(lesson.id)).length;
  const minutes = mod.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={`${id}-title`}
      className="hidden scroll-mt-6 flex-wrap gap-x-12 gap-y-6 rounded-3xl border-[1.5px] border-border bg-surface2 p-(--pad) tablet:flex desktop:p-8"
    >
      <div className="flex flex-[1_1_260px] flex-col gap-3 desktop:max-w-[300px]">
        <h3 id={`${id}-title`} className="m-0 flex flex-col gap-1">
          <span className="t-meta font-bold text-muted">Module {mod.number}</span>
          <span className="display text-[30px] leading-[1.15] font-extrabold">{mod.title}</span>
        </h3>
        <p className="m-0 text-[18px] leading-[1.5]">{mod.summary}</p>
        <p className="t-meta m-0 text-muted">
          {formatCount(mod.lessons.length, "lesson")} · {formatAbout(minutes)}
          {doneCount > 0 && ` · ${doneCount} done`}
        </p>
        {mod.lessons.some((lesson) => lesson.requiresAccount) && <HandsOnNote className="mt-3" />}
      </div>
      <ol className="m-0 flex min-w-0 flex-[999_1_420px] list-none flex-col gap-1.5 p-0">
        {mod.lessons.map((lesson) => (
          <LessonRow key={lesson.id} lesson={lesson} progress={progress} />
        ))}
        {mod.quiz && <QuizRow quiz={mod.quiz} module={mod.number} result={progress.results[mod.quiz.id]} />}
        {mod.skillsCheck && (
          <SkillsCheckRow check={mod.skillsCheck} module={mod.number} result={progress.results[mod.skillsCheck.id]} />
        )}
      </ol>
    </div>
  );
}

/** A module on phones: a button that opens its lessons in place. */
function PhoneModule({
  id,
  mod,
  progress,
  current,
  open,
  onToggle,
}: {
  id: string;
  mod: OutlineModule;
  progress: Progress;
  current: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const status = moduleStatus(mod, progress, current);
  const lessonsId = `${id}-lessons`;
  return (
    <li
      id={id}
      className={`scroll-mt-4 rounded-2xl border-[1.5px] ${open ? "border-accent bg-surface" : "border-border"}`}
    >
      <h4 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={lessonsId}
          onClick={onToggle}
          className="flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-2xl bg-transparent px-3.5 py-2.5 text-left font-[inherit] text-fg"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            {open && <MiniHoneycomb mod={mod} progress={progress} small />}
            <span className="text-[14px] leading-[1.3] font-bold text-muted">
              Module {mod.number}
              {open && status.started && !status.finished && ` · ${status.label}`}
            </span>
            <span className="display text-[18px] leading-[1.2] font-extrabold">{mod.title}</span>
          </span>
          {!open && (status.finished || status.started) && <StatusLabel status={status} />}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`flex-none fill-none stroke-[2.5] ${open ? "rotate-180 stroke-accent" : "stroke-muted"}`}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h4>
      <div id={lessonsId} hidden={!open} className="px-2 pb-2.5">
        <ol className="m-0 flex list-none flex-col gap-0.5 p-0">
          {mod.lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} progress={progress} compact />
          ))}
          {mod.quiz && <QuizRow quiz={mod.quiz} module={mod.number} result={progress.results[mod.quiz.id]} compact />}
          {mod.skillsCheck && (
            <SkillsCheckRow
              check={mod.skillsCheck}
              module={mod.number}
              result={progress.results[mod.skillsCheck.id]}
              compact
            />
          )}
        </ol>
        {mod.lessons.some((lesson) => lesson.requiresAccount) && <HandsOnNote className="mx-2 mt-2" onSurface />}
      </div>
    </li>
  );
}

// ---- Rows ----

type RowShape = { state: "done" | "next" | "todo" | "quiz-done" | "quiz" | "check"; mark: string };

/**
 * A row on the lesson list. The title link stretches over the whole row, so
 * the row is one link.
 */
function Row({
  href,
  shape,
  srPrefix,
  title,
  meta,
  highlight = false,
  action,
  compact = false,
}: {
  href: string;
  shape: RowShape;
  srPrefix: string;
  title: string;
  meta: React.ReactNode;
  highlight?: boolean;
  action?: string;
  compact?: boolean;
}) {
  return (
    <li
      className={`relative flex items-center rounded-[14px] has-[.row-link:focus-visible]:outline-3 has-[.row-link:focus-visible]:outline-offset-3 has-[.row-link:focus-visible]:outline-accent ${
        compact ? "min-h-12 gap-3 px-2 py-1" : "min-h-14 gap-4 px-3.5 py-1.5"
      } ${highlight ? "bg-tint" : "hover:bg-surface"}`}
    >
      <RowHex shape={shape} compact={compact} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Link
          href={href}
          className={`row-link font-bold text-fg no-underline after:absolute after:inset-0 after:rounded-[14px] hover:text-fg focus-visible:outline-none ${
            compact ? "text-[17px] leading-[1.3]" : "display text-[19px] leading-[1.3]"
          }`}
        >
          <span className="sr-only">{srPrefix}</span>
          {title}
        </Link>
        <span
          className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 leading-[1.4] text-muted ${compact ? "text-[15px]" : "text-[16px]"}`}
        >
          {meta}
        </span>
      </span>
      {action &&
        (compact ? (
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="flex-none fill-none stroke-accent stroke-[2.5]">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          // Looks like a button; a click lands on the row's link underneath.
          <span aria-hidden="true" className="btn btn-primary min-h-11 flex-none px-5 text-[16px]">
            {action}
          </span>
        ))}
    </li>
  );
}

function LessonRow({ lesson, progress, compact = false }: { lesson: OutlineLesson; progress: Progress; compact?: boolean }) {
  const done = progress.done.has(lesson.id);
  const next = lesson.id === progress.nextId;
  const state = done ? "done" : next ? "next" : "todo";
  const words = { done: "done", next: progress.startedCourse ? "up next" : "start here", todo: "not started" }[state];
  return (
    <Row
      href={lesson.href}
      shape={{ state, mark: String(lesson.number) }}
      srPrefix={`Lesson ${lesson.number}, ${words}: `}
      title={lesson.title}
      highlight={next}
      action={next ? (progress.startedCourse ? "Continue" : "Start") : undefined}
      compact={compact}
      meta={
        <>
          <span>
            {lesson.duration} min
            {compact && next && <span aria-hidden="true"> · {progress.startedCourse ? "up next" : "start here"}</span>}
          </span>
          {lesson.requiresAccount && <LaptopIcon label="Hands-on: needs access" />}
          {lesson.hasPractice && <span className="font-bold text-accent">Includes practice</span>}
          <LevelLabel level={levelOf(progress.levels, lesson.id)} />
        </>
      }
    />
  );
}

function QuizRow({
  quiz,
  module,
  result,
  compact = false,
}: {
  quiz: OutlineQuiz;
  module: number;
  result: QuizResult | undefined;
  compact?: boolean;
}) {
  return (
    <Row
      href={quiz.href}
      shape={{ state: result ? "quiz-done" : "quiz", mark: "?" }}
      srPrefix={result ? "Taken: " : ""}
      title={`Module ${module} quiz`}
      compact={compact}
      meta={
        <>
          <span>{formatCount(quiz.questions, "question")}</span>
          {result && (
            <span className="font-bold text-fg">
              Last try: {result.correct} of {result.total}
            </span>
          )}
        </>
      }
    />
  );
}

function SkillsCheckRow({
  check,
  module,
  result,
  compact = false,
}: {
  check: OutlineQuiz;
  module: number;
  result: QuizResult | undefined;
  compact?: boolean;
}) {
  const range = module === 1 ? "Module 1" : `Modules 1 to ${module}`;
  return (
    <Row
      href={check.href}
      shape={{ state: "check", mark: "" }}
      srPrefix=""
      title="Check your skills"
      compact={compact}
      meta={
        <>
          <span>
            {check.questions > 0
              ? `A mixed quiz on ${range}, and a checklist for your final project`
              : "A checklist for your final project"}
          </span>
          {result && (
            <span className="font-bold text-fg">
              Last try: {result.correct} of {result.total}
            </span>
          )}
        </>
      }
    />
  );
}

// accent fill + check = done · accent ring = next · grey ring = not started.
function RowHex({ shape, compact }: { shape: RowShape; compact: boolean }) {
  const hex = {
    done: "fill-accent stroke-accent stroke-[1.5]",
    "quiz-done": "fill-accent stroke-accent stroke-[1.5]",
    next: "fill-surface stroke-accent stroke-2",
    todo: "fill-surface stroke-pip stroke-[1.5]",
    quiz: "fill-surface stroke-pip stroke-[1.5]",
    check: "fill-tint stroke-accent stroke-[1.5]",
  }[shape.state];
  const text = shape.state === "next" ? "text-accent" : "text-muted";
  const size = compact ? "h-8 w-7" : "h-[38px] w-[34px]";
  return (
    <span aria-hidden="true" className={`relative block flex-none ${size}`}>
      <Hex width={compact ? 28 : 34} height={compact ? 32 : 38} shape={hex} className="block">
        {(shape.state === "done" || shape.state === "quiz-done") && <HexCheck className="stroke-on-accent stroke-[2.4]" />}
        {shape.state === "check" && <HexCheck className="stroke-accent stroke-2" />}
      </Hex>
      {(shape.state === "next" || shape.state === "todo" || shape.state === "quiz") && (
        <span
          className={`absolute inset-0 grid place-items-center font-sans leading-none font-bold tabular-nums ${text} ${compact ? "text-[14px]" : "text-[16px]"}`}
        >
          {shape.mark}
        </span>
      )}
    </span>
  );
}

// ---- Hands-on ----

/** The laptop that marks a hands-on lesson. Labelled, so it's never just a picture. */
function LaptopIcon({ label }: { label: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" role="img" aria-label={label} className="flex-none">
      <title>{label}</title>
      <rect x="4" y="5" width="16" height="11" rx="1.5" className="fill-none stroke-current stroke-2" />
      <path d="M2 19h20" strokeLinecap="round" className="fill-none stroke-current stroke-2" />
    </svg>
  );
}

/** The one explanation of the laptop icon, next to the lessons it marks. */
function HandsOnNote({ className = "", onSurface = false }: { className?: string; onSurface?: boolean }) {
  return (
    <p className={`m-0 flex items-start gap-2.5 rounded-xl ${onSurface ? "bg-surface2" : "bg-surface"} px-3.5 py-3 text-[16px] leading-[1.45] ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="mt-px flex-none text-accent">
        <rect x="4" y="5" width="16" height="11" rx="1.5" className="fill-none stroke-current stroke-2" />
        <path d="M2 19h20" strokeLinecap="round" className="fill-none stroke-current stroke-2" />
      </svg>
      <span>
        Hands-on: needs a laptop and access. <Link href="/access">How access works</Link>
      </span>
    </p>
  );
}
