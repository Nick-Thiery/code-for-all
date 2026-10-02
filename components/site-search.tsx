"use client";

import { type ComponentType, useCallback, useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import type { SearchPanelProps } from "@/components/search-panel";
import type { SearchIndex } from "@/lib/search";

// Site search: the Search buttons in the header and the dialog they open.
// The inside of the dialog (components/search-panel.tsx) and the index
// (/search-index.json, lib/search-index.ts) only download when someone first
// opens it, or points at or focuses a Search button, so a page view costs
// nothing extra. Searching happens in the browser: nothing typed is sent,
// logged or saved. "/" opens it from anywhere but a text box.
//
// The header calls useSiteSearch() once, renders its `dialog`, and gives
// `search` to each SearchButton and SearchMenuItem.

const INDEX_URL = "/search-index.json";

// Downloaded once per page load and shared by every Search button. A failed
// index download is forgotten, so "Try again" really tries again. A failed
// script download isn't: the bundler remembers it until the page reloads.
let panelPromise: Promise<ComponentType<SearchPanelProps>> | null = null;
let indexPromise: Promise<SearchIndex> | null = null;
let panelFailed = false;

function loadPanel() {
  panelPromise ??= import("@/components/search-panel").then(
    (module) => module.SearchPanel,
    (error) => {
      panelFailed = true;
      throw error;
    },
  );
  return panelPromise;
}

function loadIndex() {
  indexPromise ??= fetch(INDEX_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`${INDEX_URL}: ${response.status}`);
      return response.json() as Promise<SearchIndex>;
    })
    .catch((error) => {
      indexPromise = null;
      throw error;
    });
  return indexPromise;
}

/** Start both downloads early: on hover or focus of a Search button. */
function preload() {
  loadPanel().catch(() => {});
  loadIndex().catch(() => {});
}

/** Typing "/" here types a slash, so it mustn't open search. */
function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || !!target.closest("input, textarea, select"));
}

type Loaded = { Panel: ComponentType<SearchPanelProps>; index: SearchIndex };

export type SiteSearch = {
  open: (opener: HTMLElement | null) => void;
  dialog: React.ReactNode;
};

