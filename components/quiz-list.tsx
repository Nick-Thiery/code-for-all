"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { formatCount, formatDate } from "@/lib/format";
import { type Outline, type OutlineQuiz, allLessons, lessonLabel } from "@/lib/outline";
import { type QuizResult, useQuizResults } from "@/lib/quiz-results";

// The list on /quizzes: every released module quiz and Check your skills page,
// grouped by phase like the Contents page. It reads the same outline
// (content/module-N/quiz.yml, content/check-your-skills.yml) and the same
// saved results (lib/quiz-results.ts) as the quiz pages and the course grid,
// so a score is the same wherever it's shown. Before results load (and
// without JavaScript) it renders as a new visitor sees it.

type Entry = {
  kind: "module" | "skills";
  quiz: OutlineQuiz;
  /** The module the quiz belongs to, or comes after. */
  module: number;
  title: string;
};

export function QuizList({ outline }: { outline: Outline }) {
  const { results, ready } = useQuizResults();
  const lessons = new Map(allLessons(outline).map((lesson) => [lesson.id, lesson]));

  // Phases in course order, each with its released modules' quizzes and any
  // Check your skills page in its place, straight after its module.
  const phases = outline.phases
    .map((phase) => ({
      ...phase,
      entries: phase.modules.flatMap((planned): Entry[] => {
        const mod = outline.modules.find((m) => m.number === planned.number);
        if (!mod) return [];
        return [
          ...(mod.quiz ? [{ kind: "module" as const, quiz: mod.quiz, module: mod.number, title: mod.title }] : []),
          ...(mod.skillsCheck
            ? [{ kind: "skills" as const, quiz: mod.skillsCheck, module: mod.number, title: rangeOf(mod.number) }]
            : []),
        ];
      }),
    }))
    .filter((phase) => phase.entries.length > 0);

  const all = phases.flatMap((phase) => phase.entries);
  const taken = all.filter((entry) => results[entry.quiz.id]).length;
  const first = all.find((entry) => entry.kind === "module") ?? all[0];

  return (
    <>
      {ready &&
        (taken === 0 ? (
          first && <EmptyState first={first} />
        ) : (
          <p className="t-meta m-0 font-bold">
            {taken === all.length ? `You've taken all ${all.length}.` : `You've taken ${taken} of ${all.length}.`}{" "}
            <span className="font-normal text-muted">Scores are saved on this device.</span>
          </p>
        ))}

      {phases.map((phase) => (
        <section key={phase.number} aria-labelledby={`phase-${phase.number}`} className="rail-block flex flex-col">
          <h2 id={`phase-${phase.number}`} className="rail-label">
            Phase {phase.number} · {phase.title}
          </h2>
          <ol className="m-0 mt-5 flex list-none flex-col gap-5 p-0 wide:mt-0 desktop:gap-6">
            {phase.entries.map((entry) => (
              <QuizCard
                key={entry.quiz.id}
                entry={entry}
                result={results[entry.quiz.id]}
                reviewLabel={(id) => {
                  const lesson = lessons.get(id);
                  return lesson ? { href: lesson.href, label: lessonLabel(outline, lesson) } : null;
                }}
              />
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}

const rangeOf = (module: number) => (module === 1 ? "Module 1" : `Modules 1 to ${module}`);

function EmptyState({ first }: { first: Entry }) {
  return (
    <section aria-labelledby="no-quizzes" className="card-flat flex flex-col gap-3 p-(--pad)">
      <h2 id="no-quizzes" className="t-block m-0">
        No quizzes taken yet
      </h2>
      <p className="m-0">
        Every module ends with a short quiz on its lessons. Take one when you&apos;ve finished a module, and your last
        score shows up here, with the lessons worth another look.
      </p>
      <p className="t-meta m-0 text-muted">There are no grades. Scores are saved on this device only.</p>
      <Link href={first.quiz.href} className="btn btn-primary mt-2 self-start print:hidden">
        {first.kind === "module" ? `Start the Module ${first.module} quiz` : "Check your skills"}
        <Icon name="arrow-right" size={20} stroke={2.6} />
      </Link>
    </section>
  );
}

function QuizCard({
  entry,
  result,
  reviewLabel,
}: {
  entry: Entry;
  result: QuizResult | undefined;
  reviewLabel: (lessonId: string) => { href: string; label: string } | null;
}) {
  const { kind, quiz, module, title } = entry;
  const headingId = `${quiz.id.replace("/", "-")}-title`;
  const checklistOnly = kind === "skills" && quiz.questions === 0;
  const review = result ? result.review.flatMap((id) => reviewLabel(id) ?? []) : [];
  const name = kind === "module" ? `the Module ${module} quiz` : `Check your skills: ${title}`;

  return (
    <li
      aria-labelledby={headingId}
      className={`card flex flex-col gap-4 p-5 shadow-h5 tablet:flex-row tablet:items-start tablet:justify-between tablet:gap-6 desktop:p-6 desktop:shadow-h6 ${
        kind === "skills" ? "on-sky" : ""
      }`}
    >
      <div className="flex min-w-0 flex-col gap-2">
        <span className="eyebrow">{kind === "module" ? `Module ${module} quiz` : "Check your skills"}</span>
        <h3 id={headingId} className="m-0 font-serif text-[26px] leading-[1.12] font-medium desktop:text-[30px]">
          {kind === "module" ? (
            <>
              <span className="sr-only">Module {module}: </span>
              {title}
            </>
          ) : (
            title
          )}
        </h3>
        <p className="t-meta m-0 text-muted">
          {checklistOnly
            ? "A checklist for your final project"
            : kind === "module"
              ? `${formatCount(quiz.questions, "question")} on this module's lessons`
              : `${formatCount(quiz.questions, "question")} mixed from ${title}, and a checklist for your final project`}
        </p>

        {!checklistOnly && (
          <p className="m-0 mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            {result ? (
              <>
                <span className="chip">
                  Last score: {result.correct} of {result.total}
                </span>
                <span className="t-meta text-muted">on {formatDate(result.date)}</span>
              </>
            ) : (
              <span className="chip">Not started</span>
            )}
          </p>
        )}

        {result &&
          (review.length > 0 ? (
            <div className="mt-1 flex flex-col gap-1">
              <p className="t-meta m-0 font-bold">
                {review.length === 1 ? "Have another look at this lesson:" : "Have another look at these lessons:"}
              </p>
              <ul className="m-0 flex list-none flex-col p-0">
                {review.map((lesson) => (
                  <li key={lesson.href}>
                    <Link href={lesson.href} className="text-link min-h-10 text-[16px] font-normal">
                      {lesson.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="t-meta m-0 mt-1">Every answer right last time. Nothing to review.</p>
          ))}
      </div>

      <Link
        href={quiz.href}
        className={`btn ${result ? "btn-secondary" : "btn-primary"} flex-none self-start print:hidden`}
      >
        {checklistOnly ? "Open" : result ? "Retake" : "Start"}
        <span className="sr-only"> {name}</span>
        <Icon name="arrow-right" size={20} stroke={2.6} />
      </Link>
    </li>
  );
}
