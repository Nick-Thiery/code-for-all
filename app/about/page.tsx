import type { Metadata } from "next";
import Link from "next/link";
import { DraftNotice } from "@/components/draft-notice";
import { getPhases } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Code for All is a free course in building with AI tools, made by students at Singapore American School.",
};

// Widths and heights of the HDB blocks in the skyline.
const blocks = [
  [58, 92], [70, 134], [48, 74], [80, 146], [62, 108], [54, 86], [76, 124], [58, 98],
];

// DRAFT. The facts below come from "Program facts from the Blueprint" in
// docs/launchlab-curriculum-source.md and the phases in content/course.yml.
// No tutor names without their permission.
const facts = [
  { label: "Cost", value: "Free" },
  { label: "Length", value: "10 weeks, in 1.5-hour sessions" },
  { label: "Where", value: "Online" },
  { label: "Who", value: "Mixed skill levels" },
  { label: "You need", value: "A laptop. Tablets and phones won't work for most sessions." },
  { label: "AI tools", value: "No AI subscriptions needed" },
];

export default async function AboutPage() {
  const phases = await getPhases();
  const moduleCount = phases.reduce((sum, phase) => sum + phase.modules.length, 0);

  return (
    <div className="px-(--gut)">
      <article className="mx-auto flex max-w-[720px] flex-col gap-[22px] pt-(--hy) pb-12 tablet:pb-(--sec)">
        <DraftNotice>
          <p>
            This page is a first draft, written from the LaunchLab Blueprint and the course map. Rewrite it in your own
            words, check every fact, then remove this box.
          </p>
        </DraftNotice>
        <div
          aria-hidden="true"
          className="relative mb-4 flex h-[150px] items-end gap-2.5 overflow-hidden border-b-4 border-border px-1.5"
        >
          {blocks.map(([width, height], index) => (
            <span
              key={index}
              className="flex-none border-t-[5px] border-deco bg-[repeating-linear-gradient(to_bottom,var(--tint)_0_9px,var(--bg)_9px_12px)]"
              style={{ flexBasis: width, height }}
            />
          ))}
          <span className="absolute bottom-1.5 left-[18%] box-border flex h-[30px] w-[190px] gap-1.5 rounded-t-[14px] rounded-b bg-accent px-3.5 py-[7px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="flex-1 rounded-[3px] bg-tint" />
            ))}
          </span>
        </div>
        <span className="eyebrow">About</span>
        <h1 className="t-h1 m-0">Made by students in Singapore</h1>
        <p className="t-lead m-0">
          Code for All is a free course that teaches 13 to 16 year olds to build things with AI tools. It&apos;s made
          by students in Code for All, a service club at Singapore American School.
        </p>

        <h2 className="t-h2 mt-6 mb-0">Where it comes from</h2>
        <p className="m-0">
          The lessons are adapted from LaunchLab, the club&apos;s live course. LaunchLab is planned like this:
        </p>
        <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-[18px] gap-y-3 rounded-2xl border border-border px-(--pad) py-5 text-[17px] leading-[1.5]">
          {facts.map(({ label, value }) => (
            <div key={label} className="contents">
              <dt className="font-bold text-muted">{label}</dt>
              <dd className="m-0">{value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="t-h2 mt-6 mb-0">What&apos;s in the course</h2>
        <p className="m-0">
          {moduleCount} modules in {phases.length} phases. On this site the lessons are short and you go at your own
          pace.
        </p>
        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {phases.map((phase) => {
            const first = phase.modules[0]?.number;
            const last = phase.modules.at(-1)?.number;
            return (
              <li key={phase.number} className="flex flex-col gap-1 border-l-4 border-track pl-4">
                <span className="t-h3">{phase.title}</span>
                <span className="t-meta text-muted">
                  {first === last ? `Module ${first}` : `Modules ${first} to ${last}`}:{" "}
                  {phase.modules.map((module) => module.title).join(", ")}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-2.5 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Start the course
          </Link>
          <Link href="/run-it" className="btn btn-secondary">
            Run a session
          </Link>
        </div>
      </article>
    </div>
  );
}
