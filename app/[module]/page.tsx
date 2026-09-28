import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Hex } from "@/components/hex";
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
    <div className="px-(--gut)">
      <div className="mx-auto flex max-w-[720px] flex-col gap-8 py-12 tablet:py-(--sec)">
        <div className="flex flex-col items-center gap-[18px] text-center">
          <ComingSoonHoneycomb />
          <span className="eyebrow">Module {number} · Coming soon</span>
          <h1 className="t-h1 m-0">{planned.title}</h1>
          <p className="m-0 max-w-[28em]">{planned.summary} We&apos;re writing this module now.</p>
          <p className="t-meta m-0 max-w-[28em] text-muted">
            There&apos;s nothing to sign up for. Just check back. Your progress stays saved on this device.
          </p>
        </div>

        {planned.planned.length > 0 && (
          <section aria-labelledby="covers" className="flex flex-col gap-3 rounded-[20px] border-[1.5px] border-border p-(--pad)">
            <h2 id="covers" className="t-h3 m-0">
              What this module will cover
            </h2>
            <ol className="m-0 flex list-none flex-col gap-2 p-0">
              {planned.planned.map((title, index) => (
                <li key={title} className="flex items-center gap-3">
                  <span className="relative flex h-[30px] w-[26px] flex-none items-center justify-center">
                    <Hex width={26} height={30} shape="fill-none stroke-pip stroke-2 [stroke-dasharray:4_3]" className="absolute inset-0" />
                    <span className="relative text-[13px] leading-none font-bold text-muted">{index + 1}</span>
                  </span>
                  <span>{title}</span>
                </li>
              ))}
            </ol>
            <p className="t-meta m-0 text-muted">The lesson titles may change a little before the module is out.</p>
          </section>
        )}

        {(planned.waiting || before) && (
          <section aria-labelledby="wait" className="flex flex-col gap-3 rounded-[20px] bg-tint p-(--pad)">
            <h2 id="wait" className="t-h3 m-0">
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

        <div className="flex justify-center">
          <Link href="/" className="btn btn-primary">
            Back to the course
          </Link>
        </div>
      </div>
    </div>
  );
}

function ComingSoonHoneycomb() {
  const ring = [
    "-25,-69.3 -2.5,-56.3 -2.5,-30.3 -25,-17.3 -47.5,-30.3 -47.5,-56.3",
    "25,-69.3 47.5,-56.3 47.5,-30.3 25,-17.3 2.5,-30.3 2.5,-56.3",
    "50,-26 72.5,-13 72.5,13 50,26 27.5,13 27.5,-13",
    "25,17.3 47.5,30.3 47.5,56.3 25,69.3 2.5,56.3 2.5,30.3",
    "-25,17.3 -2.5,30.3 -2.5,56.3 -25,69.3 -47.5,56.3 -47.5,30.3",
    "-50,-26 -27.5,-13 -27.5,13 -50,26 -72.5,13 -72.5,-13",
  ];
  return (
    <svg width="170" height="162" viewBox="-80 -76 160 152" aria-hidden="true" className="mb-2">
      {ring.map((points) => (
        <polygon
          key={points}
          points={points}
          strokeLinejoin="round"
          className="fill-none stroke-pip stroke-2 [stroke-dasharray:5_4]"
        />
      ))}
      <polygon
        points="0,-26 22.5,-13 22.5,13 0,26 -22.5,13 -22.5,-13"
        strokeLinejoin="round"
        className="fill-tint stroke-deco stroke-[2.5]"
      />
    </svg>
  );
}
