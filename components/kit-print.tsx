"use client";

import { useEffect } from "react";
import { applyTheme } from "@/lib/theme";

/** Opens the print dialog for this page. Hidden on paper. */
export function PrintButton({ label = "Print", className = "btn btn-primary" }: { label?: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={`${className} print:hidden`}>
      {label}
    </button>
  );
}

/**
 * Put once on every session kit page. It:
 * - opens the print dialog when the page is loaded with ?print=1 (the
 *   "Print" links on /run-it), then takes ?print=1 out of the address so a
 *   reload doesn't print again;
 * - prints in light colours even when the site is in dark mode, by switching
 *   to the light theme while printing and back afterwards (without saving it).
 */
export function PrintSetup() {
  useEffect(() => {
    let restore: "dark" | null = null;
    const toLight = () => {
      if (document.documentElement.dataset.theme === "dark") {
        restore = "dark";
        applyTheme("light", { save: false });
      }
    };
    const back = () => {
      if (restore) applyTheme(restore, { save: false });
      restore = null;
    };
    const print = window.matchMedia("print");
    const onMedia = (event: MediaQueryListEvent) => (event.matches ? toLight() : back());
    window.addEventListener("beforeprint", toLight);
    window.addEventListener("afterprint", back);
    print.addEventListener("change", onMedia);
    if (print.matches) toLight();

    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    const url = new URL(window.location.href);
    if (url.searchParams.get("print") === "1") {
      // Let the fonts arrive first, so the printout uses them.
      document.fonts.ready.then(() => {
        if (cancelled) return;
        timer = setTimeout(() => {
          url.searchParams.delete("print");
          window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
          window.print();
        }, 100);
      });
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener("beforeprint", toLight);
      window.removeEventListener("afterprint", back);
      print.removeEventListener("change", onMedia);
      back();
    };
  }, []);

  return null;
}
