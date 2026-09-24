import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { lessonHref, lessonId, type Outline } from "@/lib/outline";

// Each part is a folder: content/part-1, content/part-2, ... Adding a folder
// releases that part. Lessons are the .mdx files inside it, and part.yml
// holds the part's own title and copy.
const CONTENT_DIR = path.join(process.cwd(), "content");
const PART_FOLDER = /^part-(\d+)$/;
const PART_FILE = "part.yml";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// These URLs belong to the part itself: /part-1/complete.
const RESERVED_SLUGS = ["complete"];

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
  /** "part-1/sample-lesson": unique across the course. */
  id: string;
  part: number;
  /** Position within its part, from 1. */
  number: number;
  href: string;
  /** True if the lesson uses <PromptPractice>. */
  hasPractice: boolean;
  /** Path from the project root, for error messages. */
  file: string;
  /** The whole file, frontmatter included, so MDX errors report real line numbers. */
  source: string;
};

export type PartMeta = {
  title: string;
  summary: string;
  /** Part complete page. */
  completeHeading: string;
  completeText: string;
  shareTitle: string;
  shareText: string;
  /** Shown under "Part N+1: Coming soon" while this is the latest part. */
  nextTeaser: string;
};

export type Part = PartMeta & {
  number: number;
  file: string;
  lessons: Lesson[];
};

export type LessonWithNeighbours = {
  lesson: Lesson;
  part: Part;
  previous: Lesson | null;
  next: Lesson | null;
};

/** Every released part, in order, each with its lessons sorted by `order`. */
export const getParts = cache(async (): Promise<Part[]> => {
  const names = await fs.readdir(CONTENT_DIR);

  const stray = names.find((name) => name === "lessons");
  if (stray) {
    throw new Error(
      `content/lessons/ is from before lessons were grouped into parts. Move its files into content/part-1/.`,
    );
  }

  const numbers = names
    .map((name) => PART_FOLDER.exec(name))
    .filter((match) => match !== null)
    .map((match) => Number(match[1]))
    .sort((a, b) => a - b);

  numbers.forEach((number, index) => {
    if (number !== index + 1) {
      throw new Error(
        `Found content/part-${number}/ but no content/part-${index + 1}/. Parts are numbered from 1 with no gaps.`,
      );
    }
  });

  return Promise.all(numbers.map(readPart));
});

export async function getPart(number: number): Promise<Part | null> {
  const parts = await getParts();
  return parts.find((part) => part.number === number) ?? null;
}

export async function getLessonWithNeighbours(
  partNumber: number,
  slug: string,
): Promise<LessonWithNeighbours | null> {
  const part = await getPart(partNumber);
  if (!part) return null;
  const index = part.lessons.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return null;

  return {
    lesson: part.lessons[index],
    part,
    previous: part.lessons[index - 1] ?? null,
    next: part.lessons[index + 1] ?? null,
  };
}

/** Everything the browser needs to know about the course, and nothing more. */
export const getOutline = cache(async (): Promise<Outline> => {
  const parts = await getParts();
  const latest = parts.at(-1);
  return {
    parts: parts.map((part) => ({
      number: part.number,
      title: part.title,
      summary: part.summary,
      lessons: part.lessons.map((lesson) => ({
        id: lesson.id,
        part: lesson.part,
        number: lesson.number,
        slug: lesson.slug,
        title: lesson.title,
        duration: lesson.duration,
        requiresAccount: lesson.requiresAccount,
        hasPractice: lesson.hasPractice,
        href: lesson.href,
      })),
    })),
    upcoming: {
      number: parts.length + 1,
      teaser: latest?.nextTeaser ?? "We're writing it now.",
    },
  };
});

/** "part-2" -> 2, anything else -> null. */
export function parsePartParam(param: string): number | null {
  const match = PART_FOLDER.exec(param);
  return match ? Number(match[1]) : null;
}

async function readPart(number: number): Promise<Part> {
  const folder = `part-${number}`;
  const dir = path.join(CONTENT_DIR, folder);
  const names = await fs.readdir(dir);

  const misnamed = names.find((name) => name.endsWith(".md"));
  if (misnamed) {
    throw new Error(
      `content/${folder}/${misnamed} ends in .md, so it won't be picked up. Rename it to ${misnamed}x.`,
    );
  }

  const meta = await readPartMeta(folder, names.includes(PART_FILE));

  const lessons = await Promise.all(
    names.filter((name) => name.endsWith(".mdx")).map((name) => readLesson(folder, name)),
  );
  assertUnique(lessons, "slug");
  assertUnique(lessons, "order");
  lessons.sort((a, b) => a.order - b.order);

  return {
    ...meta,
    number,
    file: `content/${folder}/${PART_FILE}`,
    lessons: lessons.map((lesson, index) => ({
      ...lesson,
      id: lessonId(number, lesson.slug),
      part: number,
      number: index + 1,
      href: lessonHref(number, lesson.slug),
    })),
  };
}

