import type { ReactNode } from "react";
import { Diagram, diagramCard } from "@/components/diagram";
import { Hex } from "@/components/hex";

// "The three files" in lesson 5.6 (design: DiagramFiles board).
// From desktop up it is the board: a small web page in the middle and the
// three file cards around it, each joined by a dashed line to the part of the
// page it controls. Below desktop the lines can't keep their places, so the
// page sits on top and the cards follow (in a row on tablets, stacked on
// phones); a numbered hexagon on each card matches one on the page instead.
// The chip colours are the prompt-part tokens (--part-role and so on).

const ALT =
  "A small web page in a browser window, with the heading 'Join the club', the line 'Get news about our next session.' " +
  "and a 'Sign up' button with a mouse pointer clicking it. Three files each control one part of that page. " +
  "index.html is the words and the structure: every heading, button and paragraph people actually read. It points at the heading. " +
  "styles.css is the look: colours, fonts, spacing, and how it changes on a phone versus a laptop. It points at the button. " +
  "script.js is the behaviour: what happens when somebody clicks, types, or hits submit. It points at the pointer clicking the button. " +
  "One button, three files: change the words in index.html, the colour in styles.css and the click in script.js.";

type Part = "role" | "style" | "goal";

// The chip and hexagon colours for each file. Written out in full so
// Tailwind sees every class.
const PART: Record<Part, { chip: string; hex: string; number: string }> = {
  role: {
    chip: "bg-(--part-role) text-(--part-role-ink)",
    hex: "fill-(--part-role) stroke-(--part-role-ink) stroke-[1.5]",
    number: "text-(--part-role-ink)",
  },
  style: {
    chip: "bg-(--part-style) text-(--part-style-ink)",
    hex: "fill-(--part-style) stroke-(--part-style-ink) stroke-[1.5]",
    number: "text-(--part-style-ink)",
  },
  goal: {
    chip: "bg-(--part-goal) text-(--part-goal-ink)",
    hex: "fill-(--part-goal) stroke-(--part-goal-ink) stroke-[1.5]",
    number: "text-(--part-goal-ink)",
  },
};

export function ThreeFilesDiagram() {
  return (
    <Diagram
      alt={ALT}
      caption="One button, three files: change the words in index.html, the colour in styles.css and the click in script.js."
    >
      <div className="flex flex-col gap-4 desktop:relative desktop:mx-auto desktop:block desktop:h-[372px] desktop:w-[680px] desktop:max-w-full">
        <MockPage />
        <div className="grid gap-3 tablet:grid-cols-3 desktop:contents">
          <FileCard
            part="role"
            number={1}
            name="index.html"
            job="The words and the structure."
            className="desktop:top-[10px] desktop:left-0"
          >
            Every heading, button and paragraph people actually read.
          </FileCard>
          <FileCard
            part="style"
            number={2}
            name="styles.css"
            job="The look."
            className="desktop:top-[118px] desktop:right-0"
          >
            Colours, fonts, spacing, and how it changes on a phone versus a laptop.
          </FileCard>
          <FileCard
            part="goal"
            number={3}
            name="script.js"
            job="The behaviour."
            className="desktop:top-[222px] desktop:left-0"
          >
            What happens when somebody clicks, types, or hits submit.
          </FileCard>
        </div>
        <Connectors />
      </div>
    </Diagram>
  );
}

function FileCard({
  part,
  number,
  name,
  job,
  className,
  children,
}: {
  part: Part;
  number: number;
  name: string;
  job: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${diagramCard} flex min-w-0 flex-col gap-2 px-3.5 py-3 desktop:absolute desktop:w-[200px] ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="desktop:hidden">
          <Marker part={part} number={number} />
        </span>
        <span className={`rounded-lg px-2.5 py-[3px] font-mono text-[14px] leading-[1.4] font-semibold ${PART[part].chip}`}>
          {name}
        </span>
      </div>
      <p className="m-0 text-[15px] leading-[1.45] text-muted">
        <strong className="text-fg">{job}</strong> {children}
      </p>
    </div>
  );
}

/** The numbered hexagon that pairs a card with a part of the page below desktop. */
function Marker({ part, number }: { part: Part; number: number }) {
  return (
    <span className="relative flex h-[27px] w-[25px] flex-none items-center justify-center">
      <Hex width={25} height={27} shape={PART[part].hex} className="absolute inset-0" />
      <span className={`relative font-display text-[14px] leading-none font-extrabold ${PART[part].number}`}>
        {number}
      </span>
    </span>
  );
}

/** The page the three files make: a heading, a line of text and a button being clicked. */
function MockPage() {
  return (
    <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[14px] bg-surface shadow-[0_14px_34px_color-mix(in_srgb,var(--accent)_16%,transparent)] dark:shadow-none dark:ring-1 dark:ring-border desktop:absolute desktop:top-[76px] desktop:left-[240px] desktop:w-[200px]">
      <div className="flex h-[26px] items-center gap-[5px] border-b border-border bg-surface2 px-2.5">
        <span className="size-[7px] rounded-full bg-pip" />
        <span className="size-[7px] rounded-full bg-pip" />
        <span className="size-[7px] rounded-full bg-pip" />
      </div>
      <div className="flex flex-col gap-2.5 px-[18px] pt-5 pb-10 desktop:pb-9">
        <div className="flex items-center gap-2.5">
          <span className="font-display text-[22px] leading-none font-extrabold text-fg">Join the club</span>
          <span className="desktop:hidden">
            <Marker part="role" number={1} />
          </span>
        </div>
        <span className="text-[14px] leading-[1.4] text-muted">Get news about our next session.</span>
        <div className="relative mt-2.5 flex items-center gap-2">
          <span className="inline-flex h-[38px] items-center rounded-[10px] bg-accent px-5 text-[15px] font-bold text-on-accent">
            Sign up
          </span>
          <span className="desktop:hidden">
            <Marker part="style" number={2} />
          </span>
          {/* The pointer, clicking the button. */}
          <svg
            width="26"
            height="30"
            viewBox="0 0 26 30"
            aria-hidden="true"
            className="absolute top-[24px] left-[66px] fill-surface stroke-fg stroke-2"
          >
            <path d="M4 3 L4 23 L9.5 18 L13.5 27 L17 25.5 L13 16.5 L20 16.5 Z" strokeLinejoin="round" />
          </svg>
          <span className="absolute top-[38px] left-[96px] desktop:hidden">
            <Marker part="goal" number={3} />
          </span>
        </div>
      </div>
    </div>
  );
}

/** Desktop only: the dashed lines from each card to the part of the page it controls. */
function Connectors() {
  const line = "fill-none stroke-accent stroke-2 [stroke-dasharray:5_5]";
  return (
    <svg
      viewBox="0 0 680 372"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden h-full w-full desktop:block"
    >
      {/* index.html to the heading */}
      <path d="M200 34 C 234 34, 230 132, 249 132" className={line} />
      <circle cx="249" cy="132" r="5" className="fill-accent" />
      {/* styles.css to the button */}
      <path d="M480 142 C 430 142, 410 220, 364 220" className={line} />
      <circle cx="364" cy="220" r="5" className="fill-accent" />
      {/* script.js to the pointer */}
      <path d="M200 246 C 262 246, 306 276, 333 268" className={line} />
      <circle cx="333" cy="268" r="5" className="fill-accent" />
    </svg>
  );
}
