"use client";

import { useSyncExternalStore } from "react";

// A slim bar under the header while there's no connection. Nothing is stored;
// it follows the browser's online/offline events.
function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

export const OFFLINE_MESSAGE = "You're offline. Lessons you've opened still work.";

export function OfflineNotice() {
  const offline = useSyncExternalStore(subscribe, () => !navigator.onLine, () => false);
  return (
    <div role="status" className="print:hidden">
      {offline && (
        <p className="m-0 border-b border-border bg-surface2 px-(--gut) py-2 text-center text-[16px] leading-[1.4] text-fg">
          {OFFLINE_MESSAGE}
        </p>
      )}
    </div>
  );
}