export function useSiteSearch(): SiteSearch {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [isOpen, setOpen] = useState(false);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState(false);
  const [height, setHeight] = useState<number | null>(null);

  const load = useCallback(() => {
    setFailed(false);
    Promise.all([loadPanel(), loadIndex()]).then(
      ([Panel, index]) => setLoaded({ Panel, index }),
      () => setFailed(true),
    );
  }, []);

  const open = useCallback(
    (from: HTMLElement | null) => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      // Where focus goes back to: the button pressed, or for "/" the Search
      // button on screen (or whatever had focus, if none is).
      opener.current =
        from ??
        [...document.querySelectorAll<HTMLElement>("[data-search-button]")].find((button) => button.getClientRects().length > 0) ??
        (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      dialog.showModal();
      setOpen(true);
      if (!loaded) load();
    },
    [load, loaded],
  );

  /** Close it. Focus goes back to the button that opened it, unless a result is being opened. */
  const close = useCallback((restoreFocus = true) => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    if (!restoreFocus) opener.current = null;
    dialog.close();
  }, []);

  // "/" opens search, except in a text box or while another dialog is open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
      if (isTyping(event.target) || document.querySelector("dialog[open]")) return;
      event.preventDefault();
      open(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // While it's open the page behind stays still, and on a phone the sheet
  // fits the space the on-screen keyboard leaves.
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    const viewport = window.visualViewport;
    const phone = window.matchMedia("(max-width: 599px)");
    const fit = () => setHeight(viewport && phone.matches ? viewport.height : null);
    fit();
    viewport?.addEventListener("resize", fit);
    return () => {
      root.style.overflow = before;
      viewport?.removeEventListener("resize", fit);
    };
  }, [isOpen]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      // Close here rather than leave it to the browser, which would first
      // clear the box; and stop it reaching the header, so a menu the
      // search was opened from stays open.
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    // Keep Tab inside the dialog.
    const focusable = [
      ...event.currentTarget.querySelectorAll<HTMLElement>("input, button, a[href]:not([tabindex='-1']), [tabindex='0']"),
    ].filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const dialog = (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={onKeyDown}
      onClose={() => {
        setOpen(false);
        opener.current?.focus();
        opener.current = null;
      }}
      onClick={(event) => {
        // A tap on the backdrop (outside the panel) closes it.
        if (event.target === event.currentTarget) close();
      }}
      style={height ? { height } : undefined}
      className="m-auto h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 text-fg backdrop:bg-bg/90 print:hidden"
    >
      <div className="flex h-full flex-col overflow-hidden bg-paper tablet:mx-auto tablet:mt-[8dvh] tablet:h-auto tablet:max-h-[min(680px,84dvh)] tablet:w-[calc(100%-64px)] tablet:max-w-[720px] tablet:rounded-md tablet:border-2 tablet:border-line tablet:shadow-h10">
        <div className="flex flex-none items-center justify-between gap-3 border-b-2 border-line bg-paper px-(--gut) py-2.5">
          <h2 id={titleId} className="kicker m-0">
            Search the course
          </h2>
          <button type="button" onClick={() => close()} className="btn btn-small">
            Close <Icon name="cross" size={15} stroke={3} />
          </button>
        </div>
        {isOpen &&
          (loaded ? (
            <loaded.Panel index={loaded.index} onNavigate={() => close(false)} />
          ) : failed ? (
            <div className="flex flex-col items-start gap-3 bg-paper2 px-(--gut) py-6">
              <p role="alert" className="m-0 font-serif text-[22px] leading-[1.25] font-semibold">
                Search couldn&apos;t load
              </p>
              <p className="t-meta m-0 text-muted">
                It needs a connection the first time. Check you&apos;re online, then try again.
              </p>
              <button
                type="button"
                // Only a fresh page can fetch the panel's script again.
                onClick={() => (panelFailed ? window.location.reload() : load())}
                className="btn btn-small"
              >
                Try again
              </button>
            </div>
          ) : (
            <p role="status" className="t-meta m-0 bg-paper2 px-(--gut) py-6 text-muted">
              Loading search…
            </p>
          ))}
      </div>
    </dialog>
  );

  return { open, dialog };
}

/**
 * The square Search button beside the theme switch, with the word SEARCH
 * when there's room. `labelClassName` says when the word is only for
 * screen readers.
 */
export function SearchButton({
  search,
  className = "",
  labelClassName = "max-wide:sr-only",
}: {
  search: SiteSearch;
  className?: string;
  labelClassName?: string;
}) {
  return (
    <button
      type="button"
      data-search-button
      aria-haspopup="dialog"
      aria-keyshortcuts="/"
      onClick={(event) => search.open(event.currentTarget)}
      onPointerEnter={preload}
      onFocus={preload}
      className={`flex h-11 min-w-11 flex-none cursor-pointer items-center justify-center gap-2 rounded border-2 border-line bg-transparent px-[10px] font-display text-[14px] font-extrabold tracking-[.1em] text-fg uppercase [font-stretch:85%] hover:bg-marigold hover:text-on-marigold ${className}`}
    >
      <Icon name="search" size={19} stroke={2.4} />
      <span className={labelClassName}>Search</span>
    </button>
  );
}

/** The Search row at the top of the phone menu. */
export function SearchMenuItem({ search, className = "" }: { search: SiteSearch; className?: string }) {
  return (
    <li className={`border-b-2 border-line ${className}`}>
      <button
        type="button"
        data-search-button
        aria-haspopup="dialog"
        aria-keyshortcuts="/"
        onClick={(event) => search.open(event.currentTarget)}
        onPointerEnter={preload}
        onFocus={preload}
        className="kicker flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent p-0 text-left text-[15px] hover:text-accent"
      >
        Search
        <Icon name="search" size={18} stroke={2.6} />
      </button>
    </li>
  );
}
