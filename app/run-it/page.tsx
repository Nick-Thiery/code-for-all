import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Hex } from "@/components/hex";
import { PrintSetup } from "@/components/kit-print";
import { KIT_PAGES, getKit, kitHref, type KitPage, type RunSheet } from "@/lib/facilitator";
import { formatCount } from "@/lib/format";
import { getOutline } from "@/lib/lessons";
import { moduleHref } from "@/lib/outline";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Run a session",
  description:
    "Everything teachers, volunteers and club leaders need to run Code for All: run sheets, a facilitator script, a student handout and a pre-session checklist for every module.",
};

const printable: KitPage[] = ["script", "handout", "checklist"];

export default async function RunItPage() {
  const [kit, outline] = await Promise.all([getKit(), getOutline()]);
  const planned = outline.phases.flatMap((phase) => phase.modules);
  const comingSoon = planned.filter((mod) => !mod.released);
  const covered = kit.sheets.map((sheet) => sheet.module.number);
  const range = covered.length > 1 ? `Modules ${covered[0]} to ${covered[covered.length - 1]}` : `Module ${covered[0]}`;
  const skillsPages = outline.modules.filter((mod) => mod.skillsCheck);
  const handsOnModules = outline.modules
    .map((mod) => ({ ...mod, handsOn: mod.lessons.filter((lesson) => lesson.requiresAccount) }))
    .filter((mod) => mod.handsOn.length > 0);

  return (
    <div className="px-(--gut)">
      {/* Prints in light colours, even in dark mode. */}
      <PrintSetup />
      <div className="mx-auto flex max-w-[1120px] flex-col gap-12 pt-(--hy) tablet:gap-[72px] pb-12 tablet:pb-(--sec)">
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
            <dd className="m-0">Ages 13 to 16, with mixed skill levels</dd>
            <dt className="font-bold text-muted">Time</dt>
            <dd className="m-0">
              {planned.length} weekly sessions of {kit.sessionMinutes} minutes, one per module
            </dd>
            <dt className="font-bold text-muted">Needs</dt>
            <dd className="m-0">
              A laptop per learner, internet, and <Link href="/access">accounts for the hands-on lessons</Link>
            </dd>
            <dt className="font-bold text-muted">Cost</dt>
            <dd className="m-0">Free</dd>
          </dl>
        </section>

        <section id="kit" aria-labelledby="kit-title" className="flex scroll-mt-6 flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 id="kit-title" className="t-h2 m-0">
              The session kit
            </h2>
            <p className="m-0 text-muted">
              Open it online, or print it. Each one covers {range}, with a page per module.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
            {printable.map((page) => {
              const info = KIT_PAGES[page];
              return (
                <KitCard key={page} label={range} title={info.title} description={info.description}>
                  <Link href={kitHref(page)} className="btn btn-small">
                    Open
                  </Link>
                  <Link
                    href={`${kitHref(page)}?print=1`}
                    aria-label={`Print the ${info.title.toLowerCase()}`}
                    className="text-link text-[16px]"
                  >
                    Print
                  </Link>
                </KitCard>
              );
            })}
            <KitCard label="Slides" title="Slide deck" description="Slides to show in each session." keepInPrint>
              <span className="chip">Coming soon</span>
            </KitCard>
          </div>
        </section>

        <section id="how-it-runs" aria-labelledby="how-title" className="flex max-w-[820px] scroll-mt-6 flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 id="how-title" className="t-h2 m-0">
              How LaunchLab runs
            </h2>
            <p className="m-0">
              Code for All is adapted from LaunchLab, a free course of {planned.length} weekly sessions of{" "}
              {kit.sessionMinutes} minutes. The original course ran online. Here&apos;s how it works, from the LaunchLab
              Blueprint.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="t-h3 m-0">Weekly deliverables</h3>
            <p className="m-0">
              Each session covers one module, and the module&apos;s Challenge is the homework. Each week&apos;s
              deliverable is marked on this scale:
            </p>
            <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
              {kit.deliverableMarks.map((mark, index) => (
                <li key={mark} className="flex items-center gap-2">
                  <span className="rounded-full border-[1.5px] border-accent px-3 py-0.5 text-[17px] font-bold text-accent">
                    {mark}
                  </span>
                  {index < kit.deliverableMarks.length - 1 && (
                    <span aria-hidden="true" className="text-muted">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="t-h3 m-0">Expectations</h3>
            <Bullets
              items={[
                "Every learner needs a laptop. Tablets and phones won't work for most sessions.",
                "Expect mixed skill levels in one group.",
                "No AI subscriptions are needed. In LaunchLab, Code for All provided Claude Code. In your sessions, your school, club or programme provides access.",
              ]}
            />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="t-h3 m-0">The final project rubric</h3>
            <p className="m-0">
              The final project is marked out of {kit.rubric.total}: {kit.rubric.criteria.length} criteria, worth{" "}
              {kit.rubric.pointsPerCriterion} points each.
              {skillsPages.length > 0 && (
                <>
                  {" "}
                  Learners see the same criteria as questions, without points, on the Check your skills pages (
                  {skillsPages.map((mod, index) => (
                    <span key={mod.number}>
                      {index > 0 && " and "}
                      <Link href={mod.skillsCheck!.href}>after Module {mod.number}</Link>
                    </span>
                  ))}
                  ).
                </>
              )}
            </p>
            <ol className="m-0 flex list-none flex-col p-0">
              {kit.rubric.criteria.map((criterion, index) => (
                <li
                  key={criterion.criterion}
                  className={`flex flex-col gap-2 border-t border-border py-4 ${index === kit.rubric.criteria.length - 1 ? "border-b" : ""}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h4 className="display m-0 text-[21px] leading-[1.35] font-[650]">{criterion.criterion}</h4>
                    <span className="font-mono text-[16px] text-muted">{kit.rubric.pointsPerCriterion} points</span>
                  </div>
                  <Bullets items={criterion.items} />
                </li>
              ))}
            </ol>
            <table className="w-full max-w-[520px] border-collapse text-left text-[17px]">
              <caption className="mb-2 text-left font-bold">Bands, out of {kit.rubric.total}</caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Points</th>
                  <th scope="col">Band</th>
                </tr>
              </thead>
              <tbody>
                {kit.rubric.bands.map((band) => (
                  <tr key={band.points} className="border-t border-border last:border-b">
                    <th scope="row" className="w-[110px] py-2 pr-4 font-mono text-[16px] font-normal whitespace-nowrap text-muted">
                      {band.points}
                    </th>
                    <td className="py-2">{band.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="run-sheets" aria-labelledby="run-sheets-title" className="flex max-w-[820px] scroll-mt-6 flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h2 id="run-sheets-title" className="t-h2 m-0">
              Run sheets
            </h2>
            <p className="m-0">
              One for each module: what to prepare, suggested timings for a {kit.sessionMinutes}-minute session, and the
              group version of the activities the lessons turned into solo ones. The timings are only suggestions:
              change them to suit your group.
              {comingSoon.length > 0 &&
                ` ${comingSoon.map((mod) => `Module ${mod.number}`).join(" and ")} ${comingSoon.length === 1 ? "is" : "are"} coming soon.`}
            </p>
          </div>
          <div>
            {kit.sheets.map((sheet, index) => (
              <RunSheetDetails key={sheet.module.number} sheet={sheet} last={index === kit.sheets.length - 1} />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="accounts-title"
          className="box-border flex max-w-[820px] flex-col gap-3 rounded-[20px] bg-tint p-(--pad)"
        >
          <h2 id="accounts-title" className="t-h3 m-0">
            Accounts for the hands-on lessons
          </h2>
          <p className="m-0">
            Some lessons have a hands-on part that needs an account. Please don&apos;t ask learners to sign up on their
            own: your school, club or programme should provide and manage the accounts, so no learner has to hand over
            personal details. Learners don&apos;t sign up for Lovable or Claude themselves. The GitHub, Vercel and
            Supabase steps, where learners sign in with a GitHub account, are done in a session, with your go-ahead.
          </p>
          <h3 className="m-0 text-[19px] font-bold">The hands-on lessons</h3>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {handsOnModules.map((mod) => (
              <li key={mod.number}>
                <span className="font-bold">Module {mod.number}:</span>{" "}
                {mod.handsOn.map((lesson, index) => (
                  <span key={lesson.id}>
                    {index > 0 && "; "}
                    <Link href={lesson.href}>{lesson.title}</Link>
                  </span>
                ))}
              </li>
            ))}
          </ul>
          <Link href="/access" className="text-link self-start">
            How we explain this to learners →
          </Link>
        </section>

        <section
          id="contact"
          aria-labelledby="contact-title"
          className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-border pt-12"
        >
          <div className="flex flex-[1_1_360px] flex-col gap-1">
            <h2 id="contact-title" className="t-h2 m-0">
              Talk to the team
            </h2>
            <p className="m-0">Planning a session, or have a question about the kit? We&apos;d love to hear from you.</p>
          </div>
          <a href={site.contactHref} className="btn btn-primary print:hidden">
            Contact us
          </a>
        </section>
      </div>
    </div>
  );
}

function KitCard({
  label,
  title,
  description,
  keepInPrint = false,
  children,
}: {
  label: string;
  title: string;
  description: string;
  /** Buttons are hidden on paper; a label like "Coming soon" isn't. */
  keepInPrint?: boolean;
  children: ReactNode;
}) {
  return (
    <article className="flex flex-col gap-2.5 rounded-[20px] border-[1.5px] border-border p-[22px]">
      <span className="chip-label">{label}</span>
      <h3 className="display m-0 text-[22px] leading-[1.25] font-[650]">{title}</h3>
      <p className="m-0 flex-1 text-[17px] leading-[1.55] text-muted">{description}</p>
      <div className={`mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 ${keepInPrint ? "" : "print:hidden"}`}>{children}</div>
    </article>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <Hex width={14} height={15} shape="fill-deco" className="mt-2 flex-none" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RunSheetDetails({ sheet, last }: { sheet: RunSheet; last: boolean }) {
  const mod = sheet.module;
  const groupSteps = sheet.steps.filter((step) => step.group);
  return (
    <details className={`group border-t border-border ${last ? "border-b" : ""}`}>
      <summary className="flex min-h-11 cursor-pointer list-none items-start gap-3 py-4 [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="mt-[3px] flex size-7 flex-none items-center justify-center rounded-full border-[1.5px] border-accent font-bold text-accent transition-transform group-open:rotate-90"
        >
          ›
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="display text-[21px] leading-[1.35] font-[650]">
            Module {mod.number}: {mod.title}
          </span>
          <span className="t-meta text-muted">
            {formatCount(mod.lessons.length, "lesson")}
            {sheet.handsOn.length > 0 ? `, ${sheet.handsOn.length} hands-on` : ""}
            {groupSteps.length > 0 ? `, ${formatCount(groupSteps.length, "group version")}` : ""}
          </span>
        </span>
      </summary>
      <div className="flex flex-col gap-6 pb-8 tablet:pl-10">
        <div className="flex flex-col gap-3">
          <h3 className="m-0 text-[19px] font-bold">Suggested timings</h3>
          <div aria-hidden="true" className="flex h-3 gap-1 print:hidden">
            {sheet.steps.map((step, index) => (
              <span key={index} className="rounded-md bg-accent" style={{ flex: step.minutes }} />
            ))}
          </div>
          <ol className="m-0 list-none p-0">
            {sheet.steps.map((step, index) => (
              <li
                key={index}
                className="grid grid-cols-1 gap-x-4 border-t border-border py-3 first:border-t-0 tablet:grid-cols-[100px_minmax(0,1fr)]"
              >
                <span className="font-mono text-[16px] leading-[1.6] text-muted tablet:leading-[1.9]">
                  {step.from}–{step.to} min
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h4 className="m-0 text-[19px] leading-[1.45] font-bold">{step.title}</h4>
                  <p className="m-0">{step.do}</p>
                  {step.group && (
                    <p className="m-0 mt-1 rounded-[14px] border-[1.5px] border-accent px-4 py-3">
                      <span className="kicker block">Group version</span>
                      {step.group}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="m-0 text-[19px] font-bold">What to prepare</h3>
          <Bullets
            items={[
              ...(sheet.tools.length > 0
                ? [`Access to ${joinAnd(sheet.tools)} for every learner${lessonsPhrase(sheet)}.`]
                : []),
              ...sheet.prepare,
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {printable.map((page) => (
            <Link key={page} href={kitHref(page, mod.number)} className="btn btn-small">
              {KIT_PAGES[page].title}
            </Link>
          ))}
          <Link href={moduleHref(mod.number)} className="text-link ml-1 text-[16px]">
            The lessons
          </Link>
        </div>
      </div>
    </details>
  );
}

function joinAnd(items: string[]) {
  return items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function lessonsPhrase(sheet: RunSheet) {
  const numbers = sheet.handsOn.map((lesson) => String(lesson.number));
  if (numbers.length === 0) return "";
  return numbers.length === 1 ? `, for lesson ${numbers[0]}` : `, for lessons ${joinAnd(numbers)}`;
}
