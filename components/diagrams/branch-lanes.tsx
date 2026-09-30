"use client";

import type { CSSProperties, ReactNode } from "react";
import { Diagram, diagramLabel } from "@/components/diagram";

// "7.1 · Branches as lanes" (design board: DiagramBranches), in lesson 7.1
// under "How branching works". Main runs along the middle; alex-keyboard (your
// branch) splits off, gets two commits and merges back through a pull request;
// sam-board (a teammate's) is still going. The numbers match the lesson's
// numbered list underneath.
//
// From tablet up the lanes run left to right. The lines are one SVG stretched
// to the width (non-scaling strokes); dots and words are HTML placed by
// percentage, so text never shrinks. On phones the lanes run top to bottom: a
// fixed-size SVG track on the left, one fixed-height row of words per event.
//
// "use client" only because diagramLabel comes from components/diagram.tsx, a
// client module: imported into a server component, the string would arrive as
// a client reference instead of its value.

const ALT =
  "Diagram of branches as lanes. A line called main runs across the middle, with commits as dots along it. " +
  "Step 1, branch off: two branches split away from main at the same commit. alex-keyboard, your branch, goes one way and sam-board, a teammate's branch, goes the other. " +
  "Step 2: you make two commits on alex-keyboard, and meanwhile main keeps moving with a commit of its own. " +
  "Step 3: a pull request merges alex-keyboard back into main. Main carries on to its next commit, labelled Vercel: live. " +
  "sam-board has two commits of its own and is still working, so it hasn't joined main yet.";

const CAPTION = "Every branch is its own lane, and main never sees your work until your pull request is merged.";

export function BranchLanesDiagram() {
  return (
    <Diagram alt={ALT} caption={CAPTION}>
      <WideLanes />
      <TallLanes />
    </Diagram>
  );
}

/* ---- Shared bits ---- */

/** "1 · Branch off": the number in the accent colour, matching the lesson's list. */
function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <span className={`${diagramLabel} block text-fg`}>
      <span className="text-accent">{n} ·</span> {children}
    </span>
  );
}

