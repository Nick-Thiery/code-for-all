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
    <div className="blk overflow-hidden rounded-md border-2 border-line bg-term-bg text-term-text shadow-h6 desktop:shadow-h8">
      <div className="flex items-center justify-between gap-3 border-b-2 border-term-rule py-2 pr-3 pl-[18px]">
        <span className="font-display text-[14px] font-extrabold tracking-[.12em] text-term-muted uppercase [font-stretch:85%]">
          Terminal
        </span>
        <CopyButton
          text={command}
          className="flex min-h-11 min-w-[104px] cursor-pointer items-center justify-center gap-2 rounded border-2 border-term-text bg-transparent px-4 font-display text-[15px] font-extrabold tracking-[.08em] text-term-text uppercase [font-stretch:85%] hover:bg-term-rule focus-visible:outline-offset-2 focus-visible:outline-marigold"
        />
      </div>
      <ScrollArea
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
