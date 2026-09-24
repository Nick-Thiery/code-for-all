import Link from "next/link";

/** Top of a lesson with `requiresAccount: true`. */
export function AccountNotice({ lessonId }: { lessonId: string }) {
  return (
    <div role="note" className="flex items-start gap-4 rounded-2xl bg-tint px-[22px] py-[18px]">
      <svg width="26" height="28" viewBox="0 0 24 26" aria-hidden="true" className="mt-[3px] flex-none">
        <polygon
          points="12,1.5 22.5,7.5 22.5,18.5 12,24.5 1.5,18.5 1.5,7.5"
          strokeLinejoin="round"
          className="fill-none stroke-accent stroke-[2.2]"
        />
        <text x="12" y="17.8" textAnchor="middle" className="fill-accent font-sans text-[12px] font-bold">
          i
        </text>
      </svg>
      <div className="flex flex-col gap-0.5">
        <Link href={`/access?from=${encodeURIComponent(lessonId)}`} className="text-link -my-2.5">
          Hands-on: needs access
        </Link>
        <p className="m-0">This lesson has a hands-on part. You can read the whole lesson without access.</p>
      </div>
    </div>
  );
}
