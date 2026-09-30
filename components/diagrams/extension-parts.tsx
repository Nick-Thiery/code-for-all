"use client";

import { Diagram } from "@/components/diagram";
import { Label, Line, NumberHex, Window } from "@/components/diagrams/parts";

// Lesson 3.5: the parts of a Chrome extension, using the lesson's own
// "highlights words on any page" idea as the example. Three parts: the icon
// in the toolbar, the popup that opens when you click it, and what happens
// on the page.

const PARTS = [
  { n: 1, name: "Icon", what: "Sits in Chrome's toolbar. Click it to open the popup." },
  { n: 2, name: "Popup", what: "A tiny window with the extension's controls: a switch, a word to look for." },
  { n: 3, name: "What happens on the page", what: "The extension changes the page: here it highlights every 'the'." },
];

const ALT =
  "Simplified drawing of a browser window with a Chrome extension. " +
  "1, Icon: a small hexagon in the toolbar next to the address bar. " +
  "2, Popup: a small panel under the icon with the title Highlighter, a switch turned on, and a box holding the word 'the'. " +
  "3, What happens on the page: in the page below, every 'the' in the text is highlighted. " +
  "The example extension highlights words on any page, one of the lesson's ideas.";

export function ExtensionPartsDiagram() {
  return (
    <Diagram alt={ALT} caption="A Chrome extension has three parts: the icon, the popup, and what it does to the page. Simplified drawing.">
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-start">
        <Window className="tablet:flex-[1.3]">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2" aria-hidden="true">
            <span className="h-6 flex-1 rounded-md bg-surface2" />
            <span className="relative">
              <NumberHex n={1} size={26} />
            </span>
          </div>
          <div className="relative px-3 pt-3 pb-4">
            {/* The popup, hanging from the icon. */}
            <div className="absolute top-1 right-3 z-10 w-[168px] rounded-xl border border-accent bg-surface p-2.5 shadow-[0_8px_22px_color-mix(in_srgb,var(--accent)_16%,transparent)]">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-extrabold text-fg">Highlighter</span>
                <NumberHex n={2} size={22} />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[13px] text-fg">
                <span>On</span>
                <span className="relative h-4 w-8 rounded-full bg-accent"><span className="absolute top-0.5 right-0.5 size-3 rounded-full bg-on-accent" /></span>
              </div>
              <span className="mt-1.5 block rounded-md border border-border px-2 py-0.5 font-mono text-[13px] text-fg">the</span>
            </div>
            {/* The page, with highlights. */}
            <div className="flex flex-col gap-2 pr-[180px] tablet:pr-[184px]">
              <Line w="60%" tone="accent" />
              <p className="m-0 text-[13px] leading-[1.6] text-fg">
                <Mark>The</Mark> best part of <Mark>the</Mark> school day is <Mark>the</Mark> bit after lunch, when <Mark>the</Mark> canteen is quiet.
              </p>
              <span className="flex items-center gap-2">
                <NumberHex n={3} size={22} />
                <Label>every &ldquo;the&rdquo; is highlighted</Label>
              </span>
            </div>
          </div>
        </Window>
        <ol className="m-0 flex list-none flex-col gap-2.5 p-0 tablet:flex-1">
          {PARTS.map((part) => (
            <li key={part.n} className="flex items-start gap-2.5 rounded-2xl bg-surface p-3 ring-1 ring-border">
              <NumberHex n={part.n} size={26} />
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] leading-[1.3] font-bold text-fg">{part.name}</span>
                <span className="text-[14px] leading-[1.4] text-muted">{part.what}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Diagram>
  );
}

function Mark({ children }: { children: string }) {
  return <mark className="rounded-sm bg-(--part-audience) px-0.5 text-(--part-audience-ink)">{children}</mark>;
}
