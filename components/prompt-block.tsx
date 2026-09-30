import { CopyButton } from "@/components/copy-button";

/**
 * A prompt to copy and paste into an AI tool, exactly as written, on an
 * index card: ruled lines, a tomato margin and a Copy button. In MDX, use a
 * fenced block with the language "prompt" (see code-block.tsx):
 *
 *   ```prompt title="Strong"
 *   Role: You are an expert educational web designer...
 *   ```
 */
export function PromptBlock({ text, title }: { text: string; title?: string }) {
  // A few lines get the big card; a long prompt gets smaller type, so it stays one card.
  const short = text.length <= 220 && !text.includes("\n");
  return (
    <figure className={`blk index-card -rotate-[0.6deg] break-inside-avoid print:rotate-0 ${short ? "index-card-short" : ""}`}>
      <figcaption className="index-card-head">
        <span className="eyebrow">{title ? `Prompt: ${title}` : "Prompt"}</span>
        <CopyButton text={text} />
      </figcaption>
      <div className="index-card-body">{text}</div>
    </figure>
  );
}
