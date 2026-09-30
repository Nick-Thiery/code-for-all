"use client";

import { useId } from "react";
import { SAVED_WORK_MAX, saveWork, useSavedWork } from "@/lib/saved-work";

/**
 * A box where a learner saves something they'll need in a later lesson, on
 * this device only. A later lesson shows it back with <SavedWork id="…">.
 * In MDX:
 *   <SaveHere id="solo-sprint-prompt" label="Your exact prompt" placeholder="Paste the prompt you gave Lovable." />
 */
export function SaveHere({
  id,
  label,
  placeholder,
  rows = 5,
}: {
  /** Matches the <SavedWork id> that shows it later. Lowercase words and dashes. */
  id: string;
  label: string;
  placeholder?: string;
  rows?: number;
}) {
  const fieldId = useId();
  const { text, ready } = useSavedWork(id);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-deco bg-surface p-(--pad) print:hidden">
      <div className="flex flex-col gap-1">
        <span className="kicker">Save it here</span>
        <label htmlFor={fieldId} className="text-[18px] font-bold">
          {label}
        </label>
      </div>
      <textarea
        id={fieldId}
        value={text}
        readOnly={!ready}
        onChange={(event) => saveWork(id, event.target.value)}
        maxLength={SAVED_WORK_MAX}
        rows={rows}
        placeholder={placeholder}
        aria-describedby={`${fieldId}-note`}
        className="box-border w-full resize-y rounded-xl border-2 border-border bg-surface p-4 font-mono text-[17px] leading-[1.6] text-fg"
      />
      <p id={`${fieldId}-note`} className="t-meta m-0 text-muted">
        {ready && text.trim() !== "" ? "Saved on this device. " : ""}
        It stays in this browser and is never sent anywhere. A later lesson shows it back to you. Keep a copy in your
        own notes too, in case you change devices.
      </p>
    </div>
  );
}
