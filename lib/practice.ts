/** What <PromptPractice> sends to POST /api/practice. */
export type PracticeSubmission = {
  taskId: string;
  prompt: string;
};

export function isPracticeSubmission(value: unknown): value is PracticeSubmission {
  if (typeof value !== "object" || value === null) return false;
  const { taskId, prompt } = value as Record<string, unknown>;
  return typeof taskId === "string" && taskId !== "" && typeof prompt === "string";
}

/** The prompt box stops accepting text here. */
export const PROMPT_MAX = 1200;
/** The counter turns accent from here, with a nudge to keep it short. */
export const PROMPT_NEAR = 1000;

/** The three things every prompt is scored on, in order. */
export const SKILLS = [
  { name: "Specificity", meaning: "Did you say exactly what you want?" },
  { name: "Context", meaning: "Did you tell it what it needs to know about your situation?" },
  { name: "Scope", meaning: "Did you ask for the right amount at once?" },
] as const;

/** 0 = Not yet, 1 = Getting there, 2 = Nailed it. */
export type Score = 0 | 1 | 2;
export const SCORE_WORDS = ["Not yet", "Getting there", "Nailed it"] as const;

/** The one thing to try next. */
export type Fix =
  /** Points at the learner's own words. `quote` must appear in their prompt. */
  | { kind: "quote"; quote: string; why: string; try: string }
  /** Something the prompt doesn't have yet. */
  | { kind: "missing"; add: string; why: string }
  /** The prompt is already strong: a stretch goal. */
  | { kind: "stretch"; text: string };

/** The improved prompt, in pieces. `added` pieces are underlined as new. */
export type RewritePart = { text: string; added?: boolean };

/**
 * What POST /api/practice answers with.
 *
 * - 200 `graded`: scores and feedback.
 * - 200 `offtopic`: the prompt isn't an attempt at this task.
 * - 429 `limited`: too many tries, this hour or for everyone today.
 * - 400 / 500 `{ error }`: something went wrong.
 */
export type PracticeResponse =
  | {
      status: "graded";
      taskId: string;
      scores: [Score, Score, Score];
      headline: string;
      fix: Fix;
      rewrite: RewritePart[];
      rewriteLabel: string;
    }
  | { status: "offtopic"; taskId: string }
  | { status: "limited"; scope: "hourly" | "daily" };

export type PracticeError = { error: string };
