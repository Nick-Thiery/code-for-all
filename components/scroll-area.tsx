"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Classes for the scrolling box (padding, font). */
  className?: string;
  /** The box's background, so the fade at the right edge blends in. */
  fade: string;
  /** Classes for the "scroll sideways" line. */
  hintClassName?: string;
};

/**
 * A box that scrolls sideways when its content is too wide (long commands,
 * code, console errors). When it overflows, a fade at the right edge and a
 * line underneath say so, so nothing looks cut off.
 */
export function ScrollArea({ children, className = "", fade, hintClassName = "" }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => {
      setOverflows(el.scrollWidth > el.clientWidth + 1);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <>
      <div className="relative" style={{ "--fade": fade } as CSSProperties}>
        <div
          ref={box}
          // Focusable when it scrolls, so keyboard users can scroll it too.
          tabIndex={overflows ? 0 : undefined}
          className={`overflow-x-auto print:overflow-visible ${className}`}
        >
          {children}
        </div>
        {overflows && !atEnd && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-(--fade) to-transparent print:hidden"
          />
        )}
      </div>
      {overflows && (
        <p className={`m-0 text-[15px] leading-[1.5] print:hidden ${hintClassName}`}>
          Scroll sideways to see all of it <span aria-hidden="true">→</span>
        </p>
      )}
    </>
  );
}
