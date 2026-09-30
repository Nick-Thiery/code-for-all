import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { PromptBlock } from "@/components/prompt-block";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Help",
  description:
    "Short answers for learners: no laptop, a school device that blocks installs, can't sign up, limited data, lost progress, something broke, what a word means, and who to ask.",
};

// Pages other pull requests add. Linked only once they exist in this build,
// so this page is never a dead link.
const hasPage = (route: string) => fs.existsSync(path.join(process.cwd(), "app", route, "page.tsx"));
const moveProgress = hasPage("move-progress");
const offline = fs.existsSync(path.join(process.cwd(), "public", "sw.js"));

const ERROR_PROMPT = `Something broke and I don't know why. Here's the error, copied exactly:

<paste the error here>

What I did: <what you clicked or typed>
What I expected: <what should have happened>
What happened instead: <what you saw>

Please explain what the error means in simple words, then tell me the first thing to try.`;

export default function HelpPage() {
  const questions: { id: string; q: string; a: React.ReactNode }[] = [
    {
      id: "no-laptop",
      q: "I don't have a laptop.",
      a: (
        <>
          <p className="m-0">
            You can still do most of the course. Reading, practice and quizzes work on a phone, an iPad or any device
            with a browser, and your progress is saved on it.
          </p>
          <p className="m-0">
            The building parts (Lovable, Claude Code, GitHub and so on) need a laptop or a Chromebook. Do those in a{" "}
            <Link href="/access">Code for All session</Link>, where there&apos;s a laptop to use, or on a shared or
            school computer. Read the hands-on lessons anyway, so you know every step when you get there.{" "}
            <Link href="/access#devices">Which device do you have?</Link>
          </p>
        </>
      ),
    },
    {
      id: "blocked-installs",
      q: "My school device won't let me install things.",
      a: (
        <>
          <p className="m-0">
            That&apos;s fine for almost everything: Lovable, Claude, Claude Design, GitHub, Vercel, Supabase and Excel on
            the web all run in the browser, with nothing to install.
          </p>
          <p className="m-0">
            The one exception is the Claude Code app in <Link href="/module-3/install-claude-code">Module 3</Link>. On a
            device that blocks installs, use Claude Code on the web instead (it runs in the browser and needs a GitHub
            account, which you set up in <Link href="/module-6">Module 6</Link>), or a session laptop. The{" "}
            <Link href="/access#devices">device guide</Link> has the details.
          </p>
        </>
      ),
    },
    {
      id: "cant-sign-up",
      q: "I can't sign up for a tool.",
      a: (
        <>
          <p className="m-0">
            You&apos;re not meant to. Nobody on this course signs up for Lovable or Claude themselves: access comes
            through a <Link href="/access">Code for All session</Link>, or a teacher running one. The GitHub, Vercel and
            Supabase steps are done in a session too, with your teacher&apos;s go-ahead.
          </p>
          <p className="m-0">
            Everything is free. If a tool asks you for a bank card, stop: that&apos;s the wrong page or the wrong plan.
            Ask in your session.
          </p>
        </>
      ),
    },
    {
      id: "limited-data",
      q: "My internet or data is limited.",
      a: (
        <>
          <p className="m-0">
            The lessons are mostly text, so they use very little data. Videos are the big cost: they only load when you
            press play, and every video has a plain link so you can watch it later on Wi-Fi instead.
          </p>
          <p className="m-0">
            {offline
              ? "Lessons you've already opened keep working without a connection, so open the ones you want while you have Wi-Fi. "
              : ""}
            The building tools (Lovable, Claude Code) need a live connection, so save those for a session or somewhere
            with Wi-Fi.
          </p>
        </>
      ),
    },
    {
      id: "lost-progress",
      q: "I'm on a new device and my progress is gone.",
      a: (
        <>
          <p className="m-0">
            Your progress, quiz results and saved work live in the browser of the device you used, not in an account,
            so a new device or a different browser starts empty. Nothing is lost: it&apos;s still on the old device.
          </p>
          <p className="m-0">
            {moveProgress ? (
              <>
                Use <Link href="/move-progress">Move my progress</Link> on the old device to carry it across with a code,
                a QR code or a file.{" "}
              </>
            ) : (
              <>On the new device, tick the lessons you&apos;ve already finished at the end of each one. </>
            )}
            Keep your prompts and project ideas in your own notes too, so they follow you anywhere.
          </p>
        </>
      ),
    },
    {
      id: "broke",
      q: "Something broke and I don't know why.",
      a: (
        <>
          <p className="m-0">
            First, read the red text. An error is information, not failure: it usually names the file and the line. Then
            give Claude the whole story. Copy this, fill in the gaps, and paste it into Claude or Claude Code:
          </p>
          <PromptBlock text={ERROR_PROMPT} title="Here's the error, please help" />
          <p className="m-0">
            <Link href="/module-5/when-it-breaks">When it breaks (and it will)</Link> shows where to find the error in
            your browser. Every hands-on lesson also has a Stuck? box near the end with the most common fixes for that
            step.
          </p>
        </>
      ),
    },
    {
      id: "word",
      q: "What does this word mean?",
      a: (
        <>
          <p className="m-0">
            Tap any word with a dotted underline in a lesson and its meaning appears right there. The{" "}
            <Link href="/glossary">glossary</Link> has every key term from the course, A to Z, with the lesson that
            explains it.
          </p>
        </>
      ),
    },
    {
      id: "ask",
      q: "Who can I ask?",
      a: (
        <>
          <p className="m-0">
            In a <Link href="/access">Code for All session</Link>, ask the tutor or teacher: that&apos;s what they&apos;re
            there for. Working alone? Ask Claude, using the prompt above, or a friend, parent or teacher. And you can
            always <a href={site.contactHref}>contact us</a>.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="px-(--gut)">
      <article className="mx-auto flex max-w-[720px] flex-col gap-6 pt-(--hy) pb-12 tablet:pb-(--sec)">
        <header className="flex flex-col gap-3.5">
          <span className="eyebrow">Help</span>
          <h1 className="t-h1 m-0">Stuck? Start here.</h1>
          <p className="t-lead m-0">
            Short answers to the things that stop people most often. For the tools and accounts, see{" "}
            <Link href="/access">how hands-on access works</Link>.
          </p>
        </header>

        <nav aria-label="Questions on this page" className="rounded-2xl bg-tint p-(--pad)">
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {questions.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="inline-flex min-h-11 items-center font-bold">
                  {item.q}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {questions.map((item) => (
          <section key={item.id} id={item.id} aria-labelledby={`${item.id}-q`} className="flex scroll-mt-6 flex-col gap-3 border-t border-border pt-6">
            <h2 id={`${item.id}-q`} className="t-h3 m-0">
              {item.q}
            </h2>
            {item.a}
          </section>
        ))}

        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/access" className="btn btn-primary">
            How hands-on access works
          </Link>
          <Link href="/glossary" className="btn btn-secondary">
            Glossary
          </Link>
        </div>
      </article>
    </div>
  );
}
