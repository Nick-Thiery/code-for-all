import { LEVELS, type Level, type Levels, isLevel } from "@/lib/mastery";

// "Move my progress" (app/move-progress): a learner's progress as a code they
// can carry to another device. Nothing here touches storage or the network;
// the browser side is in lib/transfer-storage.ts. The code is made on one
// device and read on the other, and the QR link keeps it after a "#" so it
// never reaches the server.
//
// A code looks like CFA1Zk3f9AbC…:
//   CFA      it's ours
//   1        the format version; a code from another version says so instead of breaking
//   Z or U   Z: the JSON below, deflated; U: not deflated (older browsers)
//   4 hex    a check on the payload, so a code with a missing character is caught
//   payload  base64url
// The JSON is {"v":1,"t":"2026-09-27","l":{"1/meet-lovable":"dp",…}}: for each
// lesson, "d" if it's done and one letter for its level (a f p m).

export const VERSION = 1;
export const CODE_PREFIX = "CFA";

export type Snapshot = {
  /** Lesson ids, "module-1/meet-lovable". */
  done: Set<string>;
  levels: Levels;
  /** The day it was made, "2026-09-27". */
  date: string;
};

export type Problem =
  /** Not one of our codes at all. */
  | "not-a-code"
  /** A version this site no longer reads. */
  | "too-old"
  /** A version this site doesn't know yet. */
  | "too-new"
  /** Right shape, but the contents don't add up: a missing or changed character. */
  | "damaged";

export type Decoded = { ok: true; snapshot: Snapshot } | { ok: false; problem: Problem };

const LEVEL_LETTERS: Record<Exclude<Level, "not-started">, string> = { attempted: "a", familiar: "f", proficient: "p", mastered: "m" };
const LETTER_LEVELS = Object.fromEntries(Object.entries(LEVEL_LETTERS).map(([level, letter]) => [letter, level])) as Record<string, Level>;

const LESSON_ID = /^module-(\d+)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const SHORT_ID = /^(\d+)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export function isEmpty(snapshot: Snapshot): boolean {
  return snapshot.done.size === 0 && Object.keys(snapshot.levels).length === 0;
}

/** How many lessons have a level, for the summaries. */
export function levelledCount(snapshot: Snapshot): number {
  return Object.values(snapshot.levels).filter((level) => level !== "not-started").length;
}

/**
 * Both snapshots together: a lesson is done if it's done in either, and keeps
 * the higher of its two levels.
 */
export function merge(a: Snapshot, b: Snapshot): Snapshot {
  const levels: Levels = { ...a.levels };
  for (const [lesson, level] of Object.entries(b.levels)) {
    const current = levels[lesson];
    if (!current || LEVELS.indexOf(level) > LEVELS.indexOf(current)) levels[lesson] = level;
  }
  return { done: new Set([...a.done, ...b.done]), levels, date: a.date > b.date ? a.date : b.date };
}

// ---- Encoding ----

function toJson(snapshot: Snapshot): string {
  const lessons: Record<string, string> = {};
  const shorten = (id: string) => id.replace(/^module-/, "");
  for (const id of [...snapshot.done].sort()) if (LESSON_ID.test(id)) lessons[shorten(id)] = "d";
  for (const [id, level] of Object.entries(snapshot.levels)) {
    if (!LESSON_ID.test(id) || level === "not-started") continue;
    lessons[shorten(id)] = (lessons[shorten(id)] ?? "") + LEVEL_LETTERS[level];
  }
  return JSON.stringify({ v: VERSION, t: snapshot.date, l: lessons });
}

function fromJson(text: string): Snapshot | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;
  const { v, t, l } = data as { v?: unknown; t?: unknown; l?: unknown };
  if (v !== VERSION || !l || typeof l !== "object") return null;
  const date = typeof t === "string" && /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : "";
  const done = new Set<string>();
  const levels: Levels = {};
  for (const [short, flags] of Object.entries(l as Record<string, unknown>)) {
    if (!SHORT_ID.test(short) || typeof flags !== "string" || !/^d?[afpm]?$/.test(flags)) return null;
    const id = `module-${short}`;
    if (flags.includes("d")) done.add(id);
    const level = LETTER_LEVELS[flags.replace("d", "")];
    if (isLevel(level)) levels[id] = level;
  }
  return { done, levels, date };
}

