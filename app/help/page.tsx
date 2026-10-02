import type { Metadata } from "next";
import Link from "next/link";
import { PageBody, PageHeader } from "@/components/page-header";
import { PromptBlock } from "@/components/prompt-block";
import { type HelpBlock, helpQuestions, helpSegments } from "@/lib/help";

export const metadata: Metadata = {
  title: "Help",
  description:
    "Short answers for learners: no laptop, a school device that blocks installs, can't sign up, limited data, lost progress, something broke, what a word means, and who to ask.",
};

// The questions and answers are in lib/help.ts, which the site search reads too.
export default function HelpPage() {
  return (
    <article>
      <PageHeader kicker="Help" title="Stuck? Start here.">
        <p>
          Short answers to the things that stop people most often. For the tools and accounts, see{" "}
          <Link href="/access">how hands-on access works</Link>.
        </p>
      </PageHeader>
      <PageBody className="gap-10 desktop:gap-14">
        <nav
          aria-label="Questions on this page"
          className="on-sky rounded-md border-2 border-line px-(--pad) py-3 shadow-h6 desktop:shadow-h8"
        >
          <ul className="m-0 flex list-none flex-col p-0">
            {helpQuestions.map((item) => (
              <li key={item.id} className="border-b-2 border-hairline last:border-b-0">
                <a
                  href={`#${item.id}`}
                  className="flex min-h-12 items-center py-1.5 font-serif text-[20px] leading-[1.25] font-semibold text-fg no-underline hover:underline desktop:text-[23px]"
                >
                  {item.question}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col border-b-2 border-line">
          {helpQuestions.map((item) => (
            <section
              key={item.id}
              id={item.id}
              aria-labelledby={`${item.id}-q`}
              className="flex scroll-mt-6 flex-col gap-3.5 border-t-2 border-line pt-6 pb-8"
            >
              <h2 id={`${item.id}-q`} className="t-h3 m-0">
                {item.question}
              </h2>
              <Answer blocks={item.answer} />
            </section>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/access" className="btn btn-primary">
            How hands-on access works
          </Link>
          <Link href="/glossary" className="btn btn-secondary">
            Glossary
          </Link>
        </div>
      </PageBody>
    </article>
  );
}

function Answer({ blocks }: { blocks: HelpBlock[] }) {
  return (
    <>
      {blocks.map((block, index) =>
        block.kind === "prompt" ? (
          <PromptBlock key={index} text={block.text} title={block.title} />
        ) : (
          <p key={index} className="m-0">
            {helpSegments(block.text).map((segment, i) =>
              !segment.href ? (
                segment.text
              ) : segment.href.startsWith("/") ? (
                <Link key={i} href={segment.href}>
                  {segment.text}
                </Link>
              ) : (
                <a key={i} href={segment.href}>
                  {segment.text}
                </a>
              ),
            )}
          </p>
        ),
      )}
    </>
  );
}
