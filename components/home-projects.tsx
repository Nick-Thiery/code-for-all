import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import s from "@/components/home.module.css";
import { Odometer } from "@/components/odometer";
import { HomeTicker } from "@/components/home-ticker";
import { Reveal } from "@/components/reveal";
import { contentError } from "@/lib/content-error";
import { type Outline, moduleHref } from "@/lib/outline";

// "What you'll make" on the homepage: one row per project, numbered by the
// module that builds it, each with a small picture of the project. The
// ticker under the cover runs the same names. Both link to the lesson where
// you build the project.

type Project = {
  module: number;
  /** The slug of the lesson in that module where you build it. */
  lesson: string;
  title: string;
  text: string;
  /** Its name in the ticker. */
  ticker: string;
  thumb: ReactNode;
};

// The word game: three guesses at FLAME. A letter in the right place is a hit.
const ANSWER = "FLAME";
const GUESSES = ["STARE", "PLANE", ANSWER];

const PROJECTS: Project[] = [
  {
    module: 1,
    lesson: "build-about-me",
    title: "Your own About me website",
    text: "Write one good prompt, and Lovable builds the site. Then change one part of the prompt and compare.",
    ticker: "An About me website",
    thumb: (
      <Thumb className={s.site} tilt={-2}>
        <span className={s.masthead}>
          <span className={s.name}>Hi, I&apos;m Aisyah</span>
          <span className={s.bio}>Cats, badminton and drawing.</span>
        </span>
        <span className={s.sections}>
          <span className={`${s.section} ${s.mochi}`}>Meet Mochi</span>
          <span className={`${s.section} ${s.badminton}`}>Badminton</span>
        </span>
      </Thumb>
    ),
  },
  {
    module: 2,
    lesson: "solo-sprint",
    title: "A quiz, a news site or a shop",
    text: "Pick one of three sites to build, then use AI to make your own prompt better.",
    ticker: "A personality quiz",
    thumb: (
      <Thumb className={s.quiz} tilt={1.5}>
        <span className={s.quizTitle}>Which hawker dish are you?</span>
        {["Chicken rice", "Laksa", "Roti prata"].map((option, index) => (
          <span key={option} className={`${s.option} ${index === 0 ? s.picked : ""}`}>
            {option}
          </span>
        ))}
      </Thumb>
    ),
  },
  {
    module: 3,
    lesson: "plan-your-extension",
    title: "A Chrome extension",
    text: "Build a tool that lives in your browser with Claude Code, like a tab organiser.",
    ticker: "A Chrome extension",
    thumb: (
      <Thumb className={s.tabs} tilt={-1.5}>
        <span className={s.popup}>
          <span className={s.popupTitle}>
            Tab Tidy
            <span className={s.extIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M4 7h16M4 12h10M4 17h13" />
              </svg>
            </span>
          </span>
          <span className={s.note}>12 tabs sorted into 3 groups</span>
          <span className={s.bars}>
            <span />
            <span />
            <span />
          </span>
        </span>
      </Thumb>
    ),
  },
  {
    module: 7,
    lesson: "recreate-wordle",
    title: "A word game, branch by branch",
    text: "Build a Wordle clone on three branches, then merge them into one game with pull requests on GitHub.",
    ticker: "A word game",
    thumb: (
      <Thumb className={s.words} tilt={1}>
        {GUESSES.map((guess) => (
          <span key={guess} className={s.guess}>
            {[...guess].map((letter, i) => (
              <span key={i} className={`${s.tile} ${ANSWER[i] === letter ? s.hit : ""}`}>
                {letter}
              </span>
            ))}
          </span>
        ))}
      </Thumb>
    ),
  },
  {
    module: 8,
    lesson: "put-live-data-on-your-page",
    title: "A page with live data",
    text: "Your page asks a weather API for Singapore's live temperature, and shows it at the top.",
    ticker: "A page with live weather",
    thumb: (
      <Thumb className={s.weather} tilt={-2}>
        <span className={s.place}>Singapore, right now</span>
        <span className={s.temp}>31°C</span>
        <span className={s.source}>From a free weather API</span>
      </Thumb>
    ),
  },
];

function Thumb({ className, tilt, children }: { className: string; tilt: number; children: ReactNode }) {
  return (
    <span aria-hidden="true" className={`block ${s.thumbFrame}`}>
      <span className={`${s.thumb} ${className}`} style={{ "--tilt": `${tilt}deg` } as CSSProperties}>
        {children}
      </span>
    </span>
  );
}

/** The module where learners start their own project: the ticker's last name links to it. */
const OWN_PROJECT_MODULE = 9;

/**
 * Only the projects whose module is out, each with its lesson's address. A
 * slug that isn't a lesson in that module stops the build, so a renamed
 * lesson can't leave a broken link on the homepage.
 */
function released(outline: Outline) {
  return PROJECTS.flatMap((project) => {
    const mod = outline.modules.find((m) => m.number === project.module);
    if (!mod) return [];
    const lesson = mod.lessons.find((l) => l.slug === project.lesson);
    if (!lesson) {
      throw contentError("components/home-projects.tsx", [
        `The project "${project.title}" links to the lesson "${project.lesson}", but Module ${project.module} has no lesson with that slug.`,
        `Change its "lesson" in PROJECTS to the slug of the Module ${project.module} lesson where learners build it (the "slug" in that lesson's frontmatter).`,
      ]);
    }
    return [{ ...project, moduleTitle: mod.title, href: lesson.href }];
  });
}

/** The marigold strip under the cover: the project names, scrolling, each a link to its lesson. */
export function Ticker({ outline }: { outline: Outline }) {
  const items = [
    ...released(outline).map((project) => ({ name: project.ticker, href: project.href })),
    { name: "A project of your own", href: moduleHref(OWN_PROJECT_MODULE) },
  ];
  return <HomeTicker items={items} />;
}

export function ProjectRows({ outline }: { outline: Outline }) {
  const projects = released(outline);
  return (
    <div className="border-b-2 border-line">
      {projects.map((project, index) => (
        <Reveal key={project.module}>
          <Link
            href={project.href}
            className={`${s.row} flex flex-col gap-3.5 border-t-2 border-line pt-6 pb-[34px] text-fg no-underline hover:text-fg desktop:grid desktop:grid-cols-12 desktop:items-center desktop:gap-x-10 desktop:gap-y-0 desktop:py-[30px]`}
          >
            <span className="flex items-end gap-4 desktop:col-span-3 desktop:block">
              <Odometer
                value={project.module}
                delay={0.1 + index * 0.05}
                className="numeral text-[104px] text-accent desktop:text-[clamp(140px,14.6vw,210px)]"
              />
              <span className="eyebrow pb-3.5 desktop:hidden">
                Module {project.module}
                <br />
                {project.moduleTitle}
              </span>
            </span>
            <span className="flex flex-col gap-3.5 desktop:col-span-5 desktop:gap-3">
              <span className="eyebrow hidden desktop:block">
                Module {project.module} · {project.moduleTitle}
              </span>
              <span className="font-serif text-[34px] leading-[1.02] font-medium tracking-[-.02em] desktop:text-[clamp(38px,3.6vw,52px)]">
                {project.title}
              </span>
              <span className="text-[17px] leading-[1.5] text-muted desktop:text-[19px]">{project.text}</span>
            </span>
            <span className="mt-2.5 block desktop:col-span-4 desktop:mt-0 desktop:justify-self-end desktop:w-full desktop:max-w-[380px]">
              {project.thumb}
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function projectCount(outline: Outline) {
  return released(outline).length;
}
