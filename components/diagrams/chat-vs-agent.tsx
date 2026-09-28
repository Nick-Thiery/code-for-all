"use client";

import { Diagram } from "@/components/diagram";
import { Card, Icon, Label, Note } from "@/components/diagrams/parts";

// Lesson 3.1: a chat answers questions; Claude Code does the work in your
// files. The same request, two very different results.

const ASK = "Add a Sign up button to my page.";

const ALT =
  `Two cards with the same request, "${ASK}". ` +
  "Left, Chat: it answers with instructions and a block of code, and you copy the code into your files yourself. " +
  "Right, Claude Code: it opens index.html and adds the button, opens styles.css and styles it, runs the page, and fixes an error it finds. " +
  "You watch, then check the result.";

export function ChatVsAgentDiagram() {
  return (
    <Diagram alt={ALT} caption="A chat tells you what to change. Claude Code makes the change, in your files.">
      <div className="grid gap-3 tablet:grid-cols-2">
        <Card icon={<Icon name="chat" />} title="Chat">
          <Bubble>{ASK}</Bubble>
          <div className="flex flex-col gap-1.5 rounded-lg bg-surface2 p-2.5">
            <Note className="text-[14px]">Here&apos;s how. Add this to your HTML:</Note>
            <code className="block rounded bg-bg px-2 py-1 font-mono text-[13px] leading-[1.5] text-fg">{"<button>Sign up</button>"}</code>
          </div>
          <Note className="text-muted">Then <strong>you</strong> open the files and paste it in.</Note>
        </Card>
        <Card tone="tint" icon={<Icon name="hammer" />} title="Claude Code">
          <Bubble>{ASK}</Bubble>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {[
              ["index.html", "adds the button"],
              ["styles.css", "styles it"],
              ["runs the page", "finds an error"],
              ["script.js", "fixes it"],
            ].map(([file, what]) => (
              <li key={file} className="flex items-center gap-2 text-[14px] leading-[1.4]">
                <Icon name="check" size={16} className="stroke-accent" />
                <code className="font-mono text-[13px] font-semibold text-fg">{file}</code>
                <span className="text-muted">{what}</span>
              </li>
            ))}
          </ul>
          <Note className="text-muted">
            <strong>It</strong> does the work. You watch, then check.
          </Note>
        </Card>
      </div>
    </Diagram>
  );
}

function Bubble({ children }: { children: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <Label>You type</Label>
      <span className="self-start rounded-2xl rounded-tl-sm bg-accent px-3 py-1.5 text-[14px] leading-[1.4] text-on-accent">{children}</span>
    </div>
  );
}
