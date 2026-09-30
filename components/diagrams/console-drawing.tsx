"use client";

import { Diagram } from "@/components/diagram";
import { Label, Line, NumberHex, Window } from "@/components/diagrams/parts";

// Lesson 5.5: where the error is. A simplified drawing of a page with Chrome
// DevTools open underneath, the Console tab selected and one red line. The
// error is the lesson's practice example.

const ERROR = "Uncaught TypeError: Cannot read properties of null (reading 'value')";

const ALT =
  "Simplified drawing of a browser window. The top half is a web page with a sign-up form and a Sign up button. " +
  "The bottom half is Chrome DevTools, opened with F12, with tabs Elements, Console and Sources, and Console selected. " +
  `In the Console is one red line: ${ERROR}, and on the right, script.js:12, the file and the line. ` +
  "Three numbers mark the steps: 1, press F12; 2, click the Console tab; 3, the red text is your error, and it names the file and the line.";

export function ConsoleDrawing() {
  return (
    <Diagram alt={ALT} caption="Press F12, click Console, read the red. It names the file (script.js) and the line (12). Simplified drawing.">
      <Window className="mx-auto max-w-[560px]">
        <div className="flex flex-col gap-2 px-4 py-3" aria-hidden="true">
          <Line w="40%" tone="accent" />
          <Line w="70%" />
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="h-8 w-[46%] rounded-md border border-line bg-bg" />
            <span className="inline-flex h-8 items-center rounded-md bg-accent px-3 text-[13px] font-bold text-on-accent">Sign up</span>
          </div>
        </div>
        <div className="border-t-2 border-line bg-surface2">
          <div className="flex items-center gap-1 border-b border-line px-2 pt-1.5">
            {["Elements", "Console", "Sources"].map((tab) => (
              <span
                key={tab}
                className={`px-2 pb-1.5 text-[13px] font-bold ${tab === "Console" ? "border-b-2 border-accent text-accent" : "text-muted"}`}
              >
                {tab}
              </span>
            ))}
            {/* The step markers are real content, so they're outside aria-hidden. */}
          </div>
          <div className="flex items-start gap-2 bg-tomato-tint px-3 py-2.5 font-mono text-[13px] leading-[1.5] text-ink">
            <span className="mt-0.5 box-border size-3 flex-none rounded-full border-2 border-line bg-tomato" aria-hidden="true" />
            <span className="min-w-0 flex-1 font-bold">{ERROR}</span>
            <span className="flex-none underline">script.js:12</span>
          </div>
        </div>
      </Window>
      <div className="mx-auto mt-3 flex max-w-[560px] flex-wrap gap-x-5 gap-y-2">
        {[
          ["Press F12", "DevTools opens under the page."],
          ["Click Console", "Not Elements: Console."],
          ["Read the red", "It names the file and the line."],
        ].map(([title, what], index) => (
          <span key={title} className="flex items-center gap-2">
            <NumberHex n={index + 1} size={24} />
            <span className="flex flex-col">
              <span className="text-[14px] leading-[1.2] font-bold text-fg">{title}</span>
              <Label>{what}</Label>
            </span>
          </span>
        ))}
      </div>
    </Diagram>
  );
}
