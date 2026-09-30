import Link from "next/link";
import { Icon } from "@/components/icons";

/** Top of a lesson with `requiresAccount: true` that has no "You'll need" box. */
export function AccountNotice({ lessonId }: { lessonId: string }) {
  return (
    <div className="rail-block flex flex-col gap-3.5">
      <span className="rail-label">Before you start</span>
      <div
        role="note"
        className="on-marigold flex items-start gap-4 rounded-md border-2 border-line px-[22px] py-5 shadow-h6 desktop:px-8 desktop:py-6 desktop:shadow-h8"
      >
        <span className="on-surface box-border grid size-12 flex-none place-items-center rounded-md border-2 border-line text-accent">
          <Icon name="laptop" size={28} stroke={1.9} />
        </span>
        <div className="flex flex-col gap-0.5">
          <Link href={`/access?from=${encodeURIComponent(lessonId)}`} className="text-link -my-2">
            Hands-on: needs access
          </Link>
          <p className="m-0">This lesson has a hands-on part. You can read the whole lesson without access.</p>
        </div>
      </div>
    </div>
  );
}
