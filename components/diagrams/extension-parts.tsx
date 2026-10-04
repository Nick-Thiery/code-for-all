"use client";

import { Diagram } from "@/components/diagram";
import { Label, Line, NumberHex, Window } from "@/components/diagrams/parts";

// Lesson 3.5: the parts of a Chrome extension, using the lesson's own
// "highlights words on any page" idea as the example. Every extension is a
// folder with a manifest.json in it, the only file Chrome requires
// (developer.chrome.com/docs/extensions/get-started). This one also has an
// icon in the toolbar, a popup that opens when you click it, and something it
// does to the page.

const PARTS = [
  {
    n: 1,
    name: "manifest.json",
    what: "The one file every extension must have. It gives the name and version, the permissions it needs, and what opens when you click the icon.",
  },
  { n: 2, name: "Icon", what: "Sits in Chrome's toolbar. Click it to open the popup. Without an icon file, Chrome shows a plain one." },
  { n: 3, name: "Popup", what: "A tiny window with the extension's controls: a switch, a word to look for. Its code goes in popup.html and popup.js." },
  {
    n: 4,
    name: "What happens on the page",
    what: "Here it highlights every 'the'. Not every extension changes pages: a tab organiser changes your tabs instead.",
  },
];

const ALT =
  "Simplified drawing of a Chrome extension. " +
  "1, manifest.json: the first file in the extension's folder, listed above popup.html, popup.js and the other files it needs. It's the one file every extension must have. " +
  "2, Icon: a small hexagon in the browser's toolbar next to the address bar. " +
  "3, Popup: a small panel under the icon with the title Highlighter, a switch turned on, and a box holding the word 'the'. " +
  "4, What happens on the page: in the page below, every 'the' in the text is highlighted. " +
  "The example extension highlights words on any page, one of the lesson's ideas.";

export function ExtensionPartsDiagram() {
  return (
    <Diagram alt={ALT} caption="Every Chrome extension has a manifest.json file. This one also has an icon, a popup, and something it does to the page. Simplified drawing.">
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-start">
        <div className="flex flex-col gap-3 tablet:flex-[1.3]">
          {/* The extension's folder, with the manifest first. */}
          <div className="flex flex-col gap-2 rounded-md border-2 border-dashed border-line bg-paper2 p-3">
            <Label>The extension&apos;s folder</Label>
            <span className="flex items-center gap-2">
              <NumberHex n={1} size={22} />
              <span className="font-mono text-[14px] font-bold text-fg">manifest.json</span>
            </span>
            <span className="pl-[30px] font-mono text-[14px] text-muted">popup.html · popup.js · …</span>
          </div>
          <Window>
            <div className="flex items-center gap-2 border-b border-line px-3 py-2" aria-hidden="true">
              <span className="h-6 flex-1 rounded-md bg-surface2" />
              <span className="relative">
                <NumberHex n={2} size={26} />
              </span>
            </div>
            <div className="relative px-3 pt-3 pb-4">
              {/* The popup, hanging from the icon. */}
              <div className="absolute top-1 right-3 z-10 w-[168px] rounded-md border-2 border-line bg-surface p-2.5 shadow-h4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-extrabold text-fg">Highlighter</span>
                  <NumberHex n={3} size={22} />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[13px] text-fg">
                  <span>On</span>
                  <span className="relative h-4 w-8 rounded-full bg-accent"><span className="absolute top-0.5 right-0.5 size-3 rounded-full bg-on-accent" /></span>
                </div>
                <span className="mt-1.5 block rounded-md border border-line px-2 py-0.5 font-mono text-[13px] text-fg">the</span>
              </div>
              {/* The page, with highlights. */}
              <div className="flex flex-col gap-2 pr-[180px] tablet:pr-[184px]">
                <Line w="60%" tone="accent" />
                <p className="m-0 text-[13px] leading-[1.6] text-fg">
                  <Mark>The</Mark> best part of <Mark>the</Mark> school day is <Mark>the</Mark> bit after lunch, when <Mark>the</Mark> canteen is quiet.
                </p>
                <span className="flex items-center gap-2">
                  <NumberHex n={4} size={22} />
                  <Label>every &ldquo;the&rdquo; is highlighted</Label>
                </span>
              </div>
            </div>
          </Window>
        </div>
        <ol className="m-0 flex list-none flex-col gap-2.5 p-0 tablet:flex-1">
          {PARTS.map((part) => (
            <li key={part.n} className="flex items-start gap-2.5 rounded-md bg-surface p-3 border-2 border-line">
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
  return <mark className="rounded-sm bg-marigold px-0.5 text-on-marigold">{children}</mark>;
}
