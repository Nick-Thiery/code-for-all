// The course outline: what the header, track and continue bar need to know
// about every lesson, without any lesson's text. Safe to send to the browser.

export type OutlineLesson = {
  /** "part-1/sample-lesson". Unique across the course; used for progress. */
  id: string;
  part: number;
  /** Position within its part, from 1. */
  number: number;
  slug: string;
  title: string;
  /** Estimated minutes. */
  duration: number;
  requiresAccount: boolean;
  hasPractice: boolean;
  href: string;
};

export type OutlinePart = {
  number: number;
  title: string;
  summary: string;
  lessons: OutlineLesson[];
};

export type Outline = {
  parts: OutlinePart[];
  /** The first part that isn't released yet. It shows as "Coming soon". */
  upcoming: { number: number; teaser: string };
};

export const partHref = (part: number) => `/part-${part}`;
export const partTrackHref = (part: number) => `/#part-${part}`;
export const partCompleteHref = (part: number) => `/part-${part}/complete`;
export const lessonHref = (part: number, slug: string) => `/part-${part}/${slug}`;
export const lessonId = (part: number, slug: string) => `part-${part}/${slug}`;

export function allLessons(outline: Outline): OutlineLesson[] {
  return outline.parts.flatMap((part) => part.lessons);
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

/** "Lesson 5, Getting set up", with the part when there's more than one. */
export function lessonLabel(outline: Outline, lesson: OutlineLesson) {
  const part = outline.parts.length > 1 ? `Part ${lesson.part}, ` : "";
  return `${part}Lesson ${lesson.number}, ${lesson.title}`;
}
