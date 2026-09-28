"use client";

import Link from "next/link";
import { CopyButton } from "@/components/copy-button";
import { useSavedWork } from "@/lib/saved-work";

/**
 * Shows something the learner saved earlier on this device (with SaveHere, or
 * the practice card), with a Copy button, right where it's needed. If there's
 * nothing saved, it links back to the lesson where they write it and offers a
 * sample to start from. In MDX:
 *   <SavedWork id="about-me-prompt" from="/module-1/the-art-of-prompting" fromLabel="lesson 4" sample="…" />
 */
export function SavedWork({
  id,
  what,
  from,
  fromLabel,
  sample,
}: {
  /** Matches the SaveHere id or practice taskId it was saved under. */
  id: string;
  /** What it is, lowercase: "your About Me prompt". */
  what: string;
  /** The lesson where they write it. */
  from: string;
  fromLabel: string;
  /** A sample to start from when nothing is saved. */
  sample: string;
}) {
  const { text, ready } = useSavedWork(id);
  const saved = ready && text.trim() !== "";

  return (
    <div className="flex flex-col gap-3 rounded-[20px] border-[1.5px] border-border bg-surface p-(--pad)">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="flex flex-col gap-0.5">
          <span className="kicker">{saved ? "Saved on this device" : "From an earlier lesson"}</span>
          <span className="text-[18px] font-bold">
            {saved ? `Here's ${what}.` : `Nothing saved yet: ${what} isn't on this device.`}
          </span>
        </div>
        <CopyButton text={saved ? text : sample} className="btn btn-small min-w-24 print:hidden" />
      </div>
      {!saved && (
        <p className="m-0">
          If you wrote it on another device, or in your notes, paste it in yourself. Otherwise{" "}
          <Link href={from}>go back to {fromLabel}</Link> and write it, or start from this sample:
        </p>
      )}
      <pre className="m-0 rounded-xl border-[1.5px] border-border bg-surface2 px-[18px] py-4 font-mono text-[16px] leading-[1.6] whitespace-pre-wrap [overflow-wrap:anywhere] text-fg">
        {saved ? text : sample}
      </pre>
      {saved && (
        <p className="t-meta m-0 text-muted">
          Want to change it? <Link href={from}>Go back to {fromLabel}</Link>. It stays in this browser and is never sent
          anywhere.
        </p>
      )}
    </div>
  );
}
