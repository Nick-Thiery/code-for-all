"use client";

import { Children, cloneElement, isValidElement, useId, useState, type ReactElement, type ReactNode } from "react";
import { Hex } from "@/components/hex";

/**
 * A short quiz. Answers stay hidden until the learner asks for them.
 * In MDX:
 *
 *   <CheckYourself>
 *     <Question q="Which file changes the text on your main button?">
 *       index.html. It holds the words and structure.
 *     </Question>
 *   </CheckYourself>
 */
export function CheckYourself({ children }: { children: ReactNode }) {
  const questions = Children.toArray(children).filter(isValidElement) as ReactElement<QuestionProps>[];
  return (
    <section
      aria-label="Check yourself"
      className="flex flex-col gap-4 rounded-[20px] border-[1.5px] border-border bg-surface p-(--pad) text-fg"
    >
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2">
          <Hex width={16} height={18} shape="fill-none stroke-accent stroke-[2.4]">
            <text x="12" y="17.4" textAnchor="middle" className="fill-accent font-sans text-[12px] font-bold">
              ?
            </text>
          </Hex>
          <span className="eyebrow leading-none">Check yourself</span>
        </span>
        <p className="t-meta m-0 text-muted">Answer in your head first, then check.</p>
      </div>
      <div className="flex flex-col">
        {questions.map((question, index) => cloneElement(question, { key: index, number: index + 1 }))}
      </div>
    </section>
  );
}

type QuestionProps = { q: string; number?: number; children: ReactNode };

export function Question({ q, number, children }: QuestionProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="flex flex-col gap-2.5 border-t border-border py-4 last:pb-0">
      <p className="m-0 flex gap-2.5 font-bold">
        {number && <span className="text-accent tabular-nums">{number}.</span>}
        <span>{q}</span>
      </p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="btn btn-small self-start"
      >
        {open ? "Hide answer" : "Show answer"}
      </button>
      <div id={id} hidden={!open} className="rounded-[14px] bg-tint px-[18px] py-3.5 [&_p]:m-0 [&:not([hidden])]:flex [&:not([hidden])]:flex-col [&:not([hidden])]:gap-2">
        {children}
      </div>
    </div>
  );
}
