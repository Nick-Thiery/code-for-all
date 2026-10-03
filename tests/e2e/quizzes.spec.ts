import { expect, test, type Page } from "@playwright/test";
import { answerRound, lessonsOf, quizOf, readStorage, releasedModules, seedStorage } from "./helpers";

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
    await page.goto("/contents#module-2");
    await expect(page.locator("text=Last score: 6 of 8").locator("visible=true").first()).toBeVisible();
  });

  test("is linked from the header, the footer and the course section", async ({ page }) => {
    await page.goto("/contents");
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

// "Try the ones I missed": a round of only the questions missed in the round
// just finished. It moves lesson levels like any answer but never replaces
// the saved whole-quiz score, and it lives in memory only.
test.describe("Retry the questions you missed", () => {
  const quiz1 = quizOf(1);
  const quizRegion = (page: Page) => page.getByRole("region", { name: /quiz/i }).first();

  test("a module quiz offers a round of just the missed questions, which moves levels but keeps the saved score", async ({
    page,
  }) => {
    const total = quiz1.length;
    // Miss questions 2, 3 and 4: each tests a different lesson.
    const missed = [1, 2, 3].map((i) => quiz1[i]);
    const lessonOf = (q: { lesson: string }) => `module-1/${q.lesson}`;
    await page.goto("/module-1/quiz");
    await answerRound(page, (asked) => (missed.some((q) => q.question === asked) ? "wrong" : "right"));
    const quiz = quizRegion(page);
    await expect(quiz.getByRole("heading", { name: `You got ${total - 3} of ${total}.` })).toBeVisible();
    await expect(quiz.getByRole("button", { name: "Try again" })).toBeVisible();
    const tryMissed = quiz.getByRole("button", { name: "Try the ones I missed" });
    await expect(tryMissed).toBeVisible();
    // A miss on a lesson that wasn't started makes it Attempted.
    let levels = await readStorage<Record<string, string>>(page, "cfa:mastery");
    for (const q of missed) expect(levels?.[lessonOf(q)]).toBe("attempted");

    await tryMissed.click();
    const first = quiz.getByRole("heading", { name: "Retry · question 1 of 3" });
    await expect(first).toBeVisible();
    await expect(first).toBeFocused();
    // The pips show the retry round's length.
    await expect(quiz.locator("span[aria-hidden='true'].flex-wrap > span")).toHaveCount(3);

    // Right on the first, wrong on the other two.
    const asked = await answerRound(page, (_, i) => (i === 0 ? "right" : "wrong"));
    expect([...asked].sort()).toEqual(missed.map((q) => q.question).sort());
    await expect(quiz.getByRole("heading", { name: "You got 1 of the 3 you'd missed." })).toBeFocused();
    await expect(quiz.getByText(`Your saved score for the whole quiz is still ${total - 3} of ${total}.`)).toBeVisible();
    await expect(quiz.getByText("Still worth another look")).toBeVisible();
    await expect(quiz.getByRole("button", { name: "Take the whole quiz again" })).toBeVisible();

    // The question got right moved its lesson up; the two still wrong stay Attempted.
    const rightOne = quiz1.find((q) => q.question === asked[0])!;
    levels = await readStorage<Record<string, string>>(page, "cfa:mastery");
    expect(levels?.[lessonOf(rightOne)]).toBe("familiar");
    for (const q of missed.filter((q) => q !== rightOne)) expect(levels?.[lessonOf(q)]).toBe("attempted");

    // The saved score is still the whole quiz's.
    const results = await readStorage<Record<string, { correct: number; total: number }>>(page, "cfa:quiz-results");
    expect(results?.["module-1/quiz"]).toMatchObject({ correct: total - 3, total });

    // Again with the two still missed, all right this time: no more retry button.
    await quiz.getByRole("button", { name: "Try the ones I missed" }).click();
    await expect(quiz.getByRole("heading", { name: "Retry · question 1 of 2" })).toBeFocused();
    await answerRound(page, () => "right");
    await expect(quiz.getByRole("heading", { name: "You got 2 of the 2 you'd missed." })).toBeVisible();
    await expect(quiz.getByText("You got them all this time. Well done.")).toBeVisible();
    await expect(quiz.getByRole("button", { name: "Try the ones I missed" })).toHaveCount(0);

    await page.goto("/quizzes");
    const card = page.getByRole("listitem", { name: /^Module 1:/ });
    await expect(card.getByText(`Last score: ${total - 3} of ${total}`)).toBeVisible();

    // Memory only: after a reload it's the normal quiz, with no retry button.
    await page.goto("/module-1/quiz");
    await expect(quiz.getByRole("heading", { name: `Last time, you got ${total - 3} of ${total}.` })).toBeVisible();
    await expect(quiz.getByRole("button", { name: "Try the ones I missed" })).toHaveCount(0);
    // Nothing new in localStorage: only what the quiz always saved.
    expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(["cfa:mastery", "cfa:quiz-results"]);
  });

  test("Take the whole quiz again starts the full quiz", async ({ page }) => {
    await page.goto("/module-1/quiz");
    await answerRound(page, (_, i) => (i === 0 ? "wrong" : "right"));
    const quiz = quizRegion(page);
    await quiz.getByRole("button", { name: "Try the ones I missed" }).click();
    await expect(quiz.getByRole("heading", { name: "Retry · question 1 of 1" })).toBeFocused();
    await answerRound(page, () => "wrong");
    await expect(quiz.getByRole("heading", { name: "The one you'd missed is still wrong." })).toBeVisible();
    await quiz.getByRole("button", { name: "Take the whole quiz again" }).click();
    await expect(quiz.getByRole("heading", { name: `Question 1 of ${quiz1.length}` })).toBeFocused();
  });

  test("Check your skills retries the same missed questions, not a new mix", async ({ page }) => {
    await page.goto("/module-5/check-your-skills");
    const asked = await answerRound(page, (_, i) => (i < 2 ? "wrong" : "right"));
    const quiz = quizRegion(page);
    await expect(quiz.getByRole("heading", { name: "You got 6 of 8." })).toBeVisible();
    await quiz.getByRole("button", { name: "Try the ones I missed" }).click();
    await expect(quiz.getByRole("heading", { name: /^Retry · question 1 of 2/ })).toBeFocused();
    const retried = await answerRound(page, () => "right");
    expect([...retried].sort()).toEqual(asked.slice(0, 2).sort());
    await expect(quiz.getByRole("heading", { name: "You got 2 of the 2 you'd missed." })).toBeVisible();
    const results = await readStorage<Record<string, { correct: number; total: number }>>(page, "cfa:quiz-results");
    expect(results?.["module-5/check-your-skills"]).toMatchObject({ correct: 6, total: 8 });
  });

  test("there's no retry button when every answer was right", async ({ page }) => {
    await page.goto("/module-1/quiz");
    await answerRound(page, () => "right");
    const quiz = quizRegion(page);
    await expect(quiz.getByRole("heading", { name: `You got ${quiz1.length} of ${quiz1.length}.` })).toBeVisible();
    await expect(quiz.getByRole("button", { name: "Try again" })).toBeVisible();
    await expect(quiz.getByRole("button", { name: "Try the ones I missed" })).toHaveCount(0);
  });
});
