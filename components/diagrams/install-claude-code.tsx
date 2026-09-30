"use client";

// A client component because diagramCard and diagramLabel come from a
// "use client" module: a server component would get references, not strings.

import type { ReactNode } from "react";
import { Diagram, diagramCard, diagramLabel } from "@/components/diagram";

// Lesson 3.3, "Task: install Claude Code": three simplified drawings that
// stand in for screenshots of the official download page, the desktop app's
// Code tab and a terminal after `claude --version`. They're drawings, not
// screenshots, so they never show an account, and they follow dark mode.
// Every word is HTML, so the drawings reflow on phones instead of shrinking.

/** The version string `claude --version` printed when this was drawn (28 Sep 2026). */
const VERSION = "2.1.283 (Claude Code)";

const NOTE = "Simplified drawing, not a screenshot. The real page may look a little different.";

/** A browser or app window frame with three dots and an optional address. */
function Window({ address, children }: { address?: string; children: ReactNode }) {
  return (
    <div className={`${diagramCard} mx-auto max-w-[520px] overflow-hidden`}>
      <div className="flex h-8 items-center gap-2 border-b border-border bg-surface2 px-3" aria-hidden="true">
        <span className="size-[8px] rounded-full bg-pip" />
        <span className="size-[8px] rounded-full bg-pip" />
        <span className="size-[8px] rounded-full bg-pip" />
        {address && (
          <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-bg px-2 font-mono text-[13px] leading-[1.6] text-muted">
            {address}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/** A drawn button. */
function Button({ primary = false, children }: { primary?: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-[15px] font-bold ${
        primary ? "bg-accent text-on-accent" : "border border-accent text-accent"
      }`}
    >
      {children}
    </span>
  );
}

export function InstallDownloadDrawing() {
  return (
    <Diagram
      alt={
        "Simplified drawing of the official desktop app instructions page in a browser. " +
        "Under the heading 'Claude Code desktop app' are two buttons, 'Download for macOS' and 'Download for Windows', " +
        "and a line saying Linux users follow the Linux steps. The real page may look a little different."
      }
      caption={`The download buttons on the official desktop app instructions page. ${NOTE}`}
    >
      <Window address="code.claude.com/docs/en/desktop-quickstart">
        <div className="flex flex-col gap-3 p-4 tablet:p-5">
          <span className={`${diagramLabel} text-muted`}>Docs · Desktop quickstart</span>
          <span className="font-display text-[21px] leading-[1.2] font-extrabold text-fg">Claude Code desktop app</span>
          <div className="flex flex-col gap-1.5" aria-hidden="true">
            <span className="h-2 w-full rounded-full bg-track" />
            <span className="h-2 w-4/5 rounded-full bg-track" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button primary>Download for macOS</Button>
            <Button primary>Download for Windows</Button>
          </div>
          <span className="text-[14px] leading-[1.4] text-muted">On Linux, follow the Linux steps linked from the page.</span>
        </div>
      </Window>
    </Diagram>
  );
}

export function InstallCodeTabDrawing() {
  return (
    <Diagram
      alt={
        "Simplified drawing of the Claude desktop app. At the top centre are three tabs, and the middle one, Code, is selected. " +
        "Below it a switch shows Local selected, then a Select folder button and a chosen folder called my-extension. " +
        "The real app may look a little different."
      }
      caption={`The Code tab in the Claude desktop app, with Local selected and a project folder chosen. ${NOTE}`}
    >
      <Window>
        <div className="flex flex-col gap-4 p-4 tablet:p-5">
          <div className="flex justify-center gap-1.5" aria-hidden="true">
            <span className="h-8 w-14 rounded-full bg-surface2" />
            <span className="inline-flex h-8 items-center rounded-full bg-accent px-4 text-[15px] font-bold text-on-accent">
              Code
            </span>
            <span className="h-8 w-14 rounded-full bg-surface2" />
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-border p-3.5">
            <div className="flex items-center gap-2.5">
              <span className={`${diagramLabel} text-muted`}>Where</span>
              <span className="inline-flex rounded-full bg-surface2 p-0.5">
                <span className="rounded-full bg-accent px-3 py-0.5 text-[14px] font-bold text-on-accent">Local</span>
                <span className="w-12 rounded-full" aria-hidden="true" />
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button>Select folder</Button>
              <span className="inline-flex items-center gap-1.5 font-mono text-[14px] text-fg">
                <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true" className="fill-deco">
                  <path d="M1 3a2 2 0 0 1 2-2h3l2 2h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" />
                </svg>
                my-extension
              </span>
            </div>
          </div>
          <span className="text-[14px] leading-[1.4] text-muted">Local means Claude works on the files on your computer.</span>
        </div>
      </Window>
    </Diagram>
  );
}

export function InstallTerminalDrawing() {
  return (
    <Diagram
      alt={
        `Simplified drawing of a terminal window. The first line is the command claude --version. ` +
        `The line under it is the answer, ${VERSION}: a version number, which means the install worked. ` +
        "Your version number will be different."
      }
      caption={`A terminal after running claude --version. A version number means it worked; yours will be newer. ${NOTE}`}
    >
      <div className="mx-auto max-w-[520px] overflow-hidden rounded-xl border border-term-border bg-term-bg">
        <div className="flex items-center gap-2 border-b border-term-rule px-3 py-2" aria-hidden="true">
          <span className="size-[8px] rounded-full bg-term-rule" />
          <span className="size-[8px] rounded-full bg-term-rule" />
          <span className="size-[8px] rounded-full bg-term-rule" />
          <span className="ml-1 text-[13px] font-bold tracking-[.03em] text-term-muted">Terminal</span>
        </div>
        <div className="flex flex-col gap-1 p-4 font-mono text-[15px] leading-[1.6] text-term-text tablet:text-[16px]">
          <span>
            <span className="text-term-muted select-none">$ </span>claude --version
          </span>
          <span>{VERSION}</span>
          <span>
            <span className="text-term-muted select-none">$ </span>
            <span aria-hidden="true" className="inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-term-text" />
          </span>
        </div>
      </div>
    </Diagram>
  );
}
