import type { ReactNode } from "react";

/**
 * The module's homework, at the end of its last lesson. In MDX:
 *
 *   <Challenge title="Watch Get Started With Lovable">
 *   What to do, in Markdown.
 *   </Challenge>
 */
export function Challenge({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby="challenge-heading"
      className="blk on-marigold flex flex-col gap-3.5 rounded-md border-2 border-line px-5 pt-4 pb-5 desktop:gap-4 desktop:px-6 desktop:pt-5 desktop:pb-6"
    >
      <div className="flex flex-col gap-1.5">
        <span className="eyebrow">Challenge</span>
        <h2 id="challenge-heading" className="t-box m-0 text-[22px] desktop:text-[24px]">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-3.5 [&_p]:m-0">{children}</div>
    </section>
  );
}
