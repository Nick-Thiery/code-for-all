import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Honeycomb } from "@/components/honeycomb";
import { Icon } from "@/components/icons";
import { PageBody, PageHeader } from "@/components/page-header";
import { getModule, getModules, getPlannedModule, getSkillsChecks, parseModuleParam } from "@/lib/lessons";
import { courseCertificateHref, moduleCertificateHref, moduleHref, skillsCheckHref } from "@/lib/outline";

type Props = { params: Promise<{ module: string }> };

export async function generateStaticParams() {
  const modules = await getModules();
  return modules.map((mod) => ({ module: `module-${mod.number}` }));
}

async function find(params: Props["params"]) {
  const number = parseModuleParam((await params).module);
  return number === null ? null : getModule(number);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mod = await find(params);
  return mod
    ? { title: `Module ${mod.number} complete`, description: `You've finished Module ${mod.number}: ${mod.title}.` }
    : {};
}

export default async function ModuleCompletePage({ params }: Props) {
  const mod = await find(params);
  if (!mod) notFound();
  const nextNumber = mod.number + 1;
  const [next, planned, skills] = await Promise.all([
    getModule(nextNumber),
    getPlannedModule(nextNumber),
    getSkillsChecks(),
  ]);
  const hasSkillsCheck = skills.pages.some((page) => page.after === mod.number);
  // The last module that's out: finishing it can mean finishing the course.
  const isLast = (await getModules()).every((m) => m.number <= mod.number);

  const range = mod.number === 1 ? "Module 1" : `Modules 1 to ${mod.number}`;

  return (
    <article>
      <PageHeader
        tone="navy"
        above={
          <div className="mb-7 max-w-[220px] desktop:mb-9 desktop:max-w-[300px]">
            <Honeycomb lessons={mod.lessons.length} />
          </div>
        }
        kicker={`Module ${mod.number} complete`}
        title={`You finished ${mod.title}.`}
      >
        <p>{mod.summary}</p>
      </PageHeader>
      <PageBody wide className="gap-10 desktop:gap-14">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6 desktop:gap-8">
          <Card title="Show someone what you made">
            <p className="m-0">Explaining how you made it is the best way to remember it.</p>
          </Card>
          <Card title="Get your certificate">
            <p className="m-0">
              {isLast
                ? "One for this module, and one for the whole course now that you've finished every module that's out."
                : "Your name, the module and the date, to print or save as an image."}
            </p>
            <CardLink href={moduleCertificateHref(mod.number)}>Module {mod.number} certificate</CardLink>
            {isLast && <CardLink href={courseCertificateHref}>Course certificate</CardLink>}
          </Card>
          {hasSkillsCheck && (
            <Card title="Check your skills" tone="on-sky">
              <p className="m-0">A mixed quiz on {range}, and a checklist for your final project.</p>
              <CardLink href={skillsCheckHref(mod.number)}>Check your skills</CardLink>
            </Card>
          )}
          {planned && (
            <Card title={next ? `Up next: Module ${nextNumber}` : `Module ${nextNumber} is on the way`} tone="on-marigold">
              {next ? (
                <>
                  <p className="m-0">
                    {next.title}. {next.summary}
                  </p>
                  <CardLink href={next.lessons[0].href}>Start Module {nextNumber}</CardLink>
                </>
              ) : (
                <>
                  <p className="m-0">{planned.title}. Your progress stays saved on this device.</p>
                  <CardLink href={moduleHref(nextNumber)}>See what&apos;s coming</CardLink>
                </>
              )}
            </Card>
          )}
        </div>
        <Link href="/" className="text-link">
          Back to the course
        </Link>
      </PageBody>
    </article>
  );
}

function Card({ title, tone = "on-surface", children }: { title: string; tone?: string; children: ReactNode }) {
  return (
    <div className={`${tone} flex flex-col gap-2.5 rounded-md border-2 border-line p-6 shadow-h6 desktop:p-7 desktop:shadow-h8`}>
      <h2 className="t-h3 m-0">{title}</h2>
      {children}
    </div>
  );
}

function CardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-link gap-1.5">
      {children} <Icon name="arrow-right" size={17} stroke={2.6} />
    </Link>
  );
}
