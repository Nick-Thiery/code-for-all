import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { expect, test } from "@playwright/test";
import { lessonsOf, releasedModules } from "./helpers";

// The Coming soon pages, the Run a session kit and the drawn install
// screenshots (the fill-blanks pull request).

type Planned = { number: number; planned?: string[]; waiting?: string };

/** Modules in course.yml that aren't out yet, with their planned lessons. */
function comingSoon(): Planned[] {
  const source = fs.readFileSync(path.join(process.cwd(), "content", "course.yml"), "utf8");
  const { data } = matter(`---\n${source}\n---\n`);
  const released = new Set(releasedModules());
  return (data.phases as { modules: Planned[] }[])
    .flatMap((phase) => phase.modules)
    .filter((mod) => !released.has(mod.number));
}

test.describe("Coming soon pages", () => {
  for (const mod of comingSoon()) {
    test(`Module ${mod.number} lists what it will cover and what to do while you wait`, async ({ page }) => {
      await page.goto(`/module-${mod.number}`);
      await expect(page.getByText(`Module ${mod.number} · Coming soon`)).toBeVisible();
      if (mod.planned?.length) {
        await expect(page.getByRole("heading", { name: "What this module will cover" })).toBeVisible();
        for (const title of mod.planned) await expect(page.getByText(title, { exact: true })).toBeVisible();
      }
      await expect(page.getByRole("heading", { name: "While you wait" })).toBeVisible();
      if (mod.waiting) await expect(page.getByText(mod.waiting)).toBeVisible();
      // It points back at the latest finished module's Challenge.
      const before = releasedModules().filter((n) => n < mod.number).at(-1);
      if (before) {
        const last = lessonsOf(before).at(-1)!;
        await expect(page.getByRole("link", { name: new RegExp(`Finish the Module ${before} Challenge`) })).toHaveAttribute(
          "href",
          last.href,
        );
      }
    });
  }
});

test.describe("Run a session", () => {
  test("has no Coming soon card in the kit", async ({ page }) => {
    await page.goto("/run-it");
    await expect(page.getByRole("heading", { name: "The session kit" })).toBeVisible();
    await expect(page.locator(".chip", { hasText: "Coming soon" })).toHaveCount(0);
    // The slide PDFs are never linked.
    await expect(page.locator('a[href*="source/slides"], a[href$=".pdf"]')).toHaveCount(0);
  });
});

test.describe("Drawn screenshots", () => {
  test("lesson 3.3 shows three labelled drawings instead of empty screenshot slots", async ({ page }) => {
    const lesson = lessonsOf(3).find((l) => l.slug === "install-claude-code")!;
    await page.goto(lesson.href);
    const drawings = page.locator("figure[data-diagram]");
    await expect(drawings).toHaveCount(3);
    for (const drawing of await drawings.all()) {
      const picture = drawing.getByRole("img");
      await expect(picture).toBeVisible();
      expect((await picture.getAttribute("aria-label"))?.length ?? 0).toBeGreaterThan(40);
      await expect(drawing).toContainText("Simplified drawing");
    }
    await expect(page.getByText("screenshot ·")).toHaveCount(0);
  });
});
