import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonBody } from "@/components/lesson-body";
import { LessonNav } from "@/components/lesson-nav";
import { Recap } from "@/components/recap";
import { formatMinutes } from "@/lib/format";
import { getLessons, getLessonWithNeighbours } from "@/lib/lessons";

type Props = { params: Promise<{ slug: string }> };

// Every lesson is prerendered at build time. Unknown slugs fall through to
// notFound() below. (Not `dynamicParams = false`: the dev server caches this
// list, so a newly added lesson would 404 on its first visit.)
export async function generateStaticParams() {
  const lessons = await getLessons();
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await getLessonWithNeighbours((await params).slug);
  return found ? { title: found.lesson.title, description: found.lesson.summary } : {};
}

export default async function LessonPage({ params }: Props) {
  const found = await getLessonWithNeighbours((await params).slug);
  if (!found) notFound();
  const { lesson, position, total, previous, next } = found;

  return (
    <article>
      <header>
        <h1 className="display text-[2.25rem] leading-[1.08] sm:text-5xl">{lesson.title}</h1>
        <p className="mt-4 text-xl leading-relaxed text-muted sm:text-[1.375rem]">{lesson.summary}</p>
        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-base text-muted">
          <span>
            Lesson {position} of {total}
          </span>
          <span>About {formatMinutes(lesson.duration)}</span>
        </p>
        {lesson.requiresAccount && (
          <p className="mt-5 rounded-lg border-l-4 border-accent bg-surface px-4 py-3 text-base">
            You&apos;ll need an account for this lesson. Ask your facilitator if you don&apos;t have one.
          </p>
        )}
      </header>

      <div className="mt-10 border-t-2 border-rule pt-10">
        <LessonBody lesson={lesson} />
      </div>

      <Recap slug={lesson.slug} points={lesson.recap} fallback={lesson.summary} />
      <LessonNav previous={previous} next={next} />
    </article>
  );
}
