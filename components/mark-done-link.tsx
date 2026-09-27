"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { type ModuleInfo, markLessonDone } from "@/lib/celebration";

/** A link that marks a lesson done when it's followed: the "Next" card at the end of a lesson. */
export function MarkDoneLink({
  lessonId,
  module,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { lessonId: string; module: ModuleInfo }) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        markLessonDone(lessonId, module);
        onClick?.(event);
      }}
    />
  );
}
