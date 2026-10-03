import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { answerRound, lessonsOf, settled, useTheme } from "./helpers";

// axe-core on every kind of page, in light and dark. Serious and critical
// findings fail the test; anything milder is attached to the report and
// printed, so it can be read without failing the build.

const promptLadderLesson = lessonsOf(1).find((lesson) => lesson.slug === "the-art-of-prompting")!;
const diagramLesson = lessonsOf(1).find((lesson) => lesson.slug === "what-is-vibe-coding")!;

const pages: { name: string; path: string }[] = [
  { name: "homepage", path: "/" },
  { name: "Contents", path: "/contents" },
  { name: "a lesson", path: lessonsOf(1)[0].href },
  { name: "the prompt ladder lesson", path: promptLadderLesson.href },
  { name: "a diagram lesson", path: diagramLesson.href },
  { name: "a module quiz", path: "/module-1/quiz" },
  { name: "Check your skills", path: "/module-5/check-your-skills" },
  { name: "a module page (coming soon)", path: "/module-9" },
  { name: "Module complete", path: "/module-1/complete" },
  { name: "Run a session", path: "/run-it" },
  { name: "the glossary", path: "/glossary" },
  { name: "the quizzes page", path: "/quizzes" },
  { name: "privacy", path: "/privacy" },
  { name: "access", path: "/access" },
  { name: "help", path: "/help" },
  { name: "a lesson with several new diagrams", path: lessonsOf(6).find((lesson) => lesson.slug === "key-terms")!.href },
  { name: "a hands-on lesson with a You'll need box", path: lessonsOf(2).find((lesson) => lesson.slug === "solo-sprint")!.href },
  { name: "Move my progress", path: "/move-progress" },
  { name: "the offline page", path: "/offline" },
  { name: "a certificate (locked)", path: "/module-1/certificate" },
];

/** Serious and critical findings fail; milder ones are attached and printed. */
async function expectNoSeriousIssues(page: Page, testInfo: TestInfo, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();

  const summary = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 5),
  }));
  const blocking = summary.filter((v) => v.impact === "serious" || v.impact === "critical");
  const minor = summary.filter((v) => v.impact !== "serious" && v.impact !== "critical");
  if (minor.length > 0) {
    await testInfo.attach("minor-and-moderate.json", {
      body: JSON.stringify(minor, null, 2),
      contentType: "application/json",
    });
    console.log(`[axe] ${label} (${testInfo.project.name}): ${minor.map((v) => `${v.impact}: ${v.id}`).join(", ")}`);
  }
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} mode`, () => {
    for (const { name, path } of pages) {
      test(`${name} has no serious or critical accessibility issues`, async ({ page }, testInfo) => {
        await useTheme(page, theme);
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        // Let client-only parts (progress, quiz questions) and entrance animations settle.
        await page.waitForLoadState("networkidle");
        await settled(page);

        await expectNoSeriousIssues(page, testInfo, `${theme} · ${name}`);
      });
    }

    test("a quiz's retry round and its summary have no serious or critical accessibility issues", async ({ page }, testInfo) => {
      await useTheme(page, theme);
      await page.goto("/module-1/quiz");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await answerRound(page, (_, i) => (i < 2 ? "wrong" : "right"));
      // The summary with both buttons.
      await settled(page);
      await expectNoSeriousIssues(page, testInfo, `${theme} · quiz summary with Try the ones I missed`);

      await page.getByRole("button", { name: "Try the ones I missed" }).click();
      await expect(page.getByRole("heading", { name: "Retry · question 1 of 2" })).toBeVisible();
      await settled(page);
      await expectNoSeriousIssues(page, testInfo, `${theme} · retry question`);

      await answerRound(page, (_, i) => (i === 0 ? "right" : "wrong"));
      await expect(page.getByRole("heading", { name: "You got 1 of the 2 you'd missed." })).toBeVisible();
      await settled(page);
      await expectNoSeriousIssues(page, testInfo, `${theme} · retry summary`);
    });
  });
}
