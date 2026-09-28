import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { contentError } from "@/lib/content-error";
import {
  lessonHref,
  lessonId,
  quizHref,
  quizId,
  skillsCheckHref,
  skillsCheckId,
  type Outline,
} from "@/lib/outline";
import { drawCount, type QuizQuestion, type SkillsChecks } from "@/lib/quiz";
import { QUIZ_FILE, readQuiz, readSkillsChecks } from "@/lib/quizzes";

// content/course.yml lists every module in the course and groups them into
// phases. Each released module is a folder, content/module-1,
// content/module-2, ..., holding one .mdx file per lesson. Adding a folder
// releases that module.
const CONTENT_DIR = path.join(process.cwd(), "content");
const COURSE_FILE = "course.yml";
const MODULE_FOLDER = /^module-(\d+)$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// These URLs belong to the module itself: /module-1/complete, /module-1/quiz
// and /module-5/check-your-skills.
const RESERVED_SLUGS = ["complete", "quiz", "check-your-skills"];

/** The "You'll need" box on a hands-on lesson (components/you-need.tsx). */
export type LessonNeeds = {
  /** "A laptop or Chromebook". May contain [text](/link). */
  device: string;
  /** Tools the hands-on part uses: "Lovable", "Claude Code". */
  access: string[];
  /** Things from earlier lessons, each may contain [text](/link). */
  before: string[];
};

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
  /** Optional. Set on hands-on lessons to show the "You'll need" box. */
  needs: LessonNeeds | null;
};

export type Lesson = LessonMeta & {
  /** "module-1/meet-lovable": unique across the course. */
  id: string;
  module: number;
  /** Position within its module, from 1. */
  number: number;
  href: string;
  /** True if the lesson uses <PromptPractice>. */
  hasPractice: boolean;
  /** Path from the project root, for error messages. */
  file: string;
  /** The whole file, frontmatter included, so MDX errors report real line numbers. */
  source: string;
};

/** One module from course.yml. */
export type PlannedModule = {
  number: number;
  title: string;
  summary: string;
  phase: number;
  /** For a module that isn't out yet: its planned lesson titles, from the course map. */
  planned: string[];
  /** For a module that isn't out yet: what to do until it is, pointing back at finished work. */
  waiting: string | null;
};

export type Phase = { number: number; title: string; modules: PlannedModule[] };

export type Module = PlannedModule & {
  lessons: Lesson[];
  /** From content/module-N/quiz.yml. Null when the module has no quiz. */
  quiz: QuizQuestion[] | null;
};

export type LessonWithNeighbours = {
  lesson: Lesson;
  module: Module;
  previous: Lesson | null;
  next: Lesson | null;
};

/** The course plan from content/course.yml: every module, released or not. */
export const getPhases = cache(async (): Promise<Phase[]> => {
  const file = `content/${COURSE_FILE}`;
  let source: string;
  try {
    source = await fs.readFile(path.join(CONTENT_DIR, COURSE_FILE), "utf8");
  } catch {
    throw new Error(`${file} is missing. It lists every module in the course; see the README.`);
  }

  let data: Record<string, unknown>;
  try {
    // course.yml is plain YAML: the same format as a lesson's frontmatter.
    data = matter(`---\n${source}\n---\n`).data;
  } catch (error) {
    throw contentError(file, [
      `It couldn't be read: ${error instanceof Error ? error.message : String(error)}`,
      `If a value contains a colon, wrap it in quotes, like: title: "Claude: the basics"`,
    ]);
  }

  const problems: string[] = [];
  const phases: Phase[] = [];
  const seen = new Set<number>();

  if (!Array.isArray(data.phases) || data.phases.length === 0) {
    throw contentError(file, [`"phases" should be a list of phases, each with a "title" and a list of "modules".`]);
  }

  data.phases.forEach((rawPhase: unknown, p) => {
    const phase = (rawPhase ?? {}) as Record<string, unknown>;
    const title = typeof phase.title === "string" && phase.title.trim() ? phase.title.trim() : "";
    if (!title) problems.push(`Phase ${p + 1} needs a "title".`);
    const modules: PlannedModule[] = [];
    if (!Array.isArray(phase.modules)) {
      problems.push(`Phase ${p + 1} ("${title}") needs a list of "modules".`);
    } else {
      phase.modules.forEach((rawModule: unknown, m) => {
        const mod = (rawModule ?? {}) as Record<string, unknown>;
        const where = `Phase ${p + 1}, module ${m + 1}`;
        const number = mod.number;
        if (typeof number !== "number" || !Number.isInteger(number) || number < 1) {
          problems.push(`${where}: "number" should be a whole number, like: number: 3`);
          return;
        }
        if (seen.has(number)) problems.push(`Module ${number} is listed twice.`);
        seen.add(number);
        const text = (key: string) => (typeof mod[key] === "string" && (mod[key] as string).trim()) || "";
        if (!text("title")) problems.push(`Module ${number} needs a "title".`);
        if (!text("summary")) problems.push(`Module ${number} needs a "summary": one short line on what it's about.`);
        let planned: string[] = [];
        if (Array.isArray(mod.planned) && mod.planned.every((item) => typeof item === "string")) {
          planned = (mod.planned as string[]).map((item) => item.trim()).filter(Boolean);
        } else if (mod.planned !== undefined) {
          problems.push(`Module ${number}: "planned" should be a list of lesson titles, each on its own line starting with "  - ".`);
        }
        if (mod.waiting !== undefined && typeof mod.waiting !== "string") {
          problems.push(`Module ${number}: "waiting" should be one line of text. Wrap it in quotes if it contains ": ".`);
        }
        modules.push({
          number,
          title: text("title"),
          summary: text("summary"),
          phase: p + 1,
          planned,
          waiting: text("waiting") || null,
        });
      });
    }
    phases.push({ number: p + 1, title, modules });
  });

  if (problems.length > 0) throw contentError(file, problems);
  return phases;
});

