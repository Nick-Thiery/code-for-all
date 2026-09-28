"use client";

// Small pieces the lesson diagrams share: a numbered hexagon, a card with a
// heading, a browser window frame, a chip and a downward-or-rightward arrow.
// Everything is HTML with the design tokens, so it follows dark mode and
// reflows on phones. No text is under 13px.

import type { ReactNode } from "react";
import { diagramCard, diagramLabel, FlowArrow } from "@/components/diagram";
import { Hex } from "@/components/hex";

/** A numbered hexagon in the accent colour. */
export function NumberHex({ n, size = 30 }: { n: number | string; size?: number }) {
  const h = Math.round(size * 1.13);
  return (
    <span className="relative flex flex-none items-center justify-center" style={{ width: size, height: h }}>
      <Hex width={size} height={h} shape="fill-accent" className="absolute inset-0" />
      <span className="relative font-display text-[14px] leading-none font-extrabold text-on-accent">{n}</span>
    </span>
  );
}

/** A white card with an optional numbered hexagon and a title. */
export function Card({
  n,
  title,
  icon,
  tone = "surface",
  className = "",
  children,
}: {
  n?: number | string;
  title?: ReactNode;
  icon?: ReactNode;
  tone?: "surface" | "tint" | "dashed";
  className?: string;
  children?: ReactNode;
}) {
  const look =
    tone === "tint"
      ? "rounded-2xl bg-tint ring-1 ring-accent/20"
      : tone === "dashed"
        ? "rounded-2xl border-2 border-dashed border-pip"
        : diagramCard;
  return (
    <div className={`${look} flex min-w-0 flex-col gap-2 p-3.5 ${className}`}>
      {(n !== undefined || title || icon) && (
        <div className="flex items-center gap-2.5">
          {n !== undefined && <NumberHex n={n} />}
          {icon}
          {title && <span className="font-display text-[17px] leading-[1.2] font-extrabold text-fg">{title}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

/** Small text inside a card. */
export function Note({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`m-0 text-[15px] leading-[1.45] text-fg ${className}`}>{children}</p>;
}

/** Small caps label. */
export function Label({ children, className = "text-muted" }: { children: ReactNode; className?: string }) {
  return <span className={`${diagramLabel} ${className}`}>{children}</span>;
}

/** A browser or app window with three dots. */
export function Window({ title, className = "", children }: { title?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`${diagramCard} overflow-hidden ${className}`}>
      <div className="flex h-7 items-center gap-1.5 border-b border-border bg-surface2 px-2.5" aria-hidden="true">
        <span className="size-[7px] rounded-full bg-pip" />
        <span className="size-[7px] rounded-full bg-pip" />
        <span className="size-[7px] rounded-full bg-pip" />
        {title && <span className="ml-1.5 truncate text-[13px] font-bold text-muted">{title}</span>}
      </div>
      {children}
    </div>
  );
}

/** A pill: "Vercel: live", "main". */
export function Chip({ children, tone = "surface" }: { children: ReactNode; tone?: "surface" | "accent" | "deco" }) {
  const look = {
    surface: "bg-surface text-fg ring-1 ring-border",
    accent: "bg-accent text-on-accent",
    deco: "bg-deco text-on-deco",
  }[tone];
  return (
    <span className={`inline-flex h-[30px] items-center gap-1.5 rounded-full px-3 text-[14px] leading-none font-bold whitespace-nowrap ${look}`}>
      {children}
    </span>
  );
}

/** A row of steps on tablet and up, a column on phones, with arrows between. */
export function Flow({ children, className = "" }: { children: ReactNode[]; className?: string }) {
  return (
    <div className={`flex flex-col items-stretch gap-2.5 tablet:flex-row tablet:items-stretch ${className}`}>
      {children.map((child, index) => (
        <div key={index} className="contents">
          {index > 0 && <FlowArrow />}
          {child}
        </div>
      ))}
    </div>
  );
}

/** A grey placeholder line, for "text" in a mock page. */
export function Line({ w = "100%", tone = "track" }: { w?: string; tone?: "track" | "accent" | "deco" }) {
  const bg = { track: "bg-track", accent: "bg-accent", deco: "bg-deco" }[tone];
  return <span className={`block h-2 rounded-full ${bg}`} style={{ width: w }} aria-hidden="true" />;
}

/** Simple line icons, 24×24, stroked in the current colour. */
export function Icon({ name, size = 22, className = "stroke-accent" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`flex-none fill-none stroke-2 ${className}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}

export type IconName =
  | "clock"
  | "steps"
  | "tag"
  | "broom"
  | "chat"
  | "page"
  | "sparkle"
  | "check"
  | "cross"
  | "laptop"
  | "cloud"
  | "globe"
  | "person"
  | "eye"
  | "puzzle"
  | "book"
  | "hammer"
  | "refresh"
  | "branch"
  | "copy";

const ICONS: Record<IconName, ReactNode> = {
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  steps: (
    <>
      <path d="M4 6h4M4 12h8M4 18h12" />
      <path d="M17 15l2 2 3-3" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12l9-9h9v9l-9 9z" />
      <circle cx="16.5" cy="7.5" r="1.4" />
    </>
  ),
  broom: (
    <>
      <path d="M14 3l7 7" />
      <path d="M10.5 6.5L17 13l-5 8H6l-2-4z" />
    </>
  ),
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  page: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
      <path d="M12 8l2 4-2 4-2-4z" />
    </>
  ),
  check: <path d="M5 12l5 5 9-10" />,
  cross: <path d="M6 6l12 12M18 6L6 18" />,
  laptop: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M2 19h20" />
    </>
  ),
  cloud: <path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3.5 3.5 3.5 14.5 0 18M12 3c-3.5 3.5-3.5 14.5 0 18" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  puzzle: <path d="M10 4h4v3a2 2 0 1 0 0 4v3h3a2 2 0 1 1 0 4h-3v3h-4v-3a2 2 0 1 1 0-4v-3H7a2 2 0 1 0 0-4h3z" />,
  book: (
    <>
      <path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z" />
      <path d="M20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z" />
    </>
  ),
  hammer: (
    <>
      <path d="M14 4l6 6-3 3-6-6z" />
      <path d="M11 7L4 14l3 3 7-7" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.7" />
      <path d="M20 4v5h-5" />
    </>
  ),
  branch: (
    <>
      <circle cx="6" cy="5" r="2.5" />
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="9" r="2.5" />
      <path d="M6 7.5v9M18 11.5c0 4-12 2-12 5" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
};
