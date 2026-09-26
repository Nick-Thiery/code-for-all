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
  href: string;
};

/** A module that's out: its folder exists and has lessons. */
export type OutlineModule = {
  number: number;
  title: string;
  summary: string;
  lessons: OutlineLesson[];
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

export function allLessons(outline: Outline): OutlineLesson[] {
  return outline.modules.flatMap((module) => module.lessons);
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
