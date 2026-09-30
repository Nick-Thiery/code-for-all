"use client";

import { useState } from "react";

type Props = {
  /** The YouTube video id: the part after "v=" in the link. */
  id: string;
  /** The video's title, for screen readers and the fallback link. */
  title: string;
  /** Optional start time, in seconds. */
  start?: number;
};

/**
 * A YouTube video from a slide. Nothing loads from YouTube until the learner
 * presses play: until then it's a navy card with the title on it. Then the
 * player loads from youtube-nocookie.com and starts. The link underneath
 * always works, even where embedded videos are blocked. In MDX:
 *   <VideoEmbed id="hwP7WQkmECE" title="Git Explained in 100 Seconds" />
 */
export function VideoEmbed({ id, title, start }: Props) {
  const [playing, setPlaying] = useState(false);
  const embed = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1${start ? `&start=${start}` : ""}`;
  const watch = `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`;
  return (
    <figure data-video className="blk rail-block flex flex-col gap-3.5 desktop:gap-4">
      <span className="rail-label">Watch</span>
      {/* Until it plays, the card is never shorter than its words need on a phone. */}
      <div
        className={`relative aspect-video overflow-hidden rounded-md border-2 border-line shadow-h6 desktop:shadow-h8 print:hidden ${
          playing ? "" : "min-h-[236px]"
        }`}
      >
        {playing ? (
          <iframe
            ref={(frame) => frame?.focus()}
            src={embed}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0 bg-block-ink"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="on-navy halftone group absolute inset-0 block w-full cursor-pointer border-0 p-0 text-left font-[inherit] focus-visible:-outline-offset-[6px]"
          >
            <span className="stamp absolute top-3.5 left-3.5 text-[11px] desktop:top-5 desktop:left-[22px] desktop:text-[13px]">Video</span>
            <span className="absolute top-4 right-4 text-[14px] text-on-navy-muted max-tablet:hidden desktop:top-6 desktop:right-[22px] desktop:text-[15px]">
              Plays only when you press play
            </span>
            <span className="absolute top-[40%] left-1/2 box-border grid size-[72px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-line bg-marigold shadow-h4 transition-transform group-hover:scale-[1.07] desktop:size-28 desktop:shadow-h5">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 fill-on-marigold desktop:size-10">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
            <span className="absolute right-[18px] bottom-4 left-[18px] font-serif text-[22px] leading-[1.12] font-medium desktop:right-[30px] desktop:bottom-[26px] desktop:left-[30px] desktop:text-[36px] desktop:leading-[1.1]">
              {title}
            </span>
          </button>
        )}
      </div>
      <figcaption className="t-meta text-muted print:hidden">
        Video: {title}. <span className="tablet:hidden">It plays only when you press play. </span>
        <a href={watch}>Watch it on YouTube</a> if it doesn&apos;t play here.
      </figcaption>
      {/* On paper, a player is no use: print the link instead. */}
      <p className="m-0 hidden print:block">
        Video: {title}. Watch it at {watch}
      </p>
    </figure>
  );
}
