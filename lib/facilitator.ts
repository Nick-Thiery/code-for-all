import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { contentError } from "@/lib/content-error";
import { getModules, getSkillsChecks, type Lesson, type Module } from "@/lib/lessons";
import { quizHref, skillsCheckHref } from "@/lib/outline";

// The session kit on /run-it: run sheets, the facilitator script, the student
// handout and the pre-session checklist. content/facilitator.yml holds what
// the lessons can't say (timings, what to do, what to prepare, group
// versions). Everything else is read from the lessons, so the kit follows
// them when they change.

const FILE = "content/facilitator.yml";

export type KitLink = { label: string; href: string };

/** A lesson without its text: all the kit needs, and small enough to pass around. */
export type KitLesson = Pick<
  Lesson,
  "id" | "number" | "slug" | "title" | "duration" | "summary" | "recap" | "requiresAccount" | "href"
>;

export type KitModule = { number: number; title: string; summary: string; lessons: KitLesson[] };

export type RunStep = {
  title: string;
  minutes: number;
  /** Minutes from the start of the session. */
  from: number;
  to: number;
  lessons: KitLesson[];
  do: string;
  group: string | null;
  note: string | null;
};

/** A <KeyTerm> or <Challenge> from a lesson: its heading, and its body as MDX. */
export type Snippet = { title: string; source: string; lessonId: string; file: string };

export type RunSheet = {
  module: KitModule;
  tools: string[];
  prepare: string[];
  links: KitLink[];
  /** Files lessons offer to download, like /lessons/module-4/singapore-weather.csv. */
  downloads: (KitLink & { lesson: number })[];
  steps: RunStep[];
  totalMinutes: number;
  handsOn: KitLesson[];
  keyTerms: Snippet[];
  challenge: Snippet | null;
  quizHref: string | null;
  skillsCheckHref: string | null;
  /** Where the run sheet and the lessons disagree, in plain words. */
  outOfDate: string[];
};

export type Rubric = {
  pointsPerCriterion: number;
  total: number;
  criteria: { criterion: string; items: string[] }[];
  bands: { points: string; label: string }[];
};

export type Kit = {
  sessionMinutes: number;
  deliverableMarks: string[];
  rubric: Rubric;
  sheets: RunSheet[];
};

type RawStep = { title: string; minutes: number; lessons: string[]; do: string; group: string | null; note: string | null };
type RawModule = { module: number; tools: string[]; prepare: string[]; links: KitLink[]; steps: RawStep[] };

