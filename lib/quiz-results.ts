import { useMemo, useSyncExternalStore } from "react";
import { type Answer, type LevelChange, type Levels, type QuizKind, applyQuiz, isLevel } from "@/lib/mastery";

// Quiz results, mastery levels and checklist ticks live in this browser only,
// like lesson progress (lib/progress.ts):
//   cfa:quiz-results  {"module-1/quiz": {correct, total, review, date}, ...}
//                     the last result of each quiz; `review` is lesson ids.
//   cfa:mastery       {"module-1/meet-lovable": "proficient", ...}
//                     each lesson's level (lib/mastery.ts). A lesson that
//                     isn't there is Not started.
//   cfa:checklists    {"module-5/check-your-skills": ["<item id>", ...], ...}
//                     the ticked items on each Check your skills page.
const RESULTS_KEY = "cfa:quiz-results";
const MASTERY_KEY = "cfa:mastery";
const CHECKLISTS_KEY = "cfa:checklists";
const KEYS = [RESULTS_KEY, MASTERY_KEY, CHECKLISTS_KEY];
const CHANGE_EVENT = "cfa:quiz-change";

export type QuizResult = {
  correct: number;
  total: number;
  /** Ids of the lessons behind the questions they got wrong, without repeats. */
  review: string[];
  /** When it was taken, as an ISO date. */
  date: string;
};

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || KEYS.includes(event.key)) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function read(key: string): string {
  try {
    return localStorage.getItem(key) ?? "{}";
  } catch {
    return "{}";
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return; // Storage is blocked (some private modes). Nothing to persist to.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function parseObject(raw: string): Record<string, unknown> {
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function parseResults(raw: string): Record<string, QuizResult> {
  const results: Record<string, QuizResult> = {};
  for (const [id, value] of Object.entries(parseObject(raw))) {
    const r = value as Partial<QuizResult> | null;
    if (
      r &&
      typeof r.correct === "number" &&
      typeof r.total === "number" &&
      r.total > 0 &&
      Array.isArray(r.review) &&
      typeof r.date === "string"
    ) {
      results[id] = { correct: r.correct, total: r.total, review: r.review.filter((x) => typeof x === "string"), date: r.date };
    }
  }
  return results;
}

/** Every saved quiz result. `ready` is false during the server render and hydration. */
export function useQuizResults() {
  const raw = useSyncExternalStore<string | null>(subscribe, () => read(RESULTS_KEY), () => null);
  const results = useMemo(() => (raw === null ? {} : parseResults(raw)), [raw]);
  return { results, ready: raw !== null };
}

export function saveQuizResult(id: string, result: QuizResult) {
  write(RESULTS_KEY, { ...parseResults(read(RESULTS_KEY)), [id]: result });
}

function parseLevels(raw: string): Levels {
  const levels: Levels = {};
  for (const [id, value] of Object.entries(parseObject(raw))) {
    if (isLevel(value) && value !== "not-started") levels[id] = value;
  }
  return levels;
}

/** Every lesson's mastery level. `ready` is false during the server render and hydration. */
export function useMastery() {
  const raw = useSyncExternalStore<string | null>(subscribe, () => read(MASTERY_KEY), () => null);
  const levels = useMemo(() => (raw === null ? {} : parseLevels(raw)), [raw]);
  return { levels, ready: raw !== null };
}

/** Move the levels of the lessons a finished quiz asked about. Returns what changed, for the summary. */
export function saveMastery(answers: readonly Answer[], kind: QuizKind): LevelChange[] {
  const levels = parseLevels(read(MASTERY_KEY));
  const changes = applyQuiz(levels, answers, kind);
  for (const change of changes) levels[change.lesson] = change.after;
  write(MASTERY_KEY, levels);
  return changes;
}

function parseChecklists(raw: string): Record<string, string[]> {
  const lists: Record<string, string[]> = {};
  for (const [id, value] of Object.entries(parseObject(raw))) {
    if (Array.isArray(value)) lists[id] = value.filter((x) => typeof x === "string");
  }
  return lists;
}

/** The ticked items on one checklist. */
export function useChecklist(id: string) {
  const raw = useSyncExternalStore<string | null>(subscribe, () => read(CHECKLISTS_KEY), () => null);
  const ticked = useMemo(() => new Set(raw === null ? [] : (parseChecklists(raw)[id] ?? [])), [raw, id]);
  return { ticked, ready: raw !== null };
}

export function setChecklistItem(id: string, item: string, on: boolean) {
  const lists = parseChecklists(read(CHECKLISTS_KEY));
  const ticked = new Set(lists[id] ?? []);
  if (on) ticked.add(item);
  else ticked.delete(item);
  write(CHECKLISTS_KEY, { ...lists, [id]: [...ticked] });
}
