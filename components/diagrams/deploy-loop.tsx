"use client";

import { Diagram } from "@/components/diagram";
import { Icon, Label, type IconName } from "@/components/diagrams/parts";

// Lesson 6.6: the loop once Vercel is connected. Push, Vercel rebuilds, the
// live link updates, you change something, and round again. Never upload.

const STEPS: { icon: IconName; title: string; what: string }[] = [
  { icon: "hammer", title: "Change something", what: "Edit your project, with Claude Code or Lovable." },
  { icon: "cloud", title: "Push to GitHub", what: "Your commits go up to the repo." },
  { icon: "refresh", title: "Vercel rebuilds", what: "It notices the push and builds the site again." },
  { icon: "globe", title: "Live link updates", what: "The same link, now showing your change." },
];

const ALT =
  "A loop of four steps. " +
  STEPS.map((s, i) => `${i + 1}, ${s.title}: ${s.what}`).join(" ") +
  " Then back to step 1. You never upload anything again.";

export function DeployLoopDiagram() {
  return (
    <Diagram alt={ALT} caption="Once Vercel is connected: change, push, rebuild, live. Then round again. You never upload anything.">
      <div className="relative grid gap-2.5 tablet:grid-cols-2">
        {STEPS.map((step, index) => (
          <div key={step.title} className="flex items-center gap-3 rounded-md bg-surface p-3 border-2 border-line">
            <span className="grid size-11 flex-none place-items-center rounded-full border-2 border-line bg-sky">
              <Icon name={step.icon} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[15px] leading-[1.3] font-bold text-fg">
                <span className="text-accent">{index + 1} ·</span> {step.title}
              </span>
              <span className="text-[14px] leading-[1.4] text-muted">{step.what}</span>
            </span>
          </div>
        ))}
        <span className="flex items-center justify-center gap-2 py-1 tablet:col-span-2">
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" className="fill-none stroke-accent stroke-2" strokeLinecap="round">
            <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />
          </svg>
          <Label className="text-accent">4 goes back to 1, every time you push</Label>
        </span>
      </div>
    </Diagram>
  );
}
