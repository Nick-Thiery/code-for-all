import { evaluate } from "@mdx-js/mdx";
import type { ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx-components";
import type { Lesson } from "@/lib/lessons";

export async function LessonBody({ lesson }: { lesson: Lesson }) {
  let body: ReactNode;
  try {
    // Compile the whole file (remark-frontmatter skips the header) so error
    // line numbers match what the author sees in their editor.
    const { default: Content } = await evaluate(lesson.source, {
      ...runtime,
      remarkPlugins: [remarkFrontmatter, remarkGfm],
    });
    // Called directly rather than rendered as <Content />, so that mistakes
    // only found at render time (a stray {word}, a misspelt component) throw
    // here, where we can say which file they're in.
    body = Content({ components: mdxComponents });
  } catch (error) {
    throw new Error(
      [
        `There's a problem with the text of ${lesson.file}:`,
        `  ${describe(error)}`,
        `  MDX treats < and { as the start of code. To show them as text, put them in backticks or write \\< and \\{.`,
        `  Components you can use: ${componentNames.map((name) => `<${name}>`).join(", ")}.`,
      ].join("\n"),
    );
  }

  return <div className="lesson-body">{body}</div>;
}

const componentNames = Object.keys(mdxComponents).filter((name) => /^[A-Z]/.test(name));

function describe(error: unknown) {
  if (typeof error === "object" && error !== null && "reason" in error) {
    const { reason, line, column } = error as { reason: string; line?: number; column?: number };
    return line ? `Line ${line}, column ${column}: ${reason}` : reason;
  }
  return error instanceof Error ? error.message : String(error);
}
