// Site search, in the browser: matching what someone types against the index
// the build writes (lib/search-index.ts, served as /search-index.json).
// Nothing typed leaves the page: the index is fetched whole and searched here.
//
// Capitals, accents, apostrophes and hyphens don't matter ("dont" finds
// "don't", "resume" finds "résumé", "signup" and "sign up" both find
// "sign-up"). Every word typed must match the start of a word somewhere in a
// result. A word found in the title counts most, then the meta line ("Module
// 7 · Lesson 6"), then the summary or definition.

export type SearchItem = {
  title: string;
  /** "Module 7 · Lesson 6"; empty for glossary terms and Help questions. */
  meta: string;
  /** The lesson's summary, a glossary definition or the start of a Help answer. */
  text: string;
  href: string;
};

/** A SearchItem as /search-index.json has it: short keys, empty ones left out, to keep the file small. */
export type IndexEntry = { t: string; m?: string; s?: string; h: string };

export type SearchGroupKey = "lessons" | "quizzes" | "glossary" | "help";

export type SearchIndex = Record<SearchGroupKey, IndexEntry[]>;

export function toEntry({ title, meta, text, href }: SearchItem): IndexEntry {
  return { t: title, ...(meta && { m: meta }), ...(text && { s: text }), h: href };
}

function fromEntry({ t, m = "", s = "", h }: IndexEntry): SearchItem {
  return { title: t, meta: m, text: s, href: h };
}

/** Groups in the order they're shown, each with how many results it shows. */
export const SEARCH_GROUPS: { key: SearchGroupKey; label: string; limit: number }[] = [
  { key: "lessons", label: "Lessons", limit: 6 },
  { key: "quizzes", label: "Quizzes", limit: 3 },
  { key: "glossary", label: "Glossary", limit: 4 },
  { key: "help", label: "Help", limit: 3 },
];

/** A stretch of a field to mark as matched: [start, end) in the original text. */
export type Range = [number, number];

export type SearchHit = {
  item: SearchItem;
  marks: { title: Range[]; meta: Range[]; text: Range[] };
};

export type SearchGroup = { key: SearchGroupKey; label: string; hits: SearchHit[]; total: number };

const APOSTROPHE = /['‘’ʼ]/;
const HYPHEN = /[-‐‑‒–]/;
const WORD_CHAR = /[\p{L}\p{N}]/u;

/**
 * Text folded for matching: lower case, accents off, apostrophes and hyphens
 * dropped. `map` gives each folded character's index in the original, and
 * `starts` every position where a word starts, including just after a hyphen.
 */
type Folded = { text: string; map: number[]; starts: Set<number> };

function fold(original: string): Folded {
  let text = "";
  const map: number[] = [];
  const starts = new Set<number>();
  let afterHyphen = false;
  for (let i = 0; i < original.length; i++) {
    const char = original[i];
    if (APOSTROPHE.test(char)) continue;
    if (HYPHEN.test(char)) {
      afterHyphen = true;
      continue;
    }
    const plain = char.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("en-GB");
    for (const c of plain) {
      const isWord = WORD_CHAR.test(c);
      if (isWord && (afterHyphen || !WORD_CHAR.test(text.at(-1) ?? " "))) starts.add(text.length);
      text += c;
      map.push(i);
    }
    afterHyphen = false;
  }
  return { text, map, starts };
}

/** The words of a query, folded: "Don't  sign-UP" -> ["dont", "signup"]. */
export function queryWords(query: string): string[] {
  return [...new Set(fold(query).text.split(/[^\p{L}\p{N}]+/u).filter(Boolean))];
}

/** Where each word matches the start of a word in `field`, as ranges of the original. */
function matchRanges(field: Folded, words: string[]): { found: Set<string>; ranges: Range[] } {
  const found = new Set<string>();
  const ranges: Range[] = [];
  for (const word of words) {
    let at = field.text.indexOf(word);
    while (at !== -1) {
      if (field.starts.has(at)) {
        found.add(word);
        ranges.push([field.map[at], field.map[at + word.length - 1] + 1]);
      }
      at = field.text.indexOf(word, at + 1);
    }
  }
  return { found, ranges: merge(ranges) };
}

function merge(ranges: Range[]): Range[] {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out: Range[] = [];
  for (const range of sorted) {
    const last = out.at(-1);
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else out.push([...range]);
  }
  return out;
}

/** A field's weight: a word in the title counts most. */
const WEIGHT = { title: 3, meta: 2, text: 1 } as const;

type Prepared = { item: SearchItem; title: Folded; meta: Folded; text: Folded };

/** Fold every field once, so each keystroke only has to match. */
export function prepareIndex(index: SearchIndex): Record<SearchGroupKey, Prepared[]> {
  const prep = (entries: IndexEntry[]) =>
    entries.map(fromEntry).map((item) => ({ item, title: fold(item.title), meta: fold(item.meta), text: fold(item.text) }));
  return { lessons: prep(index.lessons), quizzes: prep(index.quizzes), glossary: prep(index.glossary), help: prep(index.help) };
}

/**
 * Every group's matches, best first, cut to the group's limit (`total` says
 * how many there were). Ties keep course order. Empty when nothing is typed.
 */
export function search(prepared: Record<SearchGroupKey, Prepared[]>, query: string): SearchGroup[] {
  const words = queryWords(query);
  if (words.length === 0) return [];
  return SEARCH_GROUPS.map(({ key, label, limit }) => {
    const scored: { hit: SearchHit; score: number; order: number }[] = [];
    prepared[key].forEach((entry, order) => {
      const title = matchRanges(entry.title, words);
      const meta = matchRanges(entry.meta, words);
      const text = matchRanges(entry.text, words);
      let score = 0;
      for (const word of words) {
        const best = title.found.has(word)
          ? WEIGHT.title
          : meta.found.has(word)
            ? WEIGHT.meta
            : text.found.has(word)
              ? WEIGHT.text
              : 0;
        if (best === 0) return;
        score += best;
      }
      scored.push({ hit: { item: entry.item, marks: { title: title.ranges, meta: meta.ranges, text: text.ranges } }, score, order });
    });
    scored.sort((a, b) => b.score - a.score || a.order - b.order);
    return { key, label, total: scored.length, hits: scored.slice(0, limit).map((s) => s.hit) };
  }).filter((group) => group.total > 0);
}

/** Split text into plain and marked pieces, for rendering with <mark>. */
export function markPieces(text: string, ranges: Range[]): { text: string; marked: boolean }[] {
  const pieces: { text: string; marked: boolean }[] = [];
  let last = 0;
  for (const [start, end] of ranges) {
    if (start > last) pieces.push({ text: text.slice(last, start), marked: false });
    pieces.push({ text: text.slice(start, end), marked: true });
    last = end;
  }
  if (last < text.length) pieces.push({ text: text.slice(last), marked: false });
  return pieces;
}
