"use client";

import { Diagram, FlowArrow } from "@/components/diagram";
import { Card, Label, Note } from "@/components/diagrams/parts";
import { Hex } from "@/components/hex";

// Lesson 4.2: a skill as a recipe card Claude picks up when the task fits.
// Three cards on the shelf; the task matches one, so Claude loads that one
// and leaves the others packed away (the slide's on-demand loading).

const TASK = "Write this week's club newsletter.";
const SHELF = [
  { name: "club-newsletter", when: "When asked to write the club's newsletter", picked: true },
  { name: "homework-checker", when: "When asked to check maths homework", picked: false },
  { name: "poster-maker", when: "When asked for an event poster", picked: false },
];
const STEPS = ["Start with one friendly line about this week", "Three short sections: news, dates, a thank-you", "Keep it under 200 words, British spelling"];

const ALT =
  `The task "${TASK}" goes to Claude, drawn as a hexagon. On a shelf are three skill cards: ` +
  SHELF.map((s) => `${s.name} (${s.when})`).join(", ") +
  ". Claude picks up club-newsletter because its 'when to use' line fits the task, and leaves the other two packed away. " +
  "The picked card reads like a recipe: a name, when to use it, and three steps: " +
  STEPS.join("; ") +
  ".";

export function SkillRecipeDiagram() {
  return (
    <Diagram alt={ALT} caption="A skill is a recipe card. Claude picks up the one whose 'when to use' line fits the task, and leaves the rest on the shelf.">
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-start">
        <div className="flex flex-col gap-2 tablet:w-[150px] tablet:flex-none">
          <Label>The task</Label>
          <span className="self-start rounded-2xl rounded-tl-sm bg-accent px-3 py-1.5 text-[14px] leading-[1.4] text-on-accent">{TASK}</span>
          <div className="flex items-center gap-2 pt-1">
            <span className="relative flex h-[38px] w-[34px] items-center justify-center">
              <Hex width={34} height={38} shape="fill-accent" className="absolute inset-0" />
              <span className="relative text-[13px] font-extrabold text-on-accent">AI</span>
            </span>
            <Note className="text-muted">Claude checks the shelf.</Note>
          </div>
        </div>
        <div className="hidden tablet:flex tablet:self-center"><FlowArrow /></div>
        <div className="flex min-w-0 flex-col gap-2 tablet:flex-1">
          <Label>The shelf</Label>
          <div className="flex flex-col gap-2">
            {SHELF.map((skill) => (
              <div
                key={skill.name}
                className={`flex flex-col gap-1 rounded-md p-2.5 ${skill.picked ? "on-marigold border-2 border-line" : "bg-surface border-2 border-line opacity-80"}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <code className="font-mono text-[14px] font-semibold [overflow-wrap:anywhere] text-fg">{skill.name}/SKILL.md</code>
                  {skill.picked && <span className="rounded-full bg-accent px-2 text-[13px] leading-[1.6] font-bold text-on-accent">picked</span>}
                </span>
                <span className="text-[14px] leading-[1.4] text-muted">{skill.when}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden tablet:flex tablet:self-center"><FlowArrow /></div>
        <Card tone="tint" className="tablet:w-[190px] tablet:flex-none">
          <Label className="text-accent">The recipe</Label>
          <code className="font-mono text-[14px] font-semibold text-fg">club-newsletter</code>
          <Note className="text-[14px] text-muted">Use when: asked to write the club&apos;s newsletter.</Note>
          <ol className="m-0 flex flex-col gap-1 pl-5 text-[14px] leading-[1.4] text-fg">
            {STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Card>
      </div>
    </Diagram>
  );
}
