"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import { MasteryHex } from "@/components/mastery";
import { LEVELS, LEVEL_NAMES, type Level, type LevelChange, atModuleCeiling, levelOf } from "@/lib/mastery";
import { drawMixed, shuffle, type DrawGroup, type QuizLesson, type QuizQuestion } from "@/lib/quiz";
import { saveMastery, saveQuizResult, useMastery, useQuizResults } from "@/lib/quiz-results";
import { formatDate } from "@/lib/format";

type Props = {
  /** Where the last result is saved: "module-1/quiz". */
  id: string;
  /** The card's label, like "Module 1 quiz". */
  label: string;
  /** A module quiz asks all of these, in order. */
  questions: QuizQuestion[];
  /**
   * Check your skills: draw questions from `questions` in these groups, fresh
   * on every attempt (after hydration, so server and browser agree).
   */
  draw?: readonly DrawGroup[];
  /** Heading level for the question number and the summary. */
  level?: 2 | 3;
  /**
   * Module quizzes: the Check your skills page that asks about this module,
   * where a lesson this quiz took to Proficient can go on to Mastered.
   */
  masterAt?: { href: string; label: string };
};

type Item = { question: QuizQuestion; options: string[] };

type Run = {
  items: Item[];
  index: number;
  choice: string | null;
  checked: boolean;
  /** One entry per checked question: was it right? */
  right: boolean[];
  done: boolean;
  /** Counts restarts, so each attempt gets fresh radio buttons. */
  attempt: number;
  /** Once done: how the attempt moved each lesson's mastery level. */
  changes: LevelChange[];
};

type Focus = "question" | "next" | "summary";

// An attempt in progress survives leaving the page (say, to open a "Review"
// link) and coming back with the Back button. Memory only: a full reload
// starts again, which also keeps the first render the same as the server's.
const inProgress = new Map<string, { run: Run | null; started: boolean }>();

function newRun(questions: QuizQuestion[], shuffled: boolean, attempt: number): Run {
  return {
    // The first attempt uses the order the options are written in; Try again shuffles them.
    items: questions.map((question) => ({
      question,
      options: shuffled ? shuffle(question.options) : question.options,
    })),
    index: 0,
    choice: null,
    checked: false,
    right: [],
    done: false,
    attempt,
    changes: [],
  };
}

