import Link from "next/link";
import { Icon } from "@/components/icons";

/** Top of a lesson with `requiresAccount: true` that has no "You'll need" box. */
export function AccountNotice({ lessonId }: { lessonId: string }) {
  return (
    <div role="note" className="on-marigold flex items-start gap-3.5 rounded-md border-2 border-line px-5 py-4 desktop:px-6 desktop:py-5">
      <span className="on-surface box-border grid size-9 flex-none place-items-center rounded border-2 border-line text-accent">
        <Icon name="laptop" size={20} stroke={2} />
      </span>
      <div className="flex flex-col gap-0.5">
        <Link href={`/access?from=${encodeURIComponent(lessonId)}`} className="text-link -my-2">
          Hands-on: needs access
        </Link>
        <p className="m-0">This lesson has a hands-on part. You can read the whole lesson without access.</p>
      </div>
    </div>
  );
}
