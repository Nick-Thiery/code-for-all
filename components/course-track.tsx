"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { formatCount, formatMinutes } from "@/lib/format";
import { useCompletedLessons } from "@/lib/progress";

export type TrackLesson = {
  slug: string;
  title: string;
  summary: string;
  duration: number;
  requiresAccount: boolean;
};

export function CourseTrack({ lessons }: { lessons: TrackLesson[] }) {
  const { completed, ready } = useCompletedLessons();
  const doneCount = lessons.filter((lesson) => completed.has(lesson.slug)).length;
  const nextSlug = ready ? lessons.find((lesson) => !completed.has(lesson.slug))?.slug : undefined;
  const totalMinutes = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

  return (
    <>
      <p className="text-muted">
        {formatCount(lessons.length, "lesson")}, about {formatMinutes(totalMinutes)} in all.{" "}
        <span aria-live="polite">
          {ready && doneCount > 0 && (doneCount === lessons.length ? "You've finished all of them." : `You've finished ${doneCount}.`)}
        </span>
      </p>

      <ol className="track mt-10 sm:mt-12">
        {lessons.map((lesson, index) => {
          const done = completed.has(lesson.slug);
          const isNext = lesson.slug === nextSlug;
          return (
            <li
              key={lesson.slug}
              className="track-item"
              data-state={done ? "done" : isNext ? "next" : "todo"}
              style={{ "--i": index } as CSSProperties}
            >
              <span className="track-stop display" aria-hidden="true">
                {done ? <CheckIcon /> : index + 1}
              </span>

              <div>
                <h2 className="flex min-h-[var(--stop)] items-center">
                  <Link href={`/lessons/${lesson.slug}`} className="track-link display text-[1.375rem] leading-tight sm:text-2xl">
                    {lesson.title}
                  </Link>
                </h2>
                <p className="mt-1 text-muted">{lesson.summary}</p>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-muted">
                  <span>{lesson.duration} min</span>
                  {lesson.requiresAccount && <span>Account needed</span>}
                  {done && <span className="sr-only">Finished</span>}
                  {isNext && (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-sm font-bold text-on-accent">
                      {doneCount === 0 ? "Start here" : "Up next"}
                    </span>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
