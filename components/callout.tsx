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

// In a lesson (`calm`) the same three colours sit flat: a small icon tile and
// a small title, no hard shadow.
const calmLooks: Record<Kind, { box: string; tile: string }> = {
  tip: { box: "on-sky", tile: "on-surface text-accent" },
  headsup: { box: "on-ink", tile: "border-transparent bg-marigold text-on-marigold" },
  tryit: { box: "on-marigold", tile: "on-surface text-accent" },
};

/**
 * In MDX:
 *   <Callout kind="tip">If an answer isn't what you wanted, ask again.</Callout>
 * `kind` is "tip" (the default), "headsup" or "tryit". Lessons get the `calm`
 * look (components/mdx-components.tsx); pages outside lessons get the Cover one.
 */
export function Callout({ kind = "tip", calm = false, children }: { kind?: Kind; calm?: boolean; children: ReactNode }) {
  const label = labels[kind] ?? labels.tip;
  const look = looks[kind] ?? looks.tip;
  if (calm) {
    const quiet = calmLooks[kind] ?? calmLooks.tip;
    return (
      <aside
        aria-label={label}
        className={`blk flex flex-col gap-2.5 rounded-md border-2 border-line px-5 pt-4 pb-5 desktop:px-6 desktop:pt-5 desktop:pb-6 [&_p]:m-0 ${quiet.box}`}
      >
        <span className="flex items-center gap-2.5">
          <span className={`box-border grid size-8 flex-none place-items-center rounded border-2 border-line ${quiet.tile}`}>
            <Icon name={look.icon} size={18} stroke={2.2} />
          </span>
          <span className={`t-box ${look.heading}`}>{label}</span>
        </span>
        <div className="flex min-w-0 flex-col gap-2.5">{children}</div>
      </aside>
    );
  }
  return (
    <div className="blk flex flex-col gap-3.5">
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
