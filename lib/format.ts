/** (1, "lesson") -> "1 lesson", (3, "lesson") -> "3 lessons" */
export function formatCount(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/** 15 -> "15 minutes", 90 -> "1 hour 30 minutes" */
export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes % 60);
  if (hours === 0) return formatCount(rest, "minute");
  if (rest === 0) return formatCount(hours, "hour");
  return `${formatCount(hours, "hour")} ${formatCount(rest, "minute")}`;
}

/** A rough total for the track: 18 -> "about 20 minutes", 59 -> "about an hour", 100 -> "about 1.5 hours" */
export function formatAbout(minutes: number) {
  if (minutes < 50) return `about ${formatCount(Math.max(5, Math.round(minutes / 5) * 5), "minute")}`;
  const hours = Math.round(minutes / 30) / 2;
  return hours === 1 ? "about an hour" : `about ${hours} hours`;
}

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

/** 10 -> "Ten", 3 -> "Three"; numbers past twelve stay as digits. */
export function numberWord(n: number) {
  return NUMBER_WORDS[n] ?? String(n);
}

// How wide each capital is in the headline face (Archivo 800 at 66% wide),
// in ems. Measured in the browser; anything not listed counts as 0.5.
const GLYPH_EM: Record<string, number> = {
  A: 0.52, B: 0.51, C: 0.53, D: 0.52, E: 0.47, F: 0.42, G: 0.56, H: 0.53, I: 0.25, J: 0.44, K: 0.52, L: 0.43, M: 0.7,
  N: 0.53, O: 0.57, P: 0.49, Q: 0.57, R: 0.52, S: 0.47, T: 0.48, U: 0.52, V: 0.49, W: 0.73, X: 0.51, Y: 0.5, Z: 0.48,
  "0": 0.44, "1": 0.38, "2": 0.43, "3": 0.44, "4": 0.43, "5": 0.44, "6": 0.44, "7": 0.39, "8": 0.43, "9": 0.44,
  ".": 0.22, ",": 0.22, ":": 0.23, "?": 0.43, "!": 0.26, "'": 0.2, '"': 0.37, "-": 0.24, "+": 0.52, "(": 0.36, ")": 0.36,
  "&": 0.56,
};
const SPACE_EM = 0.12;

/**
 * Which of a list of font sizes fits: the first (biggest) at which `text`,
 * set in headline capitals and wrapped word by word, takes `maxLines` lines or
 * fewer in a column `room` pixels wide, with no word wider than the column.
 * Returns its index, or the last one if none fits.
 */
export function fitStep(text: string, sizes: readonly number[], room: number, maxLines: number): number {
  const words = text
    .toUpperCase()
    .split(/\s+/)
    .map((word) => [...word].reduce((sum, letter) => sum + (GLYPH_EM[letter] ?? 0.5), 0));
  for (const [index, size] of sizes.entries()) {
    const ems = (room / size) * 0.97;
    let lines = 1;
    let line = 0;
    for (const word of words) {
      if (line > 0 && line + SPACE_EM + word > ems) {
        lines += 1;
        line = word;
      } else line += (line > 0 ? SPACE_EM : 0) + word;
    }
    if (lines <= maxLines && Math.max(...words) <= ems) return index;
  }
  return sizes.length - 1;
}

/** The narrowest column a headline has to fit: a 360px phone, less its gutters. */
const NARROWEST = 320;

// The phone font size of each size step. The classes themselves are in
// app/globals.css and grow with the viewport from these sizes, so what fits
// the narrowest phone fits everything wider. Keep the two in step.
const TITLE_SIZES = [72, 60, 50, 42, 36];
const HEADING_SIZES = [60, 50, 42, 36];

/** The size step of a page or lesson title (.title-1 to .title-5): it never runs past three lines. */
export function titleSize(title: string) {
  return `title-${fitStep(title, TITLE_SIZES, NARROWEST, 3) + 1}`;
}

/** The size step of a lesson's `##` heading (.heading-1 to .heading-4), so a long word never runs off a phone. */
export function headingSize(heading: string) {
  return `heading-${fitStep(heading, HEADING_SIZES, NARROWEST, 4) + 1}`;
}
