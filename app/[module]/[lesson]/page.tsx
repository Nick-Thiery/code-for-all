import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountNotice } from "@/components/account-notice";
import { Icon } from "@/components/icons";
import { LessonBody } from "@/components/lesson-body";
import { type NavTarget, PrevNext } from "@/components/prev-next";
import { RecapBox } from "@/components/recap-box";
import { YouNeed } from "@/components/you-need";
import { formatCount, lessonTitleSize } from "@/lib/format";
import { getLessonWithNeighbours, getModules, parseModuleParam } from "@/lib/lessons";
import { moduleCompleteHref, moduleTrackHref, quizHref } from "@/lib/outline";

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
  if (!found) return {};
  const { lesson } = found;
  // Two lessons can share a title ("Key terms"); the module number tells their tabs apart.
  const shared = (await getModules()).some((mod) =>
    mod.lessons.some((other) => other.id !== lesson.id && other.title === lesson.title),
  );
  return {
    title: shared ? `${lesson.title} (Module ${lesson.module})` : lesson.title,
    description: lesson.summary,
  };
}

export default async function LessonPage({ params }: Props) {
  const found = await find(params);
  if (!found) notFound();
  const { lesson, module: mod, previous, next } = found;

  // After the module's last lesson comes its quiz, if it has one, then Module complete.
  const nextTarget: NavTarget = next
    ? { label: `Next · Lesson ${next.number}`, title: next.title, href: next.href, lesson: true }
    : mod.quiz
      ? { label: `Next · Module ${mod.number} quiz`, title: "Check what you learned", href: quizHref(mod.number) }
      : { label: `You've finished Module ${mod.number}`, title: "See what's next", href: moduleCompleteHref(mod.number) };
  const moduleInfo = { number: mod.number, title: mod.title, lessonIds: mod.lessons.map((l) => l.id) };
  const previousTarget: NavTarget | null = previous
    ? { label: `Previous · Lesson ${previous.number}`, title: previous.title, href: previous.href, lesson: true }
    : null;
  // The number and the title share a size, so they sit on one line.
  const titleClass = lessonTitleSize(lesson.title);

  return (
    <article className="lesson">
      {/* The header block: where the lesson sits in the course, its number and
          title, its summary, and how long it takes. Compact, so the lesson's
          first words show on a phone's first screen. */}
      <header className="on-sky border-b-2 border-line px-(--gut)">
        <div className="mx-auto flex max-w-[720px] flex-col gap-3 pt-6 pb-7 desktop:gap-4 desktop:pt-12 desktop:pb-12">
          <p className="eyebrow m-0">
            <Link href={moduleTrackHref(mod.number)} className="no-underline hover:underline">
              Module {mod.number} · {mod.title}
            </Link>
          </p>
          <p className="sr-only">
            Lesson {lesson.number} of {mod.lessons.length}
          </p>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 desktop:gap-x-5">
            <span aria-hidden="true" className={`numeral ${titleClass} text-accent`}>
              {String(lesson.number).padStart(2, "0")}
            </span>
            <h1 className={`lesson-title ${titleClass} m-0`}>{lesson.title}</h1>
          </div>
          <p className="m-0 font-serif text-[19px] leading-[1.45] desktop:text-[22px]">{lesson.summary}</p>
          <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-2 text-[16px] leading-[1.4]">
            <span className="flex items-center gap-1.5">
              <Icon name="clock" size={18} stroke={2.2} />
              {formatCount(lesson.duration, "minute")}
            </span>
            {lesson.requiresAccount && (
              <span className="chip border-line">
                <Icon name="laptop" size={16} stroke={2.2} />
                Hands-on task
              </span>
            )}
          </p>
        </div>
      </header>

      <div className="px-(--gut)">
        <div className="mx-auto flex max-w-[720px] flex-col gap-8 pt-8 pb-14 desktop:gap-12 desktop:pt-12 desktop:pb-20">
          {lesson.needs ? (
            <YouNeed lessonId={lesson.id} needs={lesson.needs} minutes={lesson.duration} />
          ) : (
            lesson.requiresAccount && <AccountNotice lessonId={lesson.id} />
          )}

          <LessonBody lesson={lesson} />

          <section aria-labelledby="wrap-up" className="flex flex-col gap-5 desktop:gap-6">
            <h2 id="wrap-up" className="lesson-h2 m-0">
              Wrap-up
            </h2>
            <RecapBox
              id={lesson.id}
              number={lesson.number}
              points={lesson.recap}
              fallback={lesson.summary}
              next={next ? next.title : mod.quiz ? `Module ${mod.number} quiz` : undefined}
              module={moduleInfo}
            />
            {/* Following "Next" marks this lesson done; the tick above can undo it. */}
            <PrevNext calm previous={previousTarget} next={nextTarget} markDone={{ lessonId: lesson.id, module: moduleInfo }} />
          </section>
        </div>
      </div>
    </article>
  );
}
