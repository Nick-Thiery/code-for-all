import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ModuleQuiz } from "@/components/module-quiz";
import { PrevNext } from "@/components/prev-next";
import { formatCount } from "@/lib/format";
import { getModule, getModules, parseModuleParam } from "@/lib/lessons";
import { moduleCompleteHref, moduleTrackHref, quizId } from "@/lib/outline";

type Props = { params: Promise<{ module: string }> };

// /module-N/quiz, for every module with a content/module-N/quiz.yml.
export async function generateStaticParams() {
  const modules = await getModules();
  return modules.filter((mod) => mod.quiz).map((mod) => ({ module: `module-${mod.number}` }));
}

async function find(params: Props["params"]) {
  const number = parseModuleParam((await params).module);
  const mod = number === null ? null : await getModule(number);
  return mod?.quiz ? { ...mod, quiz: mod.quiz } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mod = await find(params);
  return mod ? { title: `Module ${mod.number} quiz`, description: `Questions on the lessons in ${mod.title}.` } : {};
}

export default async function QuizPage({ params }: Props) {
  const mod = await find(params);
  if (!mod) notFound();
  const last = mod.lessons[mod.lessons.length - 1];

  return (
    <div className="px-(--gut)">
      <article className="mx-auto flex max-w-[720px] flex-col gap-6 pt-(--hy) pb-(--sec)">
        <header className="mb-2 flex flex-col gap-3.5">
          <p className="t-meta m-0 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-muted">
            <span className="font-bold text-fg">{formatCount(mod.quiz.length, "question")}</span>
            <span aria-hidden="true" className="hidden tablet:inline">
              ·
            </span>
            <Link href={moduleTrackHref(mod.number)} className="basis-full font-bold tablet:basis-auto">
              Module {mod.number}: {mod.title}
            </Link>
          </p>
          <h1 className="t-h1 m-0">Module {mod.number} quiz</h1>
          <p className="t-lead m-0">
            Questions on this module&apos;s lessons. It&apos;s just for you: if you get one wrong, you&apos;ll see which
            lesson explains it.
          </p>
        </header>

        <ModuleQuiz id={quizId(mod.number)} label="Quiz" questions={mod.quiz} />

        <div className="mt-6">
          <PrevNext
            label={`Module ${mod.number}`}
            previous={{ label: `Previous · Lesson ${last.number}`, title: last.title, href: last.href }}
            next={{
              label: `You've finished Module ${mod.number}`,
              title: "See what's next",
              href: moduleCompleteHref(mod.number),
            }}
          />
        </div>
      </article>
    </div>
  );
}
