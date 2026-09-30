"use client";

import { Diagram, FlowArrow } from "@/components/diagram";
import { Card, Icon, Label, Note } from "@/components/diagrams/parts";

// Lesson 6.3: two lanes. A push goes straight into the repo; a pull request
// stops for a review first, then merges.

const ALT =
  "Two lanes. Push: your commits go straight into the repo, with no review; use it when you work solo or on your own branch. " +
  "Pull request: your commits go to a review first, where a teammate looks at the changes and comments or approves, and only then are they merged into the repo; use it on a team or someone else's project.";

export function PushVsPrDiagram() {
  return (
    <Diagram alt={ALT} caption="A push goes straight in. A pull request stops for a look first.">
      <div className="flex flex-col gap-3">
        <Lane name="Push" when="Solo, or on your own branch">
          <Card title="Your commits" className="tablet:flex-1">
            <Note className="text-muted">Saved on your computer.</Note>
          </Card>
          <FlowArrow />
          <Card tone="tint" title="The repo" className="tablet:flex-1">
            <Note className="text-muted">Straight in. No waiting, no approval.</Note>
          </Card>
        </Lane>
        <Lane name="Pull request" when="On a team, or someone else's project">
          <Card title="Your commits" className="tablet:flex-1">
            <Note className="text-muted">On your own branch.</Note>
          </Card>
          <FlowArrow />
          <Card tone="dashed" icon={<Icon name="eye" />} title="Review" className="tablet:flex-1">
            <Note className="text-muted">A teammate looks, comments, approves.</Note>
          </Card>
          <FlowArrow />
          <Card tone="tint" title="The repo" className="tablet:flex-1">
            <Note className="text-muted">Merged in, once it looks good.</Note>
          </Card>
        </Lane>
      </div>
    </Diagram>
  );
}

function Lane({ name, when, children }: { name: string; when: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border-2 border-line bg-paper p-3">
      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <span className="font-serif text-[19px] leading-[1.2] font-semibold text-fg">{name}</span>
        <Label>{when}</Label>
      </span>
      <div className="flex flex-col gap-2.5 tablet:flex-row tablet:items-stretch">{children}</div>
    </div>
  );
}
