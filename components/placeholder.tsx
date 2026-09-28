import type { ReactNode } from "react";
import { isProduction } from "@/lib/site";

/**
 * Content that's still missing, marked so nobody mistakes it for the real
 * thing. Shown locally and on preview deployments; on the production site it
 * renders nothing, so learners never see a "content needed" box. The text
 * around it has to read naturally without it.
 *
 * Every placeholder is listed in docs/content-needed.md (npm run content-needed).
 * In MDX: <Placeholder>Link to the "Get Started With Lovable" video.</Placeholder>
 */
export function Placeholder({ children }: { children: ReactNode }) {
  if (isProduction) return null;
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
