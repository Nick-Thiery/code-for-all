"use client";

import { setLessonComplete, useCompletedLessons } from "@/lib/progress";

export function FinishedToggle({ slug }: { slug: string }) {
  const { completed, ready } = useCompletedLessons();

  return (
    <label className="inline-flex cursor-pointer items-center gap-3 font-bold">
      <span className="relative inline-grid size-7 shrink-0 place-items-center">
        <input
          type="checkbox"
          checked={completed.has(slug)}
          disabled={!ready}
          onChange={(event) => setLessonComplete(slug, event.target.checked)}
          className="peer size-7 cursor-pointer appearance-none rounded-md border-2 border-emphasis bg-paper checked:bg-accent disabled:cursor-default"
        />
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pointer-events-none absolute size-5 text-on-accent opacity-0 peer-checked:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      I&apos;ve finished this lesson
    </label>
  );
}
