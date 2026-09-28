import { useSyncExternalStore } from "react";

// Certificates (app/[module]/certificate, app/certificate): what a
// certificate says, and the one thing stored for it, the name to print.
// The name lives in this browser only (cfa:certificate-name) so it doesn't
// have to be typed again for each module; clearing the box forgets it.

const NAME_KEY = "cfa:certificate-name";
const CHANGE_EVENT = "cfa:certificate-name-change";
export const NAME_MAX = 60;

/** Everything printed on one certificate, apart from the name. */
export type CertificateText = {
  /** "Module 1" or "The whole course". */
  kicker: string;
  /** "Intro to Lovable" or "Code for All". */
  title: string;
  /** One line on what the module (or course) covered, from course.yml. */
  line: string;
  /** How many lessons it took. */
  lessons: number;
  /** Lesson ids that must all be done before it's issued. */
  requires: string[];
};

/** "27 September 2026", in the device's own time zone. */
export function certificateDate(date = new Date()): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** The honest small print on every certificate. */
export const SMALL_PRINT =
  "Code for All is a free, self-paced course. This certificate records that every lesson was finished. It isn't a grade or a qualification.";

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === NAME_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

/** The saved name. `ready` is false during the server render and hydration. */
export function useCertificateName() {
  const name = useSyncExternalStore<string | null>(subscribe, readName, () => null);
  return { name: name ?? "", ready: name !== null };
}

/** Save the name for the next certificate, or forget it when it's empty. */
export function saveCertificateName(name: string) {
  const trimmed = name.trim().slice(0, NAME_MAX);
  try {
    if (trimmed) localStorage.setItem(NAME_KEY, trimmed);
    else localStorage.removeItem(NAME_KEY);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
