"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

/**
 * An inline key term. Tapping the word shows its meaning right after it, with
 * a link to the glossary entry when there is one.
 * In MDX: The part doing the writing is called the <Term def="the trained AI system that generates the text.">model</Term>.
 * Or, for a word the glossary already defines: <Term>repository</Term>
 * (components/term-lookup.tsx fills in the definition and the link).
 */
export function Term({ def, href, children }: { def: string; href?: string; children: ReactNode }) {
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
            {href && (
              <>
                {" "}
                <Link href={href} className="whitespace-nowrap">
                  Glossary →
                </Link>
              </>
            )}
          </span>
        </>
      )}
    </>
  );
}

function capitalise(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
