"use client";

import { useEffect } from "react";

// Registers public/sw.js, which keeps opened pages for offline use. The build
// id in the address makes each deploy a new worker (see next.config.ts). In
// development there's no worker, and any old one is removed.
export function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((all) => all.forEach((r) => r.unregister())).catch(() => {});
      return;
    }
    navigator.serviceWorker
      .register(`/sw.js?v=${process.env.NEXT_PUBLIC_BUILD_ID ?? "1"}`)
      .then(async () => {
        // The page that installs the worker loaded before the worker could
        // keep it. Ask the worker to fetch and keep it now, so the first
        // lesson a learner opens works offline too, not just the second.
        // Asked again whenever a new worker takes over (after a deploy),
        // since the new worker starts with an empty cache.
        await navigator.serviceWorker.ready;
        const keep = () => navigator.serviceWorker.controller?.postMessage({ type: "keep", url: location.href });
        keep();
        navigator.serviceWorker.addEventListener("controllerchange", keep);
      })
      .catch(() => {
        // Not supported here (or blocked): the site works as before, just not offline.
      });
  }, []);
  return null;
}
