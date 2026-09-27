import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { lightTokens } from "@/lib/tokens";

// /manifest.webmanifest: lets phones install the site as an app. Colours are
// the brand tokens (app/globals.css) and the icons are the logo's hexagon
// (public/icons, made from app/icon.svg).
export default function manifest(): MetadataRoute.Manifest {
  const t = lightTokens();
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: t.bg,
    theme_color: t.accent,
    lang: "en-GB",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
