"use client";

import Image from "next/image";
import { useRef } from "react";
import { Icon } from "@/components/icons";

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
 * An image in a lesson, usually cropped from a slide: framed, numbered
 * ("FIG. 1", in the rail from 1280px, where it also runs across the main and
 * side columns) and captioned. Tapping it opens the full-size image, which
 * scrolls in both directions, so small labels are readable on a phone. In MDX:
 *   <Figure src="/lessons/module-6/how-it-works.jpg" alt="…" width={1600} height={770} caption="…" />
 */
export function Figure({ src, alt, width, height, caption }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <figure className="blk wide rail-block flex flex-col gap-3.5 break-inside-avoid desktop:gap-5">
      <span aria-hidden="true" className="rail-label fig-label" />
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`Enlarge image: ${alt}`}
        className="group flex w-fit max-w-full cursor-zoom-in flex-col items-end gap-3.5 rounded-md border-0 bg-transparent p-0 text-left"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={`(min-width: 1280px) ${Math.min(width, 994)}px, (min-width: 760px) ${Math.min(width, 720)}px, 100vw`}
          // Narrower than the reading column? Show it at its own size rather than stretched and soft.
          className={`box-border h-auto rounded-md border-2 border-line bg-surface shadow-h6 desktop:shadow-h10 ${width >= 720 ? "w-full" : "w-auto max-w-full"}`}
        />
        <span aria-hidden="true" className="chip group-hover:bg-marigold group-hover:text-on-marigold print:hidden">
          <Icon name="zoom" size={14} stroke={2.5} />
          Enlarge
        </span>
      </button>
      {caption && <figcaption className="fig-caption">{caption}</figcaption>}

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
          <div className="flex items-center justify-between gap-3 border-b-2 border-line bg-paper px-(--gut) py-2.5">
            <span className="t-meta text-muted">Scroll to see all of it.</span>
            <button type="button" onClick={() => dialog.current?.close()} className="btn btn-small" autoFocus>
              Close <Icon name="cross" size={15} stroke={3} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-paper2 p-(--gut)">
            {/* Full size, not scaled to the screen: that's the point. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" width={width} height={height} loading="lazy" className="max-w-none rounded-md border-2 border-line" />
          </div>
        </div>
      </dialog>
    </figure>
  );
}
