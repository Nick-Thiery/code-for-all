import { createProcessor } from "@mdx-js/mdx";
import { cache } from "react";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { contentError } from "@/lib/content-error";
import { getModules, type Lesson } from "@/lib/lessons";

// The glossary is built from every <KeyTerm term="...">definition</KeyTerm>
// in the lessons, so adding a KeyTerm to a lesson adds it here too.

/** One definition of a term, and the lesson it comes from. */
export type GlossaryDefinition = {
  /** The definition as written in the lesson: MDX, compiled when shown. */
  source: string;
  lesson: Pick<Lesson, "id" | "module" | "title" | "href" | "file">;
};

export type GlossaryEntry = {
  /** Anchor on the glossary page, like "term-pull-request-pr". */
  id: string;
  /** As written in the first lesson that defines it. */
  term: string;
  /** One per lesson that defines the term, in course order. */
  definitions: GlossaryDefinition[];
};

export type GlossaryLetter = {
  /** "A" to "Z", or "#" for terms that start with anything else. */
  letter: string;
  entries: GlossaryEntry[];
};

// Just enough of the MDX syntax tree to find KeyTerms.
type Point = { offset?: number };
type Attribute = { type: string; name?: string; value?: unknown };
type Node = {
  type: string;
  name?: string | null;
  attributes?: Attribute[];
  children?: Node[];
  position?: { start: Point; end: Point };
};

const collator = new Intl.Collator("en-GB", { sensitivity: "base", numeric: true });

/** Every key term in the course, A to Z, grouped by first letter. */
export const getGlossary = cache(async (): Promise<GlossaryLetter[]> => {
  const modules = await getModules();
  // Parse only: the same plugins the lessons use, so the syntax matches.
  const processor = createProcessor({ remarkPlugins: [remarkFrontmatter, remarkGfm] });

  const byTerm = new Map<string, { term: string; definitions: GlossaryDefinition[] }>();
  for (const lesson of modules.flatMap((module) => module.lessons)) {
    let tree: Node;
    try {
      tree = processor.parse(lesson.source) as Node;
    } catch {
      // LessonBody reports a broken lesson with the details; skip it here.
      continue;
    }
    for (const { term, source } of findKeyTerms(tree, lesson)) {
      const key = term.toLocaleLowerCase("en-GB").replace(/\s+/g, " ");
      const entry = byTerm.get(key) ?? { term, definitions: [] };
      entry.definitions.push({
        source,
        lesson: { id: lesson.id, module: lesson.module, title: lesson.title, href: lesson.href, file: lesson.file },
      });
      byTerm.set(key, entry);
    }
  }

  const entries = [...byTerm.values()].sort((a, b) => collator.compare(a.term, b.term));
  const ids = new Set<string>();
  const letters: GlossaryLetter[] = [];
  for (const { term, definitions } of entries) {
    const letter = firstLetter(term);
    let group = letters.at(-1);
    if (group?.letter !== letter) {
      group = { letter, entries: [] };
      letters.push(group);
    }
    group.entries.push({ id: uniqueId(`term-${slugify(term)}`, ids), term, definitions });
  }
  // "#" (numbers, symbols) sorts first from the collator; keep it there.
  return letters;
});

function findKeyTerms(tree: Node, lesson: Lesson): { term: string; source: string }[] {
  const found: { term: string; source: string }[] = [];
  const visit = (node: Node) => {
    if ((node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") && node.name === "KeyTerm") {
      const term = termOf(node);
      if (!term) {
        throw contentError(lesson.file, [
          `A <KeyTerm> needs a term, written as text in quotes, like: <KeyTerm term="Token">`,
        ]);
      }
      const children = node.children ?? [];
      const start = children[0]?.position?.start.offset;
      const end = children.at(-1)?.position?.end.offset;
      const source = start !== undefined && end !== undefined ? lesson.source.slice(start, end).trim() : "";
      if (source) found.push({ term, source });
      return;
    }
    node.children?.forEach(visit);
  };
  visit(tree);
  return found;
}

function termOf(node: Node): string {
  const attribute = node.attributes?.find((a) => a.type === "mdxJsxAttribute" && a.name === "term");
  const value = attribute?.value;
  if (typeof value === "string") return value.trim();
  // term={"Token"}: accept a plain string expression too.
  if (value && typeof value === "object" && "value" in value && typeof value.value === "string") {
    const match = /^\s*(["'`])([\s\S]*)\1\s*$/.exec(value.value);
    if (match) return match[2].trim();
  }
  return "";
}

function firstLetter(term: string): string {
  const letter = term.normalize("NFD").charAt(0).toUpperCase();
  return /^[A-Z]$/.test(letter) ? letter : "#";
}

function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "term"
  );
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base;
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
  used.add(id);
  return id;
}
