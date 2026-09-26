"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { HEX_POINTS, Hex, HexCheck } from "@/components/hex";
import { LEVELS, LEVEL_NAMES, type Level, levelOf, masteryPercent } from "@/lib/mastery";
import { type Outline, allLessons, testedLessons } from "@/lib/outline";
import { useCompletedLessons } from "@/lib/progress";
import { useMastery } from "@/lib/quiz-results";

// A level is a hexagon that fills from the bottom as it goes up: an outline
// for Not started, a little for Attempted, half for Familiar, most of it for
// Proficient, all of it with a tick for Mastered. Its name always goes with it.
// Proficient stops below the hexagon's upper corners so it never looks full.
const FILL: Record<Level, number> = { "not-started": 0, attempted: 0.28, familiar: 0.5, proficient: 0.68, mastered: 1 };

const CORNERS = HEX_POINTS.split(" ").map((point) => point.split(",").map(Number) as [number, number]);
const TOP = Math.min(...CORNERS.map(([, y]) => y));
const BOTTOM = Math.max(...CORNERS.map(([, y]) => y));

/** The part of the hexagon below a line `fraction` of the way up. */
function fillPoints(fraction: number): string {
  const line = BOTTOM - fraction * (BOTTOM - TOP);
  const below = ([, y]: [number, number]) => y >= line;
  const points: [number, number][] = [];
  CORNERS.forEach((corner, i) => {
    const next = CORNERS[(i + 1) % CORNERS.length];
    if (below(corner)) points.push(corner);
    if (below(corner) !== below(next)) {
      const t = (line - corner[1]) / (next[1] - corner[1]);
      points.push([corner[0] + t * (next[0] - corner[0]), line]);
    }
  });
  return points.map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`).join(" ");
}

const FILL_POINTS = Object.fromEntries(LEVELS.map((level) => [level, fillPoints(FILL[level])])) as Record<Level, string>;

export function MasteryHex({
  level,
  width,
  height,
  className,
}: {
  level: Level;
  width: number;
  height: number;
  className?: string;
}) {
  if (level === "mastered") {
    return (
      <Hex width={width} height={height} shape="fill-accent stroke-accent stroke-[1.5]" className={className}>
        <HexCheck className="stroke-on-accent stroke-[2.6]" />
      </Hex>
    );
  }
  return (
    <Hex
      width={width}
      height={height}
      shape={level === "not-started" ? "fill-surface stroke-pip stroke-[1.5]" : "fill-surface stroke-accent stroke-[1.5]"}
      className={className}
    >
      {level !== "not-started" && <polygon points={FILL_POINTS[level]} className="fill-accent" />}
    </Hex>
  );
}

/** A lesson's level on the course track. Not started shows nothing. */
export function LevelChip({ level }: { level: Level }) {
  if (level === "not-started") return null;
  return (
    <span className="chip">
      <MasteryHex level={level} width={12} height={13} />
      <span className="sr-only">Skill level: </span>
      {LEVEL_NAMES[level]}
    </span>
  );
}

/**
 * The course page's "Your skills": course mastery, how many lessons are at
 * each level, and every module's lessons as a row of hexagons. Shows once
 * the learner has finished a lesson or a quiz; until then (and during the
 * server render) there's nothing to show.
 */
export function SkillsOverview({ outline }: { outline: Outline }) {
  const { levels, ready } = useMastery();
  const { completed, ready: progressReady } = useCompletedLessons();
  const [open, setOpen] = useState(false);
  const howId = useId();

  const modules = outline.modules
    .map((mod) => ({ ...mod, skills: testedLessons(mod.lessons) }))
    .filter((mod) => mod.skills.length > 0);
  const ids = modules.flatMap((mod) => mod.skills.map((lesson) => lesson.id));
  const anyLevel = ids.some((id) => levelOf(levels, id) !== "not-started");
  const started = anyLevel || allLessons(outline).some((lesson) => completed.has(lesson.id));
  if (!ready || !progressReady || ids.length === 0 || !started) return null;

  const counts = new Map(LEVELS.map((level) => [level, ids.filter((id) => levelOf(levels, id) === level).length]));

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="flex scroll-mt-6 flex-wrap items-start gap-x-14 gap-y-8 rounded-[20px] border-[1.5px] border-border bg-surface p-(--pad) text-fg"
    >
      <div className="flex max-w-[380px] flex-[1_1_260px] flex-col gap-3">
        <span className="flex items-center gap-2">
          <MasteryHex level="proficient" width={16} height={18} />
          <span className="eyebrow">Your skills</span>
        </span>
        <h2 id="skills-heading" className="m-0 flex flex-col">
          <span className="t-hero text-accent tabular-nums">{masteryPercent(levels, ids)}%</span>
          <span className="t-h3">course mastery</span>
        </h2>
        <p className="t-meta m-0 text-muted">
          {anyLevel
            ? "Quizzes level up the lessons they ask about. Saved on this device."
            : "Take a module quiz to start levelling up your lessons."}
        </p>
        <ul aria-label="Lessons at each level" className="m-0 flex list-none flex-col gap-1.5 p-0">
          {[...LEVELS].reverse().map((level) => (
            <li key={level} className="flex items-center gap-2.5">
              <MasteryHex level={level} width={20} height={22} className="flex-none" />
              <span className="flex-1">{LEVEL_NAMES[level]}</span>
              <span className="font-bold tabular-nums">{counts.get(level)}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={howId}
          onClick={() => setOpen((o) => !o)}
          className="btn btn-small mt-1 self-start"
        >
          How levels work
        </button>
        <ul id={howId} hidden={!open} className="m-0 list-disc flex-col gap-2 pl-5 [&:not([hidden])]:flex">
          <li>
            When you finish a quiz, every lesson it asked about moves. Get all its questions right and it goes up a
            level. Miss one and it goes down a level.
          </li>
          <li>A module quiz can take a lesson up to Proficient. To reach Mastered, get it right again in a Check your skills quiz.</li>
          <li>Course mastery adds up your lessons: Familiar counts for half a lesson, Proficient for 80% of one and Mastered for all of it.</li>
        </ul>
      </div>

      <ul aria-label="Your lessons by module" className="m-0 flex min-w-0 flex-[999_1_420px] list-none flex-col gap-5 p-0">
        {modules.map((mod) => (
          <li key={mod.number} className="flex flex-col gap-1.5">
            <span className="flex items-baseline justify-between gap-4">
              <span className="font-bold">
                Module {mod.number}
                <span className="font-normal text-muted">: {mod.title}</span>
              </span>
              <span className="font-bold tabular-nums">
                {masteryPercent(
                  levels,
                  mod.skills.map((lesson) => lesson.id),
                )}
                %<span className="sr-only"> mastery</span>
              </span>
            </span>
            <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
              {mod.skills.map((lesson) => {
                const label = `${lesson.title}: ${LEVEL_NAMES[levelOf(levels, lesson.id)]}`;
                return (
                  <li key={lesson.id}>
                    <Link
                      href={lesson.href}
                      aria-label={label}
                      title={label}
                      className="block rounded-lg p-1 hover:bg-surface2"
                    >
                      <MasteryHex level={levelOf(levels, lesson.id)} width={32} height={35} className="block" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