/** Every released module, in order, each with its lessons sorted by `order`. */
export const getModules = cache(async (): Promise<Module[]> => {
  const names = await fs.readdir(CONTENT_DIR);

  const stray = names.find((name) => name === "lessons" || /^part-\d+$/.test(name));
  if (stray) {
    throw new Error(
      `content/${stray}/ is from before lessons were grouped into modules. Move its files into content/module-1/ (or whichever module they belong to).`,
    );
  }

  const planned = (await getPhases()).flatMap((phase) => phase.modules);
  const numbers = names
    .map((name) => MODULE_FOLDER.exec(name))
    .filter((match) => match !== null)
    .map((match) => Number(match[1]))
    .sort((a, b) => a - b);

  const modules = await Promise.all(
    numbers.map(async (number) => {
      const plan = planned.find((module) => module.number === number);
      if (!plan) {
        throw new Error(
          `Found content/module-${number}/ but module ${number} isn't in content/course.yml. Add it to a phase there.`,
        );
      }
      const lessons = await readLessons(number);
      return { ...plan, lessons, quiz: lessons.length > 0 ? await readQuiz(number, lessons) : null };
    }),
  );
  // A folder with no lessons yet doesn't count as released.
  return modules.filter((module) => module.lessons.length > 0);
});

export async function getModule(number: number): Promise<Module | null> {
  const modules = await getModules();
  return modules.find((module) => module.number === number) ?? null;
}

export async function getLessonWithNeighbours(
  moduleNumber: number,
  slug: string,
): Promise<LessonWithNeighbours | null> {
  const mod = await getModule(moduleNumber);
  if (!mod) return null;
  const index = mod.lessons.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return null;

  return {
    lesson: mod.lessons[index],
    module: mod,
    previous: mod.lessons[index - 1] ?? null,
    next: mod.lessons[index + 1] ?? null,
  };
}

/** content/check-your-skills.yml: the Check your skills pages and their checklist. */
export const getSkillsChecks = cache(async (): Promise<SkillsChecks> => {
  const planned = (await getPhases()).flatMap((phase) => phase.modules.map((module) => module.number));
  return readSkillsChecks(planned);
});

/**
 * The Check your skills page after module `after`, if there is one and that
 * module is out, with the quiz questions of every released module up to it.
 */
export async function getSkillsCheck(after: number) {
  const [{ pages, checklist }, modules] = await Promise.all([getSkillsChecks(), getModules()]);
  const page = pages.find((p) => p.after === after);
  const mod = modules.find((m) => m.number === after);
  if (!page || !mod) return null;
  const questions = modules.filter((m) => m.number <= after).flatMap((m) => m.quiz ?? []);
  return { ...page, module: mod, checklist, questions };
}

/**
 * The first Check your skills page whose mixed quiz asks about module
 * `number`, if its module is out: where that module's lessons can reach
 * Mastered (lib/mastery.ts).
 */
export async function getSkillsCheckFor(number: number) {
  const [{ pages }, modules] = await Promise.all([getSkillsChecks(), getModules()]);
  return (
    pages.find(
      (page) =>
        modules.some((mod) => mod.number === page.after) &&
        page.draw.some((group) => group.from <= number && number <= group.to && group.count > 0),
    ) ?? null
  );
}

