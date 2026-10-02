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
});
