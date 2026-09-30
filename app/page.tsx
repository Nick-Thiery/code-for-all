import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { CourseGrid } from "@/components/course-grid";
import { HomeHero } from "@/components/home-hero";
import { ProjectRows, Ticker, projectCount } from "@/components/home-projects";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { KIT_PAGES, getKit, kitHref, type KitPage } from "@/lib/facilitator";
import { numberWord } from "@/lib/format";
import { getOutline } from "@/lib/lessons";
import { practiceCopy } from "@/lib/site";

const kitPages: KitPage[] = ["script", "handout", "checklist"];

// The homepage, top to bottom (design/cover/SPEC.md): the cover, the ticker,
// What you'll make, How it works, Contents (the course grid) and Run it with
// your group. The footer is in the root layout.
export default async function HomePage() {
  const [outline, kit] = await Promise.all([getOutline(), getKit()]);
  const moduleCount = outline.phases.reduce((sum, phase) => sum + phase.modules.length, 0);
  const projects = projectCount(outline);

  return (
    <>
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
            <HowStep number={2} tone="on-marigold" title="Practise with instant feedback" delay={0.25}>
              {practiceCopy.howItWorks}
            </HowStep>
            <HowStep number={3} tone="on-surface" title="Build something real" delay={0.4}>
              Use an AI agent to build your own website, step by step.
            </HowStep>
          </Reveal>
        </div>
      </section>

      <section id="contents" aria-label="Course" className="on-navy scroll-mt-0 px-(--gut)">
        <div className="mx-auto max-w-[1200px] pt-16 pb-[70px] desktop:pt-[120px] desktop:pb-[130px]">
          <CourseGrid outline={outline} />
        </div>
      </section>

      <section
        aria-labelledby="run-title"
        className="on-marigold border-y-2 border-line px-(--gut) max-desktop:border-t-0"
      >
        <div className="mx-auto grid max-w-[1200px] gap-x-10 gap-y-[22px] pt-16 pb-[70px] desktop:grid-cols-12 desktop:items-start desktop:pt-[120px] desktop:pb-[130px]">
          <div className="flex flex-col gap-[22px] desktop:col-span-6 desktop:gap-[26px]">
            <span className="overline-serif">For teachers, volunteers and club leaders</span>
            <h2
              id="run-title"
              className="head m-0 leading-[.86]"
              style={{ fontSize: "clamp(60px, calc(60px + 58 * (100vw - 390px) / 1050), 118px)" }}
            >
              Run it with your group
            </h2>
            <p className="m-0 max-w-[520px] text-[17px] leading-[1.55] desktop:text-[20px]">
              Run Code for All with your own group. The script, handouts and checklist are free.
            </p>
            <Link href="/run-it" className="btn btn-ink mt-2 self-start max-desktop:hidden">
              Get the session kit <Icon name="arrow-right" size={22} stroke={2.6} />
            </Link>
          </div>
          <div className="flex flex-col desktop:col-span-5 desktop:col-start-8 desktop:pt-3">
            <dl className="m-0 mb-2 flex gap-[22px] border-b-2 border-line pt-2 pb-[22px] desktop:gap-12 desktop:pt-0 desktop:pb-7">
              <Stat value="13–16" label="year olds" />
              <Stat value={String(moduleCount)} label={`sessions, ${kit.sessionMinutes} minutes each`} />
              <Stat value="1" label="laptop per learner" />
            </dl>
            <ul className="m-0 flex list-none flex-col p-0">
              {kitPages.map((page) => (
                <li key={page} className="border-b-2 border-line">
                  <Link
                    href={kitHref(page)}
                    prefetch={false}
                    className="group flex items-center justify-between gap-4 py-4 text-fg no-underline hover:text-fg desktop:gap-5 desktop:py-5"
                  >
                    <span className="flex flex-col gap-1">
                      <span className="font-serif text-[24px] leading-[1.2] font-medium group-hover:underline group-hover:decoration-2 group-hover:underline-offset-[6px] desktop:text-[30px]">
                        {KIT_PAGES[page].title}
                      </span>
                      <span className="text-[15px] leading-[1.4] desktop:text-[16px]">{KIT_PAGES[page].description}</span>
                    </span>
                    <Icon name="arrow-right" size={26} stroke={2.4} />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/run-it" className="btn btn-ink mt-[30px] w-full desktop:hidden">
              Get the session kit <Icon name="arrow-right" size={22} stroke={2.6} />
            </Link>
          </div>
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-col-reverse justify-end gap-1.5">
      <dt className="max-w-[7.5em] text-[14px] leading-[1.35] desktop:max-w-[9em] desktop:text-[16px]">{label}</dt>
      <dd className="numeral m-0 text-[48px] leading-[.9] whitespace-nowrap text-accent [font-stretch:66%] desktop:text-[64px]">{value}</dd>
    </div>
  );
}
