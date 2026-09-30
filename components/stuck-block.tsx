"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";

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
    <div className="blk text-fg print:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full cursor-pointer items-end justify-between gap-4 border-0 bg-transparent p-0 pb-[18px] text-left font-[inherit] text-fg desktop:pb-7"
      >
        <span className="flex flex-col gap-2">
          <span className="t-section group-hover:text-accent">Stuck?</span>
          <span className="t-meta text-muted">Common fixes for this lesson</span>
        </span>
        <span className="plus-box mb-1">
          <Icon name="plus" size={18} stroke={2.8} />
        </span>
      </button>
      <div id={id} hidden={!open} className="flex-col border-b-2 border-line [&:not([hidden])]:flex">
        {children}
        <p className="t-meta m-0 border-t-2 border-line py-5 text-muted">
          Still stuck? The <Link href="/help">Help page</Link> covers devices, access, lost progress and what to do when
          something breaks.
        </p>
      </div>
      {!open && <div aria-hidden="true" className="border-t-2 border-line" />}
    </div>
  );
}

export function StuckItem({ question, children }: { question: string; children: ReactNode }) {
  return (
    <div className="border-t-2 border-line pt-5 pb-6 [&_p]:m-0">
      <p className="font-serif text-[21px] leading-[1.2] font-semibold desktop:text-[27px]">{question}</p>
      <div className="mt-2.5 text-[16px] leading-[1.6] text-muted desktop:mt-3 desktop:text-[19px] [&_p+p]:mt-3">{children}</div>
    </div>
  );
}
