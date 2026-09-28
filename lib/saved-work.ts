import { useSyncExternalStore } from "react";

// Work a learner writes in one lesson and needs again in a later one: the
// About Me prompt from 1.4, the solo sprint prompt from 2.2, a project idea.
// It's saved in this browser only, under one key, as { id: text }, and never
// sent anywhere. SaveHere (components/save-here.tsx) writes it, SavedWork
// (components/saved-work.tsx) shows it where it's needed, and the practice
// card keeps its draft here too. Listed on /privacy.
export const SAVED_WORK_KEY = "cfa:saved-work";
const CHANGE_EVENT = "cfa:saved-work-change";
/** Longer than any prompt needs to be, so a paste can't fill the storage. */
export const SAVED_WORK_MAX = 4000;

type Store = Record<string, string>;

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === SAVED_WORK_KEY) onChange();
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
    return localStorage.getItem(SAVED_WORK_KEY) ?? "{}";
  } catch {
    return "{}";
  }
}

function parse(raw: string): Store {
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([, text]) => typeof text === "string")) as Store;
  } catch {
    return {};
  }
}

/**
 * The text saved under `id`, or "" when there's none. `ready` is false during
 * the server render and hydration, when we can't know yet.
 */
export function useSavedWork(id: string): { text: string; ready: boolean } {
  const raw = useSyncExternalStore<string | null>(subscribe, readRaw, () => null);
  return { text: raw === null ? "" : (parse(raw)[id] ?? ""), ready: raw !== null };
}

/** The text saved under `id` right now, outside React. */
export function readSavedWork(id: string): string {
  return parse(readRaw())[id] ?? "";
}

/** Saves `text` under `id`; empty text removes the entry. */
export function saveWork(id: string, text: string) {
  const store = parse(readRaw());
  const trimmed = text.slice(0, SAVED_WORK_MAX);
  if (trimmed.trim() === "") delete store[id];
  else store[id] = trimmed;
  try {
    if (Object.keys(store).length === 0) localStorage.removeItem(SAVED_WORK_KEY);
    else localStorage.setItem(SAVED_WORK_KEY, JSON.stringify(store));
  } catch {
    return; // Storage is blocked (some private modes). Nothing to persist to.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
