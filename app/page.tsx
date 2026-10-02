import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ContentsRedirect } from "@/components/contents-redirect";
import { HomeHero } from "@/components/home-hero";
import { ProjectRows, Ticker, projectCount } from "@/components/home-projects";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { numberWord } from "@/lib/format";
import { getOutline } from "@/lib/lessons";
import { contentsHref } from "@/lib/outline";
import { practiceCopy } from "@/lib/site";

// The homepage, top to bottom (design/cover/SPEC.md): the cover, the ticker,
// What you'll make, How it works and a link to /contents (the course grid).
// The footer is in the root layout.
export default async function HomePage() {
  const outline = await getOutline();
  const moduleCount = outline.phases.reduce((sum, phase) => sum + phase.modules.length, 0);
  const projects = projectCount(outline);

  return (
    <>
      <ContentsRedirect />
      <HomeHero outline={outline} />
      <Ticker outline={outline} />

      <section id="inside" aria-labelledby="inside-title" className="scroll-mt-4 px-(--gut)">
        <div className="mx-auto flex max-w-[1200px] flex-col pt-16 pb-14 desktop:pt-[120px] desktop:pb-[110px]">
          <div className="flex flex-col gap-3.5 pb-[30px] desktop:flex-row desktop:items-end desktop:justify-between desktop:gap-10 desktop:pb-10">
            <div className="flex flex-col gap-2 desktop:gap-2.5">
              <span className="overline-serif">Inside this course</span>
              <h2 id="inside-title" className="t-hero m-0">
                What you&apos;ll make
              </h2>
            </div>
            <p className="m-0 max-w-[380px] text-[17px] leading-[1.5] text-muted desktop:pb-3 desktop:text-[19px]">
              Real projects from the course. Here are {numberWord(projects).toLowerCase()} of them.
            </p>
          </div>
          <ProjectRows outline={outline} />
        </div>
      </section>

      <section aria-labelledby="how" className="px-(--gut)">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-[26px] pt-2.5 pb-[70px] desktop:gap-11 desktop:pt-5 desktop:pb-[130px]">
          <h2 id="how" className="t-hero m-0">
            How it works
          </h2>
          <Reveal className="grid border-2 border-line shadow-h6 desktop:grid-cols-3 desktop:shadow-h10">
            <HowStep number={1} tone="on-sky" title="Read a short lesson" delay={0.1}>
              Each one takes 3 to 15 minutes, in plain English.
            </HowStep>
            <HowStep number={2} tone="on-marigold" title="Practice with instant feedback" delay={0.25}>
              {practiceCopy.howItWorks}
            </HowStep>
            <HowStep number={3} tone="on-surface" title="Build something real" delay={0.4}>
              Use an AI agent to build your own website, step by step.
            </HowStep>
          </Reveal>
          <Link href={contentsHref} className="btn btn-primary self-start">
            See all {moduleCount} modules <Icon name="arrow-right" size={22} stroke={2.6} />
          </Link>
        </div>
      </section>

    </>
  );
}

/** One of the three joined blocks: a big numeral, a Newsreader title and a line of text. */
function HowStep({
  number,
  tone,
  title,
  delay,
  children,
}: {
  number: number;
  tone: "on-sky" | "on-marigold" | "on-surface";
  title: string;
  delay: number;
  children: ReactNode;
}) {
  return (
    <div
      className={`${tone} r-rise flex items-start gap-[18px] border-line px-[22px] pt-6 pb-[26px] not-first:border-t-2 desktop:min-h-[400px] desktop:flex-col desktop:gap-3.5 desktop:px-[34px] desktop:pt-[34px] desktop:pb-[38px] desktop:not-first:border-t-0 desktop:not-first:border-l-2`}
      style={{ "--d": `${delay}s` } as CSSProperties}
    >
      <span aria-hidden="true" className="numeral w-[52px] flex-none text-[96px] text-accent desktop:w-auto desktop:text-[170px]">
        {number}
      </span>
      <div className="flex flex-col gap-2 desktop:mt-[18px] desktop:gap-3.5">
        <h3 className="m-0 font-serif text-[28px] leading-[1.05] font-medium desktop:text-[40px] desktop:leading-[1.02]">{title}</h3>
        <p className="m-0 text-[16px] leading-[1.5] desktop:text-[18px] desktop:leading-[1.55]">{children}</p>
      </div>
    </div>
  );
}
