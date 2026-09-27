"use client";

import { isValidElement, type ReactNode } from "react";
import { CopyButton } from "@/components/copy-button";
import { ScrollArea } from "@/components/scroll-area";

/**
 * A terminal command with a Copy button.
 * In MDX: <CommandBlock>claude --version</CommandBlock>
 */
export function CommandBlock({ children }: { children: ReactNode }) {
  // MDX may hand over more than a string: remark-gfm turns a URL inside the
  // command into a link element. Only the text matters here.
  const command = textOf(children).trim();

  return (
    <div className="overflow-hidden rounded-xl border-[1.5px] border-term-border bg-term-bg text-term-text">
      <div className="flex items-center justify-between gap-3 border-b border-term-rule py-1.5 pr-1.5 pl-[18px]">
        <span className="text-[15px] font-bold tracking-[.03em] text-term-muted">Terminal</span>
        <CopyButton
          text={command}
          className="min-h-11 min-w-[100px] cursor-pointer rounded-[10px] border-2 border-term-text bg-transparent px-4 font-[inherit] text-[16px] font-bold text-term-text hover:bg-term-rule focus-visible:outline-deco focus-visible:outline-offset-2"
        />
      </div>
      <ScrollArea
        fade="var(--term-bg)"
        className="flex gap-3 p-[18px] font-mono text-[18px] leading-[1.5]"
        hintClassName="border-t border-term-rule px-[18px] py-2 text-term-muted"
      >
        <span aria-hidden="true" className="text-term-muted select-none">
          $
        </span>
        <code className="font-[inherit] whitespace-pre print:whitespace-pre-wrap print:[overflow-wrap:anywhere]">{command}</code>
      </ScrollArea>
    </div>
  );
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}
