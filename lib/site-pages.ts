import type { Kit } from "@/lib/facilitator";
import type { Outline } from "@/lib/outline";

// The site's own pages: each one's title and description (its metadata), and
// the headings and opening lines of the sections search links to. The pages
// read them from here and so does the site search (lib/search-index.ts), so a
// search result always says what the page it opens says.

export type PageInfo = { href: string; title: string; description: string };

export const PAGES = {
  about: {
    href: "/about",
    title: "About",
    description: "Code for All is a free course in building with AI tools, made by students at Singapore American School.",
  },
  access: {
    href: "/access",
    title: "Hands-on access",
    description: "How access works for the hands-on parts of Code for All, and what works without it.",
  },
  runIt: {
    href: "/run-it",
    title: "Run a session",
    description:
      "Everything teachers, volunteers and club leaders need to run Code for All: run sheets, a facilitator script, a student handout and a pre-session checklist for every module.",
  },
  moveProgress: {
    href: "/move-progress",
    title: "Move my progress",
    description:
      "Carry your Code for All progress to another device with a code, a QR code or a file. No account needed, and nothing is sent to a server.",
  },
  privacy: {
    href: "/privacy",
    title: "Privacy",
    description:
      "Code for All has no accounts and collects nothing. Progress stays in your browser, and practice prompts aren't stored.",
  },
  quizzes: {
    href: "/quizzes",
    title: "Quizzes",
    description:
      "Every Code for All quiz in one place: each module's quiz and the Check your skills quizzes, with your last score and the lessons to look at again.",
  },
  glossary: {
    href: "/glossary",
    title: "Glossary",
    description: "Every key term from the Code for All lessons, A to Z, with what it means and the lesson that explains it.",
  },
  contents: {
    href: "/contents",
    title: "Contents",
    description:
      "Every Code for All module and lesson, with your progress, mastery levels and quiz scores. Pick a module to see its lessons.",
  },
} satisfies Record<string, PageInfo>;

/** A page's metadata: `export const metadata = pageMetadata("privacy")`. */
export const pageMetadata = (page: keyof typeof PAGES) => ({ title: PAGES[page].title, description: PAGES[page].description });

/** A section of a page: its anchor, its heading and the first line under it. */
export type PageSection = { id: string; title: string; description: string };

/** /access: the device guide and what it costs. */
export const ACCESS_SECTIONS = {
  devices: {
    id: "devices",
    title: "Which device do you have?",
    description: "Reading, practice and quizzes work on anything with a browser. The building parts depend on your device.",
  },
  cost: {
    id: "cost",
    title: "What does it cost?",
    description: "Nothing. The course is free, and every tool it uses is either free or comes through your Code for All access.",
  },
} satisfies Record<string, PageSection>;

/** The numbers /run-it's sections mention, worked out from the kit and the course plan. */
export type RunItFacts = { range: string; sessions: number; minutes: number };

export function runItFacts(kit: Kit, outline: Outline): RunItFacts {
  const covered = kit.sheets.map((sheet) => sheet.module.number);
  return {
    range: covered.length > 1 ? `Modules ${covered[0]} to ${covered[covered.length - 1]}` : `Module ${covered[0]}`,
    sessions: outline.phases.flatMap((phase) => phase.modules).length,
    minutes: kit.sessionMinutes,
  };
}

/** /run-it's sections. The first line under some headings has numbers in it. */
export const RUN_IT_SECTIONS = {
  kit: {
    id: "kit",
    title: "The session kit",
    description: ({ range }: RunItFacts) => `Open it online, or print it. Each one covers ${range}, with a page per module.`,
  },
  howItRuns: {
    id: "how-it-runs",
    title: "How LaunchLab runs",
    description: ({ sessions, minutes }: RunItFacts) =>
      `Code for All is adapted from LaunchLab, a free course of ${sessions} weekly sessions of ${minutes} minutes.`,
  },
  runSheets: {
    id: "run-sheets",
    title: "Run sheets",
    description: ({ minutes }: RunItFacts) =>
      `One for each module: what to prepare, suggested timings for a ${minutes}-minute session, and the group version of the activities the lessons turned into solo ones.`,
  },
  contact: {
    id: "contact",
    title: "Talk to the team",
    description: () => "Planning a session, or have a question about the kit? We'd love to hear from you.",
  },
} satisfies Record<string, Omit<PageSection, "description"> & { description: (facts: RunItFacts) => string }>;
