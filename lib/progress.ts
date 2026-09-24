import { useMemo, useSyncExternalStore } from "react";

// Completion lives in this browser only: a JSON array of lesson slugs.
const STORAGE_KEY = "cfa:completed-lessons";
const CHANGE_EVENT = "cfa:progress-change";

function subscribe(onChange: () => void) {
  // "storage" fires when another tab changes progress; our own event covers this tab.
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readRaw(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function parse(raw: string): Set<string> {
  try {
    const value: unknown = JSON.parse(raw);
    return new Set(Array.isArray(value) ? value.filter((v) => typeof v === "string") : []);
  } catch {
    return new Set();
  }
}

/**
 * `ready` is false during the server render and hydration, when we can't
 * know yet. Render a neutral state until then.
 */
export function useCompletedLessons() {
  const raw = useSyncExternalStore<string | null>(subscribe, readRaw, () => null);
  const completed = useMemo(() => (raw === null ? new Set<string>() : parse(raw)), [raw]);
  return { completed, ready: raw !== null };
}

export function setLessonComplete(slug: string, done: boolean) {
  const completed = parse(readRaw());
  if (done) completed.add(slug);
  else completed.delete(slug);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  } catch {
    return; // Storage is blocked (some private modes). Nothing to persist to.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
