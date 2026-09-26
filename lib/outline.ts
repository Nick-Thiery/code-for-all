// The course outline: what the header, track and continue bar need to know
// about every lesson, without any lesson's text. Safe to send to the browser.

export type OutlineLesson = {
  /** "module-1/meet-lovable". Unique across the course; used for progress. */
  id: string;
  module: number;
  /** Position within its module, from 1. */
  number: number;
  slug: string;
  title: string;
  /** Estimated minutes. */
  duration: number;
  requiresAccount: boolean;
  hasPractice: boolean;
  /** True if a question in its module's quiz tests it, so it has a mastery level (lib/mastery.ts). */
  tested: boolean;
  href: string;
};

/** A quiz page on the track. It isn't a lesson: it never counts towards progress. */
export type OutlineQuiz = {
  /** Where its last result is saved: "module-1/quiz" or "module-5/check-your-skills". */
  id: string;
  href: string;
  /** How many questions it asks. */
  questions: number;
};

/** A module that's out: its folder exists and has lessons. */
export type OutlineModule = {
  number: number;
  title: string;
  summary: string;
  lessons: OutlineLesson[];
  /** The module quiz (content/module-N/quiz.yml), shown after its last lesson. */
  quiz: OutlineQuiz | null;
  /** The Check your skills page after this module, if there is one. */
  skillsCheck: OutlineQuiz | null;
};

/** Every module in the course plan, out or not, grouped into phases. */
export type OutlinePhase = {
  number: number;
  title: string;
  modules: { number: number; title: string; summary: string; released: boolean }[];
};

export type Outline = {
  /** Released modules, in order. */
  modules: OutlineModule[];
  phases: OutlinePhase[];
};

export const moduleHref = (module: number) => `/module-${module}`;
export const moduleTrackHref = (module: number) => `/#module-${module}`;
export const moduleCompleteHref = (module: number) => `/module-${module}/complete`;
export const lessonHref = (module: number, slug: string) => `/module-${module}/${slug}`;
export const lessonId = (module: number, slug: string) => `module-${module}/${slug}`;
export const quizHref = (module: number) => `/module-${module}/quiz`;
export const quizId = (module: number) => `module-${module}/quiz`;
export const skillsCheckHref = (after: number) => `/module-${after}/check-your-skills`;
export const skillsCheckId = (after: number) => `module-${after}/check-your-skills`;

export function allLessons(outline: Outline): OutlineLesson[] {
  return outline.modules.flatMap((module) => module.lessons);
}

/** The lessons with a mastery level: the ones a quiz question tests. */
export function testedLessons(lessons: readonly OutlineLesson[]): OutlineLesson[] {
  return lessons.filter((lesson) => lesson.tested);
}

/**
 * Where a returning learner should pick up: the first lesson they haven't
 * finished. Null for a new visitor (nothing finished yet) and for someone
 * who has finished everything.
 */
export function resumeTarget(outline: Outline, completed: Set<string>): OutlineLesson | null {
  const lessons = allLessons(outline);
  if (!lessons.some((lesson) => completed.has(lesson.id))) return null;
  return lessons.find((lesson) => !completed.has(lesson.id)) ?? null;
}

/** "Lesson 5, Ethical considerations", with the module when there's more than one. */
export function lessonLabel(outline: Outline, lesson: OutlineLesson) {
  const prefix = outline.modules.length > 1 ? `Module ${lesson.module}, ` : "";
  return `${prefix}Lesson ${lesson.number}, ${lesson.title}`;
}