function BranchName({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[15px] leading-tight font-semibold text-accent">{children}</span>;
}

function MainName() {
  return (
    <span className="font-serif text-[19px] leading-tight font-semibold text-accent dark:text-fg">main</span>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[30px] items-center gap-1.5 rounded-full bg-surface px-3 text-[15px] leading-none font-bold whitespace-nowrap text-fg">
      {children}
    </span>
  );
}

function VercelLive() {
  return (
    <Pill>
      <svg
        width="16"
        height="16"
        viewBox="-8 -8 16 16"
        aria-hidden="true"
        className="flex-none fill-none stroke-accent stroke-[1.8]"
      >
        <circle r="7" />
        <path d="M-7 0h14M0 -7c2.8 2.4 2.8 11.6 0 14M0 -7c-2.8 2.4 -2.8 11.6 0 14" strokeLinecap="round" />
      </svg>
      Vercel: live
    </Pill>
  );
}

// Line and dot colours: main is the accent in light and the text colour in
// dark (where the accent and --deco are the same blue); branches are --deco.
const MAIN_STROKE = "stroke-accent dark:stroke-fg";
const MAIN_FILL = "fill-accent dark:fill-fg";
const MAIN_BG = "bg-accent dark:bg-fg";

/* ---- Tablet and up: lanes left to right ---- */

// Heights are pixels; x positions are tenths of a percent of the width.
const H = 300;
const Y = { alex: 62, main: 160, sam: 258 };
const X = { branch: 240, merge: 760 };

function at(x: number, y: number): CSSProperties {
  return { left: `${x / 10}%`, top: y };
}

function WideDot({ x, y, kind }: { x: number; y: number; kind: "main" | "branch" | "merge" }) {
  const look = {
    main: `size-5 ${MAIN_BG} ring-3 ring-surface`,
    branch: "size-[18px] bg-deco ring-3 ring-surface",
    merge: `size-6 ${MAIN_BG} ring-4 ring-deco`,
  }[kind];
  return <span className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${look}`} style={at(x, y)} />;
}

function WideLanes() {
  const { alex, main, sam } = Y;
  const { branch, merge } = X;
  return (
    <div aria-hidden="true" className="relative hidden tablet:block" style={{ height: H }}>
      {/* The three lanes, bleeding to the panel's edges. */}
      {(["alex", "main", "sam"] as const).map((lane) => (
        <span
          key={lane}
          className={`absolute -right-5 -left-5 h-14 -translate-y-1/2 ${lane === "main" ? "bg-accent/10" : "bg-accent/[.05]"}`}
          style={{ top: Y[lane] }}
        />
      ))}

      <svg
        viewBox={`0 0 1000 ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible fill-none"
      >
        <path
          d={`M${branch} ${main} C${branch + 60} ${main} ${branch + 60} ${sam} ${branch + 120} ${sam} L640 ${sam}`}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          className="stroke-deco stroke-5"
        />
        <path
          d={`M${branch} ${main} C${branch + 60} ${main} ${branch + 60} ${alex} ${branch + 120} ${alex} L${merge - 120} ${alex} C${merge - 60} ${alex} ${merge - 60} ${main} ${merge} ${main}`}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          className="stroke-deco stroke-5"
        />
        <path
          d={`M10 ${main} L990 ${main}`}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          className={`${MAIN_STROKE} stroke-7`}
        />
      </svg>
      {/* sam-board carries on, unfinished: a dotted end. */}
      <span
        className="absolute h-[5px] -translate-y-1/2 bg-[radial-gradient(circle,var(--deco)_2.5px,transparent_3px)] bg-size-[12px_5px] bg-left bg-repeat-x"
        style={{ left: "65.2%", width: "4.8%", top: sam }}
      />

      <WideDot x={80} y={main} kind="main" />
      <WideDot x={branch} y={main} kind="main" />
      <WideDot x={500} y={main} kind="main" />
      <WideDot x={merge} y={main} kind="merge" />
      <WideDot x={920} y={main} kind="main" />
      <WideDot x={440} y={alex} kind="branch" />
      <WideDot x={560} y={alex} kind="branch" />
      <WideDot x={430} y={sam} kind="branch" />
      <WideDot x={560} y={sam} kind="branch" />

      {/* Lane names */}
      <span className="absolute left-0 -translate-y-1/2" style={{ top: alex }}>
        <BranchName>alex-keyboard</BranchName>
      </span>
      <span className="absolute left-0" style={{ top: main + 16 }}>
        <MainName />
      </span>
      <span className="absolute left-0 -translate-y-1/2" style={{ top: sam }}>
        <BranchName>sam-board</BranchName>
      </span>

      {/* Steps */}
      <span
        className="absolute left-0 text-right"
        style={{ right: `calc(${100 - branch / 10}% + 14px)`, bottom: H - main + 16 }}
      >
        <Step n={1}>Branch off</Step>
      </span>
      <span className="absolute -translate-x-1/2 whitespace-nowrap" style={at(500, alex + 18)}>
        <Step n={2}>Your commits</Step>
      </span>
      <span
        className="absolute -translate-x-1/2 whitespace-nowrap"
        style={{ left: "50%", bottom: H - main + 16 }}
      >
        <Step n={2}>Main keeps moving</Step>
      </span>
      <span className="absolute w-[190px] -translate-x-1/2 text-center" style={at(merge, main + 18)}>
        <Step n={3}>Pull request merges it back</Step>
      </span>

      {/* Notes */}
      <span className="absolute right-0 -translate-y-1/2" style={{ top: 98 }}>
        <VercelLive />
      </span>
      <span className="absolute right-0 -translate-y-1/2" style={{ top: sam }}>
        <Pill>Still working…</Pill>
      </span>
    </div>
  );
}

/* ---- Phones: lanes top to bottom ---- */

// Lane x positions in the track, and its width.
const TX = { sam: 20, main: 56, alex: 92 };
const TRACK = 108;

type Row = {
  h: number;
  /** Which lane has a dot on this row, if any. */
  dot?: "main" | "alex" | "sam" | "merge";
  label?: ReactNode;
  /** A faint leader from sam-board's lane to the label, across the other two. */
  lead?: boolean;
};

