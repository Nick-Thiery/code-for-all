import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { contentError } from "@/lib/content-error";
import { defaultDraw, type ChecklistGroup, type DrawGroup, type QuizLesson, type QuizQuestion, type SkillsCheck, type SkillsChecks } from "@/lib/quiz";

// Reads and checks content/module-N/quiz.yml and content/check-your-skills.yml.
// Both are plain YAML, the same format as course.yml. Mistakes stop the build
// with a message naming the file, the question and how to fix it. The README
// documents both formats.
export const QUIZ_FILE = "quiz.yml";
export const SKILLS_FILE = "check-your-skills.yml";

const QUESTION_KEYS = ["question", "options", "answer", "explanation", "lesson"];
const MIN_OPTIONS = 3;
const MAX_OPTIONS = 4;

type LessonRef = QuizLesson & { slug: string };

/**
 * The module's quiz, or null when it has no quiz.yml. `lessons` are the
 * module's lessons, which every question has to point at.
 */
export async function readQuiz(moduleNumber: number, lessons: LessonRef[]): Promise<QuizQuestion[] | null> {
  const file = `content/module-${moduleNumber}/${QUIZ_FILE}`;
  const source = await readOptional(file);
  if (source === null) return null;

  const data = parseYaml(source, file, `question: "Your page shows old text after you pushed. Why?"`);
  const problems: string[] = [];
  const questions: QuizQuestion[] = [];

  for (const key of Object.keys(data)) {
    if (key !== "questions") problems.push(`Found "${key}" at the top. The file should only have "questions:", with the questions listed under it.`);
  }
  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    problems.push(
      `"questions" should be a list of questions. Start the file with "questions:" and put each question under it, starting with "  - question: ". See the README for an example.`,
    );
    throw contentError(file, problems);
  }

  const seen = new Map<string, number>();
  data.questions.forEach((raw: unknown, index) => {
    const n = index + 1;
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
      problems.push(
        `Question ${n} should be a set of lines: question, options, answer, explanation and lesson. Check its indentation matches the other questions.`,
      );
      return;
    }
    const q = raw as Record<string, unknown>;
    const label = typeof q.question === "string" && q.question.trim() ? `Question ${n} ("${short(q.question)}")` : `Question ${n}`;
    const before = problems.length;
    const say = (message: string) => problems.push(`${label}: ${message}`);

    for (const key of Object.keys(q)) {
      if (QUESTION_KEYS.includes(key)) continue;
      const nearMiss = QUESTION_KEYS.find((k) => k.toLowerCase() === key.toLowerCase());
      say(
        nearMiss
          ? `found "${key}" but expected "${nearMiss}". The capital letters have to match.`
          : `found "${key}", which isn't one of ${QUESTION_KEYS.join(", ")}. Is it a typo?`,
      );
    }

    const text = (key: string, example: string) => {
      const value = q[key];
      if (typeof value === "string" && value.trim()) return value.trim();
      if (value === undefined || value === null || value === "") say(`"${key}" is missing. Add a line like: ${key}: ${example}`);
      else say(`"${key}" should be text. Wrap it in quotes, like: ${key}: ${example}`);
      return "";
    };

    const question = text("question", `"Your page shows old text after you pushed. Why?"`);
    const explanation = text("explanation", `"Why that answer is right, in a sentence or two."`);

    const options: string[] = [];
    if (!Array.isArray(q.options)) {
      say(
        q.options === undefined
          ? `"options" is missing. Add "options:" with ${MIN_OPTIONS} or ${MAX_OPTIONS} answers under it, each on its own line starting with "  - ".`
          : `"options" should be a list of ${MIN_OPTIONS} or ${MAX_OPTIONS} answers, each on its own line starting with "  - ".`,
      );
    } else {
      q.options.forEach((option: unknown, o) => {
        if (typeof option === "string" && option.trim()) options.push(option.trim());
        else if (option === null || option === "") say(`option ${o + 1} is empty.`);
        else say(`option ${o + 1} isn't plain text. Wrap it in quotes, like: - "${String(option)}"`);
      });
      if (q.options.length < MIN_OPTIONS || q.options.length > MAX_OPTIONS) {
        say(`it has ${q.options.length} option${q.options.length === 1 ? "" : "s"}. A question needs ${MIN_OPTIONS} or ${MAX_OPTIONS}.`);
      }
      const lower = new Map<string, string>();
      for (const option of options) {
        const twin = lower.get(option.toLowerCase());
        if (twin) {
          say(`two options are the same: ${twin === option ? `"${twin}"` : `"${twin}" and "${option}"`}. Every option needs to be different.`);
        }
        lower.set(option.toLowerCase(), option);
      }
      if (/\b(all|none) of the above\b/i.test(options.join("\n"))) {
        say(`"all of the above" and "none of the above" don't work here, because the options are shuffled. Write a real answer instead.`);
      }
    }

    let answer = "";
    if (q.answer === undefined || q.answer === null || q.answer === "") {
      say(`"answer" is missing. Copy the correct option's text exactly, like: answer: "${options[0] ?? "The right option"}"`);
    } else if (typeof q.answer !== "string") {
      say(`"answer" should be text. Wrap it in quotes, like: answer: "${String(q.answer)}"`);
    } else {
      answer = q.answer.trim();
      if (options.length > 0 && !options.includes(answer)) {
        const nearly = options.find((option) => squash(option) === squash(answer));
        say(
          nearly
            ? `"answer" is nearly the same as the option "${nearly}", but not exactly. Copy the option's text so capitals, spaces and punctuation match.`
            : `"answer" has to be exactly the text of one of the options. You wrote: "${answer}". The options are: ${options.map((o) => `"${o}"`).join(", ")}.`,
        );
      }
    }

    let lesson: LessonRef | undefined;
    const slug = q.lesson;
    if (slug === undefined || slug === null || slug === "") {
      say(`"lesson" is missing. Add the slug of the lesson that teaches this, like: lesson: ${lessons[0]?.slug ?? "meet-lovable"}`);
    } else {
      lesson = lessons.find((l) => l.slug === String(slug).trim());
      if (!lesson) {
        say(
          `"lesson" should be the slug of a lesson in Module ${moduleNumber}. You wrote: "${String(slug)}". The lessons are: ${lessons.map((l) => l.slug).join(", ")}.`,
        );
      }
    }

    if (question) {
      const other = seen.get(question.toLowerCase());
      if (other) say(`it's the same question as question ${other}.`);
      seen.set(question.toLowerCase(), n);
    }

    if (problems.length === before && lesson) {
      questions.push({
        id: `module-${moduleNumber}/quiz/${n}`,
        module: moduleNumber,
        question,
        options,
        answer,
        explanation,
        lesson: { id: lesson.id, module: lesson.module, title: lesson.title, href: lesson.href },
      });
    }
  });

  if (problems.length > 0) throw contentError(file, problems);
  return questions;
}

