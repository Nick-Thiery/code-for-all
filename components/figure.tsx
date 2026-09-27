"use client";

import Image from "next/image";
import { useRef } from "react";

type Props = {
  /** A file in public/, like "/lessons/module-6/how-it-works.jpg". */
  src: string;
  /** What the image shows, for people who can't see it. */
  alt: string;
  /** The image file's size in pixels, so the page doesn't jump while it loads. */
  width: number;
  height: number;
  caption?: string;
};

/**
 * An image in a lesson, usually cropped from a slide. Tapping it opens the
 * full-size image, which scrolls in both directions, so small labels are
 * readable on a phone. In MDX:
 *   <Figure src="/lessons/module-6/how-it-works.jpg" alt="…" width={1600} height={770} caption="…" />
 */
export function Figure({ src, alt, width, height, caption }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <figure className="flex flex-col gap-3 break-inside-avoid">
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`Enlarge image: ${alt}`}
        className="group flex w-fit max-w-full cursor-zoom-in flex-col items-end gap-2 rounded-[14px] border-0 bg-transparent p-0 text-left"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={`(min-width: 760px) ${Math.min(width, 720)}px, 100vw`}
          // Narrower than the reading column? Show it at its own size rather than stretched and soft.
          className={`h-auto rounded-[14px] border-[1.5px] border-border ${width >= 720 ? "w-full" : "w-auto max-w-full"}`}
        />
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-border bg-surface px-2.5 py-1 text-[14px] font-bold text-fg group-hover:border-accent print:hidden"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" className="fill-none stroke-current stroke-[2.5]">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6" strokeLinecap="round" />
          </svg>
          Enlarge
        </span>
      </button>
      {caption && <figcaption className="t-meta text-muted">{caption}</figcaption>}

      <dialog
        ref={dialog}
        aria-label={alt}
        onClick={(event) => {
          // A tap on the backdrop (outside the image) closes it.
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
            {/* Full size, not scaled to the screen: that's the point. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" width={width} height={height} loading="lazy" className="max-w-none rounded-lg" />
          </div>
        </div>
      </dialog>
    </figure>
  );
}
