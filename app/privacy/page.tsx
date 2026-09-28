import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/callout";
import { Hex, HexCheck } from "@/components/hex";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Code for All has no accounts and collects nothing. Progress stays in your browser, and practice prompts aren't stored.",
};

// Every claim here was checked against the code. If you change what the site
// stores or sends, update this page:
//   localStorage keys: lib/progress.ts, lib/quiz-results.ts, lib/certificate.ts, lib/theme.ts
//   offline copies of pages: public/sw.js
//   moving progress: lib/transfer.ts, app/move-progress/page.tsx
//   practice: components/prompt-practice.tsx, app/api/practice/route.ts
//   videos: components/video-embed.tsx
const summary = [
  "No accounts. Nobody signs up or logs in.",
  "Nothing collected. No names, no email addresses, no analytics, no adverts.",
  "Your progress, quiz results and lesson levels stay in this browser. You can move them to another device yourself, with a code that's never sent to us.",
  "Practice feedback sends only your prompt and which task it's for, and it isn't stored.",
];

const saved = [
  {
    name: "Lesson progress",
    key: "cfa:completed-lessons",
    what: "Which lessons you've finished: ticked with “I've finished this lesson”, or moved on from with the Next button at the end.",
  },
  {
    name: "Quiz results",
    key: "cfa:quiz-results",
    what: "For each quiz, your last score, which lessons to look at again, and when you took it. Not the answers you picked.",
  },
  {
    name: "Lesson levels",
    key: "cfa:mastery",
    what: "The level each lesson has reached in the quizzes, from Attempted to Mastered. Not your answers.",
  },
  {
    name: "Checklist ticks",
    key: "cfa:checklists",
    what: "What you've ticked on the Check your skills pages.",
  },
  {
    name: "Certificate name",
    key: "cfa:certificate-name",
    what: "The name you type for a certificate, so it's ready for the next one. Only if you type one; clear the box to forget it.",
  },
  {
    name: "Light or dark mode",
    key: "cfa:theme",
    what: "Saved only if you use the switch in the header. Until then, the site follows your device's setting.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="px-(--gut)">
      <article className="mx-auto flex max-w-[720px] flex-col gap-6 pt-(--hy) pb-12 tablet:pb-(--sec)">
        <header className="flex flex-col gap-3.5">
          <span className="eyebrow">For learners, parents and schools</span>
          <h1 className="t-h1 m-0">Privacy</h1>
          <p className="t-lead m-0">
            Code for All is a course you can use without telling us anything about yourself. Here&apos;s what the site
            keeps, where it keeps it, and how to delete it.
          </p>
        </header>

        <section
          aria-labelledby="short-version"
          className="flex flex-col gap-3.5 rounded-[20px] border-[1.5px] border-border p-(--pad)"
        >
          <h2 id="short-version" className="t-h3 m-0">
            The short version
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {summary.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Hex width={22} height={24} shape="fill-accent" className="mt-[3px] flex-none">
                  <HexCheck className="stroke-on-accent stroke-[2.4]" />
                </Hex>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <h2 className="t-h2 mt-6 mb-0">What&apos;s saved in your browser</h2>
        <p className="m-0">
          To remember where you are, the site saves a few small notes in your browser&apos;s local storage. They stay
          on this device, in this browser, and are never sent to us or anyone else. That&apos;s also why your progress
          doesn&apos;t follow you to another device.
        </p>
        <dl className="m-0 flex flex-col gap-4">
          {saved.map((item) => (
            <div key={item.key} className="flex flex-col gap-1 border-l-4 border-track pl-4">
              <dt className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                <span className="font-bold">{item.name}</span>
                <code className="font-mono text-[15px] text-muted">{item.key}</code>
              </dt>
              <dd className="m-0">{item.what}</dd>
            </div>
          ))}
        </dl>

        <h3 className="t-h3 mt-2 mb-0">Pages saved for offline</h3>
        <p className="m-0">
          The site also keeps a copy of each page you open, so lessons and quizzes you&apos;ve already read still
          work when you have no signal. That copy is the page itself, nothing about you, and it&apos;s replaced by
          the new version the next time you&apos;re online after the site is updated.
        </p>

        <h3 className="t-h3 mt-2 mb-0">How to delete it</h3>
        <p className="m-0">
          Clear this site&apos;s data in your browser&apos;s settings (it&apos;s usually listed with cookies and site
          data). Everything above goes for good: there&apos;s no other copy, so your progress can&apos;t be brought
          back afterwards.
        </p>

        <h2 className="t-h2 mt-6 mb-0">Moving your progress to another device</h2>
        <p className="m-0">
          Because your progress stays on one device, there&apos;s a page called{" "}
          <Link href="/move-progress">Move my progress</Link> for taking it with you. It turns the notes above
          (which lessons you&apos;ve done, and their levels) into a code. You copy the code, scan it as a QR code, or
          download it as a small file, then load it on the other device.
        </p>
        <p className="m-0">
          The code is made by your browser and read by your browser. It is never sent to us. The QR code opens the
          Move my progress page with the code after a &quot;#&quot; in the address, and browsers don&apos;t send that
          part to any server. The code holds nothing about you: no name, no email, nothing you typed. Anyone you give
          the code to could load your progress onto their device, so treat it like a password to your progress and
          only share it with yourself.
        </p>

        <h2 className="t-h2 mt-6 mb-0">Practice feedback</h2>
        <p className="m-0">
          When you press <strong>Get feedback</strong> on a practice card, your browser sends two things to the Code
          for All server: the prompt you wrote, and which practice task it&apos;s for. The server uses them to work out
          your feedback and sends it straight back. It doesn&apos;t store your prompt or write it to a log. Nothing
          else from the site goes with it, not even your progress.
        </p>
        <p className="m-0">Your prompt isn&apos;t saved in your browser either. It&apos;s gone when you leave the page.</p>
        <Callout kind="tip">
          <p>
            The practice doesn&apos;t need real personal details. If a task asks about you, made-up ones work just as
            well.
          </p>
        </Callout>

        <h2 className="t-h2 mt-6 mb-0">Videos</h2>
        <p className="m-0">
          Some lessons include a YouTube video. They use YouTube&apos;s privacy-enhanced mode (youtube-nocookie.com),
          and the player only loads when you scroll near it. The player itself comes from YouTube, so on those pages
          your browser connects to YouTube, and YouTube&apos;s own privacy terms apply to the player and to any video
          you play. Every video also has a plain link to watch it on YouTube instead.
        </p>

        <h2 className="t-h2 mt-6 mb-0">Everything else</h2>
        <p className="m-0">
          The site sets no cookies and has no analytics, adverts or trackers. Its fonts and images come from the site
          itself, not from other companies. Like almost every website, the service that hosts it may keep standard
          technical logs for a short time, such as the internet address each request came from.
        </p>
        <p className="m-0">
          Lessons link to other sites, like Lovable and GitHub. Once you follow a link, you&apos;re on their site and
          their privacy terms apply. The hands-on parts of some lessons use accounts on those tools, set up through a
          Code for All session: see <Link href="/access">how hands-on access works</Link>.
        </p>

        <h2 className="t-h2 mt-6 mb-0">Questions</h2>
        <p className="m-0">
          Parents, carers and teachers are welcome to ask us anything about this page.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <a href={site.contactHref} className="btn btn-primary">
            Contact us
          </a>
        </div>
      </article>
    </div>
  );
}