export const getKit = cache(async (): Promise<Kit> => {
  const source = await fs.readFile(path.join(process.cwd(), FILE), "utf8");
  let data: Record<string, unknown>;
  try {
    data = matter(`---\n${source}\n---\n`).data as Record<string, unknown>;
  } catch (error) {
    throw contentError(FILE, [
      `It couldn't be read: ${error instanceof Error ? error.message.split("\n")[0] : String(error)}`,
      `If a value contains ": ", wrap the whole value in double quotes.`,
    ]);
  }

  const problems: string[] = [];
  const text = (value: unknown, where: string, optional = false): string | null => {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (value === undefined && optional) return null;
    problems.push(`${where} should be some text. Wrap it in double quotes if it contains ": ".`);
    return null;
  };
  const list = (value: unknown, where: string): string[] => {
    if (value === undefined) return [];
    if (!Array.isArray(value)) {
      problems.push(`${where} should be a list, each item on its own line starting with "  - ".`);
      return [];
    }
    return value.map((item, i) => text(item, `${where}, item ${i + 1}`)).filter((item) => item !== null);
  };
  const whole = (value: unknown, where: string) => {
    if (typeof value === "number" && Number.isInteger(value) && value > 0) return value;
    problems.push(`${where} should be a whole number of minutes or points, like: 10`);
    return 0;
  };

  const sessionMinutes = whole(data.sessionMinutes, `"sessionMinutes"`);
  const deliverableMarks = list(data.deliverableMarks, `"deliverableMarks"`);

  const rawRubric = (data.rubric ?? {}) as Record<string, unknown>;
  const pointsPerCriterion = whole(rawRubric.pointsPerCriterion, `"rubric: pointsPerCriterion"`);
  const bands = Array.isArray(rawRubric.bands)
    ? rawRubric.bands.map((raw: unknown, i) => {
        const band = (raw ?? {}) as Record<string, unknown>;
        const points = typeof band.points === "number" ? String(band.points) : text(band.points, `Rubric band ${i + 1}: "points"`);
        return { points: points ?? "", label: text(band.label, `Rubric band ${i + 1}: "label"`) ?? "" };
      })
    : [];
  if (bands.length === 0) problems.push(`"rubric" needs "bands": a list, each with "points" and "label".`);

  const rawModules: RawModule[] = [];
  if (!Array.isArray(data.modules)) {
    problems.push(`"modules" should be a list of run sheets, each starting with "  - module: ".`);
  } else {
    data.modules.forEach((raw: unknown, index) => {
      const mod = (raw ?? {}) as Record<string, unknown>;
      const number = mod.module;
      if (typeof number !== "number" || !Number.isInteger(number)) {
        problems.push(`Run sheet ${index + 1}: "module" should be the module number, like: module: 3`);
        return;
      }
      const where = `Module ${number}`;
      if (rawModules.some((m) => m.module === number)) problems.push(`${where} has two run sheets.`);
      const links = Array.isArray(mod.links)
        ? mod.links.map((rawLink: unknown, i) => {
            const link = (rawLink ?? {}) as Record<string, unknown>;
            return {
              label: text(link.label, `${where}, link ${i + 1}: "label"`) ?? "",
              href: text(link.href, `${where}, link ${i + 1}: "href"`) ?? "",
            };
          })
        : [];
      const steps: RawStep[] = [];
      if (!Array.isArray(mod.steps) || mod.steps.length === 0) {
        problems.push(`${where} needs "steps": the session, in order.`);
      } else {
        mod.steps.forEach((rawStep: unknown, i) => {
          const step = (rawStep ?? {}) as Record<string, unknown>;
          const at = `${where}, step ${i + 1}`;
          const lessons = list(step.lessons, `${at}: "lessons"`);
          const title = text(step.title, `${at}: "title"`, true);
          if (!title && lessons.length === 0) problems.push(`${at} needs a "title" or a list of "lessons".`);
          steps.push({
            title: title ?? "",
            minutes: whole(step.minutes, `${at}: "minutes"`),
            lessons,
            do: text(step.do, `${at}: "do"`) ?? "",
            group: text(step.group, `${at}: "group"`, true),
            note: text(step.note, `${at}: "note"`, true),
          });
        });
      }
      rawModules.push({
        module: number,
        tools: list(mod.tools, `${where}: "tools"`),
        prepare: list(mod.prepare, `${where}: "prepare"`),
        links,
        steps,
      });
    });
  }

  if (problems.length > 0) throw contentError(FILE, problems);

  const [modules, skills] = await Promise.all([getModules(), getSkillsChecks()]);
  const sheets: RunSheet[] = [];
  for (const mod of modules) {
    const raw = rawModules.find((m) => m.module === mod.number);
    if (raw) sheets.push(buildSheet(raw, mod, sessionMinutes, skills.pages.some((p) => p.after === mod.number)));
  }

  return {
    sessionMinutes,
    deliverableMarks,
    rubric: {
      pointsPerCriterion,
      total: pointsPerCriterion * skills.checklist.length,
      criteria: skills.checklist.map((group) => ({ criterion: group.criterion, items: group.items.map((item) => item.text) })),
      bands,
    },
    sheets,
  };
});

export async function getRunSheet(number: number): Promise<RunSheet | null> {
  const { sheets } = await getKit();
  return sheets.find((sheet) => sheet.module.number === number) ?? null;
}

