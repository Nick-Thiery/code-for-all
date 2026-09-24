"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * Common fixes, folded away until someone needs them. In MDX:
 *
 *   <StuckBlock>
 *     <StuckItem question="Nothing happens when I type the command.">
 *       That's expected for now. You'll install Claude Code in Lesson 5.
 *     </StuckItem>
 *   </StuckBlock>
 */
export function StuckBlock({ children, open: initiallyOpen = false }: { children: ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
  const id = useId();

  return (
    <div className="overflow-hidden rounded-[14px] border-[1.5px] border-border bg-surface text-fg">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-5 py-3 text-left font-[inherit] text-fg hover:bg-surface2"
      >
        <span className="flex flex-col">
          <span className="display text-[20px] leading-[1.3] font-bold">Stuck?</span>
          <span className="t-meta text-muted">Common fixes for this lesson</span>
        </span>
        <span
          aria-hidden="true"
          className="grid size-[34px] flex-none place-items-center rounded-full border-[1.5px] border-border text-[20px] leading-none font-bold text-accent"
        >
          {open ? "−" : "+"}
        </span>
      </button>
      <div id={id} hidden={!open} className="flex-col gap-4 border-t border-border px-5 pt-4 pb-5 [&:not([hidden])]:flex">
        {children}
      </div>
    </div>
  );
}

export function StuckItem({ question, children }: { question: string; children: ReactNode }) {
  return (
    <div className="[&_p]:m-0">
      <p className="font-bold">{question}</p>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}
