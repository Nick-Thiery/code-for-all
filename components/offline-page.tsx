"use client";

import Link from "next/link";
import { PageBody, PageHeader } from "@/components/page-header";
import { contentsHref } from "@/lib/outline";

export function OfflinePage() {
  return (
    <article>
      <PageHeader tone="marigold" kicker="No connection" title="You're offline.">
        <p>
          Lessons you&apos;ve opened still work. This page hasn&apos;t been opened on this device yet, so it
          isn&apos;t saved. Try again once you&apos;re back online.
        </p>
      </PageHeader>
      <PageBody>
        <div className="flex flex-wrap gap-4">
          <button type="button" onClick={() => window.location.reload()} className="btn btn-primary">
            Try again
          </button>
          <Link href={contentsHref} className="btn btn-secondary">
            Back to the course
          </Link>
        </div>
      </PageBody>
    </article>
  );
}
