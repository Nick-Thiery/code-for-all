import type { Metadata } from "next";
import Link from "next/link";
import { GlossaryDefinition } from "@/components/glossary-definition";
import { Hex } from "@/components/hex";
import { getGlossary, type GlossaryDefinition as Definition } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Every key term from the Code for All lessons, A to Z, with what it means and the lesson that explains it.",
};

// Built from the <KeyTerm>s in the lessons: see lib/glossary.ts.
export default async function GlossaryPage() {
  const letters = await getGlossary();
  const count = letters.reduce((sum, group) => sum + group.entries.length, 0);

  return (
    <div className="px-(--gut)">
      <article className="mx-auto flex max-w-[720px] flex-col gap-8 pt-(--hy) pb-12 tablet:pb-(--sec)">
        <header className="flex flex-col gap-3.5">
          <span className="eyebrow">Glossary</span>
          <h1 className="t-h1 m-0">Key terms, A to Z</h1>
          <p className="t-lead m-0">
            {count === 1 ? "The key term" : `All ${count} key terms`} from the lessons, what each one means, and the
            lesson that explains it.
          </p>
        </header>

        {letters.length > 0 && (
          <nav aria-label="Jump to a letter">
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
              {letters.map(({ letter }) => (
                <li key={letter}>
                  <a
                    href={`#${letterId(letter)}`}
                    className="group relative flex h-12 w-11 items-center justify-center text-accent no-underline hover:text-on-accent"
                  >
                    <Hex
                      width={44}
                      height={48}
                      shape="fill-tint stroke-accent stroke-[1.2] group-hover:fill-accent"
                      className="absolute inset-0"
                    />
                    <span className="display relative text-[19px] leading-none font-bold">{letter}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {letters.map(({ letter, entries }) => (
          <section
            key={letter}
            id={letterId(letter)}
            aria-labelledby={`${letterId(letter)}-heading`}
            className="flex scroll-mt-6 flex-col gap-6"
          >
            <h2 id={`${letterId(letter)}-heading`} className="t-h2 m-0 border-b-4 border-border pb-2">
              <span className="sr-only">Letter </span>
              {letter}
            </h2>
            {entries.map((entry) => (
              <div key={entry.id} id={entry.id} className="flex scroll-mt-6 flex-col gap-2.5">
                <h3 className="display m-0 text-[22px] leading-[1.3] font-bold text-accent">{entry.term}</h3>
                {entry.definitions.length === 1 ? (
                  <SourcedDefinition definition={entry.definitions[0]} />
                ) : (
                  <ol className="m-0 flex list-none flex-col gap-4 p-0">
                    {entry.definitions.map((definition) => (
                      <li key={definition.lesson.id} className="border-l-4 border-track pl-4">
                        <SourcedDefinition definition={definition} />
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}

function SourcedDefinition({ definition }: { definition: Definition }) {
  const { lesson } = definition;
  return (
    <div className="flex flex-col gap-1.5">
      <GlossaryDefinition definition={definition} />
      <p className="t-meta m-0 text-muted">
        From <Link href={lesson.href}>{`Module ${lesson.module} · ${lesson.title}`}</Link>
      </p>
    </div>
  );
}

function letterId(letter: string) {
  return letter === "#" ? "letter-other" : `letter-${letter.toLowerCase()}`;
}
