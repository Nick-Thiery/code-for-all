import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { PromptPractice } from "@/components/prompt-practice";

// Everything here can be used in any lesson without an import.
export const mdxComponents: MDXComponents = {
  // Internal links get client-side navigation.
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? <Link href={href} {...props} /> : <a href={href} {...props} />,
  PromptPractice,
};
