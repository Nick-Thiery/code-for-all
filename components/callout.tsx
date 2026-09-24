import type { ReactNode } from "react";
import { Hex } from "@/components/hex";

type Kind = "tip" | "headsup" | "tryit";

const labels: Record<Kind, string> = { tip: "Tip", headsup: "Heads up", tryit: "Try it" };

const boxes: Record<Kind, string> = {
  tip: "bg-tint",
  headsup: "border-[1.5px] border-border bg-surface2",
  tryit: "border-2 border-dashed border-deco bg-surface",
};

/**
 * In MDX:
 *   <Callout kind="tip">If an answer isn't what you wanted, ask again.</Callout>
 * `kind` is "tip" (the default), "headsup" or "tryit".
 */
export function Callout({ kind = "tip", children }: { kind?: Kind; children: ReactNode }) {
  const label = labels[kind] ?? labels.tip;
  return (
    <aside
      aria-label={label}
      className={`flex flex-col gap-2 rounded-[14px] px-[22px] py-[18px] text-fg [&_p]:m-0 ${boxes[kind] ?? boxes.tip}`}
    >
      <span className="flex items-center gap-2">
        <CalloutIcon kind={kind} />
        <span className={`eyebrow leading-none ${kind === "headsup" ? "text-fg" : ""}`}>{label}</span>
      </span>
      <div className="flex flex-col gap-2">{children}</div>
    </aside>
  );
}

function CalloutIcon({ kind }: { kind: Kind }) {
  if (kind === "headsup") {
    return (
      <Hex width={18} height={20} shape="fill-none stroke-fg stroke-2">
        <text x="12" y="17.6" textAnchor="middle" className="fill-fg font-sans text-[13px] font-bold">
          !
        </text>
      </Hex>
    );
  }
  if (kind === "tryit") {
    return (
      <Hex width={18} height={20} shape="fill-none stroke-accent stroke-[2.4]">
        <path
          d="M9.5 9l5 4-5 4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-accent stroke-[2.2]"
        />
      </Hex>
    );
  }
  return <Hex width={16} height={18} shape="fill-deco" />;
}
