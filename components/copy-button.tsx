"use client";

import { useEffect, useRef, useState } from "react";

/** "Copy", then "✓ Copied" for two seconds, announced to screen readers. */
export function CopyButton({ text, className = "btn btn-small min-w-24 text-[17px]" }: { text: string; className?: string }) {
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
    <>
      <button type="button" onClick={copy} className={`${className} print:hidden`}>
        {copied ? "✓ Copied" : "Copy"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}
