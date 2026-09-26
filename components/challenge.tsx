import type { ReactNode } from "react";
import { Hex } from "@/components/hex";

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
      className="overflow-hidden rounded-[20px] border-2 border-accent bg-surface text-fg"
    >
      <div className="flex flex-col gap-2 bg-accent p-(--pad) text-on-accent">
        <span className="flex items-center gap-2">
          <Hex width={16} height={18} shape="fill-on-accent" />
          <span className="eyebrow leading-none text-on-accent">Challenge</span>
        </span>
        <h2 id="challenge-heading" className="t-h3 m-0">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-3 p-(--pad) [&_p]:m-0">{children}</div>
    </section>
  );
}
