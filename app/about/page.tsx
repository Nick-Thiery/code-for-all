import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Code for All is made by students at Singapore American School.",
};

// Widths and heights of the HDB blocks in the skyline.
const blocks = [
  [58, 92], [70, 134], [48, 74], [80, 146], [62, 108], [54, 86], [76, 124], [58, 98],
];

export default function AboutPage() {
  return (
    <div className="px-(--gut)">
      <article className="mx-auto flex max-w-[720px] flex-col gap-[22px] pt-(--hy) pb-(--sec)">
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
        <p className="m-0">
          Code for All is a free course that teaches 13 to 16 year olds to build things with AI tools. It&apos;s made
          by students in Code for All, a service club at Singapore American School.
        </p>
        <p className="m-0">
          We think anyone who&apos;s curious should get to try this, on whatever device they have, with no sign-up and
          no cost. So we wrote the lessons we&apos;d want to learn from: short, practical, and ending with something
          you actually built.
        </p>
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
