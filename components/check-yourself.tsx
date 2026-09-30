"use client";

import { Children, cloneElement, isValidElement, useId, useState, type ReactElement, type ReactNode } from "react";

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
    <section aria-label="Check yourself" className="blk flex flex-col gap-5 text-fg">
      <div className="flex flex-col gap-2">
        <span className="t-block">Check yourself</span>
        <p className="t-meta m-0 text-muted">Answer in your head first, then check.</p>
      </div>
      <div className="flex flex-col gap-4 desktop:gap-5">
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
    <div className="card flex flex-col gap-3.5 p-[18px] break-inside-avoid shadow-h5 desktop:p-6 desktop:shadow-h6">
      <p className="m-0 flex gap-3.5 font-serif text-[21px] leading-[1.25] font-semibold desktop:text-[25px]">
        {number && (
          <span aria-hidden="true" className="numeral pt-1 text-[36px] text-accent desktop:text-[44px]">
            {number}
          </span>
        )}
        {number && <span className="sr-only">{number}.</span>}
        <span>{q}</span>
      </p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="btn btn-small self-start print:hidden"
      >
        {open ? "Hide answer" : "Show answer"}
      </button>
      <div
        id={id}
        hidden={!open}
        className="on-sky rounded border-2 border-line px-[18px] py-3.5 text-[17px] leading-[1.55] [&_p]:m-0 [&:not([hidden])]:flex [&:not([hidden])]:flex-col [&:not([hidden])]:gap-2"
      >
        {children}
      </div>
    </div>
  );
}
