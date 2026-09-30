import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";

type Kind = "tip" | "headsup" | "tryit";

const labels: Record<Kind, string> = { tip: "Tip", headsup: "Heads up", tryit: "Try it" };

// Tip: a sky block. Heads up: an ink block with a marigold heading, a shield
// and a marigold shadow. Try it: a marigold block.
const looks: Record<Kind, { box: string; tile: string; heading: string; icon: IconName }> = {
  tip: { box: "on-sky shadow-h6 desktop:shadow-h8", tile: "on-surface text-accent", heading: "", icon: "bulb" },
  headsup: {
    box: "on-ink shadow-h6 shadow-marigold desktop:shadow-h8",
    tile: "border-transparent bg-marigold text-on-marigold",
    heading: "text-marigold",
    icon: "shield",
  },
  tryit: { box: "on-marigold shadow-h6 desktop:shadow-h8", tile: "on-surface text-accent", heading: "", icon: "pencil" },
};

/**
 * In MDX:
 *   <Callout kind="tip">If an answer isn't what you wanted, ask again.</Callout>
 * `kind` is "tip" (the default), "headsup" or "tryit". `rail` is the label
 * that hangs beside it from 1280px: "Safety".
 */
export function Callout({ kind = "tip", rail, children }: { kind?: Kind; rail?: string; children: ReactNode }) {
  const label = labels[kind] ?? labels.tip;
  const look = looks[kind] ?? looks.tip;
  return (
    <div className="blk rail-block flex flex-col gap-3.5">
      {rail && <span className="rail-label">{rail}</span>}
      <aside
        aria-label={label}
        className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 gap-y-3.5 rounded-md border-2 border-line px-[22px] pt-6 pb-[26px] desktop:items-start desktop:gap-x-[26px] desktop:gap-y-3 desktop:px-[34px] desktop:pt-[30px] desktop:pb-[34px] [&_p]:m-0 ${look.box}`}
      >
        <span
          className={`box-border grid size-12 flex-none place-items-center rounded-md border-2 border-line desktop:row-span-2 desktop:size-16 ${look.tile}`}
        >
          <Icon name={look.icon} size={30} stroke={2.1} />
        </span>
        <span className={`t-block ${look.heading}`}>{label}</span>
        <div className="col-span-2 flex min-w-0 flex-col gap-2.5 desktop:col-span-1 desktop:col-start-2">{children}</div>
      </aside>
    </div>
  );
}