/** A 16-bit check (FNV-1a) as four hex characters. Catches a lost or changed character. */
export function checksum(payload: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return ((hash ^ (hash >>> 16)) & 0xffff).toString(16).padStart(4, "0");
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): Uint8Array | null {
  try {
    const padded = text.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(text.length / 4) * 4, "=");
    return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const writer = stream.writable.getWriter();
  const written = writer.write(new Uint8Array(bytes)).then(() => writer.close());
  const reader = stream.readable.getReader();
  const parts: Uint8Array[] = [];
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    parts.push(value);
  }
  await written;
  const out = new Uint8Array(parts.reduce((n, part) => n + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

const canDeflate = () => typeof CompressionStream === "function" && typeof DecompressionStream === "function";

/** The snapshot as a code. Deflated where the browser can, so the QR code stays small. */
export async function encode(snapshot: Snapshot): Promise<string> {
  const json: Uint8Array = new TextEncoder().encode(toJson(snapshot));
  let mode = "U";
  let bytes: Uint8Array = json;
  if (canDeflate()) {
    try {
      bytes = await pipe(json, new CompressionStream("deflate-raw"));
      mode = "Z";
    } catch {
      bytes = json;
    }
  }
  const payload = toBase64Url(bytes);
  return `${CODE_PREFIX}${VERSION}${mode}${checksum(payload)}${payload}`;
}

/** Tidy a pasted code: spaces, line breaks and a stray URL around it don't matter. */
export function clean(text: string): string {
  const trimmed = text.replace(/\s+/g, "");
  const inUrl = /#code=([^&]+)/.exec(trimmed);
  return (inUrl ? decodeURIComponent(inUrl[1]) : trimmed).replace(/^cfa/i, CODE_PREFIX);
}

const SHAPE = /^CFA(\d+)([ZU])([0-9a-f]{4})([A-Za-z0-9_-]+)$/;

export async function decode(text: string): Promise<Decoded> {
  const code = clean(text);
  const match = SHAPE.exec(code);
  if (!match) {
    // A version we can't parse the shape of still starts with the prefix.
    if (code.startsWith(CODE_PREFIX)) {
      const version = Number(/^CFA(\d+)/.exec(code)?.[1]);
      if (Number.isFinite(version) && version > VERSION) return { ok: false, problem: "too-new" };
      if (Number.isFinite(version) && version < VERSION) return { ok: false, problem: "too-old" };
    }
    return { ok: false, problem: code.startsWith(CODE_PREFIX) ? "damaged" : "not-a-code" };
  }
  const [, versionText, mode, check, payload] = match;
  const version = Number(versionText);
  if (version > VERSION) return { ok: false, problem: "too-new" };
  if (version < VERSION) return { ok: false, problem: "too-old" };
  if (checksum(payload) !== check) return { ok: false, problem: "damaged" };
  let bytes: Uint8Array | null = fromBase64Url(payload);
  if (!bytes) return { ok: false, problem: "damaged" };
  if (mode === "Z") {
    if (!canDeflate()) return { ok: false, problem: "too-new" };
    try {
      bytes = await pipe(bytes, new DecompressionStream("deflate-raw"));
    } catch {
      return { ok: false, problem: "damaged" };
    }
  }
  let snapshot: Snapshot | null = null;
  try {
    snapshot = fromJson(new TextDecoder().decode(bytes));
  } catch {
    snapshot = null;
  }
  return snapshot ? { ok: true, snapshot } : { ok: false, problem: "damaged" };
}

/** Today as "2026-09-27", in the device's own time zone. */
export function today(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** The link the QR code carries: this page, with the code after a "#" so the server never sees it. */
export function shareLink(origin: string, code: string): string {
  return `${origin}/move-progress#code=${code}`;
}
