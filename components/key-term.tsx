import type { ReactNode } from "react";

/**
 * In MDX:
 *   <KeyTerm term="Token">A small piece of text, like a word or part of a word.</KeyTerm>
 *
 * It sits in the text, right where the word is used.
 */
export function KeyTerm({ term, children }: { term: string; children: ReactNode }) {
  return (
    <aside
      aria-label={`Key term: ${term}`}
      className="key-term card-flat flex flex-col gap-1.5 px-5 pt-4 pb-5 text-fg [&_p]:m-0"
    >
      <span className="eyebrow text-[12px] tracking-[.14em] desktop:text-[13px]">Key term</span>
      <dfn className="font-serif text-[22px] leading-[1.15] font-semibold italic desktop:text-[24px]">{term}</dfn>
      <div className="text-[17px] leading-[1.5] desktop:text-[18px]">{children}</div>
    </aside>
  );
}
