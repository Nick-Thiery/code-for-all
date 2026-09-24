"use client";

import { useState, type ReactNode } from "react";

/**
 * An inline key term. Tapping the word shows its meaning right after it.
 * In MDX: The part doing the writing is called the <Term def="the trained AI system that generates the text.">model</Term>.
 */
export function Term({ def, children }: { def: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline cursor-pointer rounded border-0 bg-transparent px-0.5 font-[inherit] font-bold text-fg underline decoration-accent decoration-dotted decoration-2 underline-offset-[5px]"
      >
        {children}
      </button>
      {open && (
        <>
          {" "}
          <span className="rounded-md bg-tint px-2 py-0.5 [box-decoration-break:clone]">
            {typeof children === "string" && <strong>{capitalise(children)}:</strong>} {def}
          </span>
        </>
      )}
    </>
  );
}

function capitalise(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
