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
      className="blk on-marigold flex flex-col gap-4 rounded-md border-2 border-line px-[22px] pt-6 pb-[26px] shadow-h6 desktop:gap-5 desktop:px-[34px] desktop:pt-[30px] desktop:pb-[34px] desktop:shadow-h8"
    >
      <div className="flex flex-col gap-2.5">
        <span className="eyebrow">Challenge</span>
        <h2 id="challenge-heading" className="t-block m-0">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-3.5 [&_p]:m-0">{children}</div>
    </section>
  );
}
