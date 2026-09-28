"use client";

import { Diagram, FlowArrow } from "@/components/diagram";
import { Card, Label, Note } from "@/components/diagrams/parts";
import { Hex } from "@/components/hex";

// Lesson 2.3: a rough prompt goes into Claude and a sharper one comes out.
// The rough prompt is like the lesson's sample; the sharper one names the
// three things the lesson says to include (what, who, look).

const ROUGH = "Make a personality quiz website.";
const SHARP = [
  { part: "What it includes", text: "five questions, six results, a Start button" },
  { part: "Who it's for", text: "teenagers" },
  { part: "How it looks", text: "warm colours, big friendly headings, works on a phone" },
];

const ALT =
  `A rough prompt, "${ROUGH}", goes into Claude, drawn as a hexagon with a sparkle. Out comes a sharper prompt with three parts: ` +
  SHARP.map((s) => `${s.part}: ${s.text}`).join("; ") +
  ". You send the rough prompt with your original prompt pasted at the end, and Claude gives back a revision, not a new idea.";

export function RefinePromptDiagram() {
  return (
    <Diagram alt={ALT} caption="A rough prompt in, a sharper prompt out. Claude adds what, who and how it looks.">
      <div className="flex flex-col items-stretch gap-2.5 tablet:flex-row tablet:items-center">
        <Card title="Rough prompt" className="tablet:flex-1">
          <Note className="rounded-lg bg-surface2 px-2.5 py-2 font-mono text-[14px]">{ROUGH}</Note>
          <Note className="text-muted">Vague. Lovable would guess the rest.</Note>
        </Card>
        <FlowArrow />
        <div className="flex flex-col items-center gap-1 self-center">
          <span className="relative flex h-[68px] w-[60px] items-center justify-center">
            <Hex width={60} height={68} shape="fill-accent" className="absolute inset-0" />
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" className="relative fill-none stroke-on-accent stroke-2" strokeLinecap="round">
              <path d="M12 3v5M12 16v5M3 12h5M16 12h5M12 8l2 4-2 4-2-4z" />
            </svg>
          </span>
          <Label className="text-fg">Claude</Label>
        </div>
        <FlowArrow />
        <Card title="Sharper prompt" tone="tint" className="tablet:flex-[1.4]">
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {SHARP.map((s) => (
              <li key={s.part} className="flex flex-col">
                <span className="text-[13px] font-bold tracking-[.04em] text-accent uppercase">{s.part}</span>
                <span className="text-[15px] leading-[1.4] text-fg">{s.text}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Diagram>
  );
}