const ROWS: Row[] = [
  { h: 44, dot: "main", label: <MainName /> },
  { h: 48, dot: "main", label: <Step n={1}>Branch off</Step> },
  { h: 40 }, // the two branches curve away
  { h: 44, dot: "alex", label: <BranchName>alex-keyboard</BranchName> },
  { h: 48, dot: "alex", label: <Step n={2}>Your commits</Step> },
  { h: 44, dot: "sam", label: <BranchName>sam-board</BranchName>, lead: true },
  { h: 56, dot: "main", label: <Step n={2}>Main keeps moving</Step> },
  { h: 36, dot: "sam" },
  { h: 40 }, // alex-keyboard curves back
  { h: 56, dot: "merge", label: <Step n={3}>Pull request merges it back</Step> },
  { h: 44, label: <Pill>Still working…</Pill>, lead: true },
  { h: 52, dot: "main", label: <VercelLive /> },
];

function TallLanes() {
  // Centre of each row, top to bottom.
  const cy: number[] = [];
  let top = 0;
  for (const row of ROWS) {
    cy.push(top + row.h / 2);
    top += row.h;
  }
  const total = top;
  const { sam, main, alex } = TX;
  const split = cy[1];
  const splitEnd = split + ROWS[1].h / 2 + ROWS[2].h; // top of the alex-keyboard row
  const rejoinStart = cy[8] - ROWS[8].h / 2; // top of the curve-back row
  const merge = cy[9];
  const samEnd = cy[10];
  const lastSamDot = cy[7];

  return (
    <div aria-hidden="true" className="relative tablet:hidden">
      <svg
        width={TRACK}
        height={total}
        viewBox={`0 0 ${TRACK} ${total}`}
        className="absolute top-0 left-0 fill-none"
      >
        {ROWS.map((row, i) =>
          row.lead ? (
            <path
              key={i}
              d={`M${sam + 12} ${cy[i]} H${TRACK + 4}`}
              strokeDasharray="2 4"
              className="stroke-pip stroke-[1.5]"
            />
          ) : null,
        )}
        <path
          d={`M${main} ${split} C${main} ${split + 36} ${sam} ${splitEnd - 28} ${sam} ${splitEnd} L${sam} ${lastSamDot}`}
          strokeLinecap="round"
          className="stroke-deco stroke-5"
        />
        <path
          d={`M${sam} ${lastSamDot + 12} L${sam} ${samEnd}`}
          strokeLinecap="round"
          strokeDasharray="0.1 11"
          className="stroke-deco stroke-5"
        />
        <path
          d={`M${main} ${split} C${main} ${split + 36} ${alex} ${splitEnd - 28} ${alex} ${splitEnd} L${alex} ${rejoinStart} C${alex} ${rejoinStart + 28} ${main} ${merge - 36} ${main} ${merge}`}
          strokeLinecap="round"
          className="stroke-deco stroke-5"
        />
        <path d={`M${main} 6 L${main} ${total - 6}`} strokeLinecap="round" className={`${MAIN_STROKE} stroke-7`} />
        {ROWS.map((row, i) => {
          if (!row.dot) return null;
          const x = row.dot === "merge" ? main : TX[row.dot];
          if (row.dot === "merge")
            return <circle key={i} cx={x} cy={cy[i]} r="11" className={`${MAIN_FILL} stroke-deco stroke-4`} />;
          if (row.dot === "main")
            return <circle key={i} cx={x} cy={cy[i]} r="10" className={`${MAIN_FILL} stroke-surface stroke-3`} />;
          return <circle key={i} cx={x} cy={cy[i]} r="9" className="fill-deco stroke-surface stroke-3" />;
        })}
      </svg>

      <div className="flex flex-col" style={{ marginLeft: TRACK + 10 }}>
        {ROWS.map((row, i) => (
          <div key={i} className="flex items-center" style={{ height: row.h }}>
            {row.label}
          </div>
        ))}
      </div>
    </div>
  );
}
