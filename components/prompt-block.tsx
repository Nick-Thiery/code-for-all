"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A prompt to copy and paste into an AI tool, exactly as written. In MDX,
 * use a fenced block with the language "prompt" (see code-block.tsx):
 *
 *   ```prompt title="Strong"
 *   Role: You are an expert educational web designer...
 *   ```
 */
export function PromptBlock({ text, title }: { text: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function copy() {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <figure className="m-0 flex flex-col gap-2.5">
      <figcaption className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <span className="kicker">{title ? `Prompt: ${title}` : "Prompt"}</span>
        <button type="button" onClick={copy} className="btn btn-small min-w-24 text-[17px]">
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </figcaption>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
      <div className="rounded-xl border-[1.5px] border-border bg-surface2 px-[18px] py-4 font-mono text-[17px] leading-[1.7] [overflow-wrap:anywhere] whitespace-pre-wrap">
        {text}
      </div>
    </figure>
  );
}
