import type { ReactNode } from "react";

/**
 * In MDX:
 *   <KeyTerm term="Token">A small piece of text, like a word or part of a word.</KeyTerm>
 *
 * From 1280px a key term on its own sits in the side column, beside the text
 * that uses it. Several in a row (a "Key terms" lesson) stay in the main
 * column, and so does every key term on a narrower screen.
 */
export function KeyTerm({ term, children }: { term: string; children: ReactNode }) {
  return (
    <aside
      aria-label={`Key term: ${term}`}
      className="key-term card-flat flex flex-col gap-2 px-5 pt-[18px] pb-5 text-fg desktop:px-[22px] desktop:pt-5 desktop:pb-[22px] [&_p]:m-0"
    >
      <span className="eyebrow text-[12px] tracking-[.14em] desktop:text-[13px]">Key term</span>
      <dfn className="font-serif text-[30px] leading-none font-semibold italic desktop:text-[34px]">{term}</dfn>
      <div className="text-[16px] leading-[1.5]">{children}</div>
    </aside>
  );
}
