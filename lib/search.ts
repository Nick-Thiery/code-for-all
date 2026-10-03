// Site search, in the browser: matching what someone types against the index
// the build writes (lib/search-index.ts, served as /search-index.json).
// Nothing typed leaves the page: the index is fetched whole and searched here.
//
// Capitals, accents, apostrophes and hyphens don't matter ("dont" finds
// "don't", "resume" finds "résumé", "signup" and "sign up" both find
// "sign-up"), and a plural finds the singular ("devices" finds "device").
// Every word typed must match the start of a word somewhere in a result. A
// word found in the title counts most, then the meta line ("Module 7 · Lesson
// 6"), then the summary, definition or Help answer.

export type SearchItem = {
  title: string;
  /** "Module 7 · Lesson 6", or the page a section is on; empty for glossary terms, Help questions and pages. */
  meta: string;
  /** The lesson's summary, a glossary definition, a whole Help answer or a page's one line. */
  text: string;
  href: string;
};

/** A SearchItem as /search-index.json has it: short keys, empty ones left out, to keep the file small. */
export type IndexEntry = { t: string; m?: string; s?: string; h: string };

export type SearchGroupKey = "lessons" | "quizzes" | "glossary" | "help" | "pages";

export type SearchIndex = Record<SearchGroupKey, IndexEntry[]>;

export function toEntry({ title, meta, text, href }: SearchItem): IndexEntry {
  return { t: title, ...(meta && { m: meta }), ...(text && { s: text }), h: href };
}

function fromEntry({ t, m = "", s = "", h }: IndexEntry): SearchItem {
  return { title: t, meta: m, text: s, href: h };
}

/**
 * Groups in the order they're shown, each with how many results it shows.
 * `snippets`: the text is long (a whole Help answer), so a result shows its
 * start, or a snippet around the first match when only the text matched.
 */
export const SEARCH_GROUPS: { key: SearchGroupKey; label: string; limit: number; snippets?: boolean }[] = [
  { key: "lessons", label: "Lessons", limit: 6 },
  { key: "quizzes", label: "Quizzes", limit: 3 },
  { key: "glossary", label: "Glossary", limit: 4 },
  { key: "help", label: "Help", limit: 3, snippets: true },
  { key: "pages", label: "Pages", limit: 4 },
];

/** A stretch of a field to mark as matched: [start, end) in the original text. */
export type Range = [number, number];

export type SearchHit = {
  item: SearchItem;
  /** The text to show under the title: the item's text, or a snippet of it. `marks.text` is in this. */
  text: string;
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

/** A word and, for a plural, its singular: "devices" -> ["devices", "device"]. */
function forms(word: string): string[] {
  return word.length > 3 && word.endsWith("s") && !word.endsWith("ss") ? [word, word.slice(0, -1)] : [word];
}

/** Where each word matches the start of a word in `field`, as ranges of the original. */
function matchRanges(field: Folded, words: string[]): { found: Set<string>; ranges: Range[] } {
  const found = new Set<string>();
  const ranges: Range[] = [];
  for (const word of words) {
    for (const form of forms(word)) {
      let at = field.text.indexOf(form);
      while (at !== -1) {
        if (field.starts.has(at)) {
          found.add(word);
          ranges.push([field.map[at], field.map[at + form.length - 1] + 1]);
        }
        at = field.text.indexOf(form, at + 1);
      }
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

/**
 * Fold every field once, so each keystroke only has to match. A group the
 * index doesn't have (one kept offline from before the group existed) is empty.
 */
export function prepareIndex(index: SearchIndex): Record<SearchGroupKey, Prepared[]> {
  const prep = (entries: IndexEntry[] = []) =>
    entries.map(fromEntry).map((item) => ({ item, title: fold(item.title), meta: fold(item.meta), text: fold(item.text) }));
  return Object.fromEntries(SEARCH_GROUPS.map(({ key }) => [key, prep(index[key])])) as Record<SearchGroupKey, Prepared[]>;
}

/** How long a long text's start, or a snippet of it, can be in a result. */
const SHOWN = 140;
const SNIPPET = 120;

/** Cut text at a word, near `max` characters, with an ellipsis. */
export function clip(text: string, max = SHOWN): string {
  return excerpt(text, [], 0, max).text;
}

/**
 * `text` from `from` (the start of a word), cut at a word near `max`
 * characters, with an ellipsis at either end that was cut. `ranges` move with
 * it, and any outside it are dropped.
 */
function excerpt(text: string, ranges: Range[], from: number, max: number): { text: string; ranges: Range[] } {
  let end = text.length;
  if (end - from > max) {
    const space = text.lastIndexOf(" ", from + max);
    end = space > from + max * 0.6 ? space : from + max;
    while (end > from && /[\s,;:.]/.test(text[end - 1])) end--;
  }
  const lead = from > 0 ? "…" : "";
  const shift = lead.length - from;
  return {
    text: `${lead}${text.slice(from, end)}${end < text.length ? "…" : ""}`,
    ranges: ranges
      .filter(([start, stop]) => start >= from && stop <= end)
      .map(([start, stop]): Range => [start + shift, stop + shift]),
  };
}

/**
 * About SNIPPET characters of `text` around its first match: from the start
 * when the match is near it, else from the start of the match's sentence, or
 * a few words before the match.
 */
function snippet(text: string, ranges: Range[]): { text: string; ranges: Range[] } {
  const first = ranges[0][0];
  if (first < 50) return excerpt(text, ranges, 0, SNIPPET);
  const sentence = text.lastIndexOf(". ", first);
  let from: number;
  if (sentence !== -1 && first - sentence <= 50) from = sentence + 2;
  else {
    const space = text.indexOf(" ", first - 30);
    from = space !== -1 && space < first ? space + 1 : first;
  }
  return excerpt(text, ranges, from, SNIPPET);
}

/**
 * Every group's matches, best first, cut to the group's limit (`total` says
 * how many there were). Ties keep course order. Empty when nothing is typed.
 */
export function search(prepared: Record<SearchGroupKey, Prepared[]>, query: string): SearchGroup[] {
  const words = queryWords(query);
  if (words.length === 0) return [];
  return SEARCH_GROUPS.map(({ key, label, limit, snippets }) => {
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
      const shown = !snippets
        ? { text: entry.item.text, ranges: text.ranges }
        : text.ranges.length > 0 && title.ranges.length === 0
          ? snippet(entry.item.text, text.ranges)
          : excerpt(entry.item.text, text.ranges, 0, SHOWN);
      scored.push({
        hit: { item: entry.item, text: shown.text, marks: { title: title.ranges, meta: meta.ranges, text: shown.ranges } },
        score,
        order,
      });
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
