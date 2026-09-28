"use client";

import Link from "next/link";
import { Hex } from "@/components/hex";

export function OfflinePage() {
  return (
    <div className="px-(--gut)">
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-[18px] py-(--sec) text-center">
        <Hex width={64} height={70} shape="fill-tint stroke-deco stroke-[2.5]" className="mb-2" />
        <span className="eyebrow">No connection</span>
        <h1 className="t-h1 m-0">You&apos;re offline.</h1>
        <p className="m-0 max-w-[30em]">
          Lessons you&apos;ve opened still work. This page hasn&apos;t been opened on this device yet, so it
          isn&apos;t saved. Try again once you&apos;re back online.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-secondary">
            Back to the course
          </Link>
        </div>
      </div>
    </div>
  );
}
