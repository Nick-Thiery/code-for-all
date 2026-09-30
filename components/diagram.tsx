"use client";

import { type ReactNode, useRef } from "react";
import { Icon } from "@/components/icons";

// The frame every lesson diagram sits in (components/diagrams/*): a sky
// block, numbered like a figure ("FIG. 2", in the rail from 1280px). It stays
// in the main column (720px at its widest, the width the diagrams are drawn
// for; from 1280px it borrows most of the gutter to get there). Diagrams are HTML and inline
// SVG drawn with the site's tokens, so they follow dark mode. To a screen
// reader a diagram is one picture with a full text alternative (`alt`); the
// caption is shown to everyone.
//
// On phones a diagram reflows (cards stack, arrows turn downwards) rather
// than shrinking. One that can't reflow passes `enlargeWidth`: on phones it
// then gets an Enlarge button that opens it at that width, to scroll.

/** A white card on the diagram's sky panel. */
export const diagramCard = "rounded-md border-2 border-line bg-surface";

/** Small caps label inside a diagram: "1 · YOU KNOCK", "USER TABLE". */
export const diagramLabel =
  "font-display text-[13px] leading-[1.3] font-extrabold tracking-[.1em] uppercase [font-stretch:85%]";

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
    <figure data-diagram className="blk rail-block flex flex-col gap-3.5 break-inside-avoid desktop:gap-5 wide:-mr-9">
      <span aria-hidden="true" className="rail-label fig-label" />
      <div
        role="img"
        aria-label={alt}
        className="on-sky overflow-hidden rounded-md border-2 border-line p-4 shadow-h6 tablet:p-5 desktop:shadow-h10"
      >
        {children}
      </div>
      <figcaption className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <span className="fig-caption">{caption}</span>
        {enlargeWidth && (
          <button
            type="button"
            onClick={() => dialog.current?.showModal()}
            aria-label={`Enlarge diagram: ${caption}`}
            className="btn btn-small cursor-zoom-in tablet:hidden print:hidden"
          >
            <Icon name="zoom" size={15} stroke={2.5} />
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
            <div className="flex items-center justify-between gap-3 border-b-2 border-line bg-paper px-(--gut) py-2.5">
              <span className="t-meta text-muted">Scroll to see all of it.</span>
              <button type="button" onClick={() => dialog.current?.close()} className="btn btn-small" autoFocus>
                Close <Icon name="cross" size={15} stroke={3} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-paper2 p-(--gut)">
              <div aria-hidden="true" className="on-sky rounded-md border-2 border-line p-5" style={{ width: enlargeWidth }}>
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
      className="flex-none rotate-90 self-center fill-none stroke-fg stroke-3 tablet:rotate-0"
    >
      <path d="M3 12h26M21 4l8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
