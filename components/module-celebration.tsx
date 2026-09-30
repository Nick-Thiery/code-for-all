"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Honeycomb } from "@/components/honeycomb";
import { Icon } from "@/components/icons";
import { dismissCelebration, useCelebration } from "@/lib/celebration";
import { moduleCertificateHref, moduleCompleteHref } from "@/lib/outline";

// A small card that says a module is done, with its honeycomb filling in
// (lib/celebration.ts starts it). It sits in the root layout, so it still
// shows after "Next" has moved on to the following page. With reduced motion
// on, the honeycomb is simply full (app/globals.css).
const SHOW_FOR = 9000;

export function ModuleCelebration() {
  const celebration = useCelebration();
  const pathname = usePathname();
  const card = useRef<HTMLDivElement>(null);

  // Goes by itself after a while, unless someone is using its link or button.
  useEffect(() => {
    if (!celebration) return;
    const hide = () => {
      if (card.current?.contains(document.activeElement)) timer = setTimeout(hide, SHOW_FOR);
      else dismissCelebration();
    };
    let timer = setTimeout(hide, SHOW_FOR);
    return () => clearTimeout(timer);
  }, [celebration]);

  // The Module complete page is the big version of this.
  const onCompletePage = celebration && pathname === moduleCompleteHref(celebration.module);
  const show = celebration && !onCompletePage;

  return (
    // Always in the page, so screen readers announce what appears inside it.
    <div role="status" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-(--gut) tablet:justify-end print:hidden">
      {show && (
        <div
          key={celebration.key}
          ref={card}
          className="pointer-events-auto flex w-full max-w-[420px] items-center gap-4 rounded-md border-2 border-line bg-surface p-4 shadow-h8"
          style={{ animation: "cfaRise 300ms ease both" }}
        >
          <div className="w-[84px] flex-none [&>svg]:h-auto [&>svg]:w-full">
            <Honeycomb lessons={celebration.lessons} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="eyebrow">Module {celebration.module} complete</span>
            <span className="display text-[22px] leading-[1.12]">You finished {celebration.title}.</span>
            <span className="flex flex-wrap gap-x-4">
              <Link href={moduleCertificateHref(celebration.module)} onClick={dismissCelebration} className="text-link min-h-9 text-[16px]">
                Get your certificate →
              </Link>
              <Link href={moduleCompleteHref(celebration.module)} onClick={dismissCelebration} className="text-link min-h-9 text-[16px]">
                See what&apos;s next →
              </Link>
            </span>
          </div>
          <button
            type="button"
            onClick={dismissCelebration}
            aria-label="Close"
            className="grid size-11 flex-none cursor-pointer place-items-center self-start rounded border-2 border-line bg-paper text-ink hover:bg-marigold hover:text-on-marigold"
          >
            <Icon name="cross" size={16} stroke={3} />
          </button>
        </div>
      )}
    </div>
  );
}
