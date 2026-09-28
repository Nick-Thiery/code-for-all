import type { ReactNode } from "react";
import { Term } from "@/components/term";
import { findGlossaryEntry, plainDefinition } from "@/lib/glossary";

/**
 * The <Term> lessons use. A Term with a `def` shows that definition; a Term
 * without one shows the glossary's definition of the word, so a key term can
 * be tapped where it's first used in any lesson. Both link to the glossary
 * entry when there is one. Runs on the server, where the glossary is.
 */
export async function TermLookup({
  def,
  term,
  children,
}: {
  def?: string;
  /** The glossary term, when the word shown differs from it: <Term term="repository">repos</Term>. */
  term?: string;
  children: ReactNode;
}) {
  const word = term ?? (typeof children === "string" ? children : childrenText(children));
  const entry = await findGlossaryEntry(word);
  const href = entry ? `/glossary#${entry.id}` : undefined;
  if (def) return <Term def={def} href={href}>{children}</Term>;
  if (!entry) {
    throw new Error(
      `<Term>${word}</Term> has no definition. Add def="…" to it, or a <KeyTerm term="${word}"> in a lesson so the glossary defines it.`,
    );
  }
  return (
    <Term def={plainDefinition(entry.definitions[0].source)} href={href}>
      {children}
    </Term>
  );
}

function childrenText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(childrenText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return childrenText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}
