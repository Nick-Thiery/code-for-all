// Mock grading, until real grading exists. Two parts:
//
// 1. mockGrade(): what POST /api/practice answers. It copies the design's
//    stand-in rules: no website words = off-topic, "beginner" or "HTML file"
//    = strong, under 90 characters = weak, otherwise middling.
// 2. Fixtures: add ?mock=<name> to any lesson URL and every practice card on
//    the page opens in that state. One per state in the design
//    (design/PracticeBlock.dc.html): empty, near, loading, weak, middling,
//    strong, offtopic, error, hourly, daily.
//
// Everything here is written for the sample task "build your own one-page
// personal website", like the design.

import type { PracticeError, PracticeResponse, PracticeSubmission, Score } from "@/lib/practice";

const WEAK = "make me a website about me make it nice";
const MID =
  "Build a one-page website with my name Aisyah at the top, a section about my cat Mochi, and a section about badminton. Use purple and white.";
const ADD = "I'm a beginner, so please make it a single HTML file I can open by double-clicking.";
const STRONG = `${MID} ${ADD}`;
const OFF = "what's the best phone to buy under $300";
const LONG =
  "Build a one-page personal website for me. My name is Aisyah and I'm 14. Put my name at the top in big, friendly letters, with a short line under it that says I like cats, badminton and drawing. Then add a section about my cat Mochi. She is grey and white, very lazy, and sleeps on my school bag every morning. Add space for three photos of her in a row. After that, add a section about badminton. I play with my cousins every Saturday at the community centre near my block, and I want to show my favourite players and a few tips I learned. Then add a small section with my drawings, like a gallery with four boxes. Use purple and white, with rounded corners and a calm, clean feel, a bit like a notebook. The font should be easy to read. At the bottom, put a friendly message that says thanks for visiting. I'm a beginner, so please make it a single HTML file I can open by double-clicking. Please explain each part of the code in simple words so I can change the colours and text later by myself. Also make sure it looks good on a phone, because my friends will mostly open it after school.";

type Graded = Extract<PracticeResponse, { status: "graded" }>;
type Result = Omit<Graded, "status" | "taskId">;

const RESULTS: Record<"weak" | "middling" | "strong", Result> = {
  weak: {
    scores: [0, 1, 1],
    headline: "You've got the idea. Now let's show it what's in your head.",
    fix: {
      kind: "quote",
      quote: "make it nice",
      why: "The AI can't see what you're imagining, so it will guess, and its guess won't look like you.",
      try: "Name a color, a feeling, or a website you like the look of.",
    },
    rewrite: [
      { text: "Make me a one-page website about me. " },
      { text: "Use dark blue and white with a calm, clean feel. Put my name at the top in big letters.", added: true },
    ],
    rewriteLabel: "Your prompt, improved",
  },
  middling: {
    scores: [2, 1, 2],
    headline: "Really clear. One small addition makes this work first try.",
    fix: {
      kind: "missing",
      add: "Tell it you're a beginner and want one file you can open by double-clicking.",
      why: "Otherwise it may set up tools you don't have installed.",
    },
    rewrite: [{ text: `${MID} ` }, { text: ADD, added: true }],
    rewriteLabel: "Your prompt, improved",
  },
  strong: {
    scores: [2, 2, 2],
    headline: "This is a prompt a professional would write.",
    fix: { kind: "stretch", text: "Ask it to make the page look good on a phone too." },
    rewrite: [{ text: `${STRONG} ` }, { text: "Make sure it looks good on a phone too.", added: true }],
    rewriteLabel: "Your prompt, with the challenge added",
  },
};

export const MOCK_NAMES = [
  "empty",
  "near",
  "loading",
  "weak",
  "middling",
  "strong",
  "offtopic",
  "error",
  "hourly",
  "daily",
] as const;
export type MockName = (typeof MOCK_NAMES)[number];

export function isMockName(value: unknown): value is MockName {
  return typeof value === "string" && (MOCK_NAMES as readonly string[]).includes(value);
}

/** How the practice card starts for each ?mock= fixture. */
export const MOCK_FIXTURES: Record<
  MockName,
  {
    /** Prefilled in the prompt box. */
    text: string;
    /** "submit" sends the prompt straight away with ?mock=<name>; "loading" waits forever. */
    start: "idle" | "submit" | "loading";
    /** Scores from a pretend earlier try, so "Since your last try" shows. */
    previousScores?: [Score, Score, Score];
  }
> = {
  empty: { text: "", start: "idle" },
  near: { text: LONG, start: "idle" },
  loading: { text: MID, start: "loading" },
  weak: { text: WEAK, start: "submit" },
  middling: { text: MID, start: "submit" },
  strong: { text: STRONG, start: "submit", previousScores: [2, 1, 2] },
  offtopic: { text: OFF, start: "submit" },
  error: { text: MID, start: "submit" },
  hourly: { text: STRONG, start: "submit" },
  daily: { text: MID, start: "submit" },
};

/** The server's answer: HTTP status plus JSON body. */
export function mockGrade(
  submission: PracticeSubmission,
  mock: MockName | null,
): { status: number; body: PracticeResponse | PracticeError } {
  const { taskId, prompt } = submission;
  switch (mock) {
    case "error":
      return { status: 500, body: { error: "Mock error: ?mock=error always fails." } };
    case "hourly":
    case "daily":
      return { status: 429, body: { status: "limited", scope: mock } };
    case "offtopic":
      return { status: 200, body: { status: "offtopic", taskId } };
    case "weak":
    case "middling":
    case "strong":
      return { status: 200, body: { status: "graded", taskId, ...RESULTS[mock] } };
  }

  const text = prompt.toLowerCase();
  if (!/(web|site|page|html)/.test(text)) return { status: 200, body: { status: "offtopic", taskId } };
  const key = /beginner|double-click|html file/.test(text) ? "strong" : prompt.length < 90 ? "weak" : "middling";
  return { status: 200, body: { status: "graded", taskId, ...RESULTS[key] } };
}

