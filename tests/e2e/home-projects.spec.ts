import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { expect, test, type Page } from "@playwright/test";
import { lessonsOf, releasedModules } from "./helpers";

// The homepage's projects: each "What you'll make" row and each name in the
// marigold ticker goes straight to the lesson where you build that project.

const lessonHrefs = new Set(releasedModules().flatMap((n) => lessonsOf(n).map((lesson) => lesson.href)));
/** The ticker's last name: where learners start a project of their own. */
const OWN_PROJECT = "/module-9";

/** The page is really there: a 200, and it shows its heading. */
async function opens(page: Page, href: string) {
  const response = await page.request.get(href);
  expect(response.status(), `${href} should load`).toBe(200);
  await page.goto(href);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

test.describe("Homepage projects", () => {
  test("every What you'll make row goes to the lesson where you build it", async ({ page }) => {
    await page.goto("/");
    const rows = page.locator("#inside").getByRole("link");
    const hrefs = await rows.evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect(lessonHrefs, `${href} should be a lesson`).toContain(href);
    for (const href of new Set(hrefs)) await opens(page, href);
  });

  test("every name in the ticker is a link to its lesson", async ({ page }) => {
    await page.goto("/");
    const exposed = page.locator("[data-ticker]").getByRole("link");
    const hrefs = await exposed.evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
    expect(hrefs.length).toBeGreaterThan(1);
    expect(hrefs.at(-1)).toBe(OWN_PROJECT);
    for (const href of hrefs.slice(0, -1)) expect(lessonHrefs, `${href} should be a lesson`).toContain(href);
    // The ticker and the rows link to the same lessons.
    const rows = await page.locator("#inside").getByRole("link").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(new Set(hrefs.slice(0, -1))).toEqual(new Set(rows));
    for (const href of new Set(hrefs)) await opens(page, href);
  });

  test("each ticker name has exactly one copy for the keyboard and screen readers", async ({ page }) => {
    await page.goto("/");
    const links = await page.locator("[data-ticker] a").evaluateAll((all) =>
      all.map((link) => ({
        name: link.textContent ?? "",
        exposed: link.getAttribute("aria-hidden") !== "true" && link.getAttribute("tabindex") !== "-1",
        hiddenAndUntabbable: link.getAttribute("aria-hidden") === "true" && link.getAttribute("tabindex") === "-1",
      })),
    );
    const names = [...new Set(links.map((link) => link.name))];
    expect(names.length).toBeGreaterThan(1);
    for (const name of names) {
      const copies = links.filter((link) => link.name === name);
      expect(copies.filter((link) => link.exposed), name).toHaveLength(1);
      expect(copies.filter((link) => link.hiddenAndUntabbable), name).toHaveLength(copies.length - 1);
      await expect(page.locator("[data-ticker]").getByRole("link", { name, exact: true })).toHaveCount(1);
    }
  });

  test("a ticker link with keyboard focus shows its whole name and focus ring", async ({ page }) => {
    await page.goto("/");
    const ticker = page.locator("[data-ticker]");
    const count = await ticker.getByRole("link").count();
    // Tab from the top of the page into the ticker, then through it.
    const inTicker = () => page.evaluate(() => !!document.activeElement?.closest("[data-ticker]"));
    for (let i = 0; i < 40 && !(await inTicker()); i++) await page.keyboard.press("Tab");
    for (let i = 0; i < count; i++) {
      if (i > 0) await page.keyboard.press("Tab");
      const fit = await page.evaluate(() => {
        const link = document.activeElement!;
        const strip = link.closest("[data-ticker]")!.getBoundingClientRect();
        const rect = link.getBoundingClientRect();
        const style = getComputedStyle(link);
        const ring = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
        return {
          name: link.textContent,
          ring: style.outlineStyle !== "none" && ring > 0,
          inside:
            rect.left - ring >= strip.left &&
            rect.right + ring <= strip.right &&
            rect.top - ring >= strip.top &&
            rect.bottom + ring <= strip.bottom,
        };
      });
      expect(fit.ring, `${fit.name} shows a focus ring`).toBe(true);
      expect(fit.inside, `${fit.name} and its focus ring are all on screen`).toBe(true);
    }
  });

  test("the ticker and the cover's cards use keyframes that exist", async ({ page }) => {
    await page.goto("/");
    // A CSS Module renames the animations it uses, so a keyframes rule left
    // outside it never matches and the element just doesn't move.
    const { keyframes, ticker, cards } = await page.evaluate(() => {
      const names: string[] = [];
      const walk = (rules: CSSRuleList) => {
        for (const rule of rules) {
          if (rule instanceof CSSKeyframesRule) names.push(rule.name);
          if ("cssRules" in rule) walk((rule as CSSGroupingRule).cssRules);
        }
      };
      for (const sheet of document.styleSheets) walk(sheet.cssRules);
      const strip = document.querySelector("[data-ticker]")!.firstElementChild!;
      const fan = [...document.querySelectorAll("h1 ~ * a")].filter((a) => getComputedStyle(a).position === "absolute");
      return {
        keyframes: names,
        ticker: getComputedStyle(strip).animationName,
        cards: fan.map((card) => getComputedStyle(card).animationName),
      };
    });
    expect(ticker).not.toBe("none");
    expect(keyframes).toContain(ticker);
    expect(cards.length).toBe(3);
    for (const name of cards) expect(keyframes).toContain(name);
  });
});

// Every module in content/course.yml, released or not, with its one-line summary.
type PlannedModule = { number: number; title: string; summary: string };
const course = matter(`---\n${fs.readFileSync(path.join(process.cwd(), "content", "course.yml"), "utf8")}\n---\n`).data as {
  phases: { modules: PlannedModule[] }[];
};
const planned = course.phases.flatMap((phase) => phase.modules);
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("each module's summary shows under its title on /contents", async ({ page }) => {
  await page.goto("/contents");
  const released = new Set(releasedModules());
  for (const { number, title, summary } of planned) {
    // Released modules are buttons (pressed from 960px, expanded below); Coming soon ones are links.
    const row = page
      .getByRole(released.has(number) ? "button" : "link", { name: new RegExp(`^Module ${number}: `) })
      .locator("visible=true")
      .first();
    await expect(row.getByText(summary, { exact: true })).toBeVisible();
    // A hidden full stop between title and summary, so the name reads as two sentences.
    await expect(row).toHaveAccessibleName(new RegExp(`^Module ${number}: ${escape(title)}\\s*\\.\\s*${escape(summary)}`));
  }
});

