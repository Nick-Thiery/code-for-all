"use client";

import { Diagram } from "@/components/diagram";
import { Card, Icon, Label, Note } from "@/components/diagrams/parts";

// Lesson 1.5: the three slide points as do and don't cards. Each pair is one
// point: input bias, representative, the amplification loop.

const PAIRS = [
  {
    point: "Input bias",
    do: "Check your prompt for your own assumptions before you send it.",
    dont: "Write a prompt that assumes things about people, like who they are or what they like.",
  },
  {
    point: "Representative",
    do: "Make a tool that works for a wide range of people and views.",
    dont: "Build a tool that speaks for only one kind of person.",
  },
  {
    point: "The amplification loop",
    do: "Notice when a tool's answers keep leaning one way, and question them.",
    dont: "Keep using a biased tool without thinking, until its bias becomes yours.",
  },
];

const ALT =
  "Do and don't cards for the three ethical points. " +
  PAIRS.map((pair) => `${pair.point}. Do: ${pair.do} Don't: ${pair.dont}`).join(" ");

export function EthicsCardsDiagram() {
  return (
    <Diagram alt={ALT} caption="The three points as do and don't cards.">
      <div className="flex flex-col gap-3">
        {PAIRS.map((pair) => (
          <div key={pair.point} className="flex flex-col gap-2">
            <Label className="text-accent">{pair.point}</Label>
            <div className="grid gap-2.5 tablet:grid-cols-2">
              <Card tone="tint" icon={<Icon name="check" className="stroke-accent" />} title="Do">
                <Note>{pair.do}</Note>
              </Card>
              <Card tone="dashed" icon={<Icon name="cross" className="stroke-muted" />} title="Don't">
                <Note>{pair.dont}</Note>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </Diagram>
  );
}