async function readPartMeta(folder: string, exists: boolean): Promise<PartMeta> {
  const file = `content/${folder}/${PART_FILE}`;
  if (!exists) {
    throw new Error(
      `${file} is missing. Every part needs one, with at least:\n  title: What this part is called\n  summary: One sentence on what learners do in it.`,
    );
  }

  const source = await fs.readFile(path.join(CONTENT_DIR, folder, PART_FILE), "utf8");
  let data: Record<string, unknown>;
  try {
    // part.yml is plain YAML: the same format as a lesson's frontmatter.
    data = matter(`---\n${source}\n---\n`).data;
  } catch (error) {
    throw lessonError(file, [
      `It couldn't be read: ${error instanceof Error ? error.message : String(error)}`,
      `If a value contains a colon, wrap it in quotes, like: title: "Part 1: the basics"`,
    ]);
  }

  const problems: string[] = [];
  const { text, optionalText } = fieldReaders(data, problems);
  const title = text("title", "Your first build");
  const summary = text("summary", "One sentence on what learners do in this part.");
  const meta: PartMeta = {
    title,
    summary,
    completeHeading: optionalText("completeHeading") ?? `You finished ${folder.replace("part-", "Part ")}.`,
    completeText: optionalText("completeText") ?? summary,
    shareTitle: optionalText("shareTitle") ?? "Show someone what you made",
    shareText:
      optionalText("shareText") ??
      "Show a friend or someone at home. Explaining how you made it is the best way to remember it.",
    nextTeaser: optionalText("nextTeaser") ?? "We're writing it now.",
  };
  if (problems.length > 0) throw lessonError(file, problems);
  return meta;
}

type LessonFile = LessonMeta & { hasPractice: boolean; file: string; source: string };

async function readLesson(folder: string, name: string): Promise<LessonFile> {
  const file = `content/${folder}/${name}`;
  const source = await fs.readFile(path.join(CONTENT_DIR, folder, name), "utf8");

  let data: Record<string, unknown>;
  try {
    data = matter(source).data;
  } catch (error) {
    throw lessonError(file, [
      `The frontmatter (the part between the --- lines) couldn't be read: ${error instanceof Error ? error.message : String(error)}`,
      `If a value contains a colon, wrap it in quotes, like: title: "Prompts: the basics"`,
    ]);
  }

  return {
    ...parseFrontmatter(data, file),
    hasPractice: /<PromptPractice[\s/>]/.test(source),
    file,
    source,
  };
}

function fieldReaders(data: Record<string, unknown>, problems: string[]) {
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

  function optionalText(key: string): string | undefined {
    const value = data[key];
    if (value === undefined) return undefined;
    if (typeof value === "string" && value.trim() !== "") return value.trim();
    problems.push(`"${key}" should be some text, or leave the line out.`);
    return undefined;
  }

  function number(key: string, example: string, hint: string): number {
    const value = data[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (value === undefined) missing(key, example);
    else problems.push(`"${key}" ${hint}, like: ${key}: ${example}. You wrote: ${JSON.stringify(value)}`);
    return 0;
  }

  return { missing, text, optionalText, number };
}

function parseFrontmatter(data: Record<string, unknown>, file: string): LessonMeta {
  const problems: string[] = [];
  const { missing, text, number } = fieldReaders(data, problems);

  const title = text("title", "Your lesson title");
  const summary = text("summary", "One sentence on what this lesson covers.");

  const slug = text("slug", "your-lesson-title");
  if (slug && !SLUG_PATTERN.test(slug)) {
    problems.push(
      `"slug" can only use lowercase letters, numbers and single dashes, like: prompt-basics. You wrote: "${slug}"`,
    );
  } else if (RESERVED_SLUGS.includes(slug)) {
    problems.push(`"slug" can't be "${slug}": that address is used by the part itself. Pick another.`);
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

function assertUnique(lessons: LessonFile[], key: "slug" | "order") {
  const seen = new Map<unknown, string>();
  for (const lesson of lessons) {
    const other = seen.get(lesson[key]);
    if (other) {
      throw new Error(
        `${other} and ${lesson.file} both have ${key}: ${lesson[key]}. Every lesson in a part needs its own ${key}.`,
      );
    }
    seen.set(lesson[key], lesson.file);
  }
}

function lessonError(file: string, problems: string[]) {
  return new Error(`There's a problem with ${file}:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
}
