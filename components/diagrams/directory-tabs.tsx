"use client";

// A client component because diagramCard comes from a
// "use client" module: a server component would get references, not strings.

import { Diagram, diagramCard } from "@/components/diagram";

// Lesson 4.3, "Plugins": the three tabs of Claude's Directory (Skills,
// Connectors, Plugins) and what each one holds, drawn as a small window.
// What each tab is comes from the official plugins overview and the Help
// Centre's Directory article (checked 27 Sep 2026).

const TABS = [
  {
    name: "Skills",
    what: "Instructions Claude uses when they fit.",
    example: "Your SKILL.md from this lesson.",
  },
  {
    name: "Connectors",
    what: "Let Claude reach another app.",
    example: "Gmail, Google Drive, Canva.",
  },
  {
    name: "Plugins",
    what: "A package that bundles skills, connectors, slash commands and sub-agents, so they install together.",
    example: "You don't need any for this course.",
  },
];

const ALT =
  "Simplified drawing of Claude's Directory window with three tabs. " +
  TABS.map((tab) => `${tab.name}: ${tab.what} Example: ${tab.example}`).join(" ") +
  " The real window may look a little different.";

export function DirectoryTabsDiagram() {
  return (
    <Diagram
      alt={ALT}
      caption="The Directory's three tabs. A plugin is a bundle: skills, connectors and more in one install. Simplified drawing, not a screenshot."
    >
      <div className={`${diagramCard} mx-auto max-w-[560px] overflow-hidden`}>
        <div className="flex h-8 items-center gap-2 border-b border-border bg-surface2 px-3" aria-hidden="true">
          <span className="size-[8px] rounded-full bg-pip" />
          <span className="size-[8px] rounded-full bg-pip" />
          <span className="size-[8px] rounded-full bg-pip" />
          <span className="ml-1 text-[13px] font-bold tracking-[.03em] text-muted">Directory</span>
        </div>
        {/* Divs, not a list: the lesson's list styles would add hexagon bullets. */}
        <div className="flex flex-col gap-2.5 p-3 tablet:p-4">
          {TABS.map((tab, index) => (
            <div
              key={tab.name}
              className={`grid grid-cols-[minmax(92px,auto)_minmax(0,1fr)] gap-x-3 gap-y-1 rounded-xl p-2.5 ${
                index === TABS.length - 1 ? "bg-tint" : ""
              }`}
            >
              <span
                className={`inline-flex h-8 items-center self-start rounded-full px-3 text-[14px] font-bold ${
                  index === TABS.length - 1 ? "bg-accent text-on-accent" : "border border-border text-fg"
                }`}
              >
                {tab.name}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] leading-[1.4] text-fg">{tab.what}</span>
                <span className="text-[14px] leading-[1.4] font-bold text-muted">{tab.example}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Diagram>
  );
}
