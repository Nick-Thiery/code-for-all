import { KIT_PAGES, getKit, kitHref, type KitPage } from "@/lib/facilitator";
import { getGlossary, plainDefinition } from "@/lib/glossary";
import { helpAnswerText, helpQuestions } from "@/lib/help";
import { getModules, getOutline, getPhases } from "@/lib/lessons";
import { moduleHref } from "@/lib/outline";
import { type SearchIndex, type SearchItem, clip, toEntry } from "@/lib/search";
import { ACCESS_SECTIONS, PAGES, type PageInfo, RUN_IT_SECTIONS, runItFacts } from "@/lib/site-pages";

// What the site search looks through, written once at build time as
// /search-index.json (app/search-index.json/route.ts) and fetched by the
// browser the first time someone opens search. Only titles and short lines,
// never lesson text, so it stays small: every lesson, quiz and Check your
// skills page, the Coming soon pages, the glossary, the Help questions with
// their answers' text, and the site's own pages and their main sections (from
// lib/site-pages.ts, which the pages read too).

const range = (after: number) => (after === 1 ? "Module 1" : `Modules 1 to ${after}`);

export async function getSearchIndex(): Promise<SearchIndex> {
  const [outline, modules, phases, glossary, kit] = await Promise.all([
    getOutline(),
    getModules(),
    getPhases(),
    getGlossary(),
    getKit(),
  ]);
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
  // The whole answer, so a word only in it still finds the question; the
  // dialog shows its start, or a snippet around the match (lib/search.ts).
  const help: SearchItem[] = helpQuestions.map((question) => ({
    title: question.question,
    meta: "",
    text: helpAnswerText(question),
    href: `/help#${question.id}`,
  }));

  // The site's own pages, and their sections, kit pages included, under the
  // page they're on. Not every module's kit sheet: the three kit pages cover them.
  const page = ({ href, title, description }: PageInfo, meta = ""): SearchItem => ({
    title,
    meta,
    text: clip(description),
    href,
  });
  const facts = runItFacts(kit, outline);
  const pages: SearchItem[] = [
    page(PAGES.about),
    page(PAGES.access),
    ...Object.values(ACCESS_SECTIONS).map((section) =>
      page({ ...section, href: `${PAGES.access.href}#${section.id}` }, PAGES.access.title),
    ),
    page(PAGES.runIt),
    ...Object.values(RUN_IT_SECTIONS).flatMap((section) => [
      page({ ...section, description: section.description(facts), href: `${PAGES.runIt.href}#${section.id}` }, PAGES.runIt.title),
      // The kit's pages come straight after the kit.
      ...(section === RUN_IT_SECTIONS.kit
        ? (Object.keys(KIT_PAGES) as KitPage[]).map((kitPage) =>
            page({ ...KIT_PAGES[kitPage], href: kitHref(kitPage) }, PAGES.runIt.title),
          )
        : []),
    ]),
    page(PAGES.moveProgress),
    page(PAGES.privacy),
    page(PAGES.quizzes),
    page(PAGES.glossary),
    page(PAGES.contents),
  ];

  return {
    lessons: lessons.map(toEntry),
    quizzes: quizzes.map(toEntry),
    glossary: glossaryItems.map(toEntry),
    help: help.map(toEntry),
    pages: pages.map(toEntry),
  };
}
