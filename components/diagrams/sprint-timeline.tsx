"use client";

import { Diagram } from "@/components/diagram";
import { Icon, Note, NumberHex, type IconName } from "@/components/diagrams/parts";

// Lesson 2.2: the three sprint steps on a timeline. The steps are the slide's;
// the minutes are a suggestion (the class sprint was 20 minutes in total).

const STEPS: { icon: IconName; title: string; what: string; time: string }[] = [
  { icon: "chat", title: "Draft your prompt", what: "Describe your site and its layout, in detail.", time: "about 8 min" },
  { icon: "hammer", title: "Paste it into Lovable", what: "Let Lovable build your first draft.", time: "about 10 min" },
  { icon: "copy", title: "Save your exact prompt", what: "Into your notes and the box below. You'll improve it next.", time: "2 min" },
];

const ALT =
  "The solo sprint as a timeline of three steps. " +
  STEPS.map((s, i) => `${i + 1}, ${s.title} (${s.time}): ${s.what}`).join(" ") +
  " The times are only a guide; the class sprint was 20 minutes in total.";

export function SprintTimelineDiagram() {
  return (
    <Diagram alt={ALT} caption="The sprint in three steps. The class did it in 20 minutes; take the time you need.">
      <ol className="relative m-0 flex list-none flex-col gap-4 p-0 tablet:flex-row tablet:gap-3">
        {/* The line the steps sit on: down the left on phones, across the top on tablets. */}
        <span aria-hidden="true" className="absolute top-3 bottom-3 left-[14px] w-[3px] rounded bg-track tablet:top-[14px] tablet:right-6 tablet:bottom-auto tablet:left-6 tablet:h-[3px] tablet:w-auto" />
        {STEPS.map((step, index) => (
          <li key={step.title} className="relative flex gap-3 tablet:flex-1 tablet:flex-col tablet:items-start">
            <NumberHex n={index + 1} />
            <div className="flex min-w-0 flex-col gap-1 rounded-md bg-surface p-3 border-2 border-line tablet:w-full">
              <span className="flex items-center gap-2 font-serif text-[18px] leading-[1.2] font-semibold text-fg">
                <Icon name={step.icon} size={20} />
                {step.title}
              </span>
              <Note className="text-muted">{step.what}</Note>
              <span className="text-[13px] font-bold tracking-[.04em] text-accent uppercase">{step.time}</span>
            </div>
          </li>
        ))}
      </ol>
    </Diagram>
  );
}
