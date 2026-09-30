import Link from "next/link";
import { CourseGrid } from "@/components/course-grid";
import { HeroGallery } from "@/components/hero-gallery";
import { HomeHero } from "@/components/home-hero";
import { getOutline } from "@/lib/lessons";
import { practiceCopy } from "@/lib/site";

export default async function HomePage() {
  const outline = await getOutline();

  return (
    <>
      <section className="px-(--gut)">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-14 gap-y-6 pt-(--hy) pb-6 tablet:gap-y-10 tablet:pb-(--hy)">
          <HomeHero outline={outline} />
          <HeroGallery />
        </div>
      </section>

      {/* Three numbered steps. On phones each is one row: number, title, one line. */}
      <section aria-labelledby="how" className="bg-surface2 px-(--gut)">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-5 py-8 tablet:gap-10 tablet:py-(--sec)">
          <h2 id="how" className="t-h2 m-0">
            How it works
          </h2>
          <ol className="m-0 grid list-none gap-y-5 p-0 tablet:grid-cols-3 tablet:gap-x-10">
            <HowStep
              number={1}
              title="Read a short lesson"
              text="Each one takes 3 to 15 minutes, in plain English."
              shortText="3 to 15 minutes, in plain English."
            />
            <HowStep
              number={2}
              title="Practise with instant feedback"
              text={practiceCopy.howItWorks}
              shortText={practiceCopy.howItWorksShort}
            />
            <HowStep
              number={3}
              title="Build something real"
              text="Use an AI agent to build your own website, step by step."
              shortText="Your own website, built with an AI agent."
            />
          </ol>
        </div>
      </section>

      <section aria-label="Course" className="px-(--gut)">
        <div className="mx-auto max-w-[1120px] py-8 tablet:py-(--sec)">
          <CourseGrid outline={outline} />
        </div>
      </section>

      <section className="px-(--gut) pb-(--sec)">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-10 gap-y-5 rounded-3xl bg-accent p-(--pad) text-on-accent desktop:px-12 desktop:py-11">
          <div className="flex flex-[1_1_380px] flex-col gap-2">
            <h2 className="t-h2 m-0">Teacher, volunteer or club leader?</h2>
            <p className="m-0">Run Code for All with your own group. The script, handouts and checklist are free.</p>
          </div>
          <Link href="/run-it" className="btn btn-inverse">
            Get the session kit <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

/**
 * One step: its number, title and text. From tablet up the three sit in
 * columns under a short accent rule; on phones each is a row with the
 * one-line `shortText`.
 */
function HowStep({
  number,
  title,
  text,
  shortText,
}: {
  number: number;
  title: string;
  text: string;
  shortText: string;
}) {
  return (
    <li className="flex items-baseline gap-4 tablet:flex-col tablet:gap-3 tablet:border-t-2 tablet:border-accent tablet:pt-6">
      <span aria-hidden="true" className="display w-7 flex-none text-[17px] font-bold text-accent tabular-nums">
        {String(number).padStart(2, "0")}
      </span>
      <div className="flex min-w-0 flex-col gap-1 tablet:gap-3">
        <h3 className="t-h3 m-0 max-tablet:text-[19px]">{title}</h3>
        <p className="m-0 text-[16px] leading-[1.5] tablet:text-[19px] tablet:leading-[1.6]">
          <span className="tablet:hidden">{shortText}</span>
          <span className="hidden tablet:inline">{text}</span>
        </p>
      </div>
    </li>
  );
}
