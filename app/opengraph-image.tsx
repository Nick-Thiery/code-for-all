import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { lightTokens } from "@/lib/tokens";

export const alt = "Code for All: build real things with AI. A free course for beginners.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * A font for the share image, fetched from Google Fonts when the site is
 * built (the image is made once, then served as a file, so no visitor's
 * browser ever asks Google for anything). Only the letters in `text` are
 * fetched. If it can't be reached, the image falls back to the default font.
 */
async function googleFont(family: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`, {
      cache: "force-cache",
    }).then((response) => response.text());
    const url = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(css)?.[1];
    if (!url) return null;
    const font = await fetch(url, { cache: "force-cache" });
    return font.ok ? await font.arrayBuffer() : null;
  } catch {
    return null;
  }
}

const ISSUE = site.issueLine.toUpperCase();
const HEADLINE = ["BUILD", "THINGS WITH", "AI."];
const REAL = "real";
const STICKER = { big: "Free", small: "NO SIGN-UP" };

// The share image for every page: the cover. The logo on paper across the
// top, then the headline on navy with its marigold sticker.
export default async function OpengraphImage() {
  const t = lightTokens();
  const logo = fs.readFileSync(path.join(process.cwd(), "public/cfa-logo-light.png")).toString("base64");
  const [display, label, serif] = await Promise.all([
    // Google serves fixed widths only: extra-condensed (62.5%) is the nearest
    // to the site's 66% headlines, semi-condensed (87.5%) to its 85% labels.
    googleFont("Archivo:wdth,wght@62.5,800", HEADLINE.join("")),
    googleFont("Archivo:wdth,wght@87.5,800", ISSUE + STICKER.small),
    googleFont("Newsreader:ital,opsz,wght@1,72,500", REAL + STICKER.big),
  ]);
  const fonts = [
    ...(display ? [{ name: "Display", data: display, weight: 800 as const, style: "normal" as const }] : []),
    ...(label ? [{ name: "Label", data: label, weight: 800 as const, style: "normal" as const }] : []),
    ...(serif ? [{ name: "Serif", data: serif, weight: 500 as const, style: "italic" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: t.navy, color: t["on-navy"] }}>
        <div
          style={{
            height: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 64px",
            background: t.paper,
            borderBottom: `4px solid ${t.line}`,
          }}
        >
          <img src={`data:image/png;base64,${logo}`} width={223} height={70} alt="" />
          <div style={{ fontFamily: "Label", fontSize: 22, letterSpacing: 3, color: t.navy }}>{ISSUE}</div>
        </div>
        <div style={{ flex: 1, display: "flex", position: "relative", padding: "34px 64px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Display", fontSize: 176, lineHeight: 0.86 }}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              {HEADLINE[0]}
              <span style={{ marginLeft: 30, fontFamily: "Serif", fontStyle: "italic", fontSize: 184, color: t.marigold, transform: "translateY(14px)" }}>{REAL}</span>
            </div>
            <div style={{ display: "flex" }}>{HEADLINE[1]}</div>
            <div style={{ display: "flex" }}>{HEADLINE[2]}</div>
          </div>
          <div
            style={{
              position: "absolute",
              right: 72,
              bottom: 56,
              width: 210,
              height: 210,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 105,
              border: `4px solid ${t.line}`,
              background: t.marigold,
              boxShadow: `8px 8px 0 ${t.shadow}`,
              color: t["on-marigold"],
              transform: "rotate(12deg)",
            }}
          >
            <div style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: 66, lineHeight: 1 }}>{STICKER.big}</div>
            <div style={{ marginTop: 6, fontFamily: "Label", fontSize: 20, letterSpacing: 2 }}>{STICKER.small}</div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
