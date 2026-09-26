import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountNotice } from "@/components/account-notice";
import { LessonBody } from "@/components/lesson-body";
import { PrevNext } from "@/components/prev-next";
import { RecapBox } from "@/components/recap-box";
import { getLessonWithNeighbours, getModules, parseModuleParam } from "@/lib/lessons";
import { moduleTrackHref } from "@/lib/outline";

type Props = { params: Promise<{ module: string; lesson: string }> };

// Every lesson is prerendered at build time. Unknown slugs fall through to
// notFound() below. (Not `dynamicParams = false`: the dev server caches this
// list, so a newly added lesson would 404 on its first visit.)
export async function generateStaticParams() {
  const modules = await getModules();
  return modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({ module: `module-${mod.number}`, lesson: lesson.slug })),
  );
}

async function find(params: Props["params"]) {
  const { module, lesson } = await params;
  const number = parseModuleParam(module);
  return number === null ? null : getLessonWithNeighbours(number, lesson);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await find(params);
  return found ? { title: found.lesson.title, description: found.lesson.summary } : {};
}

export default async function LessonPage({ params }: Props) {
  const found = await find(params);
  if (!found) notFound();
  const { lesson, module: mod, previous, next } = found;

  return (
    <div className="px-(--gut)">
      <article className="mx-auto flex max-w-[720px] flex-col gap-6 pt-(--hy) pb-(--sec)">
        <header className="mb-2 flex flex-col gap-3.5">
          <p className="t-meta m-0 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-muted">
            <span className="font-bold text-fg">
              Lesson {lesson.number} of {mod.lessons.length}
            </span>
            <span aria-hidden="true">·</span>
            <span>{lesson.duration} min</span>
            <span aria-hidden="true">·</span>
            <Link href={moduleTrackHref(mod.number)} className="font-bold">
              Module {mod.number}: {mod.title}
            </Link>
          </p>
          <h1 className="t-h1 m-0">{lesson.title}</h1>
          <p className="t-lead m-0">{lesson.summary}</p>
        </header>

        {lesson.requiresAccount && <AccountNotice lessonId={lesson.id} />}

        <LessonBody lesson={lesson} />

        <div className="mt-6 flex flex-col gap-6">
          <RecapBox id={lesson.id} points={lesson.recap} fallback={lesson.summary} next={next?.title} />
          <PrevNext module={mod.number} previous={previous} next={next} />
        </div>
      </article>
    </div>
  );
}
