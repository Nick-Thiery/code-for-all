"use client";

import { useId, useState } from "react";
import { HEX_POINTS, Hex, HexCheck } from "@/components/hex";
import { LEVELS, LEVEL_NAMES, type Level, levelOf, masteryPercent } from "@/lib/mastery";
import { type OutlineLesson, testedLessons } from "@/lib/outline";
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
      <Hex width={width} height={height} shape="fill-accent stroke-line stroke-[1.5]" className={className}>
        <HexCheck className="stroke-on-accent stroke-[2.6]" />
      </Hex>
    );
  }
  return (
    <Hex
      width={width}
      height={height}
      shape={level === "not-started" ? "fill-surface stroke-pip stroke-[1.5]" : "fill-surface stroke-line stroke-[1.5]"}
      className={className}
    >
      {level !== "not-started" && <polygon points={FILL_POINTS[level]} className="fill-accent" />}
    </Hex>
  );
}

/** A lesson's level on the course grid's lesson rows. Not started shows nothing. */
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

/** How levels move. A button that opens the three rules in place. */
export function HowLevelsWork() {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="btn btn-small self-start print:hidden"
      >
        How levels work
      </button>
      <ul id={id} hidden={!open} className="t-meta m-0 mt-1 list-disc flex-col gap-1.5 pl-5 [&:not([hidden])]:flex">
        <li>
          When you finish a quiz, every lesson it asked about moves. Get all its questions right and it goes up a level.
          Miss one and it goes down a level.
        </li>
        <li>A module quiz can take a lesson up to Proficient. To reach Mastered, get it right again in a Check your skills quiz.</li>
        <li>Mastery adds up your lessons: Familiar counts for half a lesson, Proficient for 80% of one and Mastered for all of it.</li>
      </ul>
    </div>
  );
}

/**
 * A module's mastery on the course grid: the % across the lessons its quiz
 * tests, and how levels work. Shows once a quiz has given one of those
 * lessons a level; until then (and during the server render) nothing.
 */
export function ModuleMastery({ lessons, className = "" }: { lessons: readonly OutlineLesson[]; className?: string }) {
  const { levels, ready } = useMastery();
  const ids = testedLessons(lessons).map((lesson) => lesson.id);
  if (!ready || ids.length === 0 || ids.every((id) => levelOf(levels, id) === "not-started")) return null;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <p className="m-0 flex items-center gap-2 font-bold">
        <MasteryHex level="proficient" width={16} height={18} className="flex-none" />
        <span>
          <span className="tabular-nums">{masteryPercent(levels, ids)}%</span> mastery
        </span>
      </p>
      <HowLevelsWork />
    </div>
  );
}
