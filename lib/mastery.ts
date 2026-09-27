// Mastery levels, like Khan Academy's. Every lesson a quiz question tests is
// a skill with a level. Finishing a quiz moves the level of each lesson it
// asked about:
//   - every question on that lesson right: up one level
//   - any of them wrong: down one level, but never below Attempted
// A module quiz can take a lesson as far as Proficient. Mastered needs the
// lesson right again later, in a Check your skills quiz, so it means "still
// remembered", not "just read".
// Shared by the server and the browser. Nothing here touches storage: saved
// levels live in lib/quiz-results.ts.

export const LEVELS = ["not-started", "attempted", "familiar", "proficient", "mastered"] as const;

export type Level = (typeof LEVELS)[number];

export const LEVEL_NAMES: Record<Level, string> = {
  "not-started": "Not started",
  attempted: "Attempted",
  familiar: "Familiar",
  proficient: "Proficient",
  mastered: "Mastered",
};

/** How much of a lesson each level counts for in the mastery %, as on Khan Academy. */
const POINTS: Record<Level, number> = { "not-started": 0, attempted: 0, familiar: 50, proficient: 80, mastered: 100 };

/** A module quiz, or the mixed quiz on a Check your skills page. */
export type QuizKind = "module" | "mixed";

/** The highest level each kind of quiz can take a lesson to. */
const CEILING: Record<QuizKind, Level> = { module: "proficient", mixed: "mastered" };

/** Lesson id ("module-1/meet-lovable") to level. A lesson that isn't there is Not started. */
export type Levels = Record<string, Level>;

/** One answered question: the lesson it tests, and whether it was right. */
export type Answer = { lesson: string; right: boolean };

/** What one quiz try did to one lesson. */
export type LevelChange = { lesson: string; before: Level; after: Level; missed: boolean };

export function isLevel(value: unknown): value is Level {
  return typeof value === "string" && (LEVELS as readonly string[]).includes(value);
}

export function levelOf(levels: Levels, lesson: string): Level {
  return levels[lesson] ?? "not-started";
}

/** A lesson's level after a quiz try that asked about it. */
export function nextLevel(level: Level, allRight: boolean, kind: QuizKind): Level {
  const index = LEVELS.indexOf(level);
  if (!allRight) return LEVELS[Math.max(index - 1, LEVELS.indexOf("attempted"))];
  const ceiling = LEVELS.indexOf(CEILING[kind]);
  // Already at or above what this quiz can give (Mastered, in a module quiz): stays.
  if (index >= ceiling) return level;
  // A first right answer counts for more than a try: Not started goes straight to Familiar.
  return LEVELS[Math.max(index + 1, LEVELS.indexOf("familiar"))];
}

/** Each lesson a finished quiz asked about, in the order it first came up, with its old and new level. */
export function applyQuiz(levels: Levels, answers: readonly Answer[], kind: QuizKind): LevelChange[] {
  const allRight = new Map<string, boolean>();
  for (const { lesson, right } of answers) allRight.set(lesson, (allRight.get(lesson) ?? true) && right);
  return [...allRight].map(([lesson, right]) => {
    const before = levelOf(levels, lesson);
    return { lesson, before, after: nextLevel(before, right, kind), missed: !right };
  });
}

/**
 * Mastery of these lessons, 0 to 100: the points their levels earn over the
 * points they could. Rounded down, so 100% means every one is Mastered.
 */
export function masteryPercent(levels: Levels, lessons: readonly string[]): number {
  if (lessons.length === 0) return 0;
  const points = lessons.reduce((sum, lesson) => sum + POINTS[levelOf(levels, lesson)], 0);
  return Math.floor(points / lessons.length);
}

/** Proficient: the most a module quiz can do, so a Check your skills quiz is the way on. */
export function atModuleCeiling(change: LevelChange, kind: QuizKind): boolean {
  return kind === "module" && !change.missed && change.after === CEILING.module;
}
