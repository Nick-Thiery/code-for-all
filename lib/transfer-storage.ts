import { readLevels, replaceLevels } from "@/lib/quiz-results";
import { readCompleted, replaceCompleted } from "@/lib/progress";
import { type Snapshot, merge, today } from "@/lib/transfer";

// The browser side of "Move my progress": this device's progress as a
// snapshot, and writing a snapshot back (lib/transfer.ts has the format).

/** What this device has now. */
export function readSnapshot(): Snapshot {
  return { done: readCompleted(), levels: readLevels(), date: today() };
}

/** Put `snapshot` on this device, in place of what's here or combined with it. */
export function applySnapshot(snapshot: Snapshot, how: "replace" | "combine"): Snapshot {
  const next = how === "combine" ? merge(readSnapshot(), snapshot) : snapshot;
  replaceCompleted(next.done);
  replaceLevels(next.levels);
  return next;
}
