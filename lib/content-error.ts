/** The build's plain-English error for a content file: which file, then each problem on its own line. */
export function contentError(file: string, problems: string[]) {
  return new Error(`There's a problem with ${file}:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
}
