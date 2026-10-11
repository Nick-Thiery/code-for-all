"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { type ModuleInfo, markLessonDone } from "@/lib/celebration";
import { setLessonComplete, useCompletedLessons } from "@/lib/progress";

type Props = {
  /** The lesson's id, "module-1/meet-lovable". */
  id: string;
  /** The lesson's number in its module, for "Marks lesson 3 as done". */
  number: number;
  /** From the lesson's optional `recap` list. */
  points: string[];
  /** Shown when there are no recap points. */
  fallback: string;
  /** Title of the next lesson, for the "Saved" line. */
  next?: string;
  /** The lesson's module: ticking the last unfinished lesson celebrates it. */
  module?: ModuleInfo;
};

// The end of a lesson, under its "Wrap-up" heading: "What you learned" on a
// sky block, then the "I've finished this lesson" tick. Marigold until it's ticked; navy with a
// tick once it is, when the lesson's segment in the top bar fills too.
export function RecapBox({ id, number, points, fallback, next, module }: Props) {
  const { completed, ready } = useCompletedLessons();
  const checked = completed.has(id);
  // Animate only when someone ticks it, not when a finished lesson loads.
  const [justChecked, setJustChecked] = useState(false);

  function toggle() {
    setJustChecked(!checked);
    if (!checked && module) markLessonDone(id, module);
    else setLessonComplete(id, !checked);
  }

  return (
    <>
      <section
        aria-labelledby="recap-heading"
        className="on-sky flex flex-col rounded-md border-2 border-line px-5 pt-4 pb-2 desktop:px-6 desktop:pt-5 desktop:pb-3"
      >
        <h3 id="recap-heading" className="t-box m-0 mb-1">
          What you learned
        </h3>
        <ul className="m-0 flex list-none flex-col p-0">
          {(points.length > 0 ? points : [fallback]).map((point, index) => (
            <li
              key={index}
              className="flex items-baseline gap-3.5 border-b-2 border-hairline py-2.5 last:border-b-0 desktop:gap-4 desktop:py-3"
            >
              <span aria-hidden="true" className="numeral w-4 flex-none text-[24px] text-accent desktop:w-5 desktop:text-[28px]">
                {index + 1}
              </span>
              <span className="font-serif text-[19px] leading-[1.4] desktop:text-[20px]">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={!ready}
        onClick={toggle}
        className={`flex min-h-16 w-full cursor-pointer items-center gap-4 rounded-md border-2 border-line px-5 py-3 text-left font-[inherit] transition-colors duration-200 disabled:cursor-default desktop:gap-5 desktop:px-6 print:hidden ${
          checked ? "on-navy" : "on-marigold"
        }`}
      >
        <span
          aria-hidden="true"
          className={`box-border grid size-9 flex-none place-items-center rounded border-[2.5px] border-line ${
            checked ? "bg-marigold text-on-marigold" : "bg-surface"
          }`}
        >
          {checked && (
            <Icon
              name="check"
              size={22}
              stroke={3.4}
              className={justChecked ? "animate-[cfaPop_450ms_cubic-bezier(.3,1.4,.5,1)_both]" : ""}
            />
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-[3px] desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-5">
          <span className="font-display text-[19px] leading-[1.1] font-extrabold tracking-[.03em] uppercase [font-stretch:80%] desktop:text-[21px] desktop:tracking-[.04em]">
            I&apos;ve finished this lesson
          </span>
          <span className="text-[14px] leading-[1.35] desktop:max-w-[15em] desktop:text-right desktop:text-[15px]">
            {checked
              ? next
                ? `Saved on this device. Up next: ${next}${/[.?!]$/.test(next) ? "" : "."}`
                : "Saved on this device."
              : `Marks lesson ${number} as done`}
          </span>
        </span>
      </button>
    </>
  );
}
