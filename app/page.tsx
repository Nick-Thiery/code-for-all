import Link from "next/link";
import { CourseGrid } from "@/components/course-grid";
import { Hex } from "@/components/hex";
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

      {/* On phones this is a short list of three rows, so the course is never far down the page. */}
      <section aria-labelledby="how" className="bg-surface2 px-(--gut)">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-4 py-7 tablet:gap-8 tablet:py-(--sec)">
          <h2 id="how" className="t-h2 m-0">
            How it works
          </h2>
          <div className="grid gap-y-4 tablet:grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] tablet:gap-x-7 tablet:gap-y-8">
            <HowStep
              title="Read a short lesson"
              text="Each one takes 3 to 15 minutes, in plain English."
              shortText="3 to 15 minutes, in plain English."
              icon={
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 4.5h9.5L19 9v10.5H5z" strokeLinejoin="round" />
                  <path d="M14.5 4.5V9H19M8.5 12.5h7M8.5 16h5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              <div className="flex w-[70%] flex-col gap-[7px]">
                <span className="display text-[14px] leading-[1.2] font-bold">The art of prompting</span>
                <span className="h-1.5 rounded-[3px] bg-track" />
                <span className="h-1.5 w-[86%] rounded-[3px] bg-track" />
                <span className="h-1.5 w-[94%] rounded-[3px] bg-track" />
                <span className="self-start rounded-md bg-tint px-2 py-[3px] text-[11px] leading-[1.2] font-bold tracking-[.06em] text-accent">
                  TIP
                </span>
              </div>
            </HowStep>
            <HowStep
              title="Practise with instant feedback"
              text={practiceCopy.howItWorks}
              shortText={practiceCopy.howItWorksShort}
              icon={
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 3.5l5.5 3.2v6.4L8 16.3l-5.5-3.2V6.7z" strokeLinejoin="round" />
                  <path d="M16 7.7l5.5 3.2v6.4L16 20.5l-5.5-3.2v-6.4z" strokeLinejoin="round" className="fill-accent" />
                </svg>
              }
            >
              <div className="flex w-[72%] flex-col gap-2 text-[14px] leading-[1.2] font-bold">
                {[
                  ["Specificity", 2],
                  ["Context", 1],
                  ["Scope", 2],
                ].map(([name, score]) => (
                  <span key={name} className="flex items-center justify-between gap-2">
                    {name}
                    <span className="flex gap-[3px]">
                      <Hex width={15} height={16} shape="fill-accent" />
                      <Hex width={15} height={16} shape={score === 2 ? "fill-accent" : "fill-none stroke-pip stroke-2"} />
                    </span>
                  </span>
                ))}
              </div>
            </HowStep>
            <HowStep
              title="Build something real"
              text="Use an AI agent to build your own website, step by step."
              shortText="Your own website, built with an AI agent."
              icon={
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="4.5" width="18" height="15" rx="2" />
                  <path d="M3 9h18M7 6.8h.01M10 6.8h.01" strokeLinecap="round" />
                </svg>
              }
            >
              <div className="w-[72%] overflow-hidden rounded-[10px] border-[1.5px] border-border">
                <div className="flex gap-1 border-b border-border bg-surface2 px-2 py-1.5">
                  <span className="size-1.5 rounded-full bg-pip" />
                  <span className="size-1.5 rounded-full bg-pip" />
                  <span className="size-1.5 rounded-full bg-pip" />
                </div>
                <div className="flex flex-col gap-1.5 px-3 py-2.5">
                  <span className="display text-[18px] leading-[1.1] font-bold text-accent">Hi, I&apos;m Aisyah</span>
                  <span className="h-[5px] w-[70%] rounded-[3px] bg-track" />
                  <span className="h-[26px] rounded-[5px] bg-tint" />
                </div>
              </div>
            </HowStep>
          </div>
        </div>
      </section>

      <section aria-label="Course" className="px-(--gut)">
        <div className="mx-auto max-w-[1120px] py-8 tablet:py-(--sec)">
          <CourseGrid outline={outline} />
        </div>
      </section>

      <section className="px-(--gut) pb-(--sec) tablet:py-(--sec)">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-[20px] border-[1.5px] border-border p-(--pad)">
          <div className="flex flex-[1_1_360px] flex-col gap-1">
            <h2 className="t-h3 m-0">Teacher, volunteer or club leader?</h2>
            <p className="m-0">Run Code for All with your own group. The script, handouts and checklist are free.</p>
          </div>
          <Link href="/run-it" className="btn btn-secondary">
            Get the session kit <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

/**
 * One step. From tablet up: the illustration (children), title and text in a
 * column. On phones: a row with a small icon, the title and one line of text
 * (`shortText`).
 */
function HowStep({
  title,
  text,
  shortText,
  icon,
  children,
}: {
  title: string;
  text: string;
  shortText: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5 tablet:flex-col tablet:items-stretch">
      <span
        aria-hidden="true"
        className="grid size-11 flex-none place-items-center rounded-xl bg-tint text-accent *:size-6 *:fill-none *:stroke-current *:stroke-2 tablet:hidden"
      >
        {icon}
      </span>
      <div
        aria-hidden="true"
        className="hidden h-[150px] place-items-center rounded-2xl border-[1.5px] border-border bg-surface tablet:grid"
      >
        {children}
      </div>
      <div className="flex min-w-0 flex-col gap-1 tablet:gap-3.5">
        <h3 className="t-h3 m-0 max-tablet:text-[19px]">{title}</h3>
        <p className="m-0 text-[16px] leading-[1.5] tablet:text-[19px] tablet:leading-[1.6]">
          <span className="tablet:hidden">{shortText}</span>
          <span className="hidden tablet:inline">{text}</span>
        </p>
      </div>
    </div>
  );
}
