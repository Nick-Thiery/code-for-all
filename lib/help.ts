import { site } from "@/lib/site";

// The Help page's questions and answers (app/help/page.tsx), kept here so the
// site search (lib/search-index.ts) finds them too. Each id is the question's
// anchor on the page, /help#no-laptop, so keep ids as they are: Stuck boxes
// and search results link to them.
//
// An answer is a list of paragraphs, plus at most a prompt block. A paragraph
// is plain text with [links](/like-this): a link starting with "/" stays on
// the site, anything else (the contact address) is an ordinary link.

export type HelpBlock = { kind: "text"; text: string } | { kind: "prompt"; title: string; text: string };

export type HelpQuestion = {
  /** The anchor on /help, like "no-laptop". */
  id: string;
  question: string;
  answer: HelpBlock[];
};

const ERROR_PROMPT = `Something broke and I don't know why. Here's the error, copied exactly:

<paste the error here>

What I did: <what you clicked or typed>
What I expected: <what should have happened>
What happened instead: <what you saw>

Please explain what the error means in simple words, then tell me the first thing to try.`;

const text = (value: string): HelpBlock => ({ kind: "text", text: value });

export const helpQuestions: HelpQuestion[] = [
  {
    id: "no-laptop",
    question: "I don't have a laptop.",
    answer: [
      text(
        "You can still do most of the course. Reading, practice and quizzes work on a phone, an iPad or any device with a browser, and your progress is saved on it.",
      ),
      text(
        "The building parts (Lovable, Claude Code, GitHub and so on) need a laptop or a Chromebook. Do those in a [Code for All session](/access), where there's a laptop to use, or on a shared or school computer. Read the hands-on lessons anyway, so you know every step when you get there. [Which device do you have?](/access#devices)",
      ),
    ],
  },
  {
    id: "blocked-installs",
    question: "My school device won't let me install things.",
    answer: [
      text(
        "That's fine for almost everything: Lovable, Claude, Claude Design, GitHub, Vercel, Supabase and Excel on the web all run in the browser, with nothing to install.",
      ),
      text(
        "The one exception is the Claude Code app in [Module 3](/module-3/install-claude-code). On a device that blocks installs, use Claude Code on the web instead (it runs in the browser and needs a GitHub account, which you set up in [Module 6](/module-6)), or a session laptop. The [device guide](/access#devices) has the details.",
      ),
    ],
  },
  {
    id: "cant-sign-up",
    question: "I can't sign up for a tool.",
    answer: [
      text(
        "You're not meant to. Nobody on this course signs up for Lovable or Claude themselves: access comes through a [Code for All session](/access), or a teacher running one. The GitHub, Vercel and Supabase steps are done in a session too, with your teacher's go-ahead.",
      ),
      text(
        "Everything is free. If a tool asks you for a bank card, stop: that's the wrong page or the wrong plan. Ask in your session.",
      ),
    ],
  },
  {
    id: "limited-data",
    question: "My internet or data is limited.",
    answer: [
      text(
        "The lessons are mostly text, so they use very little data. Videos are the big cost: they only load when you press play, and every video has a plain link so you can watch it later on Wi-Fi instead.",
      ),
      text(
        "Lessons you've already opened keep working without a connection, so open the ones you want while you have Wi-Fi. The building tools (Lovable, Claude Code) need a live connection, so save those for a session or somewhere with Wi-Fi.",
      ),
    ],
  },
  {
    id: "lost-progress",
    question: "I'm on a new device and my progress is gone.",
    answer: [
      text(
        "Your progress, quiz results and saved work live in the browser of the device you used, not in an account, so a new device or a different browser starts empty. Nothing is lost: it's still on the old device.",
      ),
      text(
        "Use [Move my progress](/move-progress) on the old device to carry it across with a code, a QR code or a file. Keep your prompts and project ideas in your own notes too, so they follow you anywhere.",
      ),
    ],
  },
  {
    id: "broke",
    question: "Something broke and I don't know why.",
    answer: [
      text(
        "First, read the red text. An error is information, not failure: it usually names the file and the line. Then give Claude the whole story. Copy this, fill in the gaps, and paste it into Claude or Claude Code:",
      ),
      { kind: "prompt", title: "Here's the error, please help", text: ERROR_PROMPT },
      text(
        "[When it breaks (and it will)](/module-5/when-it-breaks) shows where to find the error in your browser. Every hands-on lesson also has a Stuck? box near the end with the most common fixes for that step.",
      ),
    ],
  },
  {
    id: "word",
    question: "What does this word mean?",
    answer: [
      text(
        "Tap any word with a dotted underline in a lesson and its meaning appears right there. The [glossary](/glossary) has every key term from the course, A to Z, with the lesson that explains it.",
      ),
    ],
  },
  {
    id: "ask",
    question: "Who can I ask?",
    answer: [
      text(
        `In a [Code for All session](/access), ask the tutor or teacher: that's what they're there for. Working alone? Ask Claude, using the prompt above, or a friend, parent or teacher. And you can always [contact us](${site.contactHref}).`,
      ),
    ],
  },
];

/** One piece of a paragraph: plain text, or a link. */
export type HelpSegment = { text: string; href?: string };

/** "Do those in a [session](/access)." as text and link pieces, for rendering. */
export function helpSegments(paragraph: string): HelpSegment[] {
  const segments: HelpSegment[] = [];
  let last = 0;
  for (const match of paragraph.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
    if (match.index > last) segments.push({ text: paragraph.slice(last, match.index) });
    segments.push({ text: match[1], href: match[2] });
    last = match.index + match[0].length;
  }
  if (last < paragraph.length) segments.push({ text: paragraph.slice(last) });
  return segments;
}

/** An answer's first paragraph as plain text: what the search shows under the question. */
export function helpSummary(question: HelpQuestion): string {
  const first = question.answer.find((block) => block.kind === "text");
  return first ? helpSegments(first.text).map((segment) => segment.text).join("") : "";
}
