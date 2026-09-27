"use client";

import { type ReactNode, useId, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { Hex } from "@/components/hex";

// The prompt ladder in lesson 1.4 (design: "Prompt ladder · lesson 1.4").
// In MDX:
//
//   <PromptLadder>
//   <LadderPrompt level="Bad" prompt="…" leavesOut={["Role", …]}>Why it's weak.</LadderPrompt>
//   <LadderPrompt level="Better" …>…</LadderPrompt>
//   </PromptLadder>
//
//   <StrongPrompt parts={[{ name: "Role", text: "Role: …", does: "tells the AI …" }, …]} />
//
// The strong prompt is its parts' text joined by line breaks, exactly as
// written; Copy copies that. Each part's colour is a token in
// app/globals.css (--part-role and so on).

/** The seven parts, in order, and the token each one is coloured with. */
const PARTS: Record<string, string> = {
  Role: "role",
  Goal: "goal",
  "Target audience": "audience",
  "Core pages": "pages",
  "Design style": "style",
  "Output required": "output",
  "Key features": "features",
};
const TOTAL = Object.keys(PARTS).length;

/** "Design style (\"modern\" is vague)" -> "style" */
function tokenFor(label: string) {
  const name = Object.keys(PARTS).find((part) => label === part || label.startsWith(`${part} `));
  return name ? PARTS[name] : "features";
}

/** The weaker rungs, side by side from tablet up. */
export function PromptLadder({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 tablet:grid-cols-2">{children}</div>;
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
    <section className="flex min-w-0 flex-col gap-3 rounded-[20px] border-[1.5px] border-border p-[18px] break-inside-avoid">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h2
          className={`m-0 inline-flex h-7 items-center rounded-full px-3 text-[14px] font-extrabold tracking-[.08em] uppercase ${
            better ? "bg-tint text-accent" : "bg-surface2 text-muted"
          }`}
        >
          {level}
        </h2>
        <StrengthMeter count={TOTAL - leavesOut.length} />
      </div>
      <p className="m-0 rounded-xl bg-surface2 px-3.5 py-3 font-mono text-[16px] leading-[1.6] [overflow-wrap:anywhere]">
        <span className="sr-only">Prompt: </span>
        {prompt}
      </p>
      {children && <div className="text-[17px] leading-[1.55] [&>p]:m-0">{children}</div>}
      <p className="m-0 text-[15px] font-bold text-muted">{leavesOutLabel}</p>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {leavesOut.map((label) => (
          <li key={label} className="m-0 p-0 pl-0 before:hidden">
            <PartChip label={label} />
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
    <section className="flex min-w-0 flex-col gap-3.5 rounded-[22px] border-2 border-accent p-(--pad) shadow-[0_18px_44px_color-mix(in_srgb,var(--accent)_12%,transparent)] break-inside-avoid dark:shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="m-0 inline-flex h-[30px] items-center rounded-full bg-accent px-3.5 text-[14px] font-extrabold tracking-[.08em] text-on-accent uppercase">
            {level}
          </h2>
          <StrengthMeter count={parts.length} />
        </div>
        <CopyButton text={text} />
      </div>
      <p className="m-0 text-[17px] text-muted print:hidden">Tap a label to see what that part does.</p>

      <ol className="m-0 flex list-none flex-col gap-1 p-0">
        {parts.map((part, i) => {
          const token = tokenFor(part.name);
          const on = i === selected;
          return (
            <li
              key={part.name}
              className="m-0 grid gap-x-3.5 gap-y-2 rounded-xl p-2.5 before:hidden tablet:grid-cols-[196px_minmax(0,1fr)] tablet:items-start tablet:px-3"
              style={{ background: on ? `var(--part-${token}-row)` : undefined }}
            >
              <button
                type="button"
                aria-pressed={on}
                aria-controls={`${uid}-explain`}
                onClick={() => setSelected(i)}
                className="min-h-11 cursor-pointer justify-self-start rounded-full border-0 px-3.5 font-[inherit] text-[14px] font-extrabold tracking-[.06em] whitespace-nowrap uppercase tablet:min-h-[34px]"
                style={{
                  background: `var(--part-${token})`,
                  color: `var(--part-${token}-ink)`,
                  boxShadow: on ? `0 0 0 2px var(--part-${token}-ink)` : undefined,
                }}
              >
                {part.name}
              </button>
              <div className="min-w-0 font-mono text-[16px] leading-[1.65] [overflow-wrap:anywhere] whitespace-pre-line">
                {part.text}
              </div>
              {/* Phones: the chosen part's explanation opens right under it. (The
                  panel below says the same for screen readers.) */}
              {on && (
                <p aria-hidden="true" className="m-0 rounded-[10px] bg-term-bg px-3.5 py-3 text-[17px] leading-[1.5] text-term-text tablet:hidden print:hidden">
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
        className="max-tablet:sr-only flex gap-3.5 rounded-[14px] bg-term-bg px-[18px] py-4 print:hidden"
      >
        <span
          aria-hidden="true"
          className="mt-1.5 size-3.5 flex-none rounded-full"
          style={{ background: `var(--part-${tokenFor(current.name)})` }}
        />
        <p className="m-0 text-[18px] leading-[1.5] text-term-text">
          <strong>{current.name}</strong> {current.does}
        </p>
      </div>
    </section>
  );
}

function PartChip({ label }: { label: string }) {
  const token = tokenFor(label);
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-[14px] leading-[1.3] font-bold"
      style={{ background: `var(--part-${token})`, color: `var(--part-${token}-ink)` }}
    >
      {label}
    </span>
  );
}

/** Seven hexagons, one per part, filled for each part the prompt has. */
function StrengthMeter({ count }: { count: number }) {
  const label = count === TOTAL ? `All ${TOTAL} parts` : `${count} of ${TOTAL}`;
  return (
    <span role="img" aria-label={`Has ${count} of the ${TOTAL} parts`} className="flex items-center gap-[3px]">
      {Array.from({ length: TOTAL }, (_, i) => (
        <Hex
          key={i}
          width={13}
          height={14}
          shape={i < count ? "fill-accent" : "fill-surface stroke-pip stroke-[1.5]"}
        />
      ))}
      <span className={`ml-1.5 text-[15px] font-bold ${count === TOTAL ? "text-accent" : "text-muted"}`}>{label}</span>
    </span>
  );
}