/**
 * content/check-your-skills.yml: which modules get a Check your skills page
 * after them, and the build checklist every one of them shows. Empty when
 * the file doesn't exist. `planned` is every module number in course.yml.
 */
export async function readSkillsChecks(planned: number[]): Promise<SkillsChecks> {
  const file = `content/${SKILLS_FILE}`;
  const source = await readOptional(file);
  if (source === null) return { pages: [], checklist: [] };

  const data = parseYaml(source, file, `criterion: "It ships"`);
  const problems: string[] = [];

  for (const key of Object.keys(data)) {
    if (key !== "pages" && key !== "checklist") {
      problems.push(`Found "${key}" at the top. The file should have "pages:" and "checklist:" and nothing else.`);
    }
  }

  const pages: SkillsCheck[] = [];
  if (!Array.isArray(data.pages) || data.pages.length === 0) {
    problems.push(`"pages" should be a list, one line per page, like:\n      pages:\n        - after: 5`);
  } else {
    data.pages.forEach((raw: unknown, index) => {
      const page = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
      const where = `Page ${index + 1}`;
      for (const key of Object.keys(page)) {
        if (key !== "after" && key !== "intro" && key !== "draw") {
          problems.push(`${where}: found "${key}". A page can only have "after", "intro" and "draw".`);
        }
      }
      const after = page.after;
      if (typeof after !== "number" || !Number.isInteger(after)) {
        problems.push(`${where}: "after" should be the module number it comes after, like: after: 5`);
        return;
      }
      if (!planned.includes(after)) problems.push(`${where}: there's no Module ${after} in content/course.yml.`);
      if (pages.some((p) => p.after === after)) problems.push(`${where}: there's already a page after Module ${after}.`);
      let intro: string | null = null;
      if (typeof page.intro === "string" && page.intro.trim()) intro = page.intro.trim();
      else if (page.intro !== undefined) problems.push(`${where}: "intro" should be text. Wrap it in quotes.`);
      pages.push({ after, intro, draw: readDraw(page.draw, after, where, problems) });
    });
  }

  const checklist: ChecklistGroup[] = [];
  if (!Array.isArray(data.checklist) || data.checklist.length === 0) {
    problems.push(`"checklist" should be a list of criteria, each with a "criterion" and a list of "items".`);
  } else {
    const ids = new Set<string>();
    data.checklist.forEach((raw: unknown, index) => {
      const group = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
      const where = `Checklist group ${index + 1}`;
      for (const key of Object.keys(group)) {
        if (key !== "criterion" && key !== "items") problems.push(`${where}: found "${key}". A group can only have "criterion" and "items".`);
      }
      const criterion = typeof group.criterion === "string" ? group.criterion.trim() : "";
      if (!criterion) problems.push(`${where} needs a "criterion", like: criterion: It ships`);
      const items: ChecklistGroup["items"] = [];
      if (!Array.isArray(group.items) || group.items.length === 0) {
        problems.push(`${where}${criterion ? ` ("${criterion}")` : ""} needs "items": a list of questions, each on its own line starting with "  - ".`);
      } else {
        group.items.forEach((item: unknown, i) => {
          if (typeof item !== "string" || !item.trim()) {
            problems.push(`${where}, item ${i + 1} should be text. Wrap it in quotes if it has a colon in it.`);
            return;
          }
          const id = hash(item.trim());
          if (ids.has(id)) problems.push(`${where}: "${short(item)}" is in the checklist twice.`);
          ids.add(id);
          items.push({ id, text: item.trim() });
        });
      }
      checklist.push({ criterion, items });
    });
  }

  if (problems.length > 0) throw contentError(file, problems);
  return { pages: pages.sort((a, b) => a.after - b.after), checklist };
}

