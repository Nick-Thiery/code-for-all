"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/icons";
import { LevelChip, ModuleMastery } from "@/components/mastery";
import { formatAbout, formatCount, numberWord } from "@/lib/format";
import { type Levels, levelOf } from "@/lib/mastery";
import {
  type Outline,
  type OutlineLesson,
  type OutlineModule,
  type OutlinePhase,
  type OutlineQuiz,
  allLessons,
  courseCertificateHref,
  moduleHref,
  resumeTarget,
} from "@/lib/outline";
import { useCompletedLessons } from "@/lib/progress";
import { type QuizResult, useMastery, useQuizResults } from "@/lib/quiz-results";

// The Contents page (app/contents/page.tsx; design/cover: a magazine contents page on navy).
// A "pick up where you left off" card, then every module by phase: big
// italic numbers, titles with their one-line summaries, lesson counts, Check your skills in marigold
// italic, and a stamp on a phase that isn't out yet. From 960px the modules
// are buttons that choose which module's lessons show below them; under that,
// each module opens and closes in place. The learner's current module is
// chosen at first; /contents#module-N picks another.
//
// Progress comes from lib/progress.ts and lib/quiz-results.ts, unchanged.
// Lesson rows also show each lesson's mastery level, and the chosen module
// its mastery % (components/mastery.tsx, lib/mastery.ts).
// Before it loads (and without JavaScript) this renders as a new visitor
// sees it.

