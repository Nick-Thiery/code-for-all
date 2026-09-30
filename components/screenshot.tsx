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
    <figure className="flex flex-col gap-3">
      <div className="grid aspect-[16/10] place-items-center rounded-xl border border-border bg-[repeating-linear-gradient(135deg,var(--surface2)_0_12px,var(--bg)_12px_24px)] p-4">
        <span className="rounded-lg bg-bg px-3 py-1.5 text-center font-mono text-[15px] leading-[1.4] text-muted">
          screenshot · {children}
        </span>
      </div>
      {caption && <figcaption className="t-meta text-muted">{caption}</figcaption>}
    </figure>
  );
}
