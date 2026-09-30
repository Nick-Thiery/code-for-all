import type { CSSProperties } from "react";

/**
 * A headline whose words slide up out of their own masks, one after another
 * (cvUp in app/globals.css). The words and the spaces between them are the
 * title exactly as written, so it reads, copies and searches as plain text.
 *
 * A phrase in double quotes, like "About me" in a lesson title, is set in
 * Newsreader italic: the one italic accent a Cover headline gets.
 */
export function MaskedTitle({ text, start = 0.2, step = 0.07 }: { text: string; start?: number; step?: number }) {
  let quoted = false;
  const words = text.split(" ").map((word) => {
    const opens = word.startsWith('"');
    const italic = quoted || opens;
    if (opens) quoted = true;
    if (/"[.,:;!?)]*$/.test(word) && (word.length > 1 || !opens)) quoted = false;
    return { word, italic };
  });

  return (
    <>
      {words.map(({ word, italic }, index) => (
        <span key={index}>
          {index > 0 && " "}
          <span className="mask" style={{ "--d": `${(start + index * step).toFixed(2)}s` } as CSSProperties}>
            <span className={italic ? "title-italic" : undefined}>{word}</span>
          </span>
        </span>
      ))}
    </>
  );
}
