import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx-components";
import type { Snippet } from "@/lib/facilitator";

// Paper-friendly stand-ins: an inline term is just the word, and a video is
// a link to it (with the address, so it still works when printed).
const components: MDXComponents = {
  ...mdxComponents,
  Term: ({ children }: { children: ReactNode }) => <>{children}</>,
  VideoEmbed: ({ id, title }: { id: string; title: string }) => (
    <p>
      Video: <a href={`https://www.youtube.com/watch?v=${id}`}>{title}</a>
      <span className="hidden print:inline"> (youtube.com/watch?v={id})</span>
    </p>
  ),
};

/**
 * A piece of a lesson (a key term's definition, or the Challenge), rendered
 * from the lesson's own MDX so the kit always matches it.
 */
export async function KitMdx({ snippet, className = "[&>*+*]:mt-3 print:[&>*+*]:mt-1.5" }: { snippet: Snippet; className?: string }) {
  let body: ReactNode;
  try {
    const { default: Content } = await evaluate(snippet.source, { ...runtime, remarkPlugins: [remarkGfm] });
    body = Content({ components });
  } catch (error) {
    throw new Error(
      `The session kit couldn't read "${snippet.title}" in ${snippet.file}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  // Printed with backgrounds on, so the list bullets (drawn as backgrounds) show.
  return <div className={`prose print:[print-color-adjust:exact] ${className}`}>{body}</div>;
}
