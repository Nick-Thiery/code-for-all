import { useSyncExternalStore } from "react";
import { readCompleted, setLessonComplete } from "@/lib/progress";

// The small "Module complete" celebration (components/module-celebration.tsx).
// It lives in memory only, so it survives the client-side move to the next
// page after "Next" but never outlasts the visit, and nothing is stored.

export type ModuleInfo = {
  number: number;
  title: string;
  /** Every lesson id in the module, in order. */
  lessonIds: string[];
};

export type Celebration = { module: number; title: string; lessons: number; key: number };

let current: Celebration | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCelebration() {
  return useSyncExternalStore(subscribe, () => current, () => null);
}

export function dismissCelebration() {
  current = null;
  emit();
}

/**
 * Mark a lesson done. If that finishes its module (every lesson done, and it
 * wasn't before), celebrate.
 */
export function markLessonDone(id: string, mod: ModuleInfo) {
  const wasFinished = mod.lessonIds.every((lessonId) => readCompleted().has(lessonId));
  setLessonComplete(id, true);
  const nowFinished = mod.lessonIds.every((lessonId) => readCompleted().has(lessonId));
  if (!wasFinished && nowFinished) {
    current = { module: mod.number, title: mod.title, lessons: mod.lessonIds.length, key: (current?.key ?? 0) + 1 };
    emit();
  }
}
