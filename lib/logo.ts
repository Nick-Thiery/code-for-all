import fs from "node:fs";
import path from "node:path";

export type LogoFiles = { light: string; dark: string };

// The logo files in public/. An SVG version, if one is ever added, is preferred
// over the PNGs: cfa-logo.svg for light mode, cfa-logo-dark.svg for dark mode.
// The PNGs are the original artwork (cfa-logo.png) with a transparent
// background, and a dark-mode copy that differs only in colour.
export function getLogoFiles(): LogoFiles {
  const has = (file: string) => fs.existsSync(path.join(process.cwd(), "public", file));
  return {
    light: has("cfa-logo.svg") ? "/cfa-logo.svg" : "/cfa-logo-light.png",
    dark: has("cfa-logo-dark.svg") ? "/cfa-logo-dark.svg" : "/cfa-logo-dark.png",
  };
}
