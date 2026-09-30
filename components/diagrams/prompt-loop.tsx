"use client";

import { Diagram } from "@/components/diagram";
import { Card, Flow, Icon, Line, Note } from "@/components/diagrams/parts";

// Lesson 2.1: what the module does with the site you pick. First prompt,
// first draft, refine the prompt with Claude, better site. The four steps
// match the lesson's "What happens next" list.

const ALT =
  "Four steps joined by arrows. 1, First prompt: you write a detailed prompt and paste it into Lovable. " +
  "2, First draft: Lovable builds a site, drawn as a plain page with grey lines. " +
  "3, Refine: Claude helps you make the prompt better, drawn as a sparkle. " +
  "4, Better site: Lovable builds it again from the refined prompt, drawn as a page with a heading, a button and coloured sections.";

export function PromptLoopDiagram() {
  return (
    <Diagram alt={ALT} caption="Prompt, build, refine the prompt, build again. The second site is better because the prompt is.">
      <Flow>
        <Card n={1} title="First prompt" className="tablet:flex-1">
          <div className="flex items-center gap-2.5">
            <Icon name="chat" />
            <Note className="text-muted">A detailed prompt, into Lovable.</Note>
          </div>
        </Card>
        <Card n={2} title="First draft" className="tablet:flex-1">
          <MiniPage better={false} />
        </Card>
        <Card n={3} title="Refine" className="tablet:flex-1">
          <div className="flex items-center gap-2.5">
            <Icon name="sparkle" />
            <Note className="text-muted">Claude sharpens your prompt.</Note>
          </div>
        </Card>
        <Card n={4} title="Better site" className="tablet:flex-1">
          <MiniPage better />
        </Card>
      </Flow>
    </Diagram>
  );
}

function MiniPage({ better }: { better: boolean }) {
  return (
    <div className="flex flex-col gap-1.5 rounded border border-line bg-bg p-2" aria-hidden="true">
      {better ? (
        <>
          <div className="flex items-center justify-between">
            <Line w="34%" tone="accent" />
            <span className="h-2 w-[30%] rounded-full bg-deco" />
          </div>
          <Line w="70%" />
          <div className="mt-1 grid grid-cols-3 gap-1">
            <span className="h-6 rounded bg-marigold" />
            <span className="h-6 rounded bg-sky" />
            <span className="h-6 rounded bg-tomato-tint" />
          </div>
        </>
      ) : (
        <>
          <Line w="50%" />
          <Line w="90%" />
          <Line w="80%" />
          <Line w="60%" />
        </>
      )}
    </div>
  );
}
