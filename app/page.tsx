import Link from "next/link";
import { CourseTrack, UpcomingModule } from "@/components/course-track";
import { Hex } from "@/components/hex";
import { HeroGallery } from "@/components/hero-gallery";
import { HomeHero } from "@/components/home-hero";
import { getOutline } from "@/lib/lessons";

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

      <section aria-label="Course" className="px-(--gut)">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-(--sec) border-t border-border pt-(--hy) pb-(--sec)">
          {outline.phases.map((phase) => (
            <section key={phase.number} aria-labelledby={`phase-${phase.number}`} className="flex flex-col gap-10">
              <header className="flex flex-col gap-1.5">
                <span className="eyebrow">Phase {phase.number}</span>
                <h2 id={`phase-${phase.number}`} className="t-h1 m-0 scroll-mt-6">
                  {phase.title}
                </h2>
                <p className="t-meta m-0 text-muted">{moduleRange(phase.modules.map((m) => m.number))}</p>
              </header>
              {phase.modules.map((mod) =>
                mod.released ? <CourseTrack key={mod.number} outline={outline} module={mod.number} /> : null,
              )}
              {phase.modules.some((mod) => !mod.released) && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-4">
                  {phase.modules
                    .filter((mod) => !mod.released)
                    .map((mod) => (
                      <UpcomingModule key={mod.number} number={mod.number} title={mod.title} summary={mod.summary} />
                    ))}
                </div>
              )}
            </section>
          ))}
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
                <span className="display text-[14px] leading-[1.2] font-bold">How a language model works</span>
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
              text="Write a prompt and get kind, specific tips from AI. Try as many times as you like."
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

      <section className="px-(--gut) py-(--sec)">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-[20px] border-[1.5px] border-border p-(--pad)">
          <div className="flex flex-[1_1_360px] flex-col gap-1">
            <h2 className="t-h3 m-0">Teacher, volunteer or club leader?</h2>
            <p className="m-0">Run Code for All with your own group. The slides, script and handouts are free.</p>
          </div>
          <Link href="/run-it" className="btn btn-secondary">
            Get the session kit <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

/** [1, 2, 3, 4, 5] -> "Modules 1 to 5", [9, 10] -> "Modules 9 and 10" */
function moduleRange(numbers: number[]) {
  if (numbers.length === 1) return `Module ${numbers[0]}`;
  if (numbers.length === 2) return `Modules ${numbers[0]} and ${numbers[1]}`;
  return `Modules ${numbers[0]} to ${numbers.at(-1)}`;
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