type Progress = {
  done: Set<string>;
  results: Record<string, QuizResult>;
  /** Mastery level per lesson id (lib/mastery.ts). */
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

  // Lesson, quiz and Check your skills pages link back to /contents#module-N.
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
  // into view: the lesson panel from 960px, the opened module below that.
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
  const moduleCount = outline.phases.reduce((sum, phase) => sum + phase.modules.length, 0);
  const columns = splitInTwo(outline.phases);

  return (
    <div className="flex flex-col gap-[30px] desktop:gap-14">
      <div className="flex flex-col gap-2 desktop:flex-row desktop:items-end desktop:justify-between desktop:gap-10">
        <div className="flex flex-col gap-2 desktop:gap-2.5">
          <span className="overline-serif text-on-navy-muted">
            {numberWord(moduleCount)} modules in {numberWord(outline.phases.length).toLowerCase()} phases
          </span>
          <h1 id={`${uid}-title`} className="t-hero m-0">
            Contents
          </h1>
        </div>
        <p className="m-0 mt-1.5 text-[14px] leading-[1.4] text-on-navy-muted desktop:mt-0 desktop:pb-3.5 desktop:font-display desktop:text-[15px] desktop:font-bold desktop:tracking-[.14em] desktop:uppercase desktop:[font-stretch:85%]">
          Your progress saves on this device<span className="desktop:hidden">.</span>
        </p>
      </div>

      <ContinueCard outline={outline} progress={progress} resume={resume} />

      <section aria-labelledby={`${uid}-title`} className="flex flex-col gap-5 desktop:gap-7">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <p className="m-0 text-[16px] leading-[1.5] text-muted desktop:text-[17px]">
            <span className="desktop:hidden">Tap a module to see its lessons</span>
            <span className="hidden desktop:inline">Pick a module to see its lessons</span>
          </p>
          <Link href="/quizzes" prefetch={false} className="text-link gap-1.5 text-[16px] desktop:text-[17px] print:hidden">
            See all quizzes <Icon name="arrow-right" size={18} stroke={2.6} />
          </Link>
        </div>

        {/* 960px and up: two columns of modules, then the chosen module's lessons. */}
        <div className="hidden grid-cols-2 items-start gap-x-20 desktop:grid">
          {columns.map((phases, column) => (
            <div key={column} className="flex flex-col gap-[26px]">
              {phases.map((phase) => (
                <div key={phase.number} className="flex flex-col">
                  <PhaseLabel phase={phase} />
                  {phase.modules.map((m) => {
                    const mod = outline.modules.find((x) => x.number === m.number);
                    return mod && m.released ? (
                      <div key={m.number} className="flex flex-col">
                        <ModuleRow
                          mod={mod}
                          progress={progress}
                          current={m.number === currentModule}
                          selected={m.number === selected}
                          controls={panelId}
                          onPick={() => setPicked(m.number)}
                        />
                        {mod.skillsCheck && <SkillsCheckLink check={mod.skillsCheck} module={mod.number} />}
                      </div>
                    ) : (
                      <ComingSoonRow
                        key={m.number}
                        number={m.number}
                        title={m.title}
                        summary={m.summary}
                        labelled={phase.modules.some((x) => x.released)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
        {selectedModule && <ModulePanel id={panelId} mod={selectedModule} progress={progress} />}

        {/* Below 960px: one list, each module opens in place. */}
        <div className="flex flex-col gap-[22px] desktop:hidden">
          {outline.phases.map((phase) => (
            <div key={phase.number} className="flex flex-col">
              <PhaseLabel phase={phase} />
              <ul className="m-0 flex list-none flex-col p-0">
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
                      <ComingSoonRow
                        number={m.number}
                        title={m.title}
                        summary={m.summary}
                        labelled={phase.modules.some((x) => x.released)}
                      />
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

/** Phases dealt into two columns of about the same length, keeping their order. */
function splitInTwo(phases: OutlinePhase[]): OutlinePhase[][] {
  const total = phases.reduce((sum, phase) => sum + phase.modules.length, 0);
  const left: OutlinePhase[] = [];
  const right: OutlinePhase[] = [];
  let count = 0;
  for (const phase of phases) {
    if (right.length === 0 && (left.length === 0 || count + phase.modules.length <= total / 2)) {
      left.push(phase);
      count += phase.modules.length;
    } else right.push(phase);
  }
  return right.length > 0 ? [left, right] : [left];
}

const twoDigits = (n: number) => String(n).padStart(2, "0");

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
    cta = lastModule ? { href: courseCertificateHref, label: "Get your course certificate" } : null;
  }

  return (
    <div className="on-surface flex flex-col gap-4 rounded-md border-2 border-line bg-paper p-[22px] shadow-h6 desktop:flex-row desktop:flex-wrap desktop:items-center desktop:gap-x-10 desktop:px-8 desktop:py-7 desktop:shadow-h8">
      <div className="flex min-w-0 flex-col gap-1.5 desktop:flex-[1_1_300px]">
        <span className="eyebrow">{eyebrow}</span>
        {where && <span className="t-meta text-muted">{where}</span>}
        <span className="font-serif text-[28px] leading-[1.08] font-medium tracking-[-.01em] desktop:text-[36px]">{title}</span>
      </div>
      <div className="flex flex-col gap-2 desktop:w-[280px]">
        <span className="t-meta font-bold">
          {progress.startedCourse
            ? `${doneCount} of ${formatCount(lessons.length, "lesson")} done`
            : `${formatCount(lessons.length, "lesson")} out so far`}
        </span>
        <span aria-hidden="true" className="box-border block h-3.5 overflow-hidden rounded-[3px] border-2 border-line bg-surface">
          <span
            className="block h-full bg-accent"
            style={{ width: `${lessons.length ? (100 * doneCount) / lessons.length : 0}%` }}
          />
        </span>
        {/* Progress lives on this device; /move-progress carries it to another. */}
        <Link href="/move-progress" className="text-link min-h-9 text-[15px]">
          {progress.startedCourse ? "Move my progress to another device" : "Got progress on another device?"}
        </Link>
      </div>
      {cta && (
        <Link href={cta.href} className="btn btn-primary">
          {cta.label} <Icon name="arrow-right" size={20} stroke={2.6} />
        </Link>
      )}
    </div>
  );
}

/** The phase's kicker under a cream rule. A phase with nothing out yet gets the stamp. */
function PhaseLabel({ phase }: { phase: OutlinePhase }) {
  const opening = phase.modules.every((m) => !m.released);
  return (
    <h2 className="relative m-0 border-t-4 border-on-navy pt-2.5 pb-3 font-display text-[13px] leading-[1.35] font-extrabold tracking-[.12em] text-marigold uppercase [font-stretch:85%] desktop:pt-3 desktop:pb-3.5 desktop:text-[16px]">
      Phase {phase.number} · {phase.title}
      {opening && (
        <span className="mt-2 block w-fit -rotate-3 rounded border-[2.5px] border-marigold px-3 py-1.5 text-[13px] desktop:absolute desktop:top-[18px] desktop:right-0 desktop:mt-0 desktop:-rotate-[4deg] desktop:text-[14px]">
          Opening soon
        </span>
      )}
    </h2>
  );
}

/** Where a module stands, for its row. */
function moduleStatus(mod: OutlineModule, progress: Progress, current: boolean) {
  const total = mod.lessons.length;
  const count = mod.lessons.filter((lesson) => progress.done.has(lesson.id)).length;
  if (count === total) return { count, label: "Done", started: true, finished: true };
  if (count > 0) return { count, label: `${count} of ${total} done`, started: true, finished: false };
  if (current) return { count, label: progress.startedCourse ? "Up next" : "Start here", started: false, finished: false };
  return { count, label: "Not started", started: false, finished: false };
}

const ROW = "flex w-full items-baseline gap-3.5 border-0 border-b border-rule-on-navy bg-transparent py-3 text-left font-[inherit] desktop:gap-[22px] desktop:py-3.5";
const ROW_NUMBER = "w-[42px] flex-none font-serif text-[36px] leading-[.9] italic desktop:w-16 desktop:text-[54px]";
const ROW_TITLE = "font-serif text-[22px] leading-[1.2] font-medium desktop:text-[30px] desktop:leading-[1.15]";
/** The small text on a module's row: its summary, lesson count or progress, and "Coming soon". */
const ROW_NOTE = "text-[13px] leading-[1.3] desktop:text-[15px]";

/**
 * A module's title with its one-line summary under it (content/course.yml).
 * A row's number lines up with the title's first line. The hidden full stop
 * keeps the two apart in the row's accessible name.
 */
function RowTitle({
  title,
  summary,
  className = "",
  dimmed = false,
}: {
  title: string;
  summary: string;
  className?: string;
  /** A Coming soon row: the summary takes the row's dimmed colour, like its title. */
  dimmed?: boolean;
}) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-1">
      <span className={`${ROW_TITLE} ${className}`}>
        {title}
        <span className="sr-only">.</span>
      </span>
      <span className={`${ROW_NOTE} ${dimmed ? "" : "text-muted"}`}>{summary}</span>
    </span>
  );
}

/** A module in the contents, from 960px: a button that shows its lessons in the panel. */
function ModuleRow({
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
    <button type="button" aria-pressed={selected} aria-controls={controls} onClick={onPick} className={`${ROW} group cursor-pointer text-fg`}>
      <span aria-hidden="true" className={`${ROW_NUMBER} ${selected ? "text-marigold" : "text-on-navy-muted"}`}>
        {twoDigits(mod.number)}
      </span>
      <span className="sr-only">Module {mod.number}: </span>
      <RowTitle
        title={mod.title}
        summary={mod.summary}
        className={`decoration-2 underline-offset-[6px] group-hover:underline ${selected ? "underline decoration-marigold" : ""}`}
      />
      <RowStatus mod={mod} status={status} />
      {selected && <Icon name="arrow-down" size={18} stroke={2.6} className="self-center text-marigold" />}
    </button>
  );
}

/** The right-hand end of a module's row: a stamp if it's the one to start, its progress, or its lesson count. */
function RowStatus({ mod, status }: { mod: OutlineModule; status: ReturnType<typeof moduleStatus> }) {
  if (!status.started && status.label !== "Not started") {
    return <span className="stamp flex-none self-center max-desktop:px-2 max-desktop:text-[11px]">{status.label}</span>;
  }
  return (
    <span className={`${ROW_NOTE} flex flex-none items-center gap-1.5 self-center whitespace-nowrap text-muted`}>
      {status.finished && <Icon name="check" size={16} stroke={3} className="text-marigold" />}
      {status.started ? status.label : formatCount(mod.lessons.length, "lesson")}
    </span>
  );
}

/** Check your skills, in marigold italic, after the module it follows. */
function SkillsCheckLink({ check, module }: { check: OutlineQuiz; module: number }) {
  const range = module === 1 ? "Module 1" : `Modules 1 to ${module}`;
  return (
    <Link
      href={check.href}
      className="flex min-h-[54px] items-center pl-14 font-serif text-[19px] leading-[1.2] text-marigold italic no-underline decoration-2 underline-offset-[6px] hover:text-marigold hover:underline desktop:min-h-[62px] desktop:pl-[86px] desktop:text-[24px]"
    >
      Check your skills: {range}
    </Link>
  );
}

/** A module that isn't out yet: dimmed, and a link to its Coming soon page. */
function ComingSoonRow({
  number,
  title,
  summary,
  labelled,
}: {
  number: number;
  title: string;
  summary: string;
  labelled: boolean;
}) {
  return (
    <Link href={moduleHref(number)} className={`${ROW} group text-on-navy-soft no-underline hover:text-on-navy`}>
      <span aria-hidden="true" className={`${ROW_NUMBER} text-on-navy-dim`}>
        {twoDigits(number)}
      </span>
      <span className="sr-only">Module {number}: </span>
      <RowTitle title={title} summary={summary} className="decoration-2 underline-offset-[6px] group-hover:underline" dimmed />
      {/* When the whole phase is on its way, its stamp says so for every row. */}
      <span className={labelled ? `${ROW_NOTE} flex-none self-center whitespace-nowrap` : "sr-only"}>
        {labelled ? "Coming soon" : " (coming soon)"}
      </span>
    </Link>
  );
}

/** The chosen module's lessons, under the contents (960px and up): a paper card on the navy. */
function ModulePanel({ id, mod, progress }: { id: string; mod: OutlineModule; progress: Progress }) {
  const doneCount = mod.lessons.filter((lesson) => progress.done.has(lesson.id)).length;
  const minutes = mod.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={`${id}-title`}
      className="on-surface hidden scroll-mt-6 gap-x-12 rounded-md border-2 border-line bg-paper p-8 shadow-h8 desktop:flex"
    >
      <div className="flex w-[300px] flex-none flex-col gap-3">
        <h2 id={`${id}-title`} className="m-0 flex flex-col gap-2">
          <span className="eyebrow">Module {mod.number}</span>
          <span className="font-serif text-[40px] leading-[1.04] font-medium tracking-[-.02em]">{mod.title}</span>
        </h2>
        <p className="m-0 text-[18px] leading-[1.5]">{mod.summary}</p>
        <p className="t-meta m-0 text-muted">
          {formatCount(mod.lessons.length, "lesson")} · {formatAbout(minutes)}
          {doneCount > 0 && ` · ${doneCount} done`}
        </p>
        {mod.lessons.some((lesson) => lesson.requiresAccount) && <HandsOnNote className="mt-3" />}
        <ModuleMastery lessons={mod.lessons} className="mt-3" />
      </div>
      <ol className="m-0 flex min-w-0 flex-1 list-none flex-col border-b-2 border-line p-0">
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

/** A module below 960px: a button that opens its lessons in place. */
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
    <li id={id} className="scroll-mt-4">
      <h3 className="m-0 [text-wrap:wrap]">
        <button type="button" aria-expanded={open} aria-controls={lessonsId} onClick={onToggle} className={`${ROW} cursor-pointer text-fg`}>
          <span aria-hidden="true" className={`${ROW_NUMBER} ${open ? "text-marigold" : "text-on-navy-muted"}`}>
            {twoDigits(mod.number)}
          </span>
          <span className="sr-only">Module {mod.number}: </span>
          <RowTitle title={mod.title} summary={mod.summary} />
          <RowStatus mod={mod} status={status} />
          <Icon
            name="arrow-down"
            size={18}
            stroke={2.6}
            className={`self-center transition-transform ${open ? "rotate-180 text-marigold" : "text-on-navy-muted"}`}
          />
        </button>
      </h3>
      <div id={lessonsId} hidden={!open} className="pt-3 pb-5">
        <div className="on-surface rounded-md border-2 border-line bg-paper px-3.5 pt-1 pb-4 shadow-h5">
          <ol className="m-0 flex list-none flex-col border-b-2 border-line p-0">
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
          {mod.lessons.some((lesson) => lesson.requiresAccount) && <HandsOnNote className="mt-4" />}
          <ModuleMastery lessons={mod.lessons} className="mt-4" />
        </div>
      </div>
      {mod.skillsCheck && <SkillsCheckLink check={mod.skillsCheck} module={mod.number} />}
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
      className={`relative flex items-center border-t-2 border-line first:border-t-0 has-[.row-link:focus-visible]:outline-3 has-[.row-link:focus-visible]:-outline-offset-3 has-[.row-link:focus-visible]:outline-focus ${
        compact ? "min-h-14 gap-3 px-1.5 py-2" : "min-h-16 gap-4 px-3 py-2.5"
      } ${highlight ? "bg-sky" : "hover:bg-paper-hover"}`}
    >
      <RowMark shape={shape} compact={compact} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Link
          href={href}
          className={`row-link font-serif font-semibold text-fg no-underline after:absolute after:inset-0 hover:text-fg focus-visible:outline-none ${
            compact ? "text-[19px] leading-[1.2]" : "text-[22px] leading-[1.2]"
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
          <Icon name="arrow-right" size={20} stroke={2.6} className="text-fg" />
        ) : (
          // Looks like a button; a click lands on the row's link underneath.
          <span aria-hidden="true" className="btn btn-primary min-h-11 flex-none px-4 text-[15px] shadow-h3">
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
  const level = levelOf(progress.levels, lesson.id);
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
          {lesson.hasPractice && <span className="font-bold text-fg">Includes practice</span>}
          {/* On phones (compact rows) the level chip gets its own line, so the row isn't cramped. */}
          {level !== "not-started" &&
            (compact ? (
              <span className="basis-full">
                <LevelChip level={level} />
              </span>
            ) : (
              <LevelChip level={level} />
            ))}
        </>
      }
    />
  );
}

/**
 * The module quiz, after its lessons: a card rather than a plain row, so it
 * stands out, with its question count and last score (lib/quiz-results.ts,
 * the same result the quiz page and /quizzes show). Like a row, the title
 * link stretches over the whole card.
 */
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
    <li className={`border-t-2 border-line first:border-t-0 ${compact ? "py-3" : "py-4"}`}>
      <div
        className={`card-flat relative flex items-center shadow-h3 hover:bg-paper-hover has-[.row-link:focus-visible]:outline-3 has-[.row-link:focus-visible]:outline-offset-2 has-[.row-link:focus-visible]:outline-focus ${
          compact ? "min-h-16 gap-3 px-2.5 py-3" : "min-h-[76px] gap-4 px-3.5 py-3"
        }`}
      >
        <RowMark shape={{ state: result ? "quiz-done" : "quiz", mark: "?" }} compact={compact} />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Link
            href={quiz.href}
            className={`row-link font-serif font-semibold text-fg no-underline after:absolute after:inset-0 hover:text-fg focus-visible:outline-none ${
              compact ? "text-[19px] leading-[1.2]" : "text-[22px] leading-[1.2]"
            }`}
          >
            <span className="sr-only">{result ? "Taken: " : ""}</span>
            Module {module} quiz
          </Link>
          <span
            className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 leading-[1.4] text-muted ${compact ? "text-[15px]" : "text-[16px]"}`}
          >
            <span>{formatCount(quiz.questions, "question")}</span>
            <span className="font-bold text-fg">
              {result ? `Last score: ${result.correct} of ${result.total}` : "Not taken yet"}
            </span>
          </span>
        </span>
        {compact ? (
          <Icon name="arrow-right" size={20} stroke={2.6} className="text-fg" />
        ) : (
          // Looks like a button; a click lands on the card's link underneath.
          <span
            aria-hidden="true"
            className={`btn ${result ? "btn-small" : "btn-primary min-h-11 px-4 text-[15px] shadow-h3"} flex-none print:hidden`}
          >
            {result ? "Retake" : "Start quiz"}
          </span>
        )}
      </div>
    </li>
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
              Last score: {result.correct} of {result.total}
            </span>
          )}
        </>
      }
    />
  );
}

// A square at the start of each row. Filled with a tick = done · marigold
// with the number = next · outlined with the number = not started.
function RowMark({ shape, compact }: { shape: RowShape; compact: boolean }) {
  const look = {
    done: "bg-accent text-on-accent",
    "quiz-done": "bg-accent text-on-accent",
    next: "bg-marigold text-on-marigold",
    todo: "bg-surface text-muted",
    quiz: "bg-surface text-muted",
    check: "bg-surface text-fg",
  }[shape.state];
  const ticked = shape.state === "done" || shape.state === "quiz-done" || shape.state === "check";
  return (
    <span
      aria-hidden="true"
      className={`box-border grid flex-none place-items-center rounded border-2 border-line font-display leading-none font-extrabold tabular-nums [font-stretch:85%] ${look} ${
        compact ? "size-8 text-[15px]" : "size-9 text-[17px]"
      }`}
    >
      {ticked ? <Icon name="check" size={compact ? 16 : 18} stroke={3.2} /> : shape.mark}
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
function HandsOnNote({ className = "" }: { className?: string }) {
  return (
    <p className={`m-0 flex items-start gap-2.5 rounded border-2 border-line bg-surface px-3.5 py-3 text-[16px] leading-[1.45] ${className}`}>
      <Icon name="laptop" size={22} stroke={2} className="mt-px text-accent" />
      <span>
        Hands-on: needs a laptop and access. <Link href="/access">How access works</Link>
      </span>
    </p>
  );
}
