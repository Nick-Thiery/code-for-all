import fs from "node:fs";
import path from "node:path";

/**
 * Light-mode colour tokens read from app/globals.css, for places that can't
 * use CSS variables (the share image). The tokens stay defined in one place.
 */
export function lightTokens(): Record<string, string> {
  const css = fs.readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");
  const root = css.slice(css.indexOf(":root {"), css.indexOf("}", css.indexOf(":root {")));
  return Object.fromEntries([...root.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{3,8})/g)].map((m) => [m[1], m[2]]));
}
