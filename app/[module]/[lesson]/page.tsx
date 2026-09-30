import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { AccountNotice } from "@/components/account-notice";
import { Icon } from "@/components/icons";
import { LessonBody } from "@/components/lesson-body";
import { MaskedTitle } from "@/components/masked-title";
import { Odometer } from "@/components/odometer";
import { type NavTarget, PrevNext } from "@/components/prev-next";
import { RecapBox } from "@/components/recap-box";
import { YouNeed } from "@/components/you-need";
import { titleSize } from "@/lib/format";
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

  return (
    <article>
      {/* The header block: the lesson's number rolling into place, then where it
          sits in the course, its title, its summary and how long it takes. */}
      <header className="on-sky overflow-hidden border-b-2 border-line px-(--gut)">
        <div className="relative mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)_auto] pt-6 pb-10 [grid-template-areas:'kicker_kicker'_'number_sticker'_'title_title'_'dek_dek'] desktop:grid-cols-[minmax(0,373fr)_minmax(0,787fr)] desktop:gap-x-10 desktop:pt-[60px] desktop:pb-[76px] desktop:[grid-template-areas:'number_kicker'_'number_title'_'number_dek']">
          <p className="a-fade eyebrow m-0 flex flex-col items-start gap-2.5 [grid-area:kicker] desktop:flex-row desktop:flex-wrap desktop:items-center desktop:gap-x-3 desktop:gap-y-2 desktop:pr-40 desktop:tracking-[.14em]">
            <Link href={moduleTrackHref(mod.number)} className="no-underline hover:underline">
              Module {mod.number} · {mod.title}
            </Link>
            {lesson.requiresAccount && (
              <span className="flex h-7 items-center gap-[7px] rounded border-2 border-line bg-paper px-2.5 text-[12px] tracking-[.1em] text-ink desktop:text-[15px]">
                <Icon name="laptop" size={16} stroke={2.2} />
                Hands-on task
              </span>
            )}
          </p>

          <div className="mt-3.5 flex flex-col gap-0.5 [container-type:inline-size] [grid-area:number] desktop:mt-0 desktop:gap-1.5">
            <span className="a-fade eyebrow desktop:tracking-[.14em]">
              Lesson<span className="desktop:hidden"> {lesson.number} of {mod.lessons.length}</span>
            </span>
            <Odometer value={lesson.number} className="numeral a-odo text-[168px] text-accent desktop:text-[min(330px,88cqw)]" />
          </div>

          {/* How long it takes, on a sticker. */}
          <p
            className="sticker a-spin m-0 mr-1.5 mb-[22px] size-[104px] self-end [grid-area:sticker] desktop:absolute desktop:top-[-4px] desktop:right-0 desktop:m-0 desktop:size-[138px] desktop:shadow-h5"
            style={{ "--d": "1.1s" } as CSSProperties}
          >
            <span className="font-serif text-[46px] leading-[.9] font-semibold italic desktop:text-[60px]">{lesson.duration}</span>
            <span className="font-display text-[11px] leading-[1.3] font-extrabold tracking-[.12em] uppercase [font-stretch:85%] desktop:text-[14px]">
              {lesson.duration === 1 ? "minute" : "minutes"}
            </span>
          </p>

          <h1 className={`${titleSize(lesson.title)} m-0 mt-3.5 [grid-area:title] desktop:mt-[26px]`}>
            {/* Keeps the title's first line clear of the sticker. */}
            <span aria-hidden="true" className="float-right hidden h-[84px] w-[156px] desktop:block" />
            <MaskedTitle text={lesson.title} />
          </h1>
          <p
            className="a-rise t-lead m-0 mt-5 max-w-[700px] [grid-area:dek] desktop:mt-[30px]"
            style={{ "--d": ".8s" } as CSSProperties}
          >
            {lesson.summary}
          </p>
        </div>
      </header>

      <div className="px-(--gut)">
        <div className="mx-auto max-w-[1200px] pt-10 pb-16 desktop:pt-24 desktop:pb-[120px]">
          <div className="with-rail flex flex-col gap-11 desktop:gap-[72px]">
            {lesson.needs ? (
              <YouNeed lessonId={lesson.id} needs={lesson.needs} minutes={lesson.duration} />
            ) : (
              lesson.requiresAccount && <AccountNotice lessonId={lesson.id} />
            )}

            <LessonBody lesson={lesson} />

            <div className="rail-block flex flex-col gap-6 desktop:gap-[30px]">
              <span className="rail-label">Wrap-up</span>
              <RecapBox
                id={lesson.id}
                number={lesson.number}
                points={lesson.recap}
                fallback={lesson.summary}
                next={next ? next.title : mod.quiz ? `Module ${mod.number} quiz` : undefined}
                module={moduleInfo}
              />
              {/* Following "Next" marks this lesson done; the tick above can undo it. */}
              <PrevNext previous={previousTarget} next={nextTarget} markDone={{ lessonId: lesson.id, module: moduleInfo }} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
