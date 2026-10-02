"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";
import { SearchButton, SearchMenuItem, type SiteSearch, useSiteSearch } from "@/components/site-search";
import type { LogoFiles } from "@/lib/logo";
import { type Outline, type OutlineLesson, type OutlineModule, lessonLabel, moduleTrackHref, resumeTarget } from "@/lib/outline";
import { useCompletedLessons } from "@/lib/progress";
import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY, type Theme, applyTheme, readSavedTheme } from "@/lib/theme";

// One header for every page. The URL decides the rest: which nav item is
// current, whether it's the lesson top bar (back to the course, the module's
// lessons as segments, "Lesson 2 of 6"), and whether to show the "pick up
// where you left off" bar. Search (components/site-search.tsx) is the first
// row of the phone menu, and a button beside the theme switch from 600px.

const NAV = [
  { href: "/contents", label: "Contents", key: "contents" },
  { href: "/quizzes", label: "Quizzes", key: "quizzes" },
  { href: "/run-it", label: "Run a session", key: "run" },
  { href: "/help", label: "Help", key: "help" },
] as const;

export function SiteHeader({ outline, logo }: { outline: Outline; logo: LogoFiles }) {
  const pathname = usePathname();
  const { completed, ready } = useCompletedLessons();
  const search = useSiteSearch();
  useThemeEffects();

  const lesson = outline.modules.flatMap((module) => module.lessons).find((l) => l.href === pathname);
  const lessonModule = lesson && outline.modules.find((module) => module.number === lesson.module);
  const active =
    pathname === "/contents" || pathname.startsWith("/module-")
      ? "contents"
      : pathname.startsWith("/quizzes")
        ? "quizzes"
        : pathname.startsWith("/run-it")
          ? "run"
          : pathname.startsWith("/help")
            ? "help"
            : null;

  // Not on the home page, whose hero has its own Continue button, nor on
  // Contents, whose course grid has its own "Pick up where you left off"
  // card, and not in lessons, where the top bar already shows where you are.
  const resume = ready ? resumeTarget(outline, completed) : null;
  const showResume = resume !== null && pathname !== "/" && pathname !== "/contents" && !lesson;

  // The phone menu: closed again whenever the page changes, and by Escape.
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      // Search handles its own Escape, and the menu it was opened from stays open.
      if (event.key !== "Escape" || event.defaultPrevented) return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const menu = { open: menuOpen, id: menuId, ref: menuButton, toggle: () => setMenuOpen((open) => !open) };

  return (
    <header className="border-b-2 border-line bg-bg text-fg print:hidden">
      {lesson && lessonModule ? (
        <LessonBar lesson={lesson} module={lessonModule} completed={completed} ready={ready} menu={menu} search={search} />
      ) : (
        <div className="px-(--gut) max-desktop:pr-4">
          <div className="mx-auto flex h-[62px] max-w-[1200px] items-center justify-between gap-3 nav:h-[76px]">
            <Wordmark files={logo} />
            <div className="flex items-center gap-2">
              <nav aria-label="Main" className="mr-0.5 hidden items-center gap-1.5 desktop:flex">
                {NAV.map((item) => (
                  <NavLink key={item.key} href={item.href} current={active === item.key} prefetch={item.key === "contents" ? undefined : false}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <SearchButton search={search} className="max-tablet:hidden" />
              <ThemeToggle />
              <MenuButton menu={menu} className="desktop:hidden" label />
            </div>
          </div>
        </div>
      )}

      {/* The menu behind the MENU button: phones and tablets. */}
      <nav
        id={menuId}
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t-2 border-line bg-paper2 px-(--gut) pb-3 desktop:hidden"
      >
        <ul className="m-0 flex list-none flex-col p-0">
          <SearchMenuItem search={search} className="tablet:hidden" />
          {NAV.map((item) => (
            <li key={item.key} className="border-b-2 border-line">
              <Link
                href={item.href}
                prefetch={item.key === "contents" ? undefined : false}
                aria-current={!lesson && active === item.key ? "page" : undefined}
                className="kicker flex min-h-14 items-center justify-between gap-3 text-[15px] no-underline decoration-marigold decoration-4 underline-offset-8 hover:text-accent aria-[current=page]:underline"
              >
                {item.label}
                <Icon name="arrow-right" size={18} stroke={2.6} />
              </Link>
            </li>
          ))}
        </ul>
        {lesson && (
          <div className="flex min-h-14 items-center justify-between gap-3 pt-3">
            <span className="kicker text-[15px]">Light or dark</span>
            <ThemeToggle />
          </div>
        )}
      </nav>

      {showResume && (
        <div className="on-sky border-t-2 border-line px-(--gut)">
          <div className="mx-auto max-w-[1200px]">
            <Link
              href={resume.href}
              className="flex min-h-12 flex-wrap items-center gap-x-2 py-1.5 text-[17px] text-fg no-underline hover:text-fg"
            >
              <span>Pick up where you left off:</span>
              <strong className="underline decoration-2 underline-offset-4">
                {lessonLabel(outline, resume)} <span aria-hidden="true">→</span>
              </strong>
            </Link>
          </div>
        </div>
      )}
      {search.dialog}
    </header>
  );
}

type Menu = { open: boolean; id: string; ref: React.RefObject<HTMLButtonElement | null>; toggle: () => void };

/** MENU on phones. With `label` it's the marigold button; without, just the square icon. */
function MenuButton({ menu, label = false, className = "" }: { menu: Menu; label?: boolean; className?: string }) {
  return (
    <button
      ref={menu.ref}
      type="button"
      aria-expanded={menu.open}
      aria-controls={menu.id}
      aria-label={label ? undefined : menu.open ? "Close menu" : "Open menu"}
      onClick={menu.toggle}
      className={`flex h-11 flex-none cursor-pointer items-center justify-center gap-2 rounded border-2 border-line font-display text-[14px] font-extrabold tracking-[.1em] text-ink uppercase [font-stretch:85%] ${
        label ? "bg-marigold px-3 text-on-marigold" : "w-11 bg-transparent"
      } ${className}`}
    >
      <Icon name={menu.open ? "cross" : "menu"} size={label ? 16 : 18} stroke={2.8} />
      {label && "Menu"}
    </button>
  );
}

function Wordmark({ files }: { files: LogoFiles }) {
  // The logo artwork is 401×126: a hexagon, then "CODE For All". Only its
  // hexagon shows here (the first 100 of its 401 pixels), and the name is
  // set beside it in Archivo. Unoptimised, so the browser gets the exact
  // file: the light and dark versions must differ only in colour.
  const image = (src: string) => (
    <Image src={src} alt="" width={401} height={126} priority unoptimized className="block h-full w-auto max-w-none" />
  );
  return (
    <Link
      href="/"
      aria-label="Code for All home"
      className="flex min-h-11 flex-none items-center gap-2.5 rounded text-fg no-underline hover:text-fg nav:gap-3"
    >
      <span className="block h-[30px] w-[24px] flex-none overflow-hidden nav:h-9 nav:w-[29px]">
        <span className="block h-full dark:hidden">{image(files.light)}</span>
        <span className="hidden h-full dark:block">{image(files.dark)}</span>
      </span>
      <span className="font-display text-[24px] leading-none font-extrabold tracking-[.01em] whitespace-nowrap uppercase [font-stretch:72%] nav:text-[28px]">
        Code for All
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
      className={`flex h-11 items-center rounded border-2 px-3.5 font-display text-[16px] font-bold tracking-[.08em] whitespace-nowrap uppercase no-underline [font-stretch:88%] ${
        current
          ? "border-line bg-marigold text-on-marigold hover:text-on-marigold"
          : "border-transparent text-fg hover:border-line hover:text-fg"
      }`}
    >
      {children}
    </Link>
  );
}

/**
 * The lesson top bar: back to the course, the module, one segment per lesson
 * and "Lesson 2 of 6". From 960px it also has Help, the theme switch and,
 * when there's room, Search; below that they're behind the menu button, and
 * Search is a button of its own from 600px.
 */
function LessonBar({
  lesson,
  module,
  completed,
  ready,
  menu,
  search,
}: {
  lesson: OutlineLesson;
  module: OutlineModule;
  completed: Set<string>;
  ready: boolean;
  menu: Menu;
  search: SiteSearch;
}) {
  const total = module.lessons.length;
  const back = (
    <Link
      href={moduleTrackHref(module.number)}
      className="kicker flex h-11 flex-none items-center gap-2 px-2 text-[14px] no-underline hover:text-accent desktop:px-0 desktop:text-[15px]"
    >
      <Icon name="arrow-left" size={18} stroke={2.6} />
      Contents
    </Link>
  );
  return (
    <>
      {/* Phones and tablets. */}
      <div className="flex h-[60px] items-center justify-between gap-2 pr-4 pl-3 desktop:hidden">
        {back}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2.5">
          <Segments module={module} lesson={lesson} completed={completed} ready={ready} compact />
          <span aria-hidden="true" className="kicker flex-none text-[13px] tracking-[.08em] tabular-nums">
            {lesson.number}/{total}
          </span>
          <SearchButton search={search} className="max-tablet:hidden" labelClassName="sr-only" />
          <MenuButton menu={menu} />
        </div>
      </div>
      {/* Desktop. */}
      <div className="hidden h-[68px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-5 px-10 desktop:grid">
        <div className="flex min-w-0 items-center gap-[18px]">
          {back}
          <span aria-hidden="true" className="h-[26px] w-0.5 flex-none bg-line" />
          <span className="eyebrow truncate">
            Module {module.number}
            <span className="max-wide:hidden"> · {module.title}</span>
          </span>
        </div>
        <div className="flex items-center gap-3.5">
          <Segments module={module} lesson={lesson} completed={completed} ready={ready} />
          <span className="kicker text-[14px] tracking-[.1em] whitespace-nowrap">
            Lesson {lesson.number} of {total}
          </span>
        </div>
        {/* Search only when there's room beside Help and the theme switch; "/" works either way. */}
        <div className="@container min-w-0">
          <div className="flex items-center justify-end gap-2">
            <SearchButton search={search} className="@max-[189px]:hidden" labelClassName="max-wide:sr-only @max-[279px]:sr-only" />
            <nav aria-label="Main">
              <NavLink href="/help" current={false} prefetch={false}>
                Help
              </NavLink>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}

// One segment per lesson: navy = done · marigold and blinking = this lesson ·
// empty = not started. Then a Quiz chip, if the module has a quiz. Finishing
// this lesson fills its segment. To a screen reader it's one sentence.
function Segments({
  module,
  lesson,
  completed,
  ready,
  compact = false,
}: {
  module: OutlineModule;
  lesson: OutlineLesson;
  completed: Set<string>;
  ready: boolean;
  compact?: boolean;
}) {
  const done = ready ? module.lessons.filter((l) => completed.has(l.id)).length : 0;
  const label = `Lesson ${lesson.number} of ${module.lessons.length}.${ready ? ` ${done} of ${module.lessons.length} done.` : ""}`;
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center ${compact ? "min-w-0 flex-1 justify-end gap-1" : "gap-1.5"}`}
    >
      {module.lessons.map((l, index) => {
        const isDone = ready && completed.has(l.id);
        const current = l.id === lesson.id;
        return (
          <span
            key={l.id}
            className={`box-border flex overflow-hidden rounded-[3px] border-2 border-line ${
              compact ? "h-3 max-w-[22px] min-w-2.5 flex-[1_1_22px]" : "h-3.5 w-11"
            } ${current && !isDone ? "bg-marigold" : "bg-paper"}`}
            style={current && !isDone ? { animation: "cvBlink 1.6s ease-in-out 1.2s infinite" } : undefined}
          >
            {isDone && (
              <span
                className="flex-1 origin-left bg-accent"
                style={{ animation: `cvGrow .35s ease-out ${(0.2 + index * 0.15).toFixed(2)}s both` } as CSSProperties}
              />
            )}
          </span>
        );
      })}
      {module.quiz && !compact && (
        <span className="ml-1 box-border flex h-[22px] items-center rounded-full border-2 border-line px-2 font-display text-[11px] leading-none font-extrabold tracking-[.1em] uppercase [font-stretch:85%]">
          Quiz
        </span>
      )}
    </div>
  );
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

/** The theme's page-wide behaviour, run once by the header whichever switches it shows. */
function useThemeEffects() {
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
}

/** The square light/dark switch. */
function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(
    subscribeTheme,
    () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    () => null,
  );
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => applyTheme(next, { save: true })}
      aria-label={theme ? `Switch to ${next} mode` : "Switch between light and dark mode"}
      className="flex size-11 flex-none cursor-pointer items-center justify-center rounded border-2 border-line bg-transparent text-fg hover:bg-marigold hover:text-on-marigold"
    >
      {/* The icon shows where the button takes you. CSS picks it, so it's
          right before hydration too. */}
      <Icon name="moon" size={19} stroke={2} className="dark:hidden" />
      <Icon name="sun" size={19} stroke={2} className="hidden dark:block" />
    </button>
  );
}
