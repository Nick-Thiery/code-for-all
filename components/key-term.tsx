import type { ReactNode } from "react";

/**
 * In MDX:
 *   <KeyTerm term="Token">A small piece of text, like a word or part of a word.</KeyTerm>
 */
export function KeyTerm({ term, children }: { term: string; children: ReactNode }) {
  return (
    <aside
      aria-label="Key term"
      className="flex flex-col gap-1 rounded-xl border border-border px-5 py-4 text-fg [&_p]:m-0"
    >
      <span className="kicker">Key term</span>
      <dfn className="display text-[22px] leading-[1.3] font-bold text-accent not-italic">{term}</dfn>
      <div>{children}</div>
    </aside>
  );
}
