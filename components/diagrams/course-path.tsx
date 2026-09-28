"use client";

import { Diagram, FlowArrow } from "@/components/diagram";
import { Hex } from "@/components/hex";
import { Card, Icon, Label, Note, type IconName } from "@/components/diagrams/parts";

// Lesson 1.1: the course path (three phases, ten modules) and the loop each
// module runs: read, practise, build. Phase names and module counts match
// content/course.yml.

const PHASES = [
  { name: "Build with AI", modules: [1, 2, 3, 4, 5], note: "Lovable, Claude Code, Claude Design" },
  { name: "Developer fundamentals", modules: [6, 7, 8], note: "GitHub, Vercel, APIs and logging in" },
  { name: "Your final project", modules: [9, 10], note: "Plan it, ship it, show it" },
];

const LOOP: { icon: IconName; name: string; what: string }[] = [
  { icon: "book", name: "Read", what: "A short lesson teaches one idea." },
  { icon: "sparkle", name: "Practise", what: "Try it in a practice box or a quiz." },
  { icon: "hammer", name: "Build", what: "A hands-on part, then the module's Challenge." },
];

const ALT =
  "The course path: three phases in a row. Build with AI, Modules 1 to 5 (Lovable, Claude Code, Claude Design). " +
  "Developer fundamentals, Modules 6 to 8 (GitHub, Vercel, APIs and logging in). Your final project, Modules 9 and 10 (plan it, ship it, show it). " +
  "Underneath, the loop every module runs: Read (a short lesson teaches one idea), Practise (try it in a practice box or a quiz), Build (a hands-on part, then the module's Challenge), and back to Read.";

export function CoursePathDiagram() {
  return (
    <Diagram alt={ALT} caption="Ten modules in three phases, and the loop every module runs: read, practise, build.">
      <div className="flex flex-col gap-4">
        <div className="grid gap-2.5 tablet:grid-cols-3">
          {PHASES.map((phase, index) => (
            <Card key={phase.name} className="gap-2.5">
              <Label className="text-accent">Phase {index + 1}</Label>
              <span className="font-display text-[17px] leading-[1.2] font-extrabold text-fg">{phase.name}</span>
              <div className="flex flex-wrap gap-1.5" aria-hidden="true">
                {phase.modules.map((n) => (
                  <span key={n} className="relative flex h-[30px] w-[27px] items-center justify-center">
                    <Hex width={27} height={30} shape={n <= 8 ? "fill-accent" : "fill-none stroke-pip stroke-2 [stroke-dasharray:4_3]"} className="absolute inset-0" />
                    <span className={`relative text-[13px] leading-none font-extrabold ${n <= 8 ? "text-on-accent" : "text-muted"}`}>{n}</span>
                  </span>
                ))}
              </div>
              <Note className="text-muted">{phase.note}</Note>
            </Card>
          ))}
        </div>
        <div className="flex flex-col gap-2.5 rounded-2xl bg-surface/60 p-3 tablet:flex-row tablet:items-stretch dark:bg-surface2/60">
          {LOOP.map((step, index) => (
            <div key={step.name} className="contents">
              {index > 0 && <FlowArrow />}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="grid size-11 flex-none place-items-center rounded-full bg-tint">
                  <Icon name={step.icon} />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-[17px] leading-[1.2] font-extrabold text-fg">{step.name}</span>
                  <span className="text-[14px] leading-[1.4] text-muted">{step.what}</span>
                </span>
              </div>
            </div>
          ))}
          <span className="flex items-center gap-1.5 self-center text-[14px] font-bold text-accent tablet:flex-none">
            <Icon name="refresh" size={18} />
            and again
          </span>
        </div>
      </div>
    </Diagram>
  );
}
