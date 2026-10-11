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
        className="group flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent p-0 pb-3.5 text-left font-[inherit] text-fg desktop:pb-4"
      >
        <span className="flex flex-col gap-1">
          <span className="t-box text-[22px] group-hover:text-accent desktop:text-[24px]">Stuck?</span>
          <span className="t-meta text-muted">Common fixes for this lesson</span>
        </span>
        <span className="plus-box">
          <Icon name="plus" size={18} stroke={2.8} />
        </span>
      </button>
      <div id={id} hidden={!open} className="flex-col border-b-2 border-line [&:not([hidden])]:flex">
        {children}
        <p className="t-meta m-0 border-t-2 border-line py-4 text-muted">
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
    <div className="border-t-2 border-line pt-4 pb-5 [&_p]:m-0">
      <p className="font-serif text-[19px] leading-[1.3] font-semibold desktop:text-[21px]">{question}</p>
      <div className="mt-2 text-[17px] leading-[1.55] text-muted desktop:text-[18px] [&_p+p]:mt-3">{children}</div>
    </div>
  );
}
