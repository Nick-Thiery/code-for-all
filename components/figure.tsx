import Image from "next/image";

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
 * An image in a lesson, usually cropped from a slide. In MDX:
 *   <Figure src="/lessons/module-6/how-it-works.jpg" alt="…" width={1600} height={770} caption="…" />
 */
export function Figure({ src, alt, width, height, caption }: Props) {
  return (
    <figure className="flex flex-col gap-3">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 760px) 720px, 100vw"
        className="h-auto w-full rounded-[14px] border-[1.5px] border-border"
      />
      {caption && <figcaption className="t-meta text-muted">{caption}</figcaption>}
    </figure>
  );
}
