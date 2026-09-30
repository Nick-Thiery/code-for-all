import Link from "next/link";
import type { ReactNode } from "react";
import { CourseLink } from "@/components/kit-course-link";
import { KitMdx } from "@/components/kit-mdx";
import { PrintButton, PrintSetup } from "@/components/kit-print";
import { Hex } from "@/components/hex";
import { KIT_PAGES, kitHref, type KitLesson, type KitPage, type RunSheet } from "@/lib/facilitator";
import { moduleHref } from "@/lib/outline";

// The printable pages of the session kit: the facilitator script, the student
// handout and the pre-session checklist. Each page shows one module or all of
// them; printed, each module starts on a new page.

type ModuleLink = { number: number; title: string };

/** The page around one or more sheets: title, Print button and module links. None of it prints. */
export function KitShell({
  page,
  current,
  modules,
  children,
}: {
  page: KitPage;
  /** The module on a single-module page; null on the all-modules page. */
  current: number | null;
  modules: ModuleLink[];
  children: ReactNode;
}) {
  const info = KIT_PAGES[page];
  return (
    <div className="px-(--gut) print:px-0">
      <PrintSetup />
      <div className="mx-auto flex max-w-[820px] flex-col gap-12 pt-(--hy) pb-12 tablet:pb-(--sec) print:max-w-none print:gap-0 print:p-0 print:text-[10.5pt] print:leading-[1.45]">
        <header className="flex flex-col gap-4 print:hidden">
          <Link href="/run-it#kit" className="text-link gap-1.5 self-start text-[17px]">
            <span aria-hidden="true">←</span> Run a session
          </Link>
          <span className="eyebrow">Session kit</span>
          <h1 className="t-h1 m-0">{current === null ? info.title : `${info.title}: Module ${current}`}</h1>
          <p className="t-lead m-0 text-muted">
            {info.description}{" "}
            {current === null ? "Printed, each module starts on a new page." : null}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <PrintButton label={current === null ? "Print all modules" : `Print Module ${current}`} />
            {current !== null && (
              <Link href={kitHref(page)} className="btn btn-secondary">
                All modules
              </Link>
            )}
          </div>
          <nav aria-label={`${info.title} for one module`} className="flex flex-col gap-2">
            <span className="kicker">{current === null ? "Or open one module" : "Modules"}</span>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {modules.map((mod) => (
                <li key={mod.number}>
                  <Link
                    href={kitHref(page, mod.number)}
                    aria-current={mod.number === current ? "page" : undefined}
                    title={`Module ${mod.number}: ${mod.title}`}
                    className={`btn btn-small px-3.5 ${mod.number === current ? "bg-accent text-on-accent hover:bg-accent hover:text-on-accent" : ""}`}
                  >
                    Module {mod.number}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}

/** One module's part of a kit page. Printed, it starts on a new page. */
function Sheet({ id, dense = false, children }: { id: string; dense?: boolean; children: ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`flex scroll-mt-6 flex-col gap-6 border-t-[1.5px] border-border pt-12 print:border-0 print:pt-0 print:break-before-page print:first-of-type:break-before-auto ${
        dense ? "print:gap-2.5 print:text-[9pt] print:leading-[1.3]" : "print:gap-4"
      }`}
    >
      {children}
    </section>
  );
}

function SheetHeader({ id, label, title, summary }: { id: string; label: string; title: string; summary?: string }) {
  return (
    <header className="flex flex-col gap-2 print:gap-1">
      <span className="eyebrow print:text-[8.5pt]">{label}</span>
      <h2 id={`${id}-title`} className="t-h2 m-0 print:text-[18pt]">
        {title}
      </h2>
      {summary && <p className="t-lead m-0 text-muted print:text-[10.5pt]">{summary}</p>}
    </header>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-1.5 p-0 print:gap-0.5">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2.5">
          <Hex width={12} height={13} shape="fill-deco" className="mt-[0.45em] flex-none print:mt-[0.3em]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function OutOfDate({ problems }: { problems: string[] }) {
  if (problems.length === 0) return null;
  return (
    <div role="note" className="rounded-xl border-2 border-dashed border-pip px-5 py-4 print:hidden">
      <p className="m-0 font-bold">This run sheet needs updating</p>
      <p className="t-meta mt-1 mb-2 text-muted">The lessons have changed since it was written. Fix these in content/facilitator.yml:</p>
      <Bullets items={problems} />
    </div>
  );
}

function ChallengeBox({ sheet }: { sheet: RunSheet }) {
  if (!sheet.challenge) return null;
  return (
    <div className="flex flex-col gap-2 rounded-2xl border-2 border-accent p-(--pad) break-inside-avoid print:gap-1 print:rounded-lg print:px-3 print:py-2.5">
      <span className="eyebrow print:text-[9pt]">Challenge</span>
      <h3 className="t-h3 m-0 print:text-[13pt]">{sheet.challenge.title}</h3>
      <KitMdx snippet={sheet.challenge} />
    </div>
  );
}

const lessonLine = (lesson: KitLesson) => `Lesson ${lesson.number}`;

/** "Lessons 3 and 6" */
function lessonNumbers(lessons: KitLesson[]) {
  const numbers = lessons.map((l) => String(l.number));
  if (numbers.length === 1) return `Lesson ${numbers[0]}`;
  return `Lessons ${numbers.slice(0, -1).join(", ")} and ${numbers[numbers.length - 1]}`;
}

/** A link that also shows its address on paper. */
function PaperLink({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:\/\//.test(href);
  return (
    <>
      {external ? <a href={href}>{children}</a> : <Link href={href}>{children}</Link>}
      {external && <span className="hidden break-all text-muted print:inline"> ({href.replace(/^https?:\/\//, "")})</span>}
    </>
  );
}

// ---- Facilitator script ----

export function ScriptSheet({ sheet, sessionMinutes }: { sheet: RunSheet; sessionMinutes: number }) {
  const mod = sheet.module;
  const id = `module-${mod.number}`;
  return (
    <Sheet id={id}>
      <SheetHeader id={id} label={`Facilitator script · Module ${mod.number}`} title={mod.title} summary={mod.summary} />
      <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2 rounded-2xl border border-border px-5 py-4 print:rounded-lg print:px-3 print:py-2">
        <dt className="font-bold text-muted">Session</dt>
        <dd className="m-0">
          {sessionMinutes} minutes. The timings below are suggestions: change them to suit your group.
        </dd>
        <dt className="font-bold text-muted">Lessons</dt>
        <dd className="m-0">
          {mod.lessons.length} lessons, at <CourseLink path={moduleHref(mod.number)} />
        </dd>
        {sheet.handsOn.length > 0 && (
          <>
            <dt className="font-bold text-muted">Hands-on</dt>
            <dd className="m-0">
              {lessonNumbers(sheet.handsOn)}
              {sheet.tools.length > 0 ? `, using ${sheet.tools.join(", ")}` : ""}
            </dd>
          </>
        )}
        <dt className="font-bold text-muted">Before</dt>
        <dd className="m-0">
          Work through the <Link href={kitHref("checklist", mod.number)}>pre-session checklist</Link>.
        </dd>
      </dl>
      <OutOfDate problems={sheet.outOfDate} />
      <ol className="m-0 list-none p-0">
        {sheet.steps.map((step, index) => {
          const points = step.lessons.flatMap((lesson) => (lesson.recap.length > 0 ? lesson.recap : [lesson.summary]));
          const terms = sheet.keyTerms.filter((term) => step.lessons.some((lesson) => lesson.id === term.lessonId));
          const lastStep = index === sheet.steps.length - 1;
          return (
            <li
              key={index}
              className={`grid grid-cols-1 gap-x-5 gap-y-2 border-t border-border py-5 tablet:grid-cols-[100px_minmax(0,1fr)] print:grid-cols-[84px_minmax(0,1fr)] print:py-3 ${lastStep ? "border-b" : ""}`}
            >
              <span className="font-mono text-[16px] leading-[1.9] whitespace-nowrap text-muted print:text-[10pt] print:leading-[1.5]">
                {step.from}–{step.to} min
              </span>
              <div className="flex min-w-0 flex-col gap-3 print:gap-1.5">
                <div className="flex flex-col gap-0.5">
                  <h3 className="display m-0 text-[21px] leading-[1.35] font-[650] print:text-[12.5pt]">{step.title}</h3>
                  {step.lessons.length > 0 && (
                    <p className="t-meta m-0 text-muted print:text-[9.5pt]">
                      {step.lessons.map((lesson, i) => (
                        <span key={lesson.id}>
                          {i > 0 && "; "}
                          <Link href={lesson.href}>{lessonLine(lesson)}</Link>, {lesson.duration} min
                          {lesson.requiresAccount ? ", hands-on" : ""}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
                <p className="m-0">
                  <strong>Do:</strong> {step.do}
                </p>
                {points.length > 0 && (
                  <div className="flex flex-col gap-1.5 print:gap-1">
                    <p className="m-0 font-bold">Key points to get across</p>
                    <Bullets items={points} />
                  </div>
                )}
                {terms.map((term) => (
                  <div key={term.title} className="flex flex-col gap-0.5 break-inside-avoid">
                    <p className="m-0">
                      <strong>Key term: {term.title}</strong>
                    </p>
                    <KitMdx snippet={term} className="[&>*+*]:mt-2" />
                  </div>
                ))}
                {step.group && (
                  <Aside label="Group version" accent>
                    {step.group}
                  </Aside>
                )}
                {step.note && <Aside label="Note">{step.note}</Aside>}
                {lastStep && (sheet.quizHref || sheet.skillsCheckHref) && (
                  <p className="m-0">
                    {sheet.quizHref && (
                      <>
                        Module quiz: <CourseLink path={sheet.quizHref} />.
                      </>
                    )}
                    {sheet.skillsCheckHref && (
                      <>
                        {" "}
                        After this module there&apos;s also Check your skills: <CourseLink path={sheet.skillsCheckHref} />.
                      </>
                    )}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {sheet.challenge && (
        <div className="flex flex-col gap-3">
          <h3 className="t-h3 m-0 print:text-[13pt]">The Challenge to set</h3>
          <p className="m-0">Word for word from the lesson, where learners will find it too.</p>
          <ChallengeBox sheet={sheet} />
        </div>
      )}
    </Sheet>
  );
}

function Aside({ label, accent = false, children }: { label: string; accent?: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border px-4 py-3 break-inside-avoid print:rounded-[8px] print:px-3 print:py-2 ${
        accent ? "border-accent" : "border-border"
      }`}
    >
      <span className="kicker print:text-[9pt]">{label}</span>
      <p className="m-0">{children}</p>
    </div>
  );
}

// ---- Student handout ----

export function HandoutSheet({ sheet }: { sheet: RunSheet }) {
  const mod = sheet.module;
  const id = `module-${mod.number}`;
  return (
    <Sheet id={id} dense>
      <SheetHeader id={id} label={`Code for All · Module ${mod.number}`} title={mod.title} summary={mod.summary} />
      <p className="m-0">
        Find this module at <CourseLink path={moduleHref(mod.number)} />
        {sheet.handsOn.length > 0 && (
          <>
            . {lessonNumbers(sheet.handsOn)} {sheet.handsOn.length === 1 ? "is" : "are"} hands-on: {sheet.handsOn.length === 1 ? "it needs" : "they need"} access,
            which your session sets up for you, so you don&apos;t sign up for anything yourself.
          </>
        )}
      </p>
      <div className="flex flex-col gap-3 print:gap-2">
        <h3 className="t-h3 m-0 print:text-[13pt]">Key ideas</h3>
        <div className="gap-8 tablet:columns-2 print:columns-2 print:gap-6">
          {mod.lessons.map((lesson) => (
            <div key={lesson.id} className="mb-4 flex flex-col gap-1.5 break-inside-avoid print:mb-1.5 print:gap-0.5">
              <h4 className="m-0 text-[17px] leading-[1.4] font-bold print:text-[10pt]">
                {lesson.number}. {lesson.title}
              </h4>
              <Bullets items={lesson.recap.length > 0 ? lesson.recap : [lesson.summary]} />
            </div>
          ))}
        </div>
      </div>
      {sheet.keyTerms.length > 0 && (
        <div className="flex flex-col gap-3 print:gap-2">
          <h3 className="t-h3 m-0 print:text-[13pt]">Key terms</h3>
          <dl
            className={`m-0 flex flex-col gap-2.5 print:block print:gap-5 ${sheet.keyTerms.length > 3 ? "print:columns-3" : "print:columns-2"}`}
          >
            {sheet.keyTerms.map((term) => (
              <div key={`${term.lessonId}-${term.title}`} className="break-inside-avoid print:mb-1.5">
                <dt className="font-bold text-accent">{term.title}</dt>
                <dd className="m-0">
                  <KitMdx snippet={term} className="[&>*+*]:mt-1" />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <ChallengeBox sheet={sheet} />
    </Sheet>
  );
}

// ---- Pre-session checklist ----

function Tick({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 break-inside-avoid">
      <span
        aria-hidden="true"
        className="mt-[0.2em] box-border size-[20px] flex-none rounded-[5px] border-2 border-fg print:size-[12pt] print:rounded-[3px] print:border"
      />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

function TickGroup({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 print:gap-1.5">
      <h3 className="t-h3 m-0 print:text-[13pt]">{title}</h3>
      {intro && <p className="m-0 text-muted">{intro}</p>}
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0 print:gap-1.5">{children}</ul>
    </div>
  );
}

export function ChecklistSheet({ sheet }: { sheet: RunSheet }) {
  const mod = sheet.module;
  const id = `module-${mod.number}`;
  return (
    <Sheet id={id}>
      <SheetHeader id={id} label={`Pre-session checklist · Module ${mod.number}`} title={mod.title} />
      <TickGroup title="Laptops">
        <Tick>A laptop for every learner, with internet. Tablets and phones won&apos;t work for most sessions.</Tick>
      </TickGroup>
      {sheet.handsOn.length > 0 && (
        <TickGroup
          title="Access for the hands-on lessons"
          intro={
            <>
              Hands-on: {sheet.handsOn.map((l) => `Lesson ${l.number}, ${l.title}`).join("; ")}. Learners don&apos;t sign up
              for these tools themselves: your school, club or programme provides and manages the accounts.
            </>
          }
        >
          {sheet.tools.map((tool) => (
            <Tick key={tool}>Access to {tool} for every learner.</Tick>
          ))}
          <Tick>Work through the hands-on lessons yourself before the session, so you know each step.</Tick>
        </TickGroup>
      )}
      {sheet.prepare.length > 0 && (
        <TickGroup title="Before the session">
          {sheet.prepare.map((item) => (
            <Tick key={item}>{item}</Tick>
          ))}
        </TickGroup>
      )}
      <TickGroup title="Files and links to have ready">
        <Tick>
          The module: <CourseLink path={moduleHref(mod.number)} />
        </Tick>
        {sheet.downloads.map((file) => (
          <Tick key={file.href}>
            Data file for Lesson {file.lesson}:{" "}
            <a href={file.href} download>
              {file.label}
            </a>
          </Tick>
        ))}
        {sheet.links.map((link) => (
          <Tick key={link.href}>
            <PaperLink href={link.href}>{link.label}</PaperLink>
          </Tick>
        ))}
        <Tick>
          The <Link href={kitHref("script", mod.number)}>facilitator script</Link> and, for each learner, the{" "}
          <Link href={kitHref("handout", mod.number)}>student handout</Link>.
        </Tick>
      </TickGroup>
    </Sheet>
  );
}
