"use client";

import Link from "next/link";
import { type CSSProperties, type FocusEvent, useState } from "react";
import s from "@/components/home.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";

// The marigold strip under the homepage cover: the project names, scrolling,
// each a link to the lesson where you build it (the names come from
// components/home-projects.tsx). They run four times over so the loop has no
// seam. Only the first run is reachable with Tab or a screen reader; the
// other three are the same links for a mouse, hidden from both.
//
// The strip stops on hover and while a link in it has focus. A link that
// gets keyboard focus may be half under the edge, or off it, and the browser
// can't scroll the strip to it (it's overflow: clip). So the strip goes back
// to its start, inset by the page gutter, and slides just far enough to show
// the whole name and its focus ring.

export type TickerItem = { name: string; href: string };

/** The focus ring's reach outside a link: a 3px outline, 3px away (globals.css). */
const RING = 6;

export function HomeTicker({ items }: { items: TickerItem[] }) {
  const [shift, setShift] = useState<number | null>(null);

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    const link = event.target;
    const track = link.parentElement;
    // Only keyboard focus: a click on a link must land where the pointer is.
    if (!(link instanceof HTMLAnchorElement) || !track || !link.matches(":focus-visible")) return;
    const strip = event.currentTarget;
    const gut = parseFloat(getComputedStyle(strip).getPropertyValue("--gut")) || 0;
    const left = link.getBoundingClientRect().left - track.getBoundingClientRect().left;
    const right = left + link.getBoundingClientRect().width;
    // The gutter's inset at most; further left only as far as the name needs, never past its own start.
    setShift(Math.max(RING - left, Math.min(gut, strip.clientWidth - gut - RING - right)));
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setShift(null);
  };

  return (
    <PauseOffscreen
      data-ticker=""
      className={`on-marigold ${s.ticker}`}
      data-focus={shift === null ? undefined : ""}
      style={shift === null ? undefined : ({ "--shift": `${shift}px` } as CSSProperties)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className={s.track}>
        {[0, 1, 2, 3].flatMap((copy) =>
          items.flatMap(({ name, href }) => [
            <Link
              key={`${copy}-${name}`}
              href={href}
              className={s.tickerLink}
              {...(copy > 0 && { "aria-hidden": true, tabIndex: -1 })}
            >
              {name}
            </Link>,
            <span key={`${copy}-${name}-star`} aria-hidden="true">
              ✦
            </span>,
          ]),
        )}
      </div>
    </PauseOffscreen>
  );
}
