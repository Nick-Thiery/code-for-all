"use client";

import { useState } from "react";
import { Hex, HEX_POINTS } from "@/components/hex";
import { setLessonComplete, useCompletedLessons } from "@/lib/progress";

type Props = {
  /** The lesson's id, "module-1/meet-lovable". */
  id: string;
  /** From the lesson's optional `recap` list. */
  points: string[];
  /** Shown when there are no recap points. */
  fallback: string;
  /** Title of the next lesson, for the "Saved" line. */
  next?: string;
};

export function RecapBox({ id, points, fallback, next }: Props) {
  const { completed, ready } = useCompletedLessons();
  const checked = completed.has(id);
  // Animate only when someone ticks it, not when a finished lesson loads.
  const [justChecked, setJustChecked] = useState(false);

  function toggle() {
    setJustChecked(!checked);
    setLessonComplete(id, !checked);
  }

  return (
    <section aria-labelledby="recap-heading" className="flex flex-col gap-[18px] rounded-[20px] bg-tint p-(--pad) text-fg">
      <h2 id="recap-heading" className="t-h3 m-0">
        What you learned
      </h2>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {(points.length > 0 ? points : [fallback]).map((point, index) => (
          <li key={index} className="flex items-start gap-3">
            <Hex width={14} height={15} shape="fill-deco" className="mt-2 flex-none" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={!ready}
        onClick={toggle}
        className="flex min-h-[68px] w-full cursor-pointer items-center gap-4 print:hidden rounded-[14px] border-[1.5px] border-border bg-surface px-[18px] py-3 text-left font-[inherit] text-fg hover:border-accent disabled:cursor-default"
      >
        <span aria-hidden="true" className="relative h-[35px] w-8 flex-none">
          {checked ? (
            <>
              {justChecked && (
                <svg
                  width="32"
                  height="35"
                  viewBox="0 0 24 26"
                  className="ripple absolute inset-0 overflow-visible"
                  style={{ animation: "cfaRing 900ms 150ms ease-out both" }}
                >
                  <polygon points={HEX_POINTS} className="fill-none stroke-deco stroke-2" />
                </svg>
              )}
              <svg
                width="32"
                height="35"
                viewBox="0 0 24 26"
                className="absolute inset-0"
                style={justChecked ? { animation: "cfaPop 450ms cubic-bezier(.3,1.4,.5,1) both" } : undefined}
              >
                <polygon points={HEX_POINTS} strokeLinejoin="round" className="fill-accent stroke-accent stroke-2" />
                <path
                  d="M7.5 13.2l3.2 3.2 5.8-6.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={16}
                  className="stroke-on-accent stroke-[2.6]"
                  style={justChecked ? { animation: "cfaDraw 350ms 200ms ease-out both" } : undefined}
                />
              </svg>
            </>
          ) : (
            <Hex width={32} height={35} shape="fill-surface stroke-accent stroke-2" className="absolute inset-0" />
          )}
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-[19px] leading-[1.35] font-bold">I&apos;ve finished this lesson</span>
          {checked && (
            <span
              className="t-meta text-muted"
              style={justChecked ? { animation: "cfaRise 300ms 250ms ease both" } : undefined}
            >
              {next ? `Saved on this device. Up next: ${next}${/[.?!]$/.test(next) ? "" : "."}` : "Saved on this device."}
            </span>
          )}
        </span>
      </button>
    </section>
  );
}
