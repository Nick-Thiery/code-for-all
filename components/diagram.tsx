"use client";

import { type ReactNode, useRef } from "react";

// The frame every lesson diagram sits in (components/diagrams/*). Diagrams
// are HTML and inline SVG drawn with the site's tokens, so they follow dark
// mode. To a screen reader a diagram is one picture with a full text
// alternative (`alt`); the caption is shown to everyone.
//
// On phones a diagram reflows (cards stack, arrows turn downwards) rather
// than shrinking. One that can't reflow passes `enlargeWidth`: on phones it
// then gets an Enlarge button that opens it at that width, to scroll.

/** A white card on the diagram's tinted panel. */
export const diagramCard =
  "rounded-2xl bg-surface shadow-[0_8px_22px_color-mix(in_srgb,var(--accent)_10%,transparent)] dark:shadow-none dark:ring-1 dark:ring-border";

/** Small caps label inside a diagram: "1 · YOU KNOCK", "USER TABLE". */
export const diagramLabel = "text-[13px] leading-[1.3] font-extrabold tracking-[.08em] uppercase";

type Props = {
  /** What the diagram shows, in full sentences, for people who can't see it. */
  alt: string;
  caption: string;
  /** Set for a diagram that can't reflow: its natural width in pixels. */
  enlargeWidth?: number;
  children: ReactNode;
};

export function Diagram({ alt, caption, enlargeWidth, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <figure data-diagram className="m-0 flex flex-col gap-3 break-inside-avoid">
      <div role="img" aria-label={alt} className="overflow-hidden rounded-[20px] bg-tint p-4 tablet:p-5">
        {children}
      </div>
      <figcaption className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <span className="t-meta text-muted">{caption}</span>
        {enlargeWidth && (
          <button
            type="button"
            onClick={() => dialog.current?.showModal()}
            aria-label={`Enlarge diagram: ${caption}`}
            className="inline-flex min-h-11 cursor-zoom-in items-center gap-1.5 rounded-full border-[1.5px] border-border bg-surface px-3 text-[15px] font-bold text-fg hover:border-accent tablet:hidden print:hidden"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="fill-none stroke-current stroke-[2.5]">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6" strokeLinecap="round" />
            </svg>
            Enlarge
          </button>
        )}
      </figcaption>

      {enlargeWidth && (
        <dialog
          ref={dialog}
          aria-label={alt}
          onClick={(event) => {
            // A tap on the backdrop closes it.
            if (event.target === event.currentTarget) dialog.current?.close();
          }}
          className="m-auto h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 backdrop:bg-bg/90"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3 bg-surface px-(--gut) py-2">
              <span className="t-meta text-muted">Scroll to see all of it.</span>
              <button type="button" onClick={() => dialog.current?.close()} className="btn btn-small" autoFocus>
                Close <span aria-hidden="true">✕</span>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-surface2 p-(--gut)">
              <div aria-hidden="true" className="rounded-[20px] bg-tint p-5" style={{ width: enlargeWidth }}>
                {children}
              </div>
            </div>
          </div>
        </dialog>
      )}
    </figure>
  );
}

/** The arrow between steps: points right from tablet up, down on phones. */
export function FlowArrow() {
  return (
    <svg
      width="34"
      height="24"
      viewBox="0 0 34 24"
      aria-hidden="true"
      className="flex-none rotate-90 self-center fill-none stroke-accent stroke-3 tablet:rotate-0"
    >
      <path d="M3 12h26M21 4l8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
