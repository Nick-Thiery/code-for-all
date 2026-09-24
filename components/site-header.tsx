"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Hex } from "@/components/hex";
import { type Outline, type OutlineLesson, lessonLabel, resumeTarget } from "@/lib/outline";
import { useCompletedLessons } from "@/lib/progress";
import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY, type Theme, applyTheme, readSavedTheme } from "@/lib/theme";

// One header for every page. The URL decides the rest: which nav item is
// current, whether to show lesson progress, and whether to show the
// "pick up where you left off" bar.
export function SiteHeader({ outline }: { outline: Outline }) {
  const pathname = usePathname();
  const { completed, ready } = useCompletedLessons();

  const lesson = outline.parts.flatMap((part) => part.lessons).find((l) => l.href === pathname);
  const active = pathname === "/" || pathname.startsWith("/part-") ? "course" : pathname.startsWith("/run-it") ? "run" : null;

  // Not on the home page, whose hero has its own Continue button, and not
  // in lessons, where the lesson row already shows where you are.
  const resume = ready ? resumeTarget(outline, completed) : null;
  const showResume = resume !== null && pathname !== "/" && !lesson;

  return (
    <header className="border-b border-border bg-bg text-[16px] leading-[1.4] text-fg">
      <div className="mx-auto flex min-h-[68px] max-w-[1200px] items-center gap-3 px-(--gut)">
        <Logo />
        {lesson && (
          <div className="ml-3 hidden min-h-9 items-center gap-3 border-l border-border pl-5 desktop:flex">
            <span className="font-bold whitespace-nowrap">
              Part {lesson.part} · Lesson {lesson.number} of {partLength(outline, lesson)}
            </span>
            <LessonPips outline={outline} lesson={lesson} completed={completed} ready={ready} size="desktop" />
          </div>
        )}
        <div className="flex-1" />
        <nav aria-label="Main" className="flex items-center gap-1">
          <NavLink href="/" current={active === "course"}>
            Course
          </NavLink>
          <NavLink href="/run-it" current={active === "run"}>
            Run a session
          </NavLink>
        </nav>
        <ThemeToggle />
      </div>

      {lesson && (
        <div className="flex min-h-10 items-center justify-between gap-3 border-t border-border px-(--gut) desktop:hidden">
          <span className="text-[15px] font-bold">
            Lesson {lesson.number} of {partLength(outline, lesson)}
          </span>
          <LessonPips outline={outline} lesson={lesson} completed={completed} ready={ready} size="mobile" />
        </div>
      )}

      {showResume && (
        <div className="border-t border-border bg-tint">
          <div className="mx-auto max-w-[1200px] px-(--gut)">
            <Link
              href={resume.href}
              className="flex min-h-12 flex-wrap items-center gap-x-2 py-1.5 text-[17px] text-fg no-underline hover:text-fg"
            >
              <span>Pick up where you left off:</span>
              <strong className="text-accent underline underline-offset-4">
                {lessonLabel(outline, resume)} <span aria-hidden="true">→</span>
              </strong>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function partLength(outline: Outline, lesson: OutlineLesson) {
  return outline.parts.find((part) => part.number === lesson.part)?.lessons.length ?? 0;
}

function Logo() {
  return (
    <Link
      href="/"
      aria-label="Code for All home"
      className="flex min-h-11 flex-none items-center rounded-lg no-underline"
    >
      {/* Light: the logo artwork. Below 600px, only its hexagon shows. */}
      <span className="block h-11 w-[35px] overflow-hidden tablet:w-auto dark:hidden">
        <Image src="/cfa-logo.png" alt="" width={140} height={44} priority className="block h-11 w-auto max-w-none" />
      </span>
      {/* Dark: the artwork's navy text disappears on the dark background, so
          the mark and wordmark are drawn with theme colours instead. */}
      <span className="hidden items-center gap-2 dark:flex">
        <svg width="36" height="40" viewBox="0 0 24 26" aria-hidden="true">
          <polygon points="12,1 23,7.25 23,18.75 12,25 1,18.75 1,7.25" className="fill-accent" />
          <text x="12" y="16.4" textAnchor="middle" className="fill-on-accent font-mono text-[9px] font-bold">
            &lt;/&gt;
          </text>
        </svg>
        <span className="hidden flex-col gap-0.5 leading-none tablet:flex">
          <span className="font-display text-[23px] font-medium tracking-[.03em] text-deco [font-variation-settings:'CASL'_1]">
            CODE
          </span>
          <span className="font-display text-[16px] font-medium text-fg [font-variation-settings:'CASL'_1]">For All</span>
        </span>
      </span>
    </Link>
  );
}

function NavLink({ href, current, children }: { href: string; current: boolean; children: string }) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`flex min-h-11 items-center rounded-[10px] px-2.5 font-bold whitespace-nowrap no-underline ${
        current ? "bg-tint text-accent hover:text-accent" : "text-fg hover:bg-surface2 hover:text-fg"
      }`}
    >
      {children}
    </Link>
  );
}

// Lesson pips: filled = done · tinted with a thick ring = this lesson ·
// gray outline = not started. Always next to "Lesson 2 of 7".
function LessonPips({
  outline,
  lesson,
  completed,
  ready,
  size,
}: {
  outline: Outline;
  lesson: OutlineLesson;
  completed: Set<string>;
  ready: boolean;
  size: "desktop" | "mobile";
}) {
  const lessons = outline.parts.find((part) => part.number === lesson.part)?.lessons ?? [];
  const small = size === "desktop" ? [14, 15] : [13, 14];
  const big = size === "desktop" ? [19, 21] : [17, 19];
  const justFinished = useJustFinished(completed.has(lesson.id), ready);

  return (
    <span aria-hidden="true" className="flex items-center gap-1">
      {lessons.map((l) => {
        const done = completed.has(l.id);
        if (l.id === lesson.id) {
          return done ? (
            <Hex
              key={l.id}
              width={big[0]}
              height={big[1]}
              shape="fill-accent stroke-accent stroke-2"
              style={justFinished ? { animation: "cfaPop 450ms cubic-bezier(.3,1.4,.5,1) both" } : undefined}
            />
          ) : (
            <Hex key={l.id} width={big[0]} height={big[1]} shape="fill-tint stroke-accent stroke-3" />
          );
        }
        return done ? (
          <Hex key={l.id} width={small[0]} height={small[1]} shape="fill-accent stroke-accent stroke-2" />
        ) : (
          <Hex key={l.id} width={small[0]} height={small[1]} shape="fill-none stroke-pip stroke-2" />
        );
      })}
    </span>
  );
}

/** True once `done` flips to true while the page is open, so the pip pops then and not on load. */
function useJustFinished(done: boolean, ready: boolean) {
  const previous = useRef<boolean | null>(null);
  const [popped, setPopped] = useState(false);
  useEffect(() => {
    if (!ready) return;
    if (previous.current === false && done) setPopped(true);
    if (!done) setPopped(false);
    previous.current = done;
  }, [done, ready]);
  return popped;
}

function subscribeTheme(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    // Another tab picked a theme: follow it.
    if (event.key === THEME_STORAGE_KEY) {
      const saved = readSavedTheme();
      if (saved) applyTheme(saved, { save: false });
    }
  };
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(
    subscribeTheme,
    () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    () => null,
  );

  // Until someone picks, keep following the device if it changes.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    // The <head> script normally sets the theme before first paint. A 404
    // from a dynamic route (/part-1/no-such-lesson) is rendered in the
    // browser instead, and React doesn't run inline scripts it inserts, so
    // apply it here in that case.
    if (!document.documentElement.dataset.theme) {
      applyTheme(readSavedTheme() ?? (media.matches ? "dark" : "light"), { save: false });
    }
    const onChange = () => {
      if (!readSavedTheme()) applyTheme(media.matches ? "dark" : "light", { save: false });
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => applyTheme(next, { save: true })}
      aria-label={theme ? `Switch to ${next} mode` : "Switch between light and dark mode"}
      className="flex min-h-11 min-w-11 flex-none cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] border-border bg-transparent px-2.5 font-bold text-fg hover:border-accent"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" className="fill-none stroke-current stroke-2" />
        <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" className="fill-current" />
      </svg>
      {/* The label names where the button takes you. CSS picks it, so it's
          right before hydration too. */}
      <span className="hidden tablet:inline dark:tablet:hidden">Dark</span>
      <span className="hidden dark:tablet:inline">Light</span>
    </button>
  );
}
