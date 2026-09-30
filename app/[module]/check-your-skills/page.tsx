import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuildChecklist } from "@/components/build-checklist";
import { ModuleQuiz } from "@/components/module-quiz";
import { PageBody, PageHeader } from "@/components/page-header";
import { type NavTarget, PrevNext } from "@/components/prev-next";
import { getModule, getModules, getPlannedModule, getSkillsCheck, getSkillsChecks, parseModuleParam } from "@/lib/lessons";
import { moduleCompleteHref, moduleHref, moduleTrackHref, skillsCheckId } from "@/lib/outline";
import { type DrawGroup, drawCount } from "@/lib/quiz";

type Props = { params: Promise<{ module: string }> };

// /module-5/check-your-skills: one for each page in content/check-your-skills.yml
// whose module is out. A mixed quiz on every module so far, then the
// final-project checklist.
export async function generateStaticParams() {
  const [{ pages }, modules] = await Promise.all([getSkillsChecks(), getModules()]);
  return pages
    .filter((page) => modules.some((mod) => mod.number === page.after))
    .map((page) => ({ module: `module-${page.after}` }));
}

async function find(params: Props["params"]) {
  const number = parseModuleParam((await params).module);
  return number === null ? null : getSkillsCheck(number);
}

const range = (after: number) => (after === 1 ? "Module 1" : `Modules 1 to ${after}`);
const modules = ({ from, to }: DrawGroup) => (from === to ? `Module ${from}` : `Modules ${from} to ${to}`);

/** "5 questions from Modules 6 to 8 and 3 from Modules 1 to 5" */
function describeDraw(groups: DrawGroup[], counts: number[]) {
  return groups
    .map((group, i) => (i === 0 ? `${counts[i]} questions from ${modules(group)}` : `${counts[i]} from ${modules(group)}`))
    .join(groups.length > 2 ? ", " : " and ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const check = await find(params);
  return check
    ? {
        title: `Check your skills: ${range(check.after)}`,
        description: `A mixed quiz on ${range(check.after)} and a checklist for your final project.`,
      }
    : {};
}

export default async function CheckYourSkillsPage({ params }: Props) {
  const check = await find(params);
  if (!check) notFound();
  const { after, module: mod, questions, checklist, intro, draw } = check;
  const counts = draw.map((group) => drawCount(questions, [group]));
  const count = counts.reduce((sum, n) => sum + n, 0);

  const nextNumber = after + 1;
  const [nextModule, planned] = await Promise.all([getModule(nextNumber), getPlannedModule(nextNumber)]);
  const next: NavTarget = nextModule
    ? { label: `Next · Module ${nextNumber}`, title: nextModule.title, href: nextModule.lessons[0].href }
    : planned
      ? { label: `Module ${nextNumber} is on the way`, title: "See what's coming", href: moduleHref(nextNumber) }
      : { label: "You're at the end", title: "Back to the course", href: "/" };

  return (
    <article>
      <PageHeader
        tone="sky"
        kicker={
          <Link href={moduleTrackHref(after)} className="no-underline hover:underline">
            After Module {after} · {mod.title}
          </Link>
        }
        title="Check your skills"
        sticker={count > 0 ? { big: String(count), small: count === 1 ? "question" : "questions" } : undefined}
      >
        <p>
          A mixed quiz on {range(after)}, then a checklist for your final project. Right answers in the quiz can take
          a lesson all the way to Mastered.
        </p>
      </PageHeader>
      <PageBody className="gap-12 desktop:gap-[72px]">

        {/* Not a named landmark: the quiz card inside is already the "Mixed quiz" region. */}
        <section className="flex flex-col gap-5 desktop:gap-7">
          <div className="flex flex-col gap-3">
            <h2 id="mixed-quiz" className="t-section m-0">
              Mixed quiz
            </h2>
            <p className="m-0">
              {count > 0
                ? `${describeDraw(draw, counts)}, picked fresh each time you try.`
                : "The questions will appear here once the modules have their quizzes."}
            </p>
          </div>
          {count > 0 && (
            <ModuleQuiz
              id={skillsCheckId(after)}
              label="Mixed quiz"
              questions={questions}
              draw={draw}
              level={3}
            />
          )}
        </section>

        <section aria-labelledby="build-checklist" className="flex flex-col gap-5 desktop:gap-7">
          <div className="flex flex-col gap-3">
            <h2 id="build-checklist" className="t-section m-0">
              Build checklist
            </h2>
            <p className="m-0">
              These are the five things a finished final project does. Ask yourself each question about what
              you&apos;ve built so far.
            </p>
            {intro && <p className="m-0">{intro}</p>}
            <p className="t-meta m-0 text-muted">
              It&apos;s unscored: there are no points and no pass or fail. Your ticks are saved on this device only.
            </p>
          </div>
          <BuildChecklist id={skillsCheckId(after)} groups={checklist} />
        </section>

        <PrevNext
          label="Check your skills"
          previous={{ label: `Back · Module ${after}`, title: `Module ${after} complete`, href: moduleCompleteHref(after) }}
          next={next}
        />
      </PageBody>
    </article>
  );
}
