"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Classes for the scrolling box (padding, font). */
  className?: string;
  /** Classes for the "scroll sideways" line. */
  hintClassName?: string;
};

/**
 * A box that scrolls sideways when its content is too wide (long commands,
 * code, console errors). When it overflows, a line underneath says so, so
 * nothing looks cut off.
 */
export function ScrollArea({ children, className = "", hintClassName = "" }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => {
      setOverflows(el.scrollWidth > el.clientWidth + 1);
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
      <div
        ref={box}
        // Focusable when it scrolls, so keyboard users can scroll it too.
        tabIndex={overflows ? 0 : undefined}
        className={`overflow-x-auto print:overflow-visible ${className}`}
      >
        {children}
      </div>
      {overflows && (
        <p className={`m-0 text-[15px] leading-[1.5] print:hidden ${hintClassName}`}>
          Scroll sideways to see all of it <span aria-hidden="true">→</span>
        </p>
      )}
    </>
  );
}
