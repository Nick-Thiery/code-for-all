// Quiz types and helpers shared by the server (which reads quiz.yml files,
// see lib/quizzes.ts) and the browser (components/module-quiz.tsx). Nothing
// here touches the file system.

/** The lesson a question tests, for its "Review" link. */
export type QuizLesson = {
  /** "module-1/meet-lovable", like lesson progress. */
  id: string;
  module: number;
  title: string;
  href: string;
};

export type QuizQuestion = {
  /** "module-1/quiz/3": the module and the question's position in its file. */
  id: string;
  module: number;
  question: string;
  /** In the order they're written in quiz.yml. */
  options: string[];
  /** The exact text of the correct option. */
  answer: string;
  explanation: string;
  lesson: QuizLesson;
};

/** Draw `count` questions from the quizzes of Modules `from` to `to`. */
export type DrawGroup = { from: number; to: number; count: number };

/** One "Check your skills" page, from content/check-your-skills.yml. */
export type SkillsCheck = {
  /** It sits after this module and mixes questions from earlier modules. */
  after: number;
  /** Optional extra words above the checklist. */
  intro: string | null;
  /** Where its questions come from. Defaults to MIXED_QUIZ_LENGTH spread over Modules 1 to `after`. */
  draw: DrawGroup[];
};

export type ChecklistItem = { id: string; text: string };

/** One of the final-project criteria, with its questions. */
export type ChecklistGroup = { criterion: string; items: ChecklistItem[] };

export type SkillsChecks = { pages: SkillsCheck[]; checklist: ChecklistGroup[] };

/** How many questions a Check your skills quiz asks when its page doesn't say. */
export const MIXED_QUIZ_LENGTH = 8;

/** The draw for a page with no "draw" list: 8 questions spread over Modules 1 to `after`. */
export function defaultDraw(after: number): DrawGroup[] {
  return [{ from: 1, to: after, count: MIXED_QUIZ_LENGTH }];
}

const inGroup = (group: DrawGroup) => (question: QuizQuestion) =>
  question.module >= group.from && question.module <= group.to;

/** How many questions a draw actually asks, given the questions that exist. */
export function drawCount(questions: readonly QuizQuestion[], groups: readonly DrawGroup[]): number {
  return groups.reduce((sum, group) => sum + Math.min(group.count, questions.filter(inGroup(group)).length), 0);
}

/** A copy of `items` in random order (Fisher–Yates). */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Up to `count` questions, spread as evenly as the modules allow: each
 * module gets the same share, give or take one, and a module with fewer
 * questions than its share gives the rest to the others. Which modules get
 * the extra one, and which questions are picked, is random. Returned in
 * module order, then in the order they're written.
 */
/**
 * A fresh mixed quiz: for each group, its count of questions from its
 * modules, spread as evenly as possible across them. Shown in module order.
 */
export function drawMixed(
  questions: readonly QuizQuestion[],
  groups: readonly DrawGroup[],
  random: () => number = Math.random,
): QuizQuestion[] {
  const drawn = groups.flatMap((group) => spread(questions.filter(inGroup(group)), group.count, random));
  return [...drawn].sort((a, b) => a.module - b.module);
}

function spread(
  questions: readonly QuizQuestion[],
  count: number,
  random: () => number,
): QuizQuestion[] {
  const pools = new Map<number, QuizQuestion[]>();
  for (const question of questions) {
    pools.set(question.module, [...(pools.get(question.module) ?? []), question]);
  }
  const modules = [...pools.keys()].sort((a, b) => a - b);
  const share = new Map(modules.map((module) => [module, 0]));
  const target = Math.min(count, questions.length);

  for (let picked = 0; picked < target; picked++) {
    const open = modules.filter((module) => share.get(module)! < pools.get(module)!.length);
    const fewest = Math.min(...open.map((module) => share.get(module)!));
    const candidates = open.filter((module) => share.get(module) === fewest);
    const pick = candidates[Math.floor(random() * candidates.length)];
    share.set(pick, share.get(pick)! + 1);
  }

  return modules.flatMap((module) => {
    const pool = pools.get(module)!;
    const chosen = new Set(shuffle(pool, random).slice(0, share.get(module)));
    return pool.filter((question) => chosen.has(question));
  });
}