export function ModuleQuiz({ id, label, questions, draw, level = 2, masterAt }: Props) {
  const uid = useId();
  const Heading = level === 2 ? "h2" : "h3";
  const mixed = draw !== undefined;
  // "module-5/check-your-skills" → /#module-5 on the home page's course grid.
  const levelsHref = `/#module-${/^module-(\d+)\//.exec(id)?.[1] ?? 1}`;
  const { results, ready } = useQuizResults();
  const { levels } = useMastery();
  const saved = results[id] ?? null;

  const [run, setRun] = useState<Run | null>(
    () => inProgress.get(id)?.run ?? (mixed ? null : newRun(questions, false, 0)),
  );
  // True once the learner has done anything. Until then, a saved result
  // from an earlier visit is shown instead of question 1.
  const [started, setStarted] = useState(() => inProgress.get(id)?.started ?? false);

  useEffect(() => {
    inProgress.set(id, { run, started });
  }, [id, run, started]);

  // Check your skills with no saved result: pick the questions now.
  const needsDraw = mixed && ready && !saved && run === null;
  useEffect(() => {
    if (needsDraw && draw !== undefined) setRun(newRun(drawMixed(questions, draw), false, 0));
  }, [needsDraw, questions, draw]);

  // Move focus after the learner acts (never on load), so keyboard and
  // screen reader users land on what just appeared.
  const focusNext = useRef<Focus | null>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const target = focusNext.current;
    if (!target) return;
    focusNext.current = null;
    ({ question: questionRef, next: nextRef, summary: summaryRef })[target].current?.focus();
  });

  const lessons = useMemo(() => new Map(questions.map((q) => [q.lesson.id, q.lesson])), [questions]);
  const lessonName = (lesson: QuizLesson) => (mixed ? `Module ${lesson.module}: ${lesson.title}` : lesson.title);

  function tryAgain() {
    setStarted(true);
    const next = draw !== undefined ? drawMixed(questions, draw) : questions;
    setRun(newRun(next, true, (run?.attempt ?? 0) + 1));
    focusNext.current = "question";
  }

  function choose(option: string) {
    if (!run || run.checked) return;
    setStarted(true);
    setRun({ ...run, choice: option });
  }

  function check(event: FormEvent) {
    event.preventDefault();
    if (!run || run.checked || run.choice === null) return;
    const { question } = run.items[run.index];
    setRun({ ...run, checked: true, right: [...run.right, run.choice === question.answer] });
    focusNext.current = "next";
  }

  function next() {
    if (!run) return;
    if (run.index + 1 < run.items.length) {
      setRun({ ...run, index: run.index + 1, choice: null, checked: false });
      focusNext.current = "question";
      return;
    }
    const review = [
      ...new Set(run.items.filter((_, i) => !run.right[i]).map((item) => item.question.lesson.id)),
    ];
    const changes = saveMastery(
      run.items.map((item, i) => ({ lesson: item.question.lesson.id, right: run.right[i] })),
      mixed ? "mixed" : "module",
    );
    saveQuizResult(id, {
      correct: run.right.filter(Boolean).length,
      total: run.items.length,
      review,
      date: new Date().toISOString(),
    });
    setRun({ ...run, done: true, changes });
    focusNext.current = "summary";
  }

  let body: ReactNode;
  let pips: ReactNode = null;

  if (ready && saved && !started) {
    body = (
      <Summary
        heading={
          <Heading ref={summaryRef} tabIndex={-1} className={SUMMARY_HEADING}>
            Last time, you got {saved.correct} of {saved.total}.
          </Heading>
        }
        note={`Saved on this device on ${formatDate(saved.date)}.`}
        allRight={saved.correct === saved.total}
        rows={saved.review.flatMap((lessonId) => {
          const lesson = lessons.get(lessonId);
          return lesson ? [{ lesson, level: levelOf(levels, lessonId), change: null }] : [];
        })}
        rowsTitle={saved.review.length === 1 ? "Have another look at this lesson:" : "Have another look at these lessons:"}
        lessonName={lessonName}
        mixed={mixed}
        levelsHref={levelsHref}
        onTryAgain={tryAgain}
        celebrate={false}
      />
    );
  } else if (!run) {
    body = (
      <div role="status" className="flex items-center gap-4">
        <span aria-hidden="true" className="flex flex-none gap-1.5">
          {[0, 200, 400].map((delay) => (
            <span
              key={delay}
              className="box-border block size-4 rounded-[3px] border-2 border-line bg-marigold"
              style={{ animation: `cfaBreathe 1.4s ease-in-out ${delay}ms infinite` }}
            />
          ))}
        </span>
        <p className="m-0">Picking your questions...</p>
      </div>
    );
  } else if (run.done) {
    const correct = run.right.filter(Boolean).length;
    const rows = run.changes.flatMap((change) => {
      const lesson = lessons.get(change.lesson);
      return lesson ? [{ lesson, level: change.after, change }] : [];
    });
    const capped = masterAt && run.changes.some((change) => atModuleCeiling(change, mixed ? "mixed" : "module"));
    body = (
      <Summary
        heading={
          <Heading ref={summaryRef} tabIndex={-1} className={SUMMARY_HEADING}>
            You got {correct} of {run.items.length}.
          </Heading>
        }
        note="Saved on this device."
        allRight={correct === run.items.length}
        rows={rows}
        rowsTitle="Your skills"
        footnote={
          capped && (
            <p className="t-meta m-0 mt-3 text-muted">
              Proficient is as high as a module quiz goes. A lesson reaches Mastered when you get it right again in{" "}
              <Link href={masterAt.href}>{masterAt.label}</Link>.
            </p>
          )
        }
        lessonName={lessonName}
        mixed={mixed}
        levelsHref={levelsHref}
        onTryAgain={tryAgain}
        celebrate
      />
    );
  } else {
    const { question, options } = run.items[run.index];
    const isLast = run.index + 1 === run.items.length;
    const wasRight = run.right[run.index];
    pips = (
      // One segment per question, like a lesson's top bar: filled = answered, marigold = this one.
      <span aria-hidden="true" className="flex flex-wrap gap-1">
        {run.items.map((item, i) => (
          <span
            key={item.question.id}
            className={`box-border block h-3.5 w-6 rounded-[3px] border-2 border-line ${
              i < run.index || (i === run.index && run.checked) ? "bg-accent" : i === run.index ? "bg-marigold" : "bg-surface"
            }`}
          />
        ))}
      </span>
    );
    body = (
      <form key={`${run.attempt}-${run.index}`} onSubmit={check} className="flex flex-col gap-5">
        <Heading ref={questionRef} tabIndex={-1} className="kicker m-0 self-start outline-offset-4">
          Question {run.index + 1} of {run.items.length}
          {mixed && <span className="font-normal"> · from Module {question.module}</span>}
        </Heading>
        <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
          <legend className="mb-5 p-0 font-serif text-(length:--task) leading-[1.15] font-semibold tracking-[-.01em]">
            {question.question}
          </legend>
          {options.map((option) => (
            <Option
              key={option}
              name={`${uid}-choice`}
              option={option}
              chosen={run.choice === option}
              checked={run.checked}
              isAnswer={option === question.answer}
              onChoose={() => choose(option)}
            />
          ))}
        </fieldset>

        <div aria-live="polite">
          {run.checked &&
            (wasRight ? (
              <div className="on-sky flex flex-col gap-2 rounded-md border-2 border-line px-[18px] py-4" style={{ animation: "cfaRise 300ms ease both" }}>
                <p className="display m-0 flex items-center gap-2.5 text-[24px] leading-[1.2]">
                  <ResultMark right />
                  That&apos;s right.
                </p>
                <p className="m-0">{question.explanation}</p>
              </div>
            ) : (
              <div
                className="card-flat flex flex-col gap-2 px-[18px] py-4"
                style={{ animation: "cfaRise 300ms ease both" }}
              >
                <p className="display m-0 flex items-center gap-2.5 text-[24px] leading-[1.2]">
                  <ResultMark right={false} />
                  Not quite.
                </p>
                <p className="m-0">
                  The answer is: <strong>{question.answer}</strong>
                </p>
                <p className="m-0">{question.explanation}</p>
                <Link href={question.lesson.href} className="text-link">
                  Review: {lessonName(question.lesson)}
                </Link>
              </div>
            ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {run.checked ? (
            <button ref={nextRef} type="button" onClick={next} className="btn btn-primary">
              {isLast ? "See how you did" : "Next question"} <Icon name="arrow-right" size={20} stroke={2.6} />
            </button>
          ) : (
            <>
              <button type="submit" disabled={run.choice === null} className="btn btn-primary">
                Check answer
              </button>
              {run.choice === null && <span className="t-meta text-muted">Pick an answer, then check it.</span>}
            </>
          )}
        </div>
      </form>
    );
  }

  return (
    <section aria-labelledby={`${uid}-label`} className="card overflow-hidden text-fg">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b-2 border-line px-(--pad) py-4">
        <span id={`${uid}-label`} className="eyebrow leading-none">
          {label}
        </span>
        {pips}
      </div>
      <div className="p-(--pad)">{body}</div>
    </section>
  );
}

const SUMMARY_HEADING = "display m-0 self-start text-(length:--head) leading-[1.12] outline-offset-[6px]";

function Option({
  name,
  option,
  chosen,
  checked,
  isAnswer,
  onChoose,
}: {
  name: string;
  option: string;
  chosen: boolean;
  checked: boolean;
  isAnswer: boolean;
  onChoose: () => void;
}) {
  // Right and wrong are told apart by their words and icons below; the looks only back them up.
  const look = !checked
    ? "cursor-pointer border-line bg-surface hover:bg-paper-hover has-checked:bg-sky has-checked:shadow-h4"
    : isAnswer
      ? "border-line bg-sky"
      : chosen
        ? "border-dashed border-line bg-paper2"
        : "border-hairline text-muted";

  return (
    <label className={`flex min-h-14 items-center gap-3.5 rounded-md border-2 px-4 py-3 ${look}`}>
      <input
        type="radio"
        name={name}
        value={option}
        checked={chosen}
        disabled={checked}
        onChange={onChoose}
        className="m-0 size-5 flex-none accent-accent"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="[overflow-wrap:anywhere]">{option}</span>
        {checked && isAnswer && (
          <span className="flex items-center gap-1.5 text-[16px] leading-[1.4] font-bold text-fg">
            <ResultMark right small />
            {chosen ? "Your answer: right" : "Right answer"}
          </span>
        )}
        {checked && chosen && !isAnswer && (
          <span className="flex items-center gap-1.5 text-[16px] leading-[1.4] font-bold text-fg">
            <ResultMark right={false} small />
            Your answer
          </span>
        )}
      </span>
    </label>
  );
}

/** A filled square with a tick for right; an outlined one with a cross for wrong. Words always go with it. */
function ResultMark({ right, small = false }: { right: boolean; small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`box-border grid flex-none place-items-center rounded-[3px] border-2 border-line ${
        small ? "size-[18px]" : "size-7"
      } ${right ? "bg-accent text-on-accent" : "bg-surface text-fg"}`}
    >
      <Icon name={right ? "check" : "cross"} size={small ? 11 : 17} stroke={3.4} />
    </span>
  );
}

/** A lesson in the summary: its level now and, straight after a quiz, how the quiz moved it. */
type SkillRow = { lesson: QuizLesson; level: Level; change: LevelChange | null };

function Summary({
  heading,
  note,
  allRight,
  rows,
  rowsTitle,
  footnote = null,
  lessonName,
  mixed,
  levelsHref,
  onTryAgain,
  celebrate,
}: {
  heading: ReactNode;
  note: string;
  allRight: boolean;
  rows: SkillRow[];
  rowsTitle: string;
  footnote?: ReactNode;
  lessonName: (lesson: QuizLesson) => string;
  mixed: boolean;
  /** The course grid opened on this quiz's module, where the lesson levels show. */
  levelsHref: string;
  onTryAgain: () => void;
  celebrate: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          {heading}
          {allRight && celebrate && (
            <span aria-hidden="true" className="flex gap-[3px]">
              {[300, 420, 540].map((delay) => (
                <span
                  key={delay}
                  className="box-border block size-3.5 rounded-[2px] border-2 border-line bg-marigold"
                  style={{ animation: `cfaPop 500ms ${delay}ms both` }}
                />
              ))}
            </span>
          )}
        </div>
        <p className="t-meta m-0 text-muted">{note}</p>
      </div>

      {allRight && <p className="m-0">You got every question right. Well done.</p>}

      {rows.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="kicker m-0 mb-1">{rowsTitle}</p>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {rows.map((row) => (
              <li key={row.lesson.id} className="flex items-start gap-3">
                <MasteryHex level={row.level} width={22} height={24} className="mt-2.5 flex-none" />
                <span className="flex min-w-0 flex-col">
                  <Link href={row.lesson.href} className="text-link">
                    {lessonName(row.lesson)}
                  </Link>
                  <span className="t-meta -mt-2 text-muted">{describe(row)}</span>
                </span>
              </li>
            ))}
          </ul>
          {footnote}
        </div>
      )}

      <Link href={levelsHref} className="text-link gap-1.5">
        See your lesson levels <Icon name="arrow-right" size={17} stroke={2.6} />
      </Link>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 border-t-2 border-line pt-5">
        <button type="button" onClick={onTryAgain} className="btn btn-secondary">
          Try again
        </button>
        <span className="t-meta text-muted">
          {mixed ? "You'll get a new mix of questions." : "The answers come in a different order each time."}
        </span>
      </div>
    </div>
  );
}

/** "Up to Proficient", "Still Mastered", "Missed a question · down to Familiar", or just the level. */
function describe({ level, change }: SkillRow) {
  const name = LEVEL_NAMES[level];
  if (!change) return name;
  const rise = LEVELS.indexOf(change.after) - LEVELS.indexOf(change.before);
  if (!change.missed) return rise > 0 ? `Up to ${name}` : `Still ${name}`;
  // A miss never moves a lesson up, but a Not started one becomes Attempted.
  return `Missed a question · ${rise < 0 ? "down to" : rise > 0 ? "now" : "still"} ${name}`;
}

