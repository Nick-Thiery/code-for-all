import { createProcessor } from "@mdx-js/mdx";
import { cache } from "react";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { contentError } from "@/lib/content-error";
import { getModules, type Lesson } from "@/lib/lessons";

// The glossary is built from every <KeyTerm term="...">definition</KeyTerm>
// and every inline <Term def="...">word</Term> in the lessons, so a term
// defined anywhere in a lesson is in the glossary too. A <Term> without a
// def looks its definition up here (components/term-lookup.tsx).

/** One definition of a term, and the lesson it comes from. */
export type GlossaryDefinition = {
  /** The definition as written in the lesson: MDX, compiled when shown. */
  source: string;
  /** "key" for a <KeyTerm> box, "inline" for a <Term def> in running text. */
  kind: "key" | "inline";
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

// Just enough of the MDX syntax tree to find KeyTerms and Terms.
type Point = { offset?: number };
type Attribute = { type: string; name?: string; value?: unknown };
type Node = {
  type: string;
  name?: string | null;
  value?: string;
  attributes?: Attribute[];
  children?: Node[];
  position?: { start: Point; end: Point };
};

const collator = new Intl.Collator("en-GB", { sensitivity: "base", numeric: true });

/** "Pull request (PR)" and "pull  request (pr)" are the same term. */
export function termKey(term: string) {
  return term.toLocaleLowerCase("en-GB").replace(/\s+/g, " ").trim();
}

/** Every key term in the course, A to Z, grouped by first letter. */
export const getGlossary = cache(async (): Promise<GlossaryLetter[]> => {
  const modules = await getModules();
  // Parse only: the same plugins the lessons use, so the syntax matches.
  const processor = createProcessor({ remarkPlugins: [remarkFrontmatter, remarkGfm] });

  const byTerm = new Map<string, { term: string; definitions: GlossaryDefinition[] }>();
  const found: { term: string; source: string; kind: "key" | "inline"; lesson: Lesson }[] = [];
  for (const lesson of modules.flatMap((module) => module.lessons)) {
    let tree: Node;
    try {
      tree = processor.parse(lesson.source) as Node;
    } catch {
      // LessonBody reports a broken lesson with the details; skip it here.
      continue;
    }
    for (const term of findTerms(tree, lesson)) found.push({ ...term, lesson });
  }

  // KeyTerm boxes first: they're the fuller definitions. An inline <Term def>
  // only adds an entry for a word no KeyTerm defines, and only once per word,
  // so the same gloss repeated across lessons isn't listed several times.
  const add = ({ term, source, kind, lesson }: (typeof found)[number]) => {
    let key = termKey(term);
    if (kind === "inline") {
      // "pull request" belongs with the KeyTerm "Pull request (PR)".
      const short = SHORT_FORMS[key] ?? key;
      const match = [...byTerm.keys()].find((k) => k === short || k.replace(/\s*\(.*\)$/, "") === short);
      if (match) return;
      key = short;
      term = SHORT_FORMS[termKey(term)] ? short : term;
    }
    const entry = byTerm.get(key) ?? { term, definitions: [] };
    if (kind === "inline" && entry.definitions.length > 0) return;
    entry.definitions.push({
      source,
      kind,
      lesson: { id: lesson.id, module: lesson.module, title: lesson.title, href: lesson.href, file: lesson.file },
    });
    byTerm.set(key, entry);
  };
  found.filter((t) => t.kind === "key").forEach(add);
  found.filter((t) => t.kind === "inline").forEach(add);

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

/**
 * A glossary entry by its term, however it's capitalised, or null. "pull
 * request" finds "Pull request (PR)", and "repos" finds "Repository" through
 * the short forms below.
 */
export async function findGlossaryEntry(term: string): Promise<GlossaryEntry | null> {
  const key = termKey(SHORT_FORMS[termKey(term)] ?? term);
  for (const { entries } of await getGlossary()) {
    const entry = entries.find((e) => termKey(e.term) === key || termKey(e.term.replace(/\s*\(.*\)$/, "")) === key);
    if (entry) return entry;
  }
  return null;
}

/** Words lessons use for a glossary term, and the term they mean. */
const SHORT_FORMS: Record<string, string> = {
  repo: "repository",
  repos: "repository",
  repositories: "repository",
  prs: "pull request",
  "pull requests": "pull request",
  branches: "branch",
  commits: "commit",
  forks: "fork",
  tokens: "token",
  apis: "api",
  skills: "skill",
  agents: "agent",
  prompts: "prompt",
  "merge conflicts": "merge conflict",
};

/**
 * A definition as one line of plain text, for the tap-to-show popup: MDX
 * emphasis, links and code marks are stripped.
 */
export function plainDefinition(source: string): string {
  return source
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findTerms(tree: Node, lesson: Lesson): { term: string; source: string; kind: "key" | "inline" }[] {
  const found: { term: string; source: string; kind: "key" | "inline" }[] = [];
  const visit = (node: Node) => {
    const isJsx = node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
    if (isJsx && node.name === "KeyTerm") {
      const term = attributeText(node, "term");
      if (!term) {
        throw contentError(lesson.file, [
          `A <KeyTerm> needs a term, written as text in quotes, like: <KeyTerm term="Token">`,
        ]);
      }
      const children = node.children ?? [];
      const start = children[0]?.position?.start.offset;
      const end = children.at(-1)?.position?.end.offset;
      const source = start !== undefined && end !== undefined ? lesson.source.slice(start, end).trim() : "";
      if (source) found.push({ term, source, kind: "key" });
      return;
    }
    if (isJsx && node.name === "Term") {
      // <Term term="prompt" def="…">prompts</Term>: `term` names the glossary entry.
      const def = attributeText(node, "def");
      const word = attributeText(node, "term") || textOf(node).replace(/\s+/g, " ").trim();
      if (def && word) found.push({ term: word, source: def, kind: "inline" });
      return;
    }
    node.children?.forEach(visit);
  };
  visit(tree);
  return found;
}

function attributeText(node: Node, name: string): string {
  const attribute = node.attributes?.find((a) => a.type === "mdxJsxAttribute" && a.name === name);
  const value = attribute?.value;
  if (typeof value === "string") return value.trim();
  // term={"Token"}: accept a plain string expression too.
  if (value && typeof value === "object" && "value" in value && typeof value.value === "string") {
    const match = /^\s*(["'`])([\s\S]*)\1\s*$/.exec(value.value);
    if (match) return match[2].trim();
  }
  return "";
}

function textOf(node: Node): string {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
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
