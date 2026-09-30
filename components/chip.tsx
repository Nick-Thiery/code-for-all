import Link from "next/link";
import { Icon } from "@/components/icons";

// The hands-on chip that marks each hands-on section inside a lesson. (The
// course list marks hands-on lessons with a laptop icon instead.)

/** Links to /access. Pass the lesson id so the access page can link back. */
export function HandsOnChip({ lessonId, className = "" }: { lessonId?: string; className?: string }) {
  const href = lessonId ? `/access?from=${encodeURIComponent(lessonId)}` : "/access";
  return (
    <Link href={href} className={`stamp min-h-8 hover:text-on-marigold hover:underline max-tablet:min-h-11 max-tablet:px-3.5 ${className}`}>
      <Icon name="laptop" size={16} stroke={2.2} />
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
