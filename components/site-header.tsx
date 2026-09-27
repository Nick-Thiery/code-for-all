"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Hex } from "@/components/hex";
import type { LogoFiles } from "@/lib/logo";
import { type Outline, type OutlineLesson, lessonLabel, resumeTarget } from "@/lib/outline";
import { useCompletedLessons } from "@/lib/progress";
import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY, type Theme, applyTheme, readSavedTheme } from "@/lib/theme";

// One header for every page. The URL decides the rest: which nav item is
// current, whether to show lesson progress, and whether to show the
// "pick up where you left off" bar.
export function SiteHeader({ outline, logo }: { outline: Outline; logo: LogoFiles }) {
  const pathname = usePathname();
  const { completed, ready } = useCompletedLessons();

  const lesson = outline.modules.flatMap((module) => module.lessons).find((l) => l.href === pathname);
  const active = pathname === "/" || pathname.startsWith("/module-") ? "course" : pathname.startsWith("/run-it") ? "run" : null;

  // Not on the home page, whose hero has its own Continue button, and not
  // in lessons, where the lesson row already shows where you are.
  const resume = ready ? resumeTarget(outline, completed) : null;
  const showResume = resume !== null && pathname !== "/" && !lesson;

  return (
    <header className="border-b border-border bg-bg text-[16px] leading-[1.4] text-fg print:hidden">
      <div className="mx-auto flex min-h-[68px] max-w-[1200px] items-center gap-3 px-(--gut)">
        <Logo files={logo} />
        {lesson && (
          <div className="ml-3 hidden min-h-9 items-center gap-3 border-l border-border pl-5 desktop:flex">
            <span className="font-bold whitespace-nowrap">
              Module {lesson.module} · Lesson {lesson.number} of {moduleLength(outline, lesson)}
            </span>
            <LessonPips outline={outline} lesson={lesson} completed={completed} ready={ready} size="desktop" />
          </div>
        )}
        <div className="flex-1" />
        <nav aria-label="Main" className="flex items-center gap-1">
          <NavLink href="/" current={active === "course"}>
            Course
          </NavLink>
          <NavLink href="/run-it" current={active === "run"} prefetch={false}>
            Run a session
          </NavLink>
        </nav>
        <ThemeToggle />
      </div>

      {lesson && (
        <div className="flex min-h-10 items-center justify-between gap-3 border-t border-border px-(--gut) desktop:hidden">
          <span className="text-[15px] font-bold">
            Lesson {lesson.number} of {moduleLength(outline, lesson)}
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

function moduleLength(outline: Outline, lesson: OutlineLesson) {
  return outline.modules.find((module) => module.number === lesson.module)?.lessons.length ?? 0;
}

function Logo({ files }: { files: LogoFiles }) {
  // The artwork is 401×126; shown 44px tall. Below 600px, only its hexagon shows.
  // Unoptimised, so the browser gets the exact file: the light and dark
  // versions must differ only in colour.
  const image = (src: string) => (
    <Image
      src={src}
      alt=""
      width={401}
      height={126}
      priority
      unoptimized
      className="block h-11 w-auto max-w-none"
    />
  );
  return (
    <Link
      href="/"
      aria-label="Code for All home"
      className="flex min-h-11 flex-none items-center rounded-lg no-underline"
    >
      <span className="block h-11 w-[35px] overflow-hidden tablet:w-auto">
        <span className="dark:hidden">{image(files.light)}</span>
        <span className="hidden dark:block">{image(files.dark)}</span>
      </span>
    </Link>
  );
}

function NavLink({
  href,
  current,
  prefetch,
  children,
}: {
  href: string;
  current: boolean;
  /** Off for pages most learners won't open from here, to save data on every page view. */
  prefetch?: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
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
  const lessons = outline.modules.find((module) => module.number === lesson.module)?.lessons ?? [];
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

  // Print in light colours, whatever the theme; put the theme back afterwards.
  useEffect(() => {
    let before: string | undefined;
    const toLight = () => {
      before = document.documentElement.dataset.theme;
      document.documentElement.dataset.theme = "light";
    };
    const restore = () => {
      if (before) document.documentElement.dataset.theme = before;
    };
    window.addEventListener("beforeprint", toLight);
    window.addEventListener("afterprint", restore);
    return () => {
      window.removeEventListener("beforeprint", toLight);
      window.removeEventListener("afterprint", restore);
    };
  }, []);

  // Until someone picks, keep following the device if it changes.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    // The <head> script normally sets the theme before first paint. A 404
    // from a dynamic route (/module-1/no-such-lesson) is rendered in the
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
          right before hydration too. Both share one grid cell, so the button
          is the same width in either theme. */}
      <span className="hidden tablet:grid">
        <span className="[grid-area:1/1] dark:invisible">Dark</span>
        <span className="invisible [grid-area:1/1] dark:visible">Light</span>
      </span>
    </button>
  );
}
