import { expect, test } from "@playwright/test";
import { lessonsOf, releasedModules } from "./helpers";

// Every lesson has a visual, and every diagram is readable (the
// lesson-visuals pull request): a diagram is one picture with a full text
// alternative, none of its words are under 13px, and it never overflows the
// page sideways on a phone.

const DIAGRAM_LESSONS = [
  [1, "how-this-course-works"],
  [1, "ethical-considerations"],
  [2, "todays-task"],
  [2, "solo-sprint"],
  [2, "better-prompts-with-ai"],
  [2, "gallery"],
  [3, "what-is-claude-code"],
  [3, "what-it-can-do"],
  [3, "plan-your-extension"],
  [4, "what-are-skills"],
  [5, "when-it-breaks"],
  [6, "key-terms"],
  [6, "push-vs-pull-request"],
  [6, "get-your-code-into-github"],
  [6, "connect-to-vercel"],
  [7, "branch-vs-fork"],
  [7, "pull-request-and-merging"],
  [8, "what-your-site-cant-do"],
] as const;

/** Lessons with no diagram, figure or video on purpose; the course map says why. */
const NO_VISUAL_ON_PURPOSE = new Set([
  "module-1/the-art-of-prompting", // the prompt ladder is its visual
  "module-2/using-refined-prompts", // a two-item checklist; 2.1's loop covers it
  "module-4/homework-review", // four self-review questions
  "module-7/recreate-wordle", // the task's instructions; 7.1 and 7.4 hold its pictures
]);

test.describe("Every lesson has a visual", () => {
  for (const mod of releasedModules()) {
    test(`Module ${mod}: each lesson has a diagram, figure, drawing or video`, async ({ page }) => {
      for (const lesson of lessonsOf(mod)) {
        await page.goto(lesson.href);
        // A video is a card ([data-video]) until play is pressed; only then is it an iframe.
        const visuals = page.locator("figure[data-diagram], .prose img, .prose iframe, .prose [data-video]");
        const count = await visuals.count();
        if (NO_VISUAL_ON_PURPOSE.has(lesson.id)) {
          if (lesson.id === "module-1/the-art-of-prompting") {
            await expect(page.getByText("Tap a label to see what that part does.")).toBeVisible();
          }
          continue;
        }
        expect(count, `${lesson.href} has no visual`).toBeGreaterThan(0);
      }
    });
  }
});

test.describe("Diagrams", () => {
  for (const [mod, slug] of DIAGRAM_LESSONS) {
    test(`${mod}: ${slug} has a readable diagram with a text alternative`, async ({ page }) => {
      const lesson = lessonsOf(mod).find((l) => l.slug === slug)!;
      await page.goto(lesson.href);
      const diagrams = page.locator("figure[data-diagram]");
      expect(await diagrams.count()).toBeGreaterThan(0);
      const pageWidth = await page.evaluate(() => document.documentElement.clientWidth);
      for (const diagram of await diagrams.all()) {
        const picture = diagram.getByRole("img");
        await expect(picture).toBeVisible();
        expect((await picture.getAttribute("aria-label"))?.length ?? 0).toBeGreaterThan(40);
        await expect(diagram.locator("figcaption")).toBeVisible();

        // No words under 13px, and nothing wider than the page.
        const box = await diagram.boundingBox();
        expect(box, "diagram is rendered").not.toBeNull();
        expect(box!.x + box!.width).toBeLessThanOrEqual(pageWidth + 1);
        const smallest = await diagram.evaluate((node) => {
          let min = Infinity;
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          for (let text = walker.nextNode(); text; text = walker.nextNode()) {
            if (!text.textContent?.trim() || !text.parentElement) continue;
            const size = parseFloat(getComputedStyle(text.parentElement).fontSize);
            if (size < min) min = size;
          }
          return min;
        });
        expect(smallest).toBeGreaterThanOrEqual(13);
        expect(await diagram.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      }
    });
  }
});
