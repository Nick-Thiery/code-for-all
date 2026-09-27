"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

/**
 * A link to a course page that shows the full address once the page is in
 * the browser (so a printed handout carries the real address, wherever the
 * site is hosted), and the path before that.
 */
export function CourseLink({ path }: { path: string }) {
  const origin = useSyncExternalStore(
    noSubscribe,
    () => window.location.host,
    () => "",
  );
  return (
    <Link href={path} className="break-all">
      {origin ? `${origin}${path}` : path}
    </Link>
  );
}
