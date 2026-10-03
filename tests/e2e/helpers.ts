import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { expect, type Page } from "@playwright/test";

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

/** Every question in every released module's quiz, by its text: what a Check your skills page draws from. */
export function allQuizQuestions(): Map<string, QuizInfo> {
  const all = new Map<string, QuizInfo>();
  for (const n of releasedModules()) {
    if (!fs.existsSync(path.join(CONTENT, `module-${n}`, "quiz.yml"))) continue;
    for (const q of quizOf(n)) all.set(q.question, q);
  }
  return all;
}

/**
 * Answer one round of the quiz on the page, whole or retry, by clicking.
 * `pick` gets each question's text and its place in the round. Returns the
 * questions asked, in order, and leaves the round's summary showing.
 */
export async function answerRound(
  page: Page,
  pick: (asked: string, index: number) => "right" | "wrong",
): Promise<string[]> {
  const known = allQuizQuestions();
  const quiz = page.getByRole("region", { name: /quiz/i }).first();
  const asked: string[] = [];
  for (let i = 0; ; i++) {
    await expect(quiz.getByRole("heading", { name: /question \d+ of \d+/i })).toBeVisible();
    const text = (await quiz.locator("legend").innerText()).trim();
    asked.push(text);
    const q = known.get(text)!;
    const option = pick(text, i) === "right" ? q.answer : q.options.find((o) => o !== q.answer)!;
    await quiz.getByRole("radio", { name: option, exact: true }).check();
    await quiz.getByRole("button", { name: "Check answer" }).click();
    const next = quiz.getByRole("button", { name: /Next question|See how you did/ });
    await expect(next).toBeVisible();
    // Buttons are set in capitals by the stylesheet, so compare without case.
    const last = /see how you did/i.test(await next.innerText());
    await next.click();
    if (last) break;
  }
  await expect(quiz.getByRole("heading", { name: /^You got|^The one you'd missed/ })).toBeVisible();
  return asked;
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

/**
 * Wait until the page's entrance animations are over, so checks see each
 * element as it ends up, not half faded in. It scrolls down the page first,
 * so the blocks that animate when scrolled to have played too. Loops that
 * never end (the ticker, the blinking segment) are left alone.
 */
export async function settled(page: Page) {
  await page.evaluate(async () => {
    const finished = () =>
      Promise.all(
        document
          .getAnimations()
          .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
          .map((animation) => animation.finished.catch(() => {})),
      );
    for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 40)));
    }
    await finished();
    window.scrollTo(0, 0);
    await finished();
  });
}

/** Light or dark, applied before first paint like a saved choice would be. */
export async function useTheme(page: Page, theme: "light" | "dark") {
  await seedStorage(page, { "cfa:theme": theme });
}