/** Everything the browser needs to know about the course, and nothing more. */
export const getOutline = cache(async (): Promise<Outline> => {
  const [phases, modules, skills] = await Promise.all([getPhases(), getModules(), getSkillsChecks()]);
  const released = new Set(modules.map((module) => module.number));
  const skillsPage = (after: number) => skills.pages.find((page) => page.after === after);
  return {
    modules: modules.map((module) => ({
      number: module.number,
      title: module.title,
      summary: module.summary,
      quiz: module.quiz
        ? { id: quizId(module.number), href: quizHref(module.number), questions: module.quiz.length }
        : null,
      skillsCheck: skillsPage(module.number)
        ? {
            id: skillsCheckId(module.number),
            href: skillsCheckHref(module.number),
            questions: drawCount(
              modules.flatMap((m) => m.quiz ?? []),
              skillsPage(module.number)!.draw,
            ),
          }
        : null,
      lessons: module.lessons.map((lesson) => ({
        id: lesson.id,
        module: lesson.module,
        number: lesson.number,
        slug: lesson.slug,
        title: lesson.title,
        duration: lesson.duration,
        requiresAccount: lesson.requiresAccount,
        hasPractice: lesson.hasPractice,
        tested: module.quiz?.some((question) => question.lesson.id === lesson.id) ?? false,
        href: lesson.href,
      })),
    })),
    phases: phases.map((phase) => ({
      number: phase.number,
      title: phase.title,
      modules: phase.modules.map(({ number, title, summary }) => ({
        number,
        title,
        summary,
        released: released.has(number),
      })),
    })),
  };
});

/** A module from the course plan, released or not. */
export async function getPlannedModule(number: number): Promise<PlannedModule | null> {
  const phases = await getPhases();
  return phases.flatMap((phase) => phase.modules).find((module) => module.number === number) ?? null;
}

/** "module-2" -> 2, anything else -> null. */
export function parseModuleParam(param: string): number | null {
  const match = MODULE_FOLDER.exec(param);
  return match ? Number(match[1]) : null;
}

async function readLessons(number: number): Promise<Lesson[]> {
  const folder = `module-${number}`;
  const names = await fs.readdir(path.join(CONTENT_DIR, folder));

  const quizFile = names.find((name) => /^quiz\.ya?ml$/i.test(name) && name !== QUIZ_FILE);
  if (quizFile) {
    throw new Error(`content/${folder}/${quizFile} won't be picked up. Rename it to ${QUIZ_FILE}.`);
  }

  const misnamed = names.find((name) => name.endsWith(".md"));
  if (misnamed) {
    throw new Error(
      `content/${folder}/${misnamed} ends in .md, so it won't be picked up. Rename it to ${misnamed}x.`,
    );
  }

  const lessons = await Promise.all(
    names.filter((name) => name.endsWith(".mdx")).map((name) => readLesson(folder, name)),
  );
  assertUnique(lessons, "slug");
  assertUnique(lessons, "order");
  lessons.sort((a, b) => a.order - b.order);

  return lessons.map((lesson, index) => ({
    ...lesson,
    id: lessonId(number, lesson.slug),
    module: number,
    number: index + 1,
    href: lessonHref(number, lesson.slug),
  }));
}

type LessonFile = LessonMeta & { hasPractice: boolean; file: string; source: string };

async function readLesson(folder: string, name: string): Promise<LessonFile> {
  const file = `content/${folder}/${name}`;
  const source = await fs.readFile(path.join(CONTENT_DIR, folder, name), "utf8");

  let data: Record<string, unknown>;
  try {
    data = matter(source).data;
  } catch (error) {
    throw contentError(file, [
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
  } else if (RESERVED_SLUGS.includes(slug)) {
    problems.push(`"slug" can't be "${slug}": that address is used by the module itself. Pick another.`);
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

  let needs: LessonNeeds | null = null;
  if (data.needs !== undefined) {
    const raw = data.needs;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      problems.push(`"needs" should have a "device" line and optional "access" and "before" lists. See the README.`);
    } else {
      const block = raw as Record<string, unknown>;
      const device = typeof block.device === "string" ? block.device.trim() : "";
      if (!device) problems.push(`"needs" must say which device, like: device: A laptop or Chromebook`);
      const strings = (key: string): string[] => {
        const value = block[key];
        if (value === undefined) return [];
        if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
          return value.map((item: string) => item.trim()).filter(Boolean);
        }
        problems.push(`"needs: ${key}" should be a list, each item on its own line starting with "    - ".`);
        return [];
      };
      needs = { device, access: strings("access"), before: strings("before") };
    }
  }

  if (problems.length > 0) throw contentError(file, problems);
  return { title, slug, order, duration, summary, requiresAccount, recap, needs };
}

function assertUnique(lessons: LessonFile[], key: "slug" | "order") {
  const seen = new Map<unknown, string>();
  for (const lesson of lessons) {
    const other = seen.get(lesson[key]);
    if (other) {
      throw new Error(
        `${other} and ${lesson.file} both have ${key}: ${lesson[key]}. Every lesson in a module needs its own ${key}.`,
      );
    }
    seen.set(lesson[key], lesson.file);
  }
}
