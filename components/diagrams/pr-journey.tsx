"use client";

import { Diagram } from "@/components/diagram";
import { Icon, Note, NumberHex, type IconName } from "@/components/diagrams/parts";

// Lesson 7.4: the pull request journey, from the push to Vercel redeploying.
// The steps and button names are the lesson's.

const STEPS: { icon: IconName; title: string; what: string; you: boolean }[] = [
  { icon: "cloud", title: "Push your branch", what: "A yellow Compare & pull request banner appears.", you: true },
  { icon: "page", title: "Open the pull request", what: "Click the banner, write one line, Create pull request.", you: true },
  { icon: "eye", title: "Review", what: "Files changed: green added, red removed. Comment or approve.", you: false },
  { icon: "check", title: "Merge", what: "Merge pull request, then Confirm merge. Your branch joins main.", you: false },
  { icon: "globe", title: "Vercel redeploys", what: "The live site updates by itself.", you: false },
];

const ALT =
  "The pull request journey in five steps. " +
  STEPS.map((s, i) => `${i + 1}, ${s.title}${s.you ? " (you)" : " (a teammate, or you as your own team)"}: ${s.what}`).join(" ");

export function PrJourneyDiagram() {
  return (
    <Diagram alt={ALT} caption="From your push to the live site: open, review, merge. Reviewing and merging are a human's job.">
      <ol className="relative m-0 flex list-none flex-col gap-3 p-0">
        <span aria-hidden="true" className="absolute top-4 bottom-4 left-[14px] w-[3px] rounded bg-track" />
        {STEPS.map((step, index) => (
          <li key={step.title} className="relative flex items-start gap-3">
            <NumberHex n={index + 1} />
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-surface p-3 ring-1 ring-border">
              <span className="grid size-9 flex-none place-items-center rounded-full bg-tint">
                <Icon name={step.icon} size={20} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[15px] leading-[1.3] font-bold text-fg">{step.title}</span>
                <Note className="text-[14px] text-muted">{step.what}</Note>
              </span>
              <span className={`rounded-full px-2.5 text-[13px] leading-[1.7] font-bold ${step.you ? "bg-accent text-on-accent" : "bg-surface2 text-muted ring-1 ring-border"}`}>
                {step.you ? "you" : index === 4 ? "automatic" : "a teammate"}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </Diagram>
  );
}
