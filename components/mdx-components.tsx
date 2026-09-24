import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Callout } from "@/components/callout";
import { HandsOn } from "@/components/chip";
import { MdxPre } from "@/components/code-block";
import { CommandBlock } from "@/components/command-block";
import { KeyTerm } from "@/components/key-term";
import { PromptPractice } from "@/components/prompt-practice";
import { Screenshot } from "@/components/screenshot";
import { StuckBlock, StuckItem } from "@/components/stuck-block";
import { Term } from "@/components/term";

// Everything here can be used in any lesson without an import.
export const mdxComponents: MDXComponents = {
  // Internal links get client-side navigation.
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? <Link href={href} {...props} /> : <a href={href} {...props} />,
  // Fenced code blocks.
  pre: MdxPre,
  Callout,
  CommandBlock,
  HandsOn,
  KeyTerm,
  PromptPractice,
  Screenshot,
  StuckBlock,
  StuckItem,
  Term,
};
