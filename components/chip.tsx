import Link from "next/link";

// The hands-on chip that marks each hands-on section inside a lesson. (The
// course list marks hands-on lessons with a laptop icon instead.)

/** Links to /access. Pass the lesson id so the access page can link back. */
export function HandsOnChip({ lessonId, className = "" }: { lessonId?: string; className?: string }) {
  const href = lessonId ? `/access?from=${encodeURIComponent(lessonId)}` : "/access";
  return (
    <Link href={href} className={`chip no-underline hover:border-accent hover:text-fg ${className}`}>
      Hands-on: needs access
    </Link>
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
