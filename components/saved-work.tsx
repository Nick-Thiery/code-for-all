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
    <div className="blk rail-block flex flex-col gap-4">
      <span className="rail-label">Saved work</span>
      <div className="index-card -rotate-[0.6deg] break-inside-avoid print:rotate-0">
        <div className="index-card-head">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="eyebrow">{saved ? "Saved on this device" : "From an earlier lesson"}</span>
            <span className="text-[16px] leading-[1.4] text-muted">
              {saved ? `Here's ${what}.` : `Nothing saved yet: ${what} isn't on this device.`}
            </span>
          </div>
          <CopyButton text={saved ? text : sample} />
        </div>
        <pre className="index-card-body text-fg">{saved ? text : sample}</pre>
      </div>
      {saved ? (
        <p className="t-meta m-0 text-muted">
          Want to change it? <Link href={from}>Go back to {fromLabel}</Link>. It stays in this browser and is never sent
          anywhere.
        </p>
      ) : (
        <p className="t-meta m-0">
          If you wrote it on another device, or in your notes, paste it in yourself. Otherwise{" "}
          <Link href={from}>go back to {fromLabel}</Link> and write it, or start from this sample.
        </p>
      )}
    </div>
  );
}
