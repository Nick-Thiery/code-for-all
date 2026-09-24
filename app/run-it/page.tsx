import type { Metadata } from "next";
import Link from "next/link";
import { TodoLink } from "@/components/todo-link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Run a session",
  description: "Everything teachers, volunteers and club leaders need to run a Code for All session.",
};

// Minutes for each part of a 60-minute session. The timeline bar and the
// "0–8 min" labels are worked out from these.
const timeline = [
  { name: "Hook", minutes: 8, text: "Show a website a learner built with AI. Ask the group what they'd make." },
  {
    name: "Concepts",
    minutes: 12,
    text: "The key ideas from Lessons 1 to 4: what AI is, how models work, and using it safely.",
  },
  { name: "Setup", minutes: 12, text: "Everyone signs in and runs Claude Code for the first time (Lesson 5)." },
  { name: "Build", minutes: 20, text: "Learners build their own one-page website (Lessons 6 and 7)." },
  {
    name: "Show and tell",
    minutes: 8,
    text: "Two or three learners share their site and one thing that surprised them.",
  },
];
const totalMinutes = timeline.reduce((sum, step) => sum + step.minutes, 0);

export default function RunItPage() {
  let start = 0;
  const steps = timeline.map((step) => {
    const from = start;
    start += step.minutes;
    return { ...step, from, to: start };
  });

  return (
    <div className="px-(--gut)">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-[72px] pt-(--hy) pb-(--sec)">
        <section className="flex flex-wrap items-start gap-x-16 gap-y-8">
          <div className="flex max-w-[660px] flex-[1_1_460px] flex-col gap-4">
            <span className="eyebrow leading-[1.3]">For teachers, volunteers and club leaders</span>
            <h1 className="t-h1 m-0">Run a Code for All session</h1>
            <p className="t-lead m-0">
              Code for All is a free, self-paced course where 13 to 16 year olds learn to build with AI tools. Learners
              can do it alone at home, and it works even better in a group. Everything you need to run a session is
              here.
            </p>
          </div>
          <dl className="m-0 box-border grid max-w-[400px] flex-[1_1_280px] grid-cols-[auto_minmax(0,1fr)] gap-x-[18px] gap-y-3 rounded-[20px] border-[1.5px] border-border px-6 py-5 text-[17px] leading-[1.5]">
            <dt className="font-bold text-muted">Who</dt>
            <dd className="m-0">Ages 13 to 16. No coding experience needed.</dd>
            <dt className="font-bold text-muted">Time</dt>
            <dd className="m-0">One {totalMinutes}-minute session</dd>
            <dt className="font-bold text-muted">Needs</dt>
            <dd className="m-0">A laptop per learner, internet, and accounts for Lessons 5 and 7</dd>
            <dt className="font-bold text-muted">Cost</dt>
            <dd className="m-0">Free</dd>
          </dl>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="t-h2 m-0">The session kit</h2>
            <p className="m-0 text-muted">Open it online, or download it to print.</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
            {site.kit.map((item) => (
              <article key={item.title} className="flex flex-col gap-2.5 rounded-[20px] border-[1.5px] border-border p-[22px]">
                <span className="chip-label">{item.format}</span>
                <h3 className="display m-0 text-[22px] leading-[1.25] font-[650]">{item.title}</h3>
                <p className="m-0 flex-1 text-[17px] leading-[1.55] text-muted">{item.description}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <TodoLink href={item.openHref} className="btn btn-small">
                    Open
                  </TodoLink>
                  <TodoLink href={item.downloadHref} className="text-link text-[16px]">
                    Download
                  </TodoLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="flex max-w-[820px] flex-col gap-5">
          <h2 className="t-h2 m-0">How a {totalMinutes}-minute session runs</h2>
          <div aria-hidden="true" className="flex h-3 gap-1">
            {steps.map((step) => (
              <span key={step.name} className="rounded-md bg-accent" style={{ flex: step.minutes }} />
            ))}
          </div>
          <ol className="m-0 list-none p-0">
            {steps.map((step, index) => (
              <li
                key={step.name}
                className={`grid grid-cols-[96px_minmax(0,1fr)] gap-x-5 gap-y-1 border-t border-border py-4 ${
                  index === steps.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="font-mono text-[16px] leading-[1.9] text-muted">
                  {step.from}–{step.to} min
                </span>
                <div>
                  <h3 className="display m-0 text-[21px] leading-[1.35] font-[650]">{step.name}</h3>
                  <p className="mt-0.5 mb-0">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="box-border flex max-w-[820px] flex-col gap-2.5 rounded-[20px] bg-tint p-(--pad)">
          <h2 className="t-h3 m-0">Accounts for the hands-on lessons</h2>
          <p className="m-0">
            Lessons 5 and 7 need a Claude account. Please don&apos;t ask learners to sign up on their own. Your school,
            club or program should provide and manage the accounts, so no learner has to hand over personal details.
          </p>
          <Link href="/access" className="text-link">
            How we explain this to learners →
          </Link>
        </section>

        <section
          id="contact"
          className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-border pt-12"
        >
          <div className="flex flex-[1_1_360px] flex-col gap-1">
            <h2 className="t-h2 m-0">Talk to the team</h2>
            <p className="m-0">Planning a session, or have a question about the kit? We&apos;d love to hear from you.</p>
          </div>
          <TodoLink href={site.contactHref} className="btn btn-primary">
            Email the Code for All team
          </TodoLink>
        </section>
      </div>
    </div>
  );
}
