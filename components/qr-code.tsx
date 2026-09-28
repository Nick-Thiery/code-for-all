"use client";

import { useEffect, useState } from "react";

// A QR code drawn as inline SVG. The modules and the quiet zone use the
// --qr-* tokens (app/globals.css), which stay dark-on-light in dark mode so
// any phone camera can read it.

export function QrCode({ text, label, size = 220 }: { text: string; label: string; size?: number }) {
  const [matrix, setMatrix] = useState<{ size: number; path: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    // The library only loads on the page that shows a code.
    import("qrcode").then(({ create }) => {
      if (cancelled) return;
      const qr = create(text, { errorCorrectionLevel: "L" });
      const n = qr.modules.size;
      let path = "";
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) if (qr.modules.get(y, x)) path += `M${x} ${y}h1v1h-1z`;
      }
      setMatrix({ size: n, path });
    });
    return () => {
      cancelled = true;
    };
  }, [text]);

  if (!matrix) {
    return <div style={{ width: size, height: size }} className="rounded-xl bg-qr-bg" aria-hidden="true" />;
  }
  const quiet = 4;
  const total = matrix.size + quiet * 2;
  return (
    <svg
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
      className="rounded-xl bg-qr-bg"
    >
      <rect width={total} height={total} className="fill-qr-bg" />
      <path d={matrix.path} transform={`translate(${quiet} ${quiet})`} className="fill-qr-ink" />
    </svg>
  );
}
