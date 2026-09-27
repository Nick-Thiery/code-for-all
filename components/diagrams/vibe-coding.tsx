import type { ReactNode } from "react";
import { Diagram, FlowArrow, diagramCard } from "@/components/diagram";
import { Hex } from "@/components/hex";

// "Vibe coding in three steps" in lesson 1.2 (design: DiagramVibe board).
// From desktop up the three cards sit in a row joined by arrows; below that
// they stack, each card with its words on the left and its picture on the
// right. The pictures are shapes only, so they can shrink; every word is HTML.

const ALT =
  "Vibe coding in three steps, shown as three cards joined by arrows. " +
  "Step 1, Describe: you say what you want, in plain words. Its picture is a speech bubble with lines of text in it. " +
  "Step 2, Build: the AI writes the code, the database and the layout. Its picture is a hexagon with a code symbol, lines of code and a progress bar. " +
  "Step 3, Launch: you review it, tweak it and put it online. Its picture is a small website in a browser window with a LIVE badge. " +
  "You define the rules; the AI writes the code.";

export function VibeCodingDiagram() {
  return (
    <Diagram alt={ALT} caption="Vibe coding in three steps. You define the rules; the AI writes the code.">
      <div className="flex flex-col gap-3 desktop:flex-row desktop:items-stretch desktop:gap-2.5">
        <Step number={1} title="Describe" picture={<DescribePicture />}>
          You say what you want, in plain words.
        </Step>
        <Arrow />
        <Step number={2} title="Build" picture={<BuildPicture />}>
          The AI writes the code, the database and the layout.
        </Step>
        <Arrow />
        <Step number={3} title="Launch" picture={<LaunchPicture />}>
          You review it, tweak it and put it online.
        </Step>
      </div>
    </Diagram>
  );
}

/** FlowArrow turns at tablet; these cards only go side by side at desktop,
 *  so between tablet and desktop the arrow is turned back down. */
function Arrow() {
  return (
    <span className="flex self-center tablet:rotate-90 desktop:rotate-0">
      <FlowArrow />
    </span>
  );
}

function Step({
  number,
  title,
  picture,
  children,
}: {
  number: number;
  title: string;
  picture: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`${diagramCard} flex min-w-0 flex-col gap-2.5 p-4 desktop:flex-1 desktop:basis-0`}>
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-[34px] w-[30px] flex-none items-center justify-center">
          <Hex width={30} height={34} shape="fill-accent" className="absolute inset-0" />
          <span className="relative font-display text-[15px] leading-none font-extrabold text-on-accent">{number}</span>
        </span>
        <span className="font-display text-[21px] leading-[1.2] font-extrabold text-fg">{title}</span>
      </div>
      <div className="flex items-center gap-3.5 desktop:flex-col desktop:items-stretch desktop:gap-2.5">
        <p className="m-0 min-w-0 flex-1 text-[15px] leading-[1.45] text-fg desktop:order-2 desktop:flex-none">
          {children}
        </p>
        <div className="relative w-[120px] flex-none tablet:w-[164px] desktop:order-1 desktop:w-full">{picture}</div>
      </div>
    </div>
  );
}

const pictureSvg = "block h-auto w-full";

function DescribePicture() {
  return (
    <svg viewBox="0 0 164 140" aria-hidden="true" className={pictureSvg}>
      <path
        d="M14 18 h136 a10 10 0 0 1 10 10 v68 a10 10 0 0 1 -10 10 h-96 l-22 20 v-20 h-18 a10 10 0 0 1 -10 -10 v-68 a10 10 0 0 1 10 -10 z"
        strokeWidth="2.5"
        strokeLinejoin="round"
        className="fill-tint stroke-accent"
      />
      <rect x="22" y="36" width="112" height="9" rx="4.5" className="fill-accent" />
      <rect x="22" y="54" width="92" height="9" rx="4.5" className="fill-deco" />
      <rect x="22" y="72" width="70" height="9" rx="4.5" className="fill-deco" />
      <rect x="98" y="70" width="3" height="14" className="fill-accent" />
    </svg>
  );
}

function BuildPicture() {
  return (
    <svg viewBox="0 0 164 140" aria-hidden="true" className={pictureSvg}>
      <polygon points="52,14 90,36 90,80 52,102 14,80 14,36" className="fill-accent" />
      {/* "</>" drawn as strokes */}
      <path
        d="M41 48 l-10 10 l10 10 M63 48 l10 10 l-10 10 M57 45 l-10 26"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-on-accent"
      />
      <rect x="100" y="30" width="54" height="8" rx="4" className="fill-deco" />
      <rect x="110" y="46" width="44" height="8" rx="4" className="fill-track" />
      <rect x="110" y="62" width="34" height="8" rx="4" className="fill-deco" />
      <rect x="100" y="78" width="50" height="8" rx="4" className="fill-track" />
      <rect x="14" y="116" width="140" height="8" rx="4" className="fill-track" />
      <rect x="14" y="116" width="96" height="8" rx="4" className="fill-accent" />
    </svg>
  );
}

function LaunchPicture() {
  return (
    <>
      <svg viewBox="0 0 164 140" aria-hidden="true" className={pictureSvg}>
        <rect x="6" y="14" width="152" height="112" rx="10" strokeWidth="2.5" className="fill-surface stroke-accent" />
        <path d="M6 34 h152" strokeWidth="2.5" className="stroke-accent" />
        <circle cx="18" cy="24" r="3" className="fill-accent" />
        <circle cx="28" cy="24" r="3" className="fill-accent" />
        <circle cx="38" cy="24" r="3" className="fill-accent" />
        <rect x="18" y="46" width="62" height="12" rx="4" className="fill-fg" />
        <rect x="18" y="66" width="56" height="7" rx="3.5" className="fill-track" />
        <rect x="18" y="86" width="60" height="28" rx="6" className="fill-(--part-role)" />
        <rect x="84" y="86" width="60" height="28" rx="6" className="fill-(--part-goal)" />
      </svg>
      <span className="absolute top-[37%] right-[7%] -translate-y-1/2 rounded-full bg-accent px-1.5 text-[13px] leading-[1.45] font-bold tracking-[.06em] text-on-accent">
        LIVE
      </span>
    </>
  );
}
