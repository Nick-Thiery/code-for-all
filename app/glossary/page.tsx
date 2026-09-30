import type { Metadata } from "next";
import Link from "next/link";
import { GlossaryDefinition } from "@/components/glossary-definition";
import { PageBody, PageHeader } from "@/components/page-header";
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
    <article>
      <PageHeader kicker="Glossary" title="Key terms, A to Z">
        <p>
          {count === 1 ? "The key term" : `All ${count} key terms`} from the lessons, what each one means, and the
          lesson that explains it.
        </p>
      </PageHeader>
      <PageBody className="gap-10 desktop:gap-14">
        {letters.length > 0 && (
          <nav aria-label="Jump to a letter">
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {letters.map(({ letter }) => (
                <li key={letter}>
                  <a
                    href={`#${letterId(letter)}`}
                    className="box-border grid size-11 place-items-center rounded border-2 border-line bg-surface font-display text-[19px] leading-none font-extrabold text-ink no-underline [font-stretch:85%] hover:bg-marigold hover:text-on-marigold"
                  >
                    {letter}
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
            className="rail-block flex scroll-mt-6 flex-col"
          >
            {/* The letter hangs in the rail from 1280px, like a step number. */}
            <h2
              id={`${letterId(letter)}-heading`}
              className="numeral m-0 border-t-2 border-line pt-3 pb-2 text-[80px] text-accent wide:absolute wide:top-0 wide:left-[-206px] wide:w-[166px] wide:border-t-0 wide:pt-5 wide:text-right wide:text-[128px]"
            >
              <span className="sr-only">Letter </span>
              {letter}
            </h2>
            {entries.map((entry) => (
              <div key={entry.id} id={entry.id} className="flex scroll-mt-6 flex-col gap-2.5 border-t-2 border-line pt-5 pb-7">
                <h3 className="m-0 font-serif text-[30px] leading-none font-semibold italic desktop:text-[34px]">{entry.term}</h3>
                {entry.definitions.length === 1 ? (
                  <SourcedDefinition definition={entry.definitions[0]} />
                ) : (
                  <ol className="m-0 flex list-none flex-col gap-4 p-0">
                    {entry.definitions.map((definition) => (
                      <li key={definition.lesson.id} className="border-l-2 border-line pl-4">
                        <SourcedDefinition definition={definition} />
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </section>
        ))}
      </PageBody>
    </article>
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
