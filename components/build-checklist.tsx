"use client";

import { useId } from "react";
import { Hex, HexCheck } from "@/components/hex";
import type { ChecklistGroup } from "@/lib/quiz";
import { setChecklistItem, useChecklist } from "@/lib/quiz-results";

/**
 * The final-project checklist on a Check your skills page, from
 * content/check-your-skills.yml. Unscored: ticks are saved on this device
 * only, per page, under `id`.
 */
export function BuildChecklist({ id, groups }: { id: string; groups: ChecklistGroup[] }) {
  const uid = useId();
  const { ticked, ready } = useChecklist(id);

  return (
    <div className="flex flex-col gap-7">
      {groups.map((group, g) => (
        <section key={group.criterion} aria-labelledby={`${uid}-${g}`} className="flex flex-col gap-3">
          <h3 id={`${uid}-${g}`} className="t-h3 m-0">
            {group.criterion}
          </h3>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {group.items.map((item) => {
              const on = ticked.has(item.id);
              return (
                <li key={item.id}>
                  <label className="flex min-h-14 cursor-pointer items-center gap-4 rounded-[14px] border-[1.5px] border-border bg-surface px-[18px] py-3 text-fg hover:border-accent has-[:disabled]:cursor-default has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-accent">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      disabled={!ready}
                      onChange={(event) => setChecklistItem(id, item.id, event.target.checked)}
                    />
                    <span aria-hidden="true" className="flex-none">
                      {on ? (
                        <Hex width={26} height={28} shape="fill-accent stroke-accent stroke-2" className="block">
                          <HexCheck className="stroke-on-accent stroke-[2.6]" />
                        </Hex>
                      ) : (
                        <Hex width={26} height={28} shape="fill-surface stroke-accent stroke-2" className="block" />
                      )}
                    </span>
                    <span>{item.text}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
