import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { lightTokens } from "@/lib/tokens";

export const alt = "Code for All: build real things with AI. A free course for beginners.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The share image for every page: the logo, the tagline and the course line.
export default function OpengraphImage() {
  const t = lightTokens();
  const logo = fs.readFileSync(path.join(process.cwd(), "public/cfa-logo-light.png")).toString("base64");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 88px",
          background: t.bg,
          color: t.text,
          borderBottom: `24px solid ${t.accent}`,
        }}
      >
        <img src={`data:image/png;base64,${logo}`} width={401 * 1.4} height={126 * 1.4} alt="" />
        <div style={{ marginTop: 56, fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
          {site.tagline}
        </div>
        <div style={{ marginTop: 20, fontSize: 34, color: t.muted }}>A free course for beginners, 13 to 16.</div>
      </div>
    ),
    size,
  );
}
