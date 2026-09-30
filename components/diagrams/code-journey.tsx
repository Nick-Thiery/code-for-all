"use client";

import { Diagram } from "@/components/diagram";
import { Icon, Label, Note, type IconName } from "@/components/diagrams/parts";

// Lessons 6.2 and 6.5: your computer, then GitHub, then Vercel, with the six
// key terms on the arrows. Commit loops on your computer (it saves locally,
// not on GitHub); push goes up; clone comes back down; fork makes a copy on
// GitHub; a pull request and merge happen on GitHub; Vercel deploys from it.

const PLACES: { icon: IconName; name: string; what: string; terms: string[] }[] = [
  { icon: "laptop", name: "Your computer", what: "Where you edit files.", terms: ["commit: save a snapshot here"] },
  { icon: "cloud", name: "GitHub", what: "Your project's online home: the repo.", terms: ["fork: copy someone's repo", "pull request: ask for review", "merge: add it to main"] },
  { icon: "globe", name: "Vercel", what: "Turns the repo into a live website.", terms: ["deploys every push"] },
];

const ALT =
  "Three places joined by arrows. Your computer, where you edit files: commit saves a snapshot here, locally. " +
  "An arrow labelled push goes up to GitHub, and an arrow labelled clone comes back down. " +
  "GitHub is your project's online home, the repo: fork copies someone's repo, a pull request asks for review, and a merge adds it to main. " +
  "An arrow labelled deploy goes from GitHub to Vercel, which turns the repo into a live website and deploys every push.";

export function CodeJourneyDiagram() {
  return (
    <Diagram alt={ALT} caption="Where your code goes: commit on your computer, push to GitHub, and Vercel puts it live.">
      <div className="flex flex-col gap-2 tablet:flex-row tablet:items-stretch tablet:gap-0">
        {PLACES.map((place, index) => (
          <div key={place.name} className="contents">
            {index > 0 && (
              <div className="flex flex-col items-center justify-center gap-1 py-1 tablet:w-[76px] tablet:flex-none">
                {index === 1 ? (
                  <>
                    <Arrow label="push" />
                    <Arrow label="clone" back />
                  </>
                ) : (
                  <Arrow label="deploy" />
                )}
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-md bg-surface p-3.5 border-2 border-line">
              <span className="flex items-center gap-2">
                <span className="grid size-10 flex-none place-items-center rounded-full border-2 border-line bg-sky">
                  <Icon name={place.icon} />
                </span>
                <span className="font-serif text-[19px] leading-[1.2] font-semibold text-fg">{place.name}</span>
              </span>
              <Note className="text-muted">{place.what}</Note>
              <div className="flex flex-col gap-1.5">
                {place.terms.map((term) => {
                  const [word, rest] = term.split(": ");
                  return (
                    <span key={term} className="rounded-md bg-surface2 px-2.5 py-1 text-[14px] leading-[1.4] border-2 border-line">
                      <span className="font-bold text-accent">{word}</span>
                      {rest && <span className="text-muted"> {rest}</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Diagram>
  );
}

/** An arrow with a word on it: right on tablets, down on phones. */
function Arrow({ label, back = false }: { label: string; back?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 tablet:flex-col tablet:gap-0">
      <svg
        width="30"
        height="18"
        viewBox="0 0 34 20"
        aria-hidden="true"
        className={`flex-none fill-none stroke-accent stroke-3 ${back ? "-rotate-90 tablet:rotate-180" : "rotate-90 tablet:rotate-0"}`}
      >
        <path d="M3 10h26M21 3l8 7-8 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Label className="text-accent">{label}</Label>
    </span>
  );
}
