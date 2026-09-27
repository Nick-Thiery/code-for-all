import Link from "next/link";
import { CourseGrid } from "@/components/course-grid";
import { Hex } from "@/components/hex";
import { HeroGallery } from "@/components/hero-gallery";
import { HomeHero } from "@/components/home-hero";
import { SkillsOverview } from "@/components/mastery";
import { getOutline } from "@/lib/lessons";
import { practiceCopy } from "@/lib/site";

export default async function HomePage() {
  const outline = await getOutline();

  return (
    <>
      <section className="px-(--gut)">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-14 gap-y-10 py-(--hy)">
          <HomeHero outline={outline} />
          <HeroGallery />
        </div>
      </section>

      <section aria-labelledby="how" className="bg-surface2 px-(--gut)">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-8 py-(--sec)">
          <h2 id="how" className="t-h2 m-0">
            How it works
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-7 gap-y-8">
            <HowStep title="Read a short lesson" text="Each one takes 3 to 15 minutes, in plain English.">
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
              title="Practice with instant feedback"
              text={practiceCopy.howItWorks}
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
            <HowStep title="Build something real" text="Use an AI agent to build your own website, step by step.">
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
        <div className="mx-auto flex max-w-[1120px] flex-col gap-10 py-(--sec) tablet:gap-12">
          <CourseGrid outline={outline} />
          <SkillsOverview outline={outline} />
        </div>
      </section>

      <section className="px-(--gut) py-(--sec)">
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

function HowStep({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3.5">
      <div aria-hidden="true" className="grid h-[150px] place-items-center rounded-2xl border-[1.5px] border-border bg-surface">
        {children}
      </div>
      <h3 className="t-h3 m-0">{title}</h3>
      <p className="m-0">{text}</p>
    </div>
  );
}
