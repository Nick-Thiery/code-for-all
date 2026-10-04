// Mock grading, until real grading exists. Per practice task:
//
// 1. A stand-in grader, answering POST /api/practice with canned feedback
//    at one of three levels (weak, middling, strong), picked by simple rules
//    built from the task's grading anchors in docs/course-map.md.
// 2. Fixtures: add ?mock=<name> to a lesson URL and every practice card on
//    the page opens in that state. One per state in the design
//    (design/PracticeBlock.dc.html): empty, near, loading, weak, middling,
//    strong, offtopic, error, hourly, daily.
//
// To mock a new task, add it to TASKS below.

import type { Fix, PracticeError, PracticeResponse, PracticeSubmission, Score } from "@/lib/practice";

type Graded = Extract<PracticeResponse, { status: "graded" }>;
type Result = Omit<Graded, "status" | "taskId">;
type Level = "weak" | "middling" | "strong";

type TaskMock = {
  /** Prompts for the fixtures. `near` should be over 1,000 characters. */
  texts: { weak: string; middling: string; strong: string; offtopic: string; near: string };
  results: Record<Level, Result>;
  /** The stand-in grader. */
  grade: (prompt: string) => Level | "offtopic";
  /** Optional: tailor the weak result's fix to what the learner wrote. */
  weakFix?: (prompt: string) => Fix;
};

