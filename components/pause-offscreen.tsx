"use client";

import { type ComponentProps, useEffect, useRef, useState } from "react";

// A div that sets data-paused while it's scrolled out of view, so CSS can
// stop its animations (animation-play-state) instead of running them unseen.
export function PauseOffscreen(props: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} data-paused={paused || undefined} {...props} />;
}
