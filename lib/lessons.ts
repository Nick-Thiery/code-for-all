import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";

const LESSONS_DIR = path.join(process.cwd(), "content", "lessons");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type LessonMeta = {
  title: string;
  slug: string;
  /** Sort key. Only relative order matters, so gaps (10, 20, 30) are fine. */
  order: number;
  /** Estimated minutes. */
  duration: number;
  summary: string;
  requiresAccount: boolean;
  /** Optional. The recap block falls back to the summary when empty. */
  recap: string[];
};

export type Lesson = LessonMeta & {
  /** Path from the project root, for error messages. */
  file: string;
  /** The whole file, frontmatter included, so MDX errors report real line numbers. */
  source: string;
};

export type LessonWithNeighbours = {
  lesson: Lesson;
  position: number;
  total: number;
  previous: Lesson | null;
  next: Lesson | null;
};

/** Every lesson in content/lessons, sorted by `order`. */
export const getLessons = cache(async (): Promise<Lesson[]> => {
  const names = await fs.readdir(LESSONS_DIR);

  const misnamed = names.find((name) => name.endsWith(".md"));
  if (misnamed) {
    throw new Error(
      `content/lessons/${misnamed} ends in .md, so it won't be picked up. Rename it to ${misnamed}x.`,
    );
  }

  const lessons = await Promise.all(
    names.filter((name) => name.endsWith(".mdx")).map(readLesson),
  );
  assertUnique(lessons, "slug");
  assertUnique(lessons, "order");
  return lessons.sort((a, b) => a.order - b.order);
});

export async function getLessonWithNeighbours(
  slug: string,
): Promise<LessonWithNeighbours | null> {
  const lessons = await getLessons();
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return null;

  return {
    lesson: lessons[index],
    position: index + 1,
    total: lessons.length,
    previous: lessons[index - 1] ?? null,
    next: lessons[index + 1] ?? null,
  };
}

async function readLesson(name: string): Promise<Lesson> {
  const file = `content/lessons/${name}`;
  const source = await fs.readFile(path.join(LESSONS_DIR, name), "utf8");

  let data: Record<string, unknown>;
  try {
    data = matter(source).data;
  } catch (error) {
    throw lessonError(file, [
      `The frontmatter (the part between the --- lines) couldn't be read: ${error instanceof Error ? error.message : String(error)}`,
      `If a value contains a colon, wrap it in quotes, like: title: "Prompts: the basics"`,
    ]);
  }

  return { ...parseFrontmatter(data, file), file, source };
}

function parseFrontmatter(data: Record<string, unknown>, file: string): LessonMeta {
  const problems: string[] = [];

  function missing(key: string, example: string) {
    const nearMiss = Object.keys(data).find(
      (k) => k !== key && k.toLowerCase() === key.toLowerCase(),
    );
    problems.push(
      nearMiss
        ? `Found "${nearMiss}" but expected "${key}". The capital letters have to match.`
        : `"${key}" is missing. Add a line like: ${key}: ${example}`,
    );
  }

  function text(key: string, example: string): string {
    const value = data[key];
    if (typeof value === "string" && value.trim() !== "") return value.trim();
    if (value === undefined) missing(key, example);
    else problems.push(`"${key}" should be some text, like: ${key}: ${example}`);
    return "";
  }

  function number(key: string, example: string, hint: string): number {
    const value = data[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (value === undefined) missing(key, example);
    else problems.push(`"${key}" ${hint}, like: ${key}: ${example}. You wrote: ${JSON.stringify(value)}`);
    return 0;
  }

  const title = text("title", "Your lesson title");
  const summary = text("summary", "One sentence on what this lesson covers.");

  const slug = text("slug", "your-lesson-title");
  if (slug && !SLUG_PATTERN.test(slug)) {
    problems.push(
      `"slug" can only use lowercase letters, numbers and single dashes, like: prompt-basics. You wrote: "${slug}"`,
    );
  }

  const order = number("order", "30", "must be a plain number");

  const duration = number("duration", "20", "must be the estimated minutes as a plain number");
  if (duration < 0) problems.push(`"duration" can't be negative.`);

  let requiresAccount = false;
  if (typeof data.requiresAccount === "boolean") requiresAccount = data.requiresAccount;
  else if (data.requiresAccount === undefined) missing("requiresAccount", "false");
  else problems.push(`"requiresAccount" must be true or false. You wrote: ${JSON.stringify(data.requiresAccount)}`);

  let recap: string[] = [];
  if (typeof data.recap === "string") recap = [data.recap];
  else if (Array.isArray(data.recap) && data.recap.every((item) => typeof item === "string")) recap = data.recap;
  else if (data.recap !== undefined) {
    problems.push(`"recap" should be a list of short points, each on its own line starting with "  - ".`);
  }

  if (problems.length > 0) throw lessonError(file, problems);
  return { title, slug, order, duration, summary, requiresAccount, recap };
}

function assertUnique(lessons: Lesson[], key: "slug" | "order") {
  const seen = new Map<unknown, string>();
  for (const lesson of lessons) {
    const other = seen.get(lesson[key]);
    if (other) {
      throw new Error(
        `${other} and ${lesson.file} both have ${key}: ${lesson[key]}. Every lesson needs its own ${key}.`,
      );
    }
    seen.set(lesson[key], lesson.file);
  }
}

function lessonError(file: string, problems: string[]) {
  return new Error(`There's a problem with ${file}:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
}
