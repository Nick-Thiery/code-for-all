"use client";

import Image from "next/image";
import { Diagram } from "@/components/diagram";
import { Label, NumberHex } from "@/components/diagrams/parts";

// Lesson 2.5: the two example About Me pages from lesson 1.6 side by side,
// with the changes a stronger prompt made. The pages are hand-made examples
// for a made-up teenager (source/about-me-example/), not real Lovable builds.

const CHANGES = [
  { what: "Named sections and a menu", from: "The prompt listed the pages: home, projects, hobbies." },
  { what: "A real design style", from: "\"Playful, light background, bold headings, one accent colour\" beat \"a website\"." },
  { what: "Hobbies and projects, not vague words", from: "The prompt said what to include, so nothing had to be guessed." },
];

const ALT =
  "Two versions of the same About Me site, side by side. Left, the first draft from a short prompt: a dark header saying About Me, a grey photo box and short, vague sections. " +
  "Right, the version from a stronger prompt: a menu with Home, Projects, Hobbies and Now, a big friendly heading, a highlighted phrase, a See my projects button and three project cards. " +
  "Three changes are numbered: " +
  CHANGES.map((c, i) => `${i + 1}, ${c.what}: ${c.from}`).join(" ");

export function GalleryCompareDiagram() {
  return (
    <Diagram alt={ALT} caption="The same site twice: a short prompt, then a stronger one. The numbers show what the stronger prompt changed.">
      <div className="flex flex-col gap-4">
        <div className="grid gap-3 tablet:grid-cols-2">
          <Shot src="/lessons/module-1/about-me-first-draft.png" label="First draft" note="from a short prompt" />
          <Shot src="/lessons/module-2/about-me-better.png" label="Better" note="from a stronger prompt" marks />
        </div>
        <ol className="m-0 grid list-none gap-2 p-0 tablet:grid-cols-3">
          {CHANGES.map((change, index) => (
            <li key={change.what} className="flex items-start gap-2.5 rounded-md bg-surface p-3 border-2 border-line">
              <NumberHex n={index + 1} size={26} />
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] leading-[1.3] font-bold text-fg">{change.what}</span>
                <span className="text-[14px] leading-[1.4] text-muted">{change.from}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Diagram>
  );
}

function Shot({ src, label, note, marks = false }: { src: string; label: string; note: string; marks?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-baseline gap-2">
        <Label className="text-fg">{label}</Label>
        <span className="text-[14px] text-muted">{note}</span>
      </span>
      {/* The markers sit half over the image's edge, so they don't hide its words. */}
      <div className={`relative ${marks ? "mx-3" : ""}`}>
        <div className="overflow-hidden rounded-md border border-line bg-surface">
          <Image src={src} alt="" width={1500} height={960} sizes="(min-width: 600px) 340px, 100vw" className="block h-auto w-full" />
        </div>
        {marks && (
          <>
            <span className="absolute top-[3%] -right-[13px]"><NumberHex n={1} size={26} /></span>
            <span className="absolute top-[34%] -left-[13px]"><NumberHex n={2} size={26} /></span>
            <span className="absolute bottom-[10%] -left-[13px]"><NumberHex n={3} size={26} /></span>
          </>
        )}
      </div>
    </div>
  );
}
