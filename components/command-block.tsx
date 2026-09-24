"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A terminal command with a Copy button.
 * In MDX: <CommandBlock>claude --version</CommandBlock>
 */
export function CommandBlock({ children }: { children: string }) {
  const command = String(children).trim();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function copy() {
    navigator.clipboard?.writeText(command).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-xl border-[1.5px] border-term-border bg-term-bg text-term-text">
      <div className="flex items-center justify-between gap-3 border-b border-term-rule py-1.5 pr-1.5 pl-[18px]">
        <span className="text-[15px] font-bold tracking-[.03em] text-term-muted">Terminal</span>
        <button
          type="button"
          onClick={copy}
          className="min-h-11 min-w-[100px] cursor-pointer rounded-[10px] border-2 border-term-text bg-transparent px-4 font-[inherit] text-[16px] font-bold text-term-text hover:bg-term-rule focus-visible:outline-deco focus-visible:outline-offset-2"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto p-[18px] font-mono text-[18px] leading-[1.5]">
        <span aria-hidden="true" className="text-term-muted select-none">
          $
        </span>
        <code className="font-[inherit] whitespace-pre">{command}</code>
      </div>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
