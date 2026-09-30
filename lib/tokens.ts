import fs from "node:fs";
import path from "node:path";

/**
 * Colour tokens read from the spec block at the top of app/globals.css, for
 * places that can't use CSS variables (the share image, the manifest, the
 * browser's theme colour) and for the certificate, which stays light in dark
 * mode. The tokens stay defined in one place.
 */

/** The `--name: value` pairs in the first block that starts with `selector {`. */
function declarationsIn(selector: string): Record<string, string> {
  const css = fs.readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");
  const start = css.indexOf(`${selector} {`);
  const block = css.slice(start, css.indexOf("}", start));
  const value = /--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{3,8}|rgba?\([^)]*\)|var\(--[a-z0-9-]+\))/g;
  return Object.fromEntries([...block.matchAll(value)].map((m) => [m[1], m[2]]));
}

/** Follows aliases, so `--bg:var(--paper)` comes back as the paper colour. */
function resolved(declared: Record<string, string>): Record<string, string> {
  const follow = (value: string | undefined, depth = 0): string | undefined => {
    const alias = value && /^var\(--([a-z0-9-]+)\)$/.exec(value)?.[1];
    if (!alias) return value;
    return depth > 8 ? undefined : follow(declared[alias], depth + 1);
  };
  return Object.fromEntries(
    Object.keys(declared).flatMap((name) => {
      const value = follow(declared[name]);
      return value ? [[name, value]] : [];
    }),
  );
}

/** The light theme's tokens. */
export function lightTokens(): Record<string, string> {
  return resolved(declarationsIn(":root"));
}

/** The dark theme's tokens: the dark block's values over the light ones, with the aliases followed again. */
export function darkTokens(): Record<string, string> {
  return resolved({ ...declarationsIn(":root"), ...declarationsIn('[data-theme="dark"]') });
}
