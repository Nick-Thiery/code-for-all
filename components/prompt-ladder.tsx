"use client";

import { type CSSProperties, type ReactNode, useId, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { Reveal } from "@/components/reveal";

// The prompt ladder in lesson 1.4. In MDX:
//
//   <PromptLadder>
//   <LadderPrompt level="Bad" prompt="…" leavesOut={["Role", …]}>Why it's weak.</LadderPrompt>
//   <LadderPrompt level="Better" …>…</LadderPrompt>
//   </PromptLadder>
//
//   <StrongPrompt parts={[{ name: "Role", text: "Role: …", does: "tells the AI …" }, …]} />
//
// The strong prompt is its parts' text joined by line breaks, exactly as
// written; Copy copies that. Each part is highlighted in one of the three
// part colours (the --part-* tokens in app/globals.css), taken in turn so
// neighbours never match. Pointing at a part's label, or tabbing to it,
// dims the other parts; pressing it shows what the part does.

/** The seven parts, in order. */
const PARTS = ["Role", "Goal", "Target audience", "Core pages", "Design style", "Output required", "Key features"];
const TOTAL = PARTS.length;
const COLOURS = ["part-scope", "part-spec", "part-ctx"];

/** "Design style (\"modern\" is vague)" -> the colour class of Design style. */
function colourFor(label: string) {
  const index = PARTS.findIndex((part) => label === part || label.startsWith(`${part} `));
  return COLOURS[(index === -1 ? TOTAL - 1 : index) % COLOURS.length];
}

/** The weaker rungs, side by side from tablet up. */
export function PromptLadder({ children }: { children: ReactNode }) {
  return <div className="blk grid gap-5 tablet:grid-cols-2 desktop:gap-6">{children}</div>;
}

export function LadderPrompt({
  level,
  prompt,
  leavesOut,
  leavesOutLabel = "It leaves out",
  children,
}: {
  level: string;
  prompt: string;
  /** Parts it's missing, by name. Extra words after the name are fine: 'Design style ("modern" is vague)'. */
  leavesOut: string[];
  leavesOutLabel?: string;
  children?: ReactNode;
}) {
  const better = level.toLowerCase() === "better";
  return (
    <section className="card flex min-w-0 flex-col gap-3.5 p-[18px] break-inside-avoid shadow-h5 desktop:p-[22px] desktop:shadow-h6">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h2 className={`stamp m-0 text-[14px] ${better ? "bg-sky text-ink" : "bg-paper text-ink"}`}>{level}</h2>
        <StrengthMeter count={TOTAL - leavesOut.length} />
      </div>
      <p className="m-0 border-l-2 border-tomato pl-3.5 font-serif text-[21px] leading-[1.35] [overflow-wrap:anywhere] desktop:text-[23px]">
        <span className="sr-only">Prompt: </span>
        {prompt}
      </p>
      {children && <div className="text-[17px] leading-[1.55] [&>p]:m-0">{children}</div>}
      <p className="kicker m-0 text-[13px] desktop:text-[13px]">{leavesOutLabel}</p>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {leavesOut.map((label) => (
          <li key={label} className="m-0 p-0 pl-0 before:hidden">
            <span className={`part-label inline-flex px-2.5 py-1 ${colourFor(label)}`}>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

type Part = { name: string; text: string; does: string };

export function StrongPrompt({ parts, level = "Strong" }: { parts: Part[]; level?: string }) {
  const [selected, setSelected] = useState(0);
  const uid = useId();
  const current = parts[selected] ?? parts[0];
  const text = parts.map((part) => part.text).join("\n");

  return (
    <Reveal className="blk">
      <section className="parts card flex min-w-0 flex-col gap-4 p-(--pad) break-inside-avoid">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="stamp m-0 text-[14px]">{level}</h2>
            <StrengthMeter count={parts.length} />
          </div>
          <CopyButton text={text} />
        </div>
        <p className="m-0 text-[16px] text-muted print:hidden">Tap a label to see what that part does.</p>

        <ol className="m-0 flex list-none flex-col border-b-2 border-line p-0">
          {parts.map((part, i) => {
            const on = i === selected;
            return (
              <li
                key={part.name}
                className={`part-row ${colourFor(part.name)} m-0 grid gap-x-4 gap-y-2.5 border-t-2 border-line px-0 py-3.5 before:hidden tablet:grid-cols-[184px_minmax(0,1fr)] tablet:items-start`}
              >
                <button
                  type="button"
                  aria-pressed={on}
                  aria-controls={`${uid}-explain`}
                  onClick={() => setSelected(i)}
                  className="part-label min-h-11 cursor-pointer justify-self-start px-3 text-left"
                >
                  {part.name}
                </button>
                <div className="min-w-0 font-serif text-[19px] leading-[1.7] [overflow-wrap:anywhere] whitespace-pre-line desktop:text-[21px]">
                  <mark className="part-mark r-swipe" style={{ "--d": `${(0.2 + i * 0.22).toFixed(2)}s` } as CSSProperties}>
                    {part.text}
                  </mark>
                </div>
                {/* Phones: the chosen part's explanation opens right under it. (The
                    panel below says the same for screen readers.) */}
                {on && (
                  <p aria-hidden="true" className="on-ink m-0 rounded px-3.5 py-3 text-[17px] leading-[1.5] tablet:hidden print:hidden">
                    <strong>{part.name}</strong> {part.does}
                  </p>
                )}
                {/* On paper every part's explanation shows, not just the chosen one. */}
                <p className="m-0 hidden text-[16px] tablet:col-start-2 print:block">
                  <strong>{part.name}</strong> {part.does}
                </p>
              </li>
            );
          })}
        </ol>

        <div
          id={`${uid}-explain`}
          aria-live="polite"
          className={`on-ink max-tablet:sr-only flex items-start gap-3.5 rounded px-[18px] py-4 print:hidden ${colourFor(current.name)}`}
        >
          <span aria-hidden="true" className="mt-1.5 box-border size-4 flex-none rounded-[3px] border-2 border-on-block-ink bg-(--part-chip)" />
          <p className="m-0 text-[18px] leading-[1.5]">
            <strong>{current.name}</strong> {current.does}
          </p>
        </div>
      </section>
    </Reveal>
  );
}

/** Seven squares, one per part, filled for each part the prompt has. */
function StrengthMeter({ count }: { count: number }) {
  const label = count === TOTAL ? `All ${TOTAL} parts` : `${count} of ${TOTAL}`;
  return (
    <span role="img" aria-label={`Has ${count} of the ${TOTAL} parts`} className="flex items-center gap-[3px]">
      {Array.from({ length: TOTAL }, (_, i) => (
        <span key={i} className={`box-border block h-3.5 w-3 rounded-[2px] border-2 border-line ${i < count ? "bg-accent" : "bg-surface"}`} />
      ))}
      <span className="ml-1.5 text-[15px] font-bold text-fg">{label}</span>
    </span>
  );
}
