import type { ReactNode } from "react";

/**
 * Content that's still missing, marked so nobody mistakes it for the real
 * thing. Find them all with: grep -rn "<Placeholder" content
 * In MDX: <Placeholder>Link to the "Get Started With Lovable" video.</Placeholder>
 */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <aside
      aria-label="Placeholder"
      className="flex flex-col gap-1 rounded-[14px] border-2 border-dashed border-pip px-5 py-4 text-muted [&_p]:m-0"
    >
      <span className="kicker">Placeholder: content needed</span>
      <div>{children}</div>
    </aside>
  );
}
