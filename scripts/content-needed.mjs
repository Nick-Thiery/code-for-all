// Writes docs/content-needed.md: every <Placeholder> and <Screenshot> slot in
// the lessons, with its lesson and what's needed, plus the things outside the
// lessons that are still missing (listed in OTHER below). Placeholders render
// nothing on the production site (components/placeholder.tsx), so this file
// is the one place to see what's still needed.
//
//   npm run content-needed
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "content");
const out = path.join(root, "docs", "content-needed.md");

/** Missing content that isn't marked in a lesson file. Keep this list current. */
const OTHER = [
  {
    where: "/run-it (Run a session)",
    needed:
      "A slide deck for each session. The card was removed until one exists; the LaunchLab PDFs in source/slides/ must not be linked or published.",
  },
  {
    where: "Modules 9 and 10",
    needed:
      "Rishabh's approval of the draft lessons (docs/course-map.md, Modules 9 and 10), the Module 9 and 10 slide decks as PDFs in source/slides/ (the drafts use only docs/launchlab-curriculum-source.md), and the tutor's OK to be named on the closing quote in 10.4.",
  },
];

const folders = (await fs.readdir(contentDir))
  .filter((name) => /^module-\d+$/.test(name))
  .sort((a, b) => Number(a.slice(7)) - Number(b.slice(7)));

const rows = [];
for (const folder of folders) {
  const number = Number(folder.slice(7));
  const files = (await fs.readdir(path.join(contentDir, folder))).filter((name) => name.endsWith(".mdx"));
  const lessons = [];
  for (const name of files) {
    const source = await fs.readFile(path.join(contentDir, folder, name), "utf8");
    const { data } = matter(source);
    lessons.push({ file: `content/${folder}/${name}`, source, title: data.title, slug: data.slug, order: data.order });
  }
  lessons.sort((a, b) => a.order - b.order);
  lessons.forEach((lesson, index) => {
    const pattern = /<(Placeholder|Screenshot)\b([^>]*)>([\s\S]*?)<\/\1>/g;
    for (const match of lesson.source.matchAll(pattern)) {
      const line = lesson.source.slice(0, match.index).split("\n").length;
      const caption = /caption="([^"]*)"/.exec(match[2])?.[1];
      const body = match[3].replace(/\s+/g, " ").trim();
      rows.push({
        module: number,
        lesson: `${number}.${index + 1} ${lesson.title}`,
        href: `/${folder}/${lesson.slug}`,
        file: `${lesson.file}:${line}`,
        kind: match[1] === "Screenshot" ? "Screenshot" : "Placeholder",
        needed: match[1] === "Screenshot" ? `${body}.${caption ? ` Caption: ${caption}` : ""}` : body,
      });
    }
  });
}

const today = new Date().toISOString().slice(0, 10);
const lines = [
  "# Content still needed",
  "",
  `Generated on ${today} by \`npm run content-needed\`. Don't edit by hand: change the lesson, or the list in scripts/content-needed.mjs, and run it again.`,
  "",
  "Placeholders and screenshot slots show locally and on preview deployments. On the production site they render nothing, so learners never see an empty box. That makes this file the list of what's still missing.",
  "",
  "## In the lessons",
  "",
];
if (rows.length === 0) {
  lines.push("Nothing. Every lesson is complete.");
} else {
  lines.push("| Lesson | What's needed | Where |", "| --- | --- | --- |");
  for (const row of rows) {
    lines.push(`| [${row.lesson}](${row.href}) | ${row.kind}: ${row.needed.replace(/\|/g, "\\|")} | \`${row.file}\` |`);
  }
}
lines.push("", "## Elsewhere on the site", "");
for (const item of OTHER) lines.push(`- **${item.where}:** ${item.needed}`);
lines.push("");

await fs.writeFile(out, lines.join("\n"));
console.log(`Wrote docs/content-needed.md: ${rows.length} in the lessons, ${OTHER.length} elsewhere.`);
