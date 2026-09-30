"use client";

import { Diagram } from "@/components/diagram";
import { Icon, Label, type IconName } from "@/components/diagrams/parts";

// Lesson 3.2: one small icon for each of the four example prompts, grouped
// under the two kinds of job they belong to. The prompts are the slide's.

const JOBS: { kind: string; items: { icon: IconName; prompt: string }[] }[] = [
  {
    kind: "Routines",
    items: [
      { icon: "clock", prompt: "Check this folder for errors every hour." },
      { icon: "steps", prompt: "Run a multi-step process: clean the files, test the code, then generate a report." },
    ],
  },
  {
    kind: "Refactoring",
    items: [
      { icon: "tag", prompt: "Rename this variable everywhere it appears." },
      { icon: "broom", prompt: "Make this code easier to read while keeping the same functionality." },
    ],
  },
];

const ALT =
  "Four example jobs for Claude Code, each with a small icon. Routines: a clock for 'Check this folder for errors every hour', and a numbered list for 'Run a multi-step process: clean the files, test the code, then generate a report'. " +
  "Refactoring: a name tag for 'Rename this variable everywhere it appears', and a broom for 'Make this code easier to read while keeping the same functionality'.";

export function FourJobsDiagram() {
  return (
    <Diagram alt={ALT} caption="The four example prompts: two routines, two kinds of refactoring.">
      <div className="grid gap-3 tablet:grid-cols-2">
        {JOBS.map((job) => (
          <div key={job.kind} className="flex flex-col gap-2">
            <Label className="text-accent">{job.kind}</Label>
            {job.items.map((item) => (
              <div key={item.prompt} className="flex items-center gap-3 rounded-md bg-surface p-3 border-2 border-line">
                <span className="grid size-11 flex-none place-items-center rounded-full border-2 border-line bg-sky">
                  <Icon name={item.icon} />
                </span>
                <span className="font-mono text-[14px] leading-[1.45] text-fg">{item.prompt}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Diagram>
  );
}
