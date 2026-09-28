// Captures the two example About Me pages as images for lesson 1.6 and the
// Module 2 gallery. Needs Playwright (npx playwright install chromium, or a
// PLAYWRIGHT_BROWSERS_PATH with Chromium in it):
//   node source/about-me-example/capture.mjs
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "..", "..", "public", "lessons");
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const context = await browser.newContext({ viewport: { width: 1000, height: 640 }, deviceScaleFactor: 1.5 });
for (const [file, target] of [
  ["first-draft.html", "module-1/about-me-first-draft.png"],
  ["better.html", "module-2/about-me-better.png"],
]) {
  const page = await context.newPage();
  await page.goto("file://" + path.join(here, file));
  await page.screenshot({ path: path.join(out, target), fullPage: false });
  console.log("wrote", target);
  await page.close();
}
await browser.close();
