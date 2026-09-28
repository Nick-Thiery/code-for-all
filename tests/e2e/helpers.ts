import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Page } from "@playwright/test";

// The tests read the course content straight from content/, so they follow
// the lessons rather than hard-coding titles that a content edit would break.
const CONTENT = path.join(process.cwd(), "content");

export type LessonInfo = { id: string; slug: string; title: string; href: string; order: number };

/** The lessons of one module, in the order the site shows them. */
export function lessonsOf(module: number): LessonInfo[] {
  const folder = path.join(CONTENT, `module-${module}`);
  return fs
    .readdirSync(folder)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => {
      const { data } = matter(fs.readFileSync(path.join(folder, name), "utf8"));
      const slug = String(data.slug);
      return {
        id: `module-${module}/${slug}`,
        slug,
        title: String(data.title),
        href: `/module-${module}/${slug}`,
        order: Number(data.order),
      };
    })
    .sort((a, b) => a.order - b.order);
}

export type QuizInfo = { question: string; options: string[]; answer: string; lesson: string };

/** The questions of a module quiz, as written in quiz.yml. */
export function quizOf(module: number): QuizInfo[] {
  const file = path.join(CONTENT, `module-${module}`, "quiz.yml");
  const { data } = matter(`---\n${fs.readFileSync(file, "utf8")}\n---\n`);
  return (data.questions as QuizInfo[]).map((q) => ({
    question: q.question,
    options: q.options,
    answer: q.answer,
    lesson: q.lesson,
  }));
}

/** Every released module number, from the content folders. */
export function releasedModules(): number[] {
  return fs
    .readdirSync(CONTENT)
    .map((name) => /^module-(\d+)$/.exec(name))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => Number(m[1]))
    .filter((n) => lessonsOf(n).length > 0)
    .sort((a, b) => a - b);
}

/** True when mastery levels (lib/mastery.ts) are part of this checkout. */
export const hasMastery = fs.existsSync(path.join(process.cwd(), "lib", "mastery.ts"));

/** Set localStorage before any page script runs, so the first render sees it. */
export async function seedStorage(page: Page, entries: Record<string, unknown>) {
  await page.addInitScript((items: Record<string, string>) => {
    for (const [key, value] of Object.entries(items)) localStorage.setItem(key, value);
  }, Object.fromEntries(Object.entries(entries).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)])));
}

export async function readStorage<T>(page: Page, key: string): Promise<T | null> {
  const raw = await page.evaluate((k) => localStorage.getItem(k), key);
  return raw === null ? null : (JSON.parse(raw) as T);
}

/** Light or dark, applied before first paint like a saved choice would be. */
export async function useTheme(page: Page, theme: "light" | "dark") {
  await seedStorage(page, { "cfa:theme": theme });
}
