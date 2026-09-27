import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx-components";
import type { GlossaryDefinition as Definition } from "@/lib/glossary";

/**
 * A KeyTerm's definition on the glossary page, compiled as MDX with the same
 * components as the lessons, so **bold**, links and <Term> work here too.
 */
export async function GlossaryDefinition({ definition }: { definition: Definition }) {
  let Content: Awaited<ReturnType<typeof evaluate>>["default"];
  try {
    ({ default: Content } = await evaluate(definition.source, { ...runtime, remarkPlugins: [remarkGfm] }));
  } catch (error) {
    throw new Error(
      `The glossary couldn't show a <KeyTerm> definition from ${definition.lesson.file}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
  return (
    <div className="flex flex-col gap-3 [&_p]:m-0">
      <Content components={mdxComponents} />
    </div>
  );
}
