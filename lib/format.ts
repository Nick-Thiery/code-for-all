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
