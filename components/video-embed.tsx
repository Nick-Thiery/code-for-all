type Props = {
  /** The YouTube video id: the part after "v=" in the link. */
  id: string;
  /** The video's title, for screen readers and the fallback link. */
  title: string;
  /** Optional start time, in seconds. */
  start?: number;
};

/**
 * A YouTube video from a slide. Uses youtube-nocookie.com, and the player
 * only loads when it's scrolled near. The link underneath always works, even
 * where embedded videos are blocked. In MDX:
 *   <VideoEmbed id="hwP7WQkmECE" title="Git Explained in 100 Seconds" />
 */
export function VideoEmbed({ id, title, start }: Props) {
  const embed = `https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ""}`;
  const watch = `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`;
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-[14px] border-[1.5px] border-border bg-surface2 print:hidden">
        <iframe
          src={embed}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <figcaption className="t-meta text-muted print:hidden">
        Video: {title}. <a href={watch}>Watch it on YouTube</a> if it doesn&apos;t play here.
      </figcaption>
      {/* On paper, a player is no use: print the link instead. */}
      <p className="m-0 hidden print:block">
        Video: {title}. Watch it at {watch}
      </p>
    </figure>
  );
}
