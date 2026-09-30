import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageBody, PageHeader } from "@/components/page-header";
import { getModule, getModules, getPlannedModule, getSkillsChecks, parseModuleParam } from "@/lib/lessons";
import { moduleTrackHref, quizHref, skillsCheckHref } from "@/lib/outline";

type Props = { params: Promise<{ module: string }> };

// /module-N. A released module lives on the course page, so this goes there.
// A module that's in the course plan but not out yet gets the Coming soon
// page: what it will cover (its planned lessons from course.yml) and what to
// do while you wait, pointing back at finished work. Anything else is a 404.
async function resolve(params: Props["params"]) {
  const number = parseModuleParam((await params).module);
  if (number === null) return null;
  if (await getModule(number)) return { released: true as const, number };
  const planned = await getPlannedModule(number);
  return planned ? { released: false as const, number, planned } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await resolve(params);
  return found && !found.released
    ? {
        title: `Module ${found.number}: coming soon`,
        description: `Module ${found.number}, ${found.planned.title}, isn't out yet. ${found.planned.summary}`,
      }
    : {};
}

export default async function ModulePage({ params }: Props) {
  const found = await resolve(params);
  if (!found) notFound();
  if (found.released) redirect(moduleTrackHref(found.number));
  const { number, planned } = found;

  // The latest finished module before this one: where "while you wait" points.
  const [modules, skills] = await Promise.all([getModules(), getSkillsChecks()]);
  const before = modules.filter((mod) => mod.number < number).at(-1) ?? null;
  const lastLesson = before?.lessons.at(-1) ?? null;
  const skillsCheck = before && skills.pages.some((page) => page.after === before.number) ? before.number : null;

  return (
    <article>
      <PageHeader tone="navy" kicker={`Module ${number} · Coming soon`} title={planned.title}>
        <p>{planned.summary} We&apos;re writing this module now.</p>
        <p className="mt-3 font-sans text-[16px] leading-[1.5] text-muted desktop:text-[17px]">
          There&apos;s nothing to sign up for. Just check back. Your progress stays saved on this device.
        </p>
      </PageHeader>
      <PageBody className="gap-10 desktop:gap-14">
        {planned.planned.length > 0 && (
          <section aria-labelledby="covers" className="flex flex-col gap-4">
            <h2 id="covers" className="t-h3 m-0">
              What this module will cover
            </h2>
            <ol className="m-0 flex list-none flex-col border-b-2 border-dashed border-line p-0">
              {planned.planned.map((title, index) => (
                <li key={title} className="flex items-center gap-4 border-t-2 border-dashed border-line py-3">
                  <span
                    aria-hidden="true"
                    className="box-border grid size-9 flex-none place-items-center rounded border-2 border-dashed border-line font-display text-[17px] leading-none font-extrabold text-muted [font-stretch:85%]"
                  >
                    {index + 1}
                  </span>
                  <span className="font-serif text-[21px] leading-[1.2] font-semibold desktop:text-[24px]">{title}</span>
                </li>
              ))}
            </ol>
            <p className="t-meta m-0 text-muted">The lesson titles may change a little before the module is out.</p>
          </section>
        )}

        {(planned.waiting || before) && (
          <section
            aria-labelledby="wait"
            className="on-sky flex flex-col gap-3.5 rounded-md border-2 border-line p-(--pad) shadow-h6 desktop:shadow-h8"
          >
            <h2 id="wait" className="t-block m-0">
              While you wait
            </h2>
            {planned.waiting && <p className="m-0">{planned.waiting}</p>}
            {before && (
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {lastLesson && (
                  <li>
                    <Link href={lastLesson.href}>
                      Finish the Module {before.number} Challenge, at the end of {lastLesson.title}
                    </Link>
                  </li>
                )}
                {before.quiz && (
                  <li>
                    <Link href={quizHref(before.number)}>Try the Module {before.number} quiz again</Link>
                  </li>
                )}
                {skillsCheck !== null && (
                  <li>
                    <Link href={skillsCheckHref(skillsCheck)}>Check your skills on Modules 1 to {skillsCheck}</Link>
                  </li>
                )}
                <li>
                  <Link href={moduleTrackHref(before.number)}>Go back over Module {before.number} on the course page</Link>
                </li>
              </ul>
            )}
          </section>
        )}

        <Link href="/" className="btn btn-primary self-start">
          Back to the course
        </Link>
      </PageBody>
    </article>
  );
}
