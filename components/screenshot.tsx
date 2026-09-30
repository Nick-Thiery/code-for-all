import type { ReactNode } from "react";
import { isProduction } from "@/lib/site";

/**
 * A slot for a screenshot that hasn't been taken yet. Like Placeholder, it
 * shows locally and on previews and renders nothing on the production site,
 * and it's listed in docs/content-needed.md.
 * In MDX: <Screenshot caption="Claude Code writes its reply in your terminal.">Claude Code replying in the terminal</Screenshot>
 */
export function Screenshot({ caption, children }: { caption?: string; children: ReactNode }) {
  if (isProduction) return null;
  return (
    <figure className="blk flex flex-col gap-3.5">
      <div className="grid aspect-[16/10] place-items-center rounded-md border-2 border-dashed border-line bg-paper2 p-4">
        <span className="rounded border-2 border-line bg-surface px-3 py-1.5 text-center font-mono text-[15px] leading-[1.4] text-muted">
          screenshot · {children}
        </span>
      </div>
      {caption && <figcaption className="fig-caption">{caption}</figcaption>}
    </figure>
  );
}