// about-me-prompt (Module 1, lesson 4). Anchors from the course map:
// Specificity = names the pages and features it needs; Context = says who
// it's for and the design style; Scope = asks for one site, with a clear
// output. Common misses: no audience, no pages listed, vague style words
// like "modern" or "nice".
const ABOUT_ME = (() => {
  const weak = "Make a nice about me website";
  const middling =
    "Create an About me website for me. It should have a home page with my name and a short intro, a page about my hobbies (badminton and drawing) and a page for projects I've made. Make it modern and make sure it works well on phones.";
  const audience = "The site is for my classmates and teachers, so keep it friendly.";
  const strong = [
    "Role: You are an expert web designer.",
    "Goal: Create an About me website for me.",
    "Target audience: my classmates and teachers.",
    "Core pages: a home page with my name and a short intro, a hobbies page (badminton and drawing), and a projects page.",
    "Design style: light background, bold headings, friendly typography (not corporate).",
    "Output required: one responsive website that works well on phones.",
  ].join("\n");
  const near = [
    "Role: You are an expert web designer and front-end developer.",
    "Goal: Create an About me website for me.",
    "Target audience: my classmates, my teachers and the clubs I want to join at school.",
    "Core pages: a home page with my first name, a short friendly intro and a space for a picture; a hobbies page about badminton and drawing, with a small gallery of four drawings; a projects page listing things I've built, each with a title, one sentence and a button; and a page about what I'm learning right now, with a short list I can update every week.",
    "Design style: light background, bold headings, friendly rounded typography, soft blue and white colours, lots of space, not corporate and not too busy.",
    "Output required: one responsive website that works well on phones and laptops, with a simple menu at the top that links every page, and a short explanation of how to change the text and colours myself.",
    "Key features: clear buttons, easy navigation between pages, and text that stays easy to read at a large size.",
  ].join("\n");

  const mock: TaskMock = {
    texts: { weak, middling, strong, near, offtopic: "what's the best phone to buy under $300" },
    results: {
      weak: {
        scores: [0, 0, 1],
        headline: "You've got the idea. Now tell Lovable what's in your head.",
        fix: {
          kind: "quote",
          quote: "nice",
          why: "Lovable can't see what you mean by this, so it will guess, and its guess won't look like you.",
          try: "Name the pages you want, who the site is for, and the style: colours, fonts, a feeling.",
        },
        rewrite: [
          { text: "Make an About me website " },
          {
            text: "for my classmates and teachers. It needs a home page with my name and a short intro, a hobbies page and a projects page. Use a light background, bold headings and friendly fonts, and make it work well on phones.",
            added: true,
          },
        ],
        rewriteLabel: "Your prompt, improved",
      },
      middling: {
        scores: [2, 1, 2],
        headline: "Really clear. One small addition makes this fit you.",
        fix: {
          kind: "missing",
          add: "Say who the site is for, like: “The site is for my classmates and teachers.”",
          why: "Lovable picks the words, layout and tone for the people you name. With no audience, it has to guess.",
        },
        rewrite: [{ text: `${middling} ` }, { text: audience, added: true }],
        rewriteLabel: "Your prompt, improved",
      },
      strong: {
        scores: [2, 2, 2],
        headline: "This is a prompt a professional would write.",
        fix: {
          kind: "stretch",
          text: "Add a Key features line, like the strong prompt in this lesson: for example, clear buttons and easy navigation between pages.",
        },
        rewrite: [
          { text: `${strong}\n` },
          { text: "Key features: clear buttons and easy navigation between pages.", added: true },
        ],
        rewriteLabel: "Your prompt, with the challenge added",
      },
    },
    grade(prompt) {
      const text = prompt.toLowerCase();
      if (!/(site|page|portfolio|about me)/.test(text)) return "offtopic";
      const pages = new Set(text.match(/\b(home|hobbies|hobby|projects?|gallery|blog|skills|contact|resume|cv)\b/g) ?? []);
      const audience = /(audience|for my |for people|for students|for classmates|for teachers|for friends|visitors|who it's for)/.test(text);
      const style = /(colou?r|font|typography|background|heading|playful|minimal|calm|bold|friendly|style)/.test(text);
      if (audience && style && pages.size >= 2) return "strong";
      if (prompt.length < 90 || pages.size === 0) return "weak";
      return "middling";
    },
    weakFix(prompt) {
      // Quote their vaguest word if there is one; otherwise, ask for pages.
      const vague = /\b(nice|modern|cool|good|pretty|awesome|beautiful)\b/i.exec(prompt);
      if (vague) {
        return {
          kind: "quote",
          quote: vague[0],
          why: "Lovable can't see what you mean by this, so it will guess, and its guess won't look like you.",
          try: "Name the pages you want, who the site is for, and the style: colours, fonts, a feeling.",
        };
      }
      return {
        kind: "missing",
        add: "List the pages you want, like a home page, a hobbies page and a projects page.",
        why: "If you don't list the pages, Lovable decides what goes on your site for you.",
      };
    },
  };
  return mock;
})();

// refine-request (Module 2, lesson 3). Anchors from the course map:
// Specificity = says what the site should include; Context = says who it's
// for and how it should look ("clean, not too AI-generated"); Scope = pastes
// the original prompt and asks for a revision, not a new idea. Modelled on
// the slide's example message to Claude.
const REFINE_REQUEST = (() => {
  const weak = "can you make my lovable prompt better? its for a quiz";
  const original = "Make a personality quiz website with 10 questions and a results page.";
  const middlingStart =
    "Help me revise my prompt for Lovable. It's a personality quiz that tells you what kind of learner you are.";
  const middlingRest = `It should have a start page, 10 questions with four answers each, and a results page with study tips for each type. Use bright colours and big buttons. Here is my original prompt: ${original}`;
  const middling = `${middlingStart} ${middlingRest}`;
  const audience = "It's for students in my year, so it should look clean, not too AI-generated.";
  const strongMain =
    "Help me revise my prompt for Lovable to create a personality quiz website. The site should include a start page, 10 questions with four answers each, and a results page that explains your learner type with three study tips. It's for students in my year, so it should look clean and friendly, not too AI-generated, with bright colours and big buttons. Help with design too.";
  const strongOriginal = `Original prompt: ${original}`;
  const strong = `${strongMain}\n${strongOriginal}`;
  const near = [
    "Help me revise my prompt for Lovable to create an online store for the second-hand book club at my school. The site should include a home page with the newest books, a shop page where you can filter by subject and year level, a page for each book with a photo, the price, its condition and a button to reserve it, a basket page, and an about page that explains how the club works and where the money goes. It's for students and parents at my school, so it should look clean and friendly, not too AI-generated, with a white background, dark green headings, rounded buttons and big text that's easy to read on a phone or laptop. Include a search bar at the top of every page and a simple way for club members to add new books. Help with design too, and tell me if my prompt is still missing anything important.",
    "Here is my original prompt: Make an online store website for my school's book club where people can buy used textbooks. It needs a home page, a shop page and a page for each book. Make it look modern.",
  ].join("\n");

  // Did they paste the prompt they want revised?
  const pastedOriginal = /(original prompt|here'?s my prompt|here is my prompt|my prompt (?:is|was)|old prompt|first prompt|prompt:)/i;

  const pasteFix: Fix = {
    kind: "missing",
    add: "Paste your original prompt at the end, like the example: “Original prompt: …”, and say what the site should include.",
    why: "Claude can't revise a prompt it can't see. Without it, Claude has to guess, and you might get a new idea instead of a better version of yours.",
  };

  const mock: TaskMock = {
    texts: { weak, middling, strong, near, offtopic: "can you help me with my maths homework on fractions" },
    results: {
      weak: {
        scores: [0, 0, 1],
        headline: "Asking Claude for help is the right move. Now give it something to work with.",
        fix: pasteFix,
        rewrite: [
          { text: `${weak} ` },
          {
            text: `that tells you what kind of learner you are. It should have a start page, 10 questions and a results page. It's for students in my year, so it should look clean, not too AI-generated. Here's my original prompt: ${original}`,
            added: true,
          },
        ],
        rewriteLabel: "Your message, improved",
      },
      middling: {
        scores: [2, 1, 2],
        headline: "Clear and specific. One addition and Claude knows who it's for.",
        fix: {
          kind: "missing",
          add: "Say who the site is for, like: “It's for students in my year.”",
          why: "Claude can only make the prompt suit your audience if you tell it who they are. With no audience, it has to guess.",
        },
        rewrite: [{ text: `${middlingStart} ` }, { text: `${audience} `, added: true }, { text: middlingRest }],
        rewriteLabel: "Your message, improved",
      },
      strong: {
        scores: [2, 2, 2],
        headline: "This is a message Claude can really work with.",
        fix: {
          kind: "stretch",
          text: "Name one feature the site must have. For a quiz, that could be a button to share your result.",
        },
        rewrite: [
          { text: `${strongMain} ` },
          { text: "Include a button to share your result.", added: true },
          { text: `\n${strongOriginal}` },
        ],
        rewriteLabel: "Your message, with the challenge added",
      },
    },
    grade(prompt) {
      const text = prompt.toLowerCase();
      if (!/(prompt|site|website|lovable|page|quiz|store|shop|news)/.test(text)) return "offtopic";
      const includes = new Set(
        text.match(
          /\b(pages?|home|start|questions?|results?|articles?|headlines?|categor(?:y|ies)|products?|basket|cart|checkout|search|filter|menu|buttons?|sign in|sign out|log ?in|log ?out|about)\b/g,
        ) ?? [],
      );
      const pasted = pastedOriginal.test(prompt);
      const revise = /(revise|improve|better|refine|rewrite|fix|edit)/.test(text);
      const audience = /(audience|for (?:students|people|kids|teens|my (?:class|year|school|friends|classmates))|students|classmates|parents|readers|customers|teenagers|who it's for)/.test(text);
      const look = /(look|colou?r|font|design|style|clean|background|heading|layout|ai-generated)/.test(text);
      if (pasted && revise && audience && look && includes.size >= 2) return "strong";
      if (prompt.length < 80 || includes.size < 2) return "weak";
      return "middling";
    },
    weakFix(prompt) {
      // No original prompt pasted is the biggest miss; then vague words; then what the site includes.
      if (!pastedOriginal.test(prompt)) {
        return pasteFix;
      }
      const vague = /\b(nice|modern|cool|good|pretty|awesome|better)\b/i.exec(prompt);
      if (vague) {
        return {
          kind: "quote",
          quote: vague[0],
          why: "Claude can't tell what you mean by this, so it will guess.",
          try: "Say what the site should include, who it's for and how it should look, like “clean, not too AI-generated”.",
        };
      }
      return {
        kind: "missing",
        add: "Say what your site should include, like the pages and features it needs.",
        why: "If you don't say what the site should include, Claude decides for you.",
      };
    },
  };
  return mock;
})();

// bug-report (Module 5, lesson 5). Anchors from the course map:
// Specificity = pastes the exact error; Context = says what was clicked;
// Scope = says what was expected to happen. From the slide "When it breaks
// (and it will)", step 3: "Paste the exact error, then say what you clicked
// and what you expected to happen." The scenario (a sign-up button that does
// nothing, and one console error) is written in the lesson, not the slides.
const BUG_REPORT = (() => {
  const error = "Uncaught TypeError: Cannot read properties of null (reading 'value') at script.js:12";
  const weak = "my sign up button is broken can you fix it";
  const middling =
    "When I click the Sign up button on my website nothing happens. There's a red error in the console that says something about null. It should save what people type into the form.";
  const strong = [
    "When I fill in the sign-up form and click the Sign up button, nothing happens.",
    "I expected it to save what I typed.",
    "This is the exact error from the console:",
    error,
  ].join("\n");
  const near = [
    "Hi Claude, I need help with my website. It's for my school's coding club, so people need to be able to sign up before our first meeting on Friday. On the home page there's a sign-up form with a box for your name and a box for your email, and a big Sign up button under them. The button looks right, it just doesn't do anything.",
    "I typed my name and my email into the boxes and clicked the Sign up button, and nothing happened at all. The page didn't change, nothing got saved and no message came up.",
    "I pressed Ctrl+Shift+J to open the Console and this is the exact red error I saw:",
    error,
    "I expected the form to save what I typed and then tell me I'd signed up, because earlier I asked you to make the sign-up form really save what people type.",
    "I reloaded the page and tried again with a different email, and the same error came back. I also tried it on my phone and it didn't work there either.",
    "Can you find out what's wrong in script.js and fix it? Please tell me what you changed, then I'll reload and check it myself.",
  ].join("\n");

  // The three anchors, as simple checks.
  const pastesError = (text: string) =>
    /(typeerror|cannot read propert|reading 'value'|reading "value"|script\.js:\s?\d+)/.test(text);
  const saysClicked = (text: string) => /\b(click|clicked|clicking|press|pressed|tap|tapped|hit)\b/.test(text);
  const saysExpected = (text: string) =>
    /(expect|should|supposed to|meant to|want(ed)? it to|thought it would|was going to)/.test(text);

  const mock: TaskMock = {
    texts: { weak, middling, strong, near, offtopic: "can you recommend a good anime to watch this weekend" },
    results: {
      weak: {
        scores: [0, 1, 0],
        headline: "Good start. Now give Claude the whole story.",
        fix: {
          kind: "quote",
          quote: "broken",
          why: "Claude doesn't know what “broken” looks like on your site, so it has to guess where to look.",
          try: "Paste the exact error from the console, then say what you clicked and what you expected to happen.",
        },
        rewrite: [
          { text: "My sign up button is broken. " },
          {
            text: `When I click it, nothing happens. I expected it to save what people type. This is the exact error from the console:\n${error}\n`,
            added: true,
          },
          { text: "Can you fix it?" },
        ],
        rewriteLabel: "Your prompt, improved",
      },
      middling: {
        scores: [1, 2, 2],
        headline: "Nearly there. Claude still needs the exact error.",
        fix: {
          kind: "missing",
          add: "Paste the exact red error from the console, word for word, instead of describing it.",
          why: "The error names the file and the line where things went wrong. A description doesn't, so Claude has to guess where to look.",
        },
        rewrite: [
          { text: `${middling}\n` },
          { text: `This is the exact error from the console:\n${error}`, added: true },
        ],
        rewriteLabel: "Your prompt, improved",
      },
      strong: {
        scores: [2, 2, 2],
        headline: "That's the whole story. Claude knows exactly where to look.",
        fix: {
          kind: "stretch",
          text: "Say what you've already tried. For example, that you reloaded the page and the same error came back.",
        },
        rewrite: [
          { text: `${strong}\n` },
          { text: "I reloaded the page and tried again, and the same error came back.", added: true },
        ],
        rewriteLabel: "Your prompt, with the challenge added",
      },
    },
    grade(prompt) {
      const text = prompt.toLowerCase();
      if (!/(sign[\s-]?up|button|error|console|broken|bug|fix|click|form|script\.js|typeerror|null)/.test(text)) {
        return "offtopic";
      }
      const hits = [pastesError(text), saysClicked(text), saysExpected(text)].filter(Boolean).length;
      if (hits === 3) return "strong";
      if (hits <= 1 || prompt.length < 60) return "weak";
      return "middling";
    },
    weakFix(prompt) {
      const text = prompt.toLowerCase();
      if (!pastesError(text)) {
        // Quote their vaguest words if there are any; otherwise, ask for the error.
        const vague = /\b(broken|not working|doesn'?t work|won'?t work|an error|some error|a bug)\b/i.exec(prompt);
        if (vague) {
          return {
            kind: "quote",
            quote: vague[0],
            why: `Claude doesn't know what “${vague[0]}” looks like on your site, so it has to guess where to look.`,
            try: "Paste the exact error from the console, then say what you clicked and what you expected to happen.",
          };
        }
        return {
          kind: "missing",
          add: "Paste the exact red error from the console, word for word.",
          why: "The error names the file and the line where things went wrong. That's where Claude needs to look.",
        };
      }
      if (!saysClicked(text)) {
        return {
          kind: "missing",
          add: "Say what you clicked, like: “When I click the Sign up button, nothing happens.”",
          why: "Claude needs to know what you did right before it broke, so it can find the code behind it.",
        };
      }
      return {
        kind: "missing",
        add: "Say what you expected to happen, like: “I expected it to save what I typed.”",
        why: "Without it, Claude doesn't know what “fixed” should look like.",
      };
    },
  };
  return mock;
})();

const TASKS: Record<string, TaskMock> = {
  "about-me-prompt": ABOUT_ME,
  "refine-request": REFINE_REQUEST,
  "bug-report": BUG_REPORT,
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

export type MockFixture = {
  /** Prefilled in the prompt box. */
  text: string;
  /** "submit" sends the prompt straight away with ?mock=<name>; "loading" waits forever. */
  start: "idle" | "submit" | "loading";
  /** Scores from a pretend earlier try, so "Since your last try" shows. */
  previousScores?: [Score, Score, Score];
};

/** How the practice card starts for a ?mock= fixture, or null if the task has no mocks. */
export function mockFixture(taskId: string, mock: MockName): MockFixture | null {
  const task = TASKS[taskId];
  if (!task) return null;
  const { texts } = task;
  const fixtures: Record<MockName, MockFixture> = {
    empty: { text: "", start: "idle" },
    near: { text: texts.near, start: "idle" },
    loading: { text: texts.middling, start: "loading" },
    weak: { text: texts.weak, start: "submit" },
    middling: { text: texts.middling, start: "submit" },
    strong: { text: texts.strong, start: "submit", previousScores: task.results.middling.scores },
    offtopic: { text: texts.offtopic, start: "submit" },
    error: { text: texts.middling, start: "submit" },
    hourly: { text: texts.strong, start: "submit" },
    daily: { text: texts.middling, start: "submit" },
  };
  return fixtures[mock];
}

/** The server's answer: HTTP status plus JSON body. */
export function mockGrade(
  submission: PracticeSubmission,
  mock: MockName | null,
): { status: number; body: PracticeResponse | PracticeError } {
  const { taskId, prompt } = submission;
  const task = TASKS[taskId];
  if (!task) {
    return {
      status: 400,
      body: { error: `There's no mock grading for task "${taskId}" yet. Add it to TASKS in lib/practice-mock.ts.` },
    };
  }

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
      return { status: 200, body: { status: "graded", taskId, ...task.results[mock] } };
  }

  const level = task.grade(prompt);
  if (level === "offtopic") return { status: 200, body: { status: "offtopic", taskId } };
  const result = task.results[level];
  const fix = level === "weak" && task.weakFix ? task.weakFix(prompt) : result.fix;
  return { status: 200, body: { status: "graded", taskId, ...result, fix } };
}
