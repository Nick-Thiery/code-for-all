import type { Metadata } from "next";
import { OfflinePage } from "@/components/offline-page";

export const metadata: Metadata = {
  title: "You're offline",
  description: "This page hasn't been opened on this device yet, so it isn't saved for offline use.",
};

// Shown by the service worker (public/sw.js) when there's no connection and
// the page asked for was never opened on this device.
export default function Offline() {
  return <OfflinePage />;
}