async function readOptional(file: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(process.cwd(), file), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

function parseYaml(source: string, file: string, example: string): Record<string, unknown> {
  try {
    // Plain YAML, read the same way as course.yml.
    const data: unknown = matter(`---\n${source}\n---\n`).data;
    return data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : {};
  } catch (error) {
    throw contentError(file, [
      `It couldn't be read: ${error instanceof Error ? error.message.split("\n")[0] : String(error)}`,
      `If a value contains a colon or starts with a quote mark, wrap the whole value in double quotes, like: ${example}`,
    ]);
  }
}

/** Ignore capitals, spaces and punctuation, to spot an answer that's nearly an option. */
function squash(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function short(text: string) {
  const t = text.trim();
  return t.length > 50 ? `${t.slice(0, 47)}...` : t;
}

/** A short stable id for a checklist item, so ticks survive reordering. */
function hash(text: string) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/**
 * A page's optional "draw" list: where its mixed quiz's questions come from.
 *   draw:
 *     - modules: 6-8
 *       questions: 5
 *     - modules: 1-5
 *       questions: 3
 * Without it, the page draws 8 questions spread over Modules 1 to "after".
 */
function readDraw(raw: unknown, after: number, where: string, problems: string[]): DrawGroup[] {
  if (raw === undefined) return defaultDraw(after);
  const example = `like:\n      draw:\n        - modules: 6-8\n          questions: 5`;
  if (!Array.isArray(raw) || raw.length === 0) {
    problems.push(`${where}: "draw" should be a list of groups, ${example}`);
    return defaultDraw(after);
  }
  const groups: DrawGroup[] = [];
  raw.forEach((entry: unknown, i) => {
    const at = `${where}, draw group ${i + 1}`;
    const group = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    for (const key of Object.keys(group)) {
      if (key !== "modules" && key !== "questions") problems.push(`${at}: found "${key}". A group has "modules" and "questions".`);
    }
    const range = /^\s*(\d+)\s*(?:-\s*(\d+))?\s*$/.exec(String(group.modules ?? ""));
    const count = group.questions;
    if (!range) {
      problems.push(`${at}: "modules" should be one module or a range, like: modules: 6-8`);
      return;
    }
    const from = Number(range[1]);
    const to = Number(range[2] ?? range[1]);
    if (from < 1 || to < from) problems.push(`${at}: "modules: ${group.modules}" should go from the lower number to the higher, like 6-8.`);
    else if (to > after) problems.push(`${at}: this page comes after Module ${after}, so it can't draw from Module ${to}.`);
    if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
      problems.push(`${at}: "questions" should be how many to draw, like: questions: 5`);
      return;
    }
    const overlap = groups.find((g) => from <= g.to && to >= g.from);
    if (overlap) problems.push(`${at}: Modules ${from} to ${to} overlap another group. Each module can be in one group only.`);
    groups.push({ from, to, count });
  });
  return groups.length > 0 ? groups : defaultDraw(after);
}
