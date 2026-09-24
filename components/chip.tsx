import Link from "next/link";
import { Hex } from "@/components/hex";

// The small labels on the course track. The hands-on chip also marks each
// hands-on section inside a lesson, so learners see the same label in both
// places.

/** Links to /access. Pass the lesson id so the access page can link back. */
export function HandsOnChip({ lessonId, className = "" }: { lessonId?: string; className?: string }) {
  const href = lessonId ? `/access?from=${encodeURIComponent(lessonId)}` : "/access";
  return (
    <Link href={href} className={`chip no-underline hover:border-accent hover:text-fg ${className}`}>
      Hands-on: needs access
    </Link>
  );
}

export function PracticeChip() {
  return (
    <span className="chip chip-practice">
      <Hex width={10} height={11} shape="fill-deco" />
      Includes practice
    </span>
  );
}

/** For MDX: put <HandsOn /> on the line above a hands-on section's heading. */
export function HandsOn() {
  return (
    <p className="hands-on">
      <HandsOnChip />
    </p>
  );
}
