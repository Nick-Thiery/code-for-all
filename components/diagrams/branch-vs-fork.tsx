"use client";

import { Diagram } from "@/components/diagram";
import { Chip, Label, Note } from "@/components/diagrams/parts";

// Lesson 7.2: a fork is a separate copy on your own account; a branch is a
// lane inside the repo you share. Two boxes for the fork, one box with two
// lanes for the branch.

const ALT =
  "Two pictures. Fork: two separate repo boxes. The original, on someone else's account, and your copy, on your account, with an arrow labelled fork between them. They don't share anything after that. " +
  "Branch: one repo box, shared by the team, with two lanes inside it: main, and your branch alex-keyboard running alongside it and joining back into main.";

export function BranchVsForkDiagram() {
  return (
    <Diagram alt={ALT} caption="A fork is your own separate copy. A branch is your own lane inside the repo you share.">
      <div className="grid gap-3 tablet:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-2xl bg-surface/60 p-3 dark:bg-surface2/60">
          <span className="font-display text-[17px] leading-[1.2] font-extrabold text-fg">Fork</span>
          <div className="flex flex-col items-stretch gap-1.5 tablet:flex-row tablet:items-center">
            <Repo owner="someone else's account" name="their-project" />
            <span className="flex items-center justify-center gap-1 tablet:flex-col">
              <svg width="30" height="18" viewBox="0 0 34 20" aria-hidden="true" className="flex-none rotate-90 fill-none stroke-accent stroke-3 tablet:rotate-0">
                <path d="M3 10h26M21 3l8 7-8 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Label className="text-accent">fork</Label>
            </span>
            <Repo owner="your account" name="their-project" mine />
          </div>
          <Note className="text-muted">Two repos. Yours is completely separate from the original.</Note>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl bg-surface/60 p-3 dark:bg-surface2/60">
          <span className="font-display text-[17px] leading-[1.2] font-extrabold text-fg">Branch</span>
          <div className="rounded-xl bg-surface p-3 ring-1 ring-border">
            <Label>the team&apos;s repo</Label>
            <div className="relative mt-2 h-[84px]" aria-hidden="true">
              <svg viewBox="0 0 300 84" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible fill-none">
                <path d="M10 62 H290" vectorEffect="non-scaling-stroke" className="stroke-accent stroke-[5] dark:stroke-fg" strokeLinecap="round" />
                <path d="M70 62 C100 62 100 22 130 22 H190 C220 22 220 62 250 62" vectorEffect="non-scaling-stroke" className="stroke-deco stroke-[4]" strokeLinecap="round" />
              </svg>
              <span className="absolute top-[4px] left-[42%] -translate-x-1/2"><Chip tone="deco">alex-keyboard</Chip></span>
              <span className="absolute bottom-0 left-2"><Chip tone="accent">main</Chip></span>
            </div>
          </div>
          <Note className="text-muted">One repo, many lanes. Everyone works in their own lane, then merges back.</Note>
        </div>
      </div>
    </Diagram>
  );
}

function Repo({ owner, name, mine = false }: { owner: string; name: string; mine?: boolean }) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-1 rounded-xl p-3 ${mine ? "bg-tint ring-2 ring-accent" : "bg-surface ring-1 ring-border"}`}>
      <Label>{owner}</Label>
      <code className="font-mono text-[14px] font-semibold text-fg">{name}</code>
    </div>
  );
}
