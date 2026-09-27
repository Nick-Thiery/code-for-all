"use client";

// A client component because diagramCard and diagramLabel come from a
// "use client" module: a server component would get references, not strings.

import type { ReactNode } from "react";
import { Diagram, diagramCard, diagramLabel, FlowArrow } from "@/components/diagram";

// Lesson 8.2, "Think of it like a door" (design: "Diagram: an API is a door").
// Your site knocks on the API with a request and gets data back; the weather
// service behind the door stays out of sight.
//
// Desktop: site, the two messages, the door and the service in a row.
// Phones and tablets: a column. The site sits on top, the two messages run
// down (request) and up (answer) beside their arrows, and the door with the
// service behind it sits at the bottom, under the arrows.

/** The answer as open-meteo's `current` block writes it, pretty-printed. */
const ANSWER = '{\n  "temperature_2m": 31.2\n}';

const ALT = [
  "Diagram: an API is like a door.",
  'Your site shows "Singapore right now" and the temperature 31.2°C.',
  'Step 1, you knock: your site sends the API a request, "What\'s the temperature in Singapore?".',
  `Step 2, it answers: the API sends data back to your site, ${ANSWER.replace(/\s+/g, " ")}.`,
  'The API is drawn as a door. Behind it, joined by a dashed line, is the weather service, with the note "You never see the inside, and you don\'t have to."',
].join(" ");

export function ApiDoorDiagram() {
  return (
    <Diagram alt={ALT} caption="An API is like a door: your site knocks with a request, and data comes back.">
      <div className="mx-auto grid max-w-[440px] grid-cols-[64px_16px_minmax(0,1fr)] gap-y-2.5 desktop:max-w-none desktop:grid-cols-[140px_minmax(0,1fr)_84px_28px_140px] desktop:gap-y-2">
        {/* Your site */}
        <div
          className={`${diagramCard} col-span-3 overflow-hidden desktop:col-span-1 desktop:col-start-1 desktop:row-span-4 desktop:row-start-1 desktop:self-center`}
        >
          <div className="flex h-6 items-center gap-[5px] border-b border-border bg-surface2 px-2.5" aria-hidden="true">
            <span className="size-[7px] rounded-full bg-pip" />
            <span className="size-[7px] rounded-full bg-pip" />
            <span className="size-[7px] rounded-full bg-pip" />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1.5 p-3.5 desktop:flex-col desktop:items-start">
            <div className="flex flex-col gap-1">
              <span className={`${diagramLabel} text-muted`}>Your site</span>
              <span className="text-[15px] leading-[1.35] text-fg">Singapore right now</span>
            </div>
            <span className="font-display text-[34px] leading-none font-extrabold text-accent">31.2°C</span>
          </div>
        </div>

        {/* 1 · You knock */}
        <Message label="1 · You knock" className="col-span-2 col-start-2 row-start-2 desktop:col-span-1 desktop:col-start-2 desktop:row-start-1">
          <span className="text-[15px] leading-[1.4] text-fg">“What’s the temperature in Singapore?”</span>
        </Message>
        <Arrow className="col-start-1 row-start-2 desktop:col-start-2 desktop:row-start-2" />

        {/* 2 · It answers */}
        <Arrow back className="col-start-1 row-start-3 desktop:col-start-2 desktop:row-start-3" />
        <Message label="2 · It answers" className="col-span-2 col-start-2 row-start-3 desktop:col-span-1 desktop:col-start-2 desktop:row-start-4">
          <code className="font-mono text-[14px] leading-[1.45] whitespace-pre text-fg">{ANSWER}</code>
        </Message>

        {/* The door */}
        <div className="col-start-1 row-start-4 flex min-h-[132px] flex-col items-center rounded-t-full rounded-b-lg bg-accent pt-6 desktop:col-start-3 desktop:row-span-4 desktop:row-start-1 desktop:h-[228px] desktop:self-center desktop:pt-9">
          <span className="font-display text-[20px] leading-none font-extrabold text-on-accent desktop:text-[24px]">API</span>
          <span
            aria-hidden="true"
            className="mt-auto mr-3 mb-[42%] size-3 self-end rounded-full bg-deco dark:bg-on-accent desktop:size-3.5 desktop:mr-4"
          />
        </div>

        {/* The dashed line from the door to what's behind it */}
        <svg
          aria-hidden="true"
          viewBox="0 0 28 4"
          preserveAspectRatio="none"
          className="col-start-2 row-start-4 h-1 w-full self-center stroke-pip desktop:col-start-4 desktop:row-span-4 desktop:row-start-1"
        >
          <path d="M0 2h28" strokeWidth="3" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* What's behind the door */}
        <div className="col-start-3 row-start-4 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pip p-3.5 text-center desktop:col-start-5 desktop:row-span-4 desktop:row-start-1 desktop:self-center desktop:py-6">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="fill-none stroke-muted stroke-[1.8]"
          >
            <path
              d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display text-[17px] leading-[1.2] font-extrabold text-fg">Weather service</span>
          <span className="text-[14px] leading-[1.4] text-muted">You never see the inside, and you don’t have to.</span>
        </div>
      </div>
    </Diagram>
  );
}

function Message({ label, className, children }: { label: string; className: string; children: ReactNode }) {
  return (
    <div className={`${diagramCard} flex min-w-0 flex-col gap-1 rounded-xl px-3 py-2.5 desktop:mx-3 ${className}`}>
      <span className={`${diagramLabel} text-accent`}>{label}</span>
      {children}
    </div>
  );
}

/**
 * FlowArrow points down on phones and right from tablet up. Here the request
 * runs down until the row layout at desktop, and the answer runs the other
 * way (up, then left), so the wrapper turns it.
 */
function Arrow({ back = false, className }: { back?: boolean; className: string }) {
  return (
    <div className={`flex items-center justify-center self-center ${className}`}>
      <div
        className={`flex size-[34px] items-center justify-center ${
          back ? "rotate-180 tablet:rotate-270 desktop:rotate-180" : "tablet:rotate-90 desktop:rotate-0"
        }`}
      >
        <FlowArrow />
      </div>
    </div>
  );
}
