"use client";

import { type ComponentProps, useEffect, useRef } from "react";

// Plays a block's entrance animation once, when it scrolls into view. The
// animations are CSS (the [data-reveal] rules in app/globals.css); this only
// says when.
//
// A block that's off screen when the page loads is "armed" (held at its
// start), then set to "play" as it comes in. A block that's already in view
// is left alone, so nothing on screen ever blinks out to animate back in.
// Without JavaScript, or with reduced motion, every block just shows its
// finished state.
export function Reveal(props: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let first = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          if (entry.isIntersecting) observer.disconnect();
          else el.dataset.reveal = "armed";
          return;
        }
        if (entry.isIntersecting) {
          el.dataset.reveal = "play";
          observer.disconnect();
        }
      },
      // A little way in from the bottom edge, so the start isn't missed.
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} {...props} />;
}
