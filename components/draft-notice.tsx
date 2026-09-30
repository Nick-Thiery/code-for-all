import type { ReactNode } from "react";

/**
 * Marks a whole page as a draft someone still has to rewrite. Same look as
 * <Placeholder>, so nobody mistakes it for finished copy. Delete it from the
 * page once the real text is in.
 */
export function DraftNotice({ children }: { children: ReactNode }) {
  return (
    <aside
      aria-label="Draft notice"
      className="flex flex-col gap-1.5 rounded-md border-2 border-dashed border-line bg-paper2 px-5 py-4 text-muted [&_p]:m-0"
    >
      <span className="kicker text-muted">Draft: to be rewritten</span>
      <div className="flex flex-col gap-2">{children}</div>
    </aside>
  );
}