function buildSheet(raw: RawModule, full: Module, sessionMinutes: number, hasSkillsCheck: boolean): RunSheet {
  const outOfDate: string[] = [];
  const lite = (lesson: Lesson): KitLesson => ({
    id: lesson.id,
    number: lesson.number,
    slug: lesson.slug,
    title: lesson.title,
    duration: lesson.duration,
    summary: lesson.summary,
    recap: lesson.recap,
    requiresAccount: lesson.requiresAccount,
    href: lesson.href,
  });
  const mod: KitModule = { number: full.number, title: full.title, summary: full.summary, lessons: full.lessons.map(lite) };
  let clock = 0;
  const steps = raw.steps.map((step) => {
    const lessons = step.lessons.flatMap((slug) => {
      const lesson = mod.lessons.find((l) => l.slug === slug);
      if (!lesson) outOfDate.push(`The run sheet lists a lesson "${slug}", which Module ${mod.number} doesn't have.`);
      return lesson ? [lesson] : [];
    });
    const from = clock;
    clock += step.minutes;
    return {
      ...step,
      title: step.title || lessons.map((l) => l.title).join(" and ") || step.lessons.join(", "),
      lessons,
      from,
      to: clock,
    };
  });
  const covered = new Set(steps.flatMap((step) => step.lessons.map((l) => l.slug)));
  for (const lesson of mod.lessons) {
    if (!covered.has(lesson.slug)) outOfDate.push(`Lesson ${lesson.number}, ${lesson.title}, isn't in the run sheet yet.`);
  }
  if (clock !== sessionMinutes) outOfDate.push(`The suggested timings add up to ${clock} minutes, not ${sessionMinutes}.`);

  const keyTerms = full.lessons.flatMap((lesson) =>
    [...lesson.source.matchAll(/<KeyTerm\s+term=(["'])(.*?)\1\s*>([\s\S]*?)<\/KeyTerm>/g)].map((m) => ({
      title: m[2],
      source: m[3].trim(),
      lessonId: lesson.id,
      file: lesson.file,
    })),
  );

  let challenge: Snippet | null = null;
  for (const lesson of full.lessons) {
    const m = /<Challenge\s+title=(["'])(.*?)\1\s*>([\s\S]*?)<\/Challenge>/.exec(lesson.source);
    if (m) challenge = { title: m[2], source: m[3].trim(), lessonId: lesson.id, file: lesson.file };
  }

  const downloads = full.lessons.flatMap((lesson) =>
    [...lesson.source.matchAll(/<a\s+href="(\/lessons\/[^"]+)"[^>]*\bdownload\b[^>]*>([^<]*)<\/a>/g)].map((m) => ({
      href: m[1],
      label: m[2].trim() || m[1].split("/").pop() || m[1],
      lesson: lesson.number,
    })),
  );

  return {
    module: mod,
    tools: raw.tools,
    prepare: raw.prepare,
    links: raw.links,
    downloads,
    steps,
    totalMinutes: clock,
    handsOn: mod.lessons.filter((lesson) => lesson.requiresAccount),
    keyTerms,
    challenge,
    quizHref: full.quiz ? quizHref(mod.number) : null,
    skillsCheckHref: hasSkillsCheck ? skillsCheckHref(mod.number) : null,
    outOfDate,
  };
}

/** Kit page routes: /run-it/script, /run-it/script/module-3 and so on. */
export const KIT_PAGES = {
  script: {
    title: "Facilitator script",
    description: "What to say and do at each step of a 90-minute session, with suggested timings.",
  },
  handout: {
    title: "Student handout",
    description: "One page per module for learners: the key ideas, the key terms and the Challenge.",
  },
  checklist: {
    title: "Pre-session checklist",
    description: "Laptops, access for the hands-on tools, and the files and links to have ready.",
  },
} as const;

export type KitPage = keyof typeof KIT_PAGES;

export const kitHref = (page: KitPage, module?: number) =>
  module === undefined ? `/run-it/${page}` : `/run-it/${page}/module-${module}`;
