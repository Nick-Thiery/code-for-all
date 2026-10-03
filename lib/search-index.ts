import { getGlossary, plainDefinition } from "@/lib/glossary";
import { helpQuestions, helpSummary } from "@/lib/help";
import { getModules, getOutline, getPhases } from "@/lib/lessons";
import { moduleHref } from "@/lib/outline";
import { type SearchIndex, type SearchItem, toEntry } from "@/lib/search";

// What the site search looks through, written once at build time as
// /search-index.json (app/search-index.json/route.ts) and fetched by the
// browser the first time someone opens search. Only titles and short lines,
// never lesson text, so it stays small: every lesson, quiz and Check your
// skills page, the Coming soon pages, the glossary and the Help questions.

/** How long a glossary definition or Help answer can be in the index. */
const CLIP = 140;

/** Cut text at a word, near `max` characters, with an ellipsis. */
export function clip(text: string, max = CLIP): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max + 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut.slice(0, max)).replace(/[\s,;:.]+$/, "")}…`;
}

const range = (after: number) => (after === 1 ? "Module 1" : `Modules 1 to ${after}`);

export async function getSearchIndex(): Promise<SearchIndex> {
  const [outline, modules, phases, glossary] = await Promise.all([getOutline(), getModules(), getPhases(), getGlossary()]);
  const summaries = new Map(modules.flatMap((mod) => mod.lessons.map((lesson) => [lesson.id, lesson.summary])));

  const lessons: SearchItem[] = outline.modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({
      title: lesson.title,
      meta: `Module ${mod.number} · Lesson ${lesson.number}`,
      text: summaries.get(lesson.id) ?? "",
      href: lesson.href,
    })),
  );
  // Modules that aren't out yet: their Coming soon page, not their planned lessons.
  const released = new Set(outline.modules.map((mod) => mod.number));
  for (const mod of phases.flatMap((phase) => phase.modules)) {
    if (released.has(mod.number)) continue;
    lessons.push({ title: mod.title, meta: `Module ${mod.number} · Coming soon`, text: mod.summary, href: moduleHref(mod.number) });
  }

  const quizzes: SearchItem[] = outline.modules.flatMap((mod) => [
    ...(mod.quiz
      ? [
          {
            title: `Module ${mod.number} quiz`,
            meta: `Module ${mod.number} · ${mod.title}`,
            text: `${mod.quiz.questions} questions on this module's lessons.`,
            href: mod.quiz.href,
          },
        ]
      : []),
    ...(mod.skillsCheck
      ? [
          {
            title: `Check your skills: ${range(mod.number)}`,
            meta: `After Module ${mod.number} · ${mod.title}`,
            text: "A mixed quiz and a checklist for your final project.",
            href: mod.skillsCheck.href,
          },
        ]
      : []),
  ]);

  const glossaryItems: SearchItem[] = glossary.flatMap(({ entries }) =>
    entries.map((entry) => ({
      title: entry.term,
      meta: "",
      text: clip(plainDefinition(entry.definitions[0].source)),
      href: `/glossary#${entry.id}`,
    })),
  );
  const help: SearchItem[] = helpQuestions.map((question) => ({
    title: question.question,
    meta: "",
    text: clip(helpSummary(question)),
    href: `/help#${question.id}`,
  }));

  return {
    lessons: lessons.map(toEntry),
    quizzes: quizzes.map(toEntry),
    glossary: glossaryItems.map(toEntry),
    help: help.map(toEntry),
  };
}
