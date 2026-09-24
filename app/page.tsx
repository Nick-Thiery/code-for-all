import Link from "next/link";
import { CourseTrack } from "@/components/course-track";
import { Hex } from "@/components/hex";
import { HomeHero } from "@/components/home-hero";
import { getOutline } from "@/lib/lessons";

export default async function HomePage() {
  const outline = await getOutline();
  const lastPart = outline.parts.at(-1)?.number;

  return (
    <>
      <section className="px-(--gut)">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-14 gap-y-10 py-(--hy)">
          <HomeHero outline={outline} />
          <BuildPreview />
        </div>
      </section>

      <section aria-label="Course" className="px-(--gut)">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-(--sec) border-t border-border pt-(--hy) pb-(--sec)">
          {outline.parts.length > 0 ? (
            outline.parts.map((part) => (
              <CourseTrack key={part.number} outline={outline} part={part.number} showUpcoming={part.number === lastPart} />
            ))
          ) : (
            <p className="m-0 rounded-2xl bg-surface2 p-(--pad)">
              No lessons yet. Add a <code>content/part-1/</code> folder with a <code>part.yml</code> and an{" "}
              <code>.mdx</code> file, and it will show up here.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="how" className="bg-surface2 px-(--gut)">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-8 py-(--sec)">
          <h2 id="how" className="t-h2 m-0">
            How it works
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-7 gap-y-8">
            <HowStep title="Read a short lesson" text="Each one takes 6 to 15 minutes, in plain English.">
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

// "You write → Claude Code builds it". Decoration, so it's hidden from
// screen readers, and dropped on phones so Lesson 1 shows up sooner.
function BuildPreview() {
  return (
    <div aria-hidden="true" className="hidden max-w-[470px] flex-[1_1_380px] flex-col rounded-3xl bg-tint p-7 tablet:flex">
      <div className="box-border flex w-[84%] flex-col gap-1.5 rounded-[14px] border-[1.5px] border-border bg-surface px-4 py-3.5">
        <span className="text-[13px] font-bold tracking-[.04em] text-muted">You write</span>
        <span className="font-mono text-[14px] leading-[1.55]">
          Build a one-page website with my name at the top and a section about my cat, Mochi. Use dark blue and white.
        </span>
      </div>
      <div className="flex items-center gap-2 py-3 pl-[22px] text-[14px] font-bold text-accent">
        <Hex width={12} height={13} shape="fill-deco" />
        Claude Code builds it
      </div>
      <div className="w-[86%] self-end overflow-hidden rounded-[14px] border-[1.5px] border-border bg-surface">
        <div className="flex items-center gap-1.5 border-b border-border bg-surface2 px-3 py-2">
          <span className="size-2 rounded-full bg-pip" />
          <span className="size-2 rounded-full bg-pip" />
          <span className="size-2 rounded-full bg-pip" />
          <span className="ml-2 rounded-full bg-surface px-2.5 font-mono text-[12px] leading-[1.6] text-muted">aisyah.html</span>
        </div>
        <div className="flex flex-col gap-2 px-[18px] pt-[18px] pb-5">
          <span className="display text-[28px] leading-[1.1] font-bold text-accent">Hi, I&apos;m Aisyah</span>
          <span className="text-[14px] leading-[1.4] text-muted">I like cats, badminton and drawing.</span>
          <div className="mt-1.5 grid grid-cols-2 gap-2.5">
            {["Meet Mochi", "Badminton"].map((label) => (
              <div key={label} className="flex flex-col gap-1.5 rounded-[10px] bg-tint p-2.5">
                <span className="text-[13px] leading-[1.2] font-bold">{label}</span>
                <span className="h-[52px] rounded-md bg-[repeating-linear-gradient(135deg,var(--surface)_0_6px,var(--tint)_6px_12px)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
