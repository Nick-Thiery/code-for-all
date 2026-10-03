import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { PrintSetup } from "@/components/kit-print";
import { PageHeader } from "@/components/page-header";
import { KIT_PAGES, getKit, kitHref, type KitPage, type RunSheet } from "@/lib/facilitator";
import { formatCount } from "@/lib/format";
import { getOutline } from "@/lib/lessons";
import { moduleHref } from "@/lib/outline";
import { site } from "@/lib/site";
import { RUN_IT_SECTIONS, pageMetadata, runItFacts } from "@/lib/site-pages";

export const metadata: Metadata = pageMetadata("runIt");

const printable: KitPage[] = ["script", "handout", "checklist"];

export default async function RunItPage() {
  const [kit, outline] = await Promise.all([getKit(), getOutline()]);
  const planned = outline.phases.flatMap((phase) => phase.modules);
  const comingSoon = planned.filter((mod) => !mod.released);
  const facts = runItFacts(kit, outline);
  const { kit: kitSection, howItRuns, runSheets, contact } = RUN_IT_SECTIONS;
  const skillsPages = outline.modules.filter((mod) => mod.skillsCheck);
  const handsOnModules = outline.modules
    .map((mod) => ({ ...mod, handsOn: mod.lessons.filter((lesson) => lesson.requiresAccount) }))
    .filter((mod) => mod.handsOn.length > 0);

  return (
    <article>
      {/* Prints in light colours, even in dark mode. */}
      <PrintSetup />
      <PageHeader tone="marigold" kicker="For teachers, volunteers and club leaders" title="Run a Code for All session">
        <p>
          Code for All is a free, self-paced course where 13 to 16 year olds learn to build with AI tools. Learners can
          do it alone at home, and it works even better in a group. Everything you need to run a session is here.
        </p>
      </PageHeader>
      <div className="px-(--gut)">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-14 pt-10 pb-16 desktop:gap-24 desktop:pt-[72px] desktop:pb-[120px]">
        <dl className="card m-0 grid max-w-[820px] grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-3 px-(--pad) py-6 text-[17px] leading-[1.5]">
          <dt className="kicker pt-[3px] text-[13px] desktop:text-[13px]">Who</dt>
          <dd className="m-0">Ages 13 to 16, with mixed skill levels</dd>
          <dt className="kicker pt-[3px] text-[13px] desktop:text-[13px]">Time</dt>
          <dd className="m-0">
            {planned.length} weekly sessions of {kit.sessionMinutes} minutes, one per module
          </dd>
          <dt className="kicker pt-[3px] text-[13px] desktop:text-[13px]">Needs</dt>
          <dd className="m-0">
            A laptop per learner, internet, and <Link href="/access">accounts for the hands-on lessons</Link>
          </dd>
          <dt className="kicker pt-[3px] text-[13px] desktop:text-[13px]">Cost</dt>
          <dd className="m-0">Free</dd>
        </dl>

        <section id={kitSection.id} aria-labelledby="kit-title" className="flex scroll-mt-6 flex-col gap-6 desktop:gap-8">
          <div className="flex flex-col gap-3">
            <h2 id="kit-title" className="t-section m-0">
              {kitSection.title}
            </h2>
            <p className="m-0 text-muted">{kitSection.description(facts)}</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-6 desktop:gap-8">
            {printable.map((page) => {
              const info = KIT_PAGES[page];
              return (
                <KitCard key={page} label={facts.range} title={info.title} description={info.description}>
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
          </div>
        </section>

        <section id={howItRuns.id} aria-labelledby="how-title" className="flex max-w-[820px] scroll-mt-6 flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 id="how-title" className="t-section m-0">
              {howItRuns.title}
            </h2>
            <p className="m-0">
              {howItRuns.description(facts)} The original course ran online. Here&apos;s how it works, from the LaunchLab
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
                  <span className="chip text-[16px]">{mark}</span>
                  {index < kit.deliverableMarks.length - 1 && <Icon name="arrow-right" size={16} stroke={2.6} className="text-muted" />}
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
                  className={`flex flex-col gap-2.5 border-t-2 border-line py-5 ${index === kit.rubric.criteria.length - 1 ? "border-b-2" : ""}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h4 className="display m-0 text-[24px] leading-[1.2]">{criterion.criterion}</h4>
                    <span className="font-mono text-[16px] text-muted">{kit.rubric.pointsPerCriterion} points</span>
                  </div>
                  <Bullets items={criterion.items} />
                </li>
              ))}
            </ol>
            <table className="w-full max-w-[520px] border-collapse text-left text-[17px]">
              <caption className="kicker mb-2 text-left">Bands, out of {kit.rubric.total}</caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Points</th>
                  <th scope="col">Band</th>
                </tr>
              </thead>
              <tbody>
                {kit.rubric.bands.map((band) => (
                  <tr key={band.points} className="border-t-2 border-line last:border-b-2">
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

        <section id={runSheets.id} aria-labelledby="run-sheets-title" className="flex max-w-[820px] scroll-mt-6 flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 id="run-sheets-title" className="t-section m-0">
              {runSheets.title}
            </h2>
            <p className="m-0">
              {runSheets.description(facts)} The timings are only suggestions: change them to suit your group.
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
          className="on-sky box-border flex max-w-[820px] flex-col gap-3.5 rounded-md border-2 border-line p-(--pad) shadow-h6 desktop:shadow-h8"
        >
          <h2 id="accounts-title" className="t-block m-0">
            Accounts for the hands-on lessons
          </h2>
          <p className="m-0">
            Some lessons have a hands-on part that needs an account. Please don&apos;t ask learners to sign up on their
            own: your school, club or programme should provide and manage the accounts, so no learner has to hand over
            personal details. Learners don&apos;t sign up for Lovable or Claude themselves. The GitHub, Vercel and
            Supabase steps, where learners sign in with a GitHub account, are done in a session, with your go-ahead.
          </p>
          <h3 className="kicker m-0 mt-2">The hands-on lessons</h3>
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
          <Link href="/access" className="text-link gap-1.5 self-start">
            How we explain this to learners <Icon name="arrow-right" size={17} stroke={2.6} />
          </Link>
        </section>

        <section
          id={contact.id}
          aria-labelledby="contact-title"
          className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t-2 border-line pt-12"
        >
          <div className="flex flex-[1_1_360px] flex-col gap-3">
            <h2 id="contact-title" className="t-section m-0">
              {contact.title}
            </h2>
            <p className="m-0">{contact.description()}</p>
          </div>
          <a href={site.contactHref} className="btn btn-primary print:hidden">
            Contact us
          </a>
        </section>
      </div>
      </div>
    </article>
  );
}

function KitCard({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className="card flex flex-col gap-3 p-6">
      <span className="chip-label">{label}</span>
      <h3 className="t-h3 m-0">{title}</h3>
      <p className="m-0 flex-1 text-[17px] leading-[1.55] text-muted">{description}</p>
      {/* Buttons are hidden on paper. */}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 print:hidden">{children}</div>
    </article>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-[0.5em] box-border block size-3 flex-none border-2 border-line bg-marigold" />
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
    <details className={`border-t-2 border-line ${last ? "border-b-2" : ""}`}>
      <summary className="flex min-h-[76px] cursor-pointer list-none items-center justify-between gap-5 py-3.5 [&::-webkit-details-marker]:hidden">
        <span className="flex flex-col gap-1">
          <span className="font-serif text-[22px] leading-[1.2] font-semibold desktop:text-[27px]">
            Module {mod.number}: {mod.title}
          </span>
          <span className="t-meta text-muted">
            {formatCount(mod.lessons.length, "lesson")}
            {sheet.handsOn.length > 0 ? `, ${sheet.handsOn.length} hands-on` : ""}
            {groupSteps.length > 0 ? `, ${formatCount(groupSteps.length, "group version")}` : ""}
          </span>
        </span>
        <span aria-hidden="true" className="plus-box">
          <Icon name="plus" size={18} stroke={2.8} />
        </span>
      </summary>
      <div className="flex flex-col gap-7 pt-2 pb-9">
        <div className="flex flex-col gap-3">
          <h3 className="kicker m-0">Suggested timings</h3>
          <div aria-hidden="true" className="flex h-3.5 gap-1 print:hidden">
            {sheet.steps.map((step, index) => (
              <span
                key={index}
                className={`box-border rounded-[3px] border-2 border-line ${index % 2 === 0 ? "bg-accent" : "bg-marigold"}`}
                style={{ flex: step.minutes }}
              />
            ))}
          </div>
          <ol className="m-0 list-none p-0">
            {sheet.steps.map((step, index) => (
              <li
                key={index}
                className="grid grid-cols-1 gap-x-4 border-t border-hairline py-3.5 first:border-t-0 tablet:grid-cols-[100px_minmax(0,1fr)]"
              >
                <span className="font-mono text-[16px] leading-[1.6] text-muted tablet:leading-[1.9]">
                  {step.from}–{step.to} min
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h4 className="m-0 font-serif text-[21px] leading-[1.3] font-semibold">{step.title}</h4>
                  <p className="m-0">{step.do}</p>
                  {step.group && (
                    <p className="on-sky m-0 mt-2 rounded border-2 border-line px-4 py-3">
                      <span className="kicker mb-1 block">Group version</span>
                      {step.group}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="kicker m-0">What to prepare</h3>
          <Bullets
            items={[
              ...(sheet.tools.length > 0
                ? [`Access to ${joinAnd(sheet.tools)} for every learner${lessonsPhrase(sheet)}.`]
                : []),
              ...sheet.prepare,
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 print:hidden">
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
