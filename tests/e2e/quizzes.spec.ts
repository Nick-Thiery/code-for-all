import { expect, test } from "@playwright/test";
import { lessonsOf, quizOf, releasedModules, seedStorage } from "./helpers";

// /quizzes: every released module quiz and Check your skills page in one
// place, reading the same saved results as the quizzes themselves.

const RESULTS_KEY = "cfa:quiz-results";
const withQuiz = releasedModules().filter((n) => {
  try {
    return quizOf(n).length > 0;
  } catch {
    return false;
  }
});

test.describe("Quizzes page", () => {
  test("lists every released module quiz, with a friendly empty state before any is taken", async ({ page }) => {
    await page.goto("/quizzes");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Every quiz in one place/i);
    await expect(page.getByRole("heading", { name: "No quizzes taken yet" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Start the Module 1 quiz/ }).first()).toHaveAttribute("href", "/module-1/quiz");

    for (const n of withQuiz) {
      const card = page.getByRole("listitem", { name: new RegExp(`Module ${n}:`) });
      await expect(card).toBeVisible();
      await expect(card.getByText(`${quizOf(n).length} questions on this module's lessons`)).toBeVisible();
      await expect(card.getByText("Not started")).toBeVisible();
      await expect(card.getByRole("link", { name: `Start the Module ${n} quiz` })).toHaveAttribute("href", `/module-${n}/quiz`);
    }
    // The Check your skills quizzes sit in their places.
    await expect(page.getByRole("listitem", { name: "Modules 1 to 5" })).toBeVisible();
    await expect(page.getByRole("listitem", { name: "Modules 1 to 8" })).toBeVisible();
  });

  test("shows the last score, lessons to review as links, and Retake", async ({ page }) => {
    const lesson = lessonsOf(2)[1];
    await seedStorage(page, {
      [RESULTS_KEY]: {
        "module-2/quiz": { correct: 6, total: 8, review: [lesson.id], date: "2026-09-28T10:00:00.000Z" },
        "module-5/check-your-skills": { correct: 8, total: 8, review: [], date: "2026-09-29T10:00:00.000Z" },
      },
    });
    await page.goto("/quizzes");
    await expect(page.getByText("You've taken 2 of")).toBeVisible();
    await expect(page.getByRole("heading", { name: "No quizzes taken yet" })).toHaveCount(0);

    const card = page.getByRole("listitem", { name: /Module 2:/ });
    await expect(card.getByText("Last score: 6 of 8")).toBeVisible();
    await expect(card.getByText("on 28 September 2026")).toBeVisible();
    await expect(card.getByRole("link", { name: new RegExp(lesson.title) })).toHaveAttribute("href", lesson.href);
    await expect(card.getByRole("link", { name: "Retake the Module 2 quiz" })).toHaveAttribute("href", "/module-2/quiz");

    const skills = page.getByRole("listitem", { name: "Modules 1 to 5" });
    await expect(skills.getByText("Last score: 8 of 8")).toBeVisible();
    await expect(skills.getByText("Nothing to review")).toBeVisible();

    // The course grid's quiz card shows the same score.
    await page.goto("/#module-2");
    await expect(page.locator("text=Last score: 6 of 8").locator("visible=true").first()).toBeVisible();
  });

  test("is linked from the header, the footer and the course section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "See all quizzes" })).toHaveAttribute("href", "/quizzes");
    await expect(page.getByRole("navigation", { name: "Footer" }).getByRole("link", { name: "Quizzes" })).toHaveAttribute(
      "href",
      "/quizzes",
    );
    const desktopNav = page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Quizzes" });
    if (await desktopNav.first().isVisible()) {
      await desktopNav.first().click();
    } else {
      await page.getByRole("button", { name: "Menu" }).click();
      await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Quizzes" }).click();
    }
    await expect(page).toHaveURL("/quizzes");
    // The header marks Quizzes as the current page (desktop nav and phone menu).
    await expect(page.locator('header a[href="/quizzes"][aria-current="page"]').first()).toBeAttached();
  });
});
