import { expect, test, type Locator, type Page } from "@playwright/test";
import { hasMastery, lessonsOf, quizOf, readStorage, seedStorage } from "./helpers";

// The main learner flows, at phone and desktop widths (playwright.config.ts).
// Progress lives in localStorage, so every test starts with an empty browser.

const module1 = lessonsOf(1);
const quiz1 = quizOf(1);
const PROGRESS_KEY = "cfa:completed-lessons";
const RESULTS_KEY = "cfa:quiz-results";

/** The phone and desktop layouts both render some text; this picks the copy that's actually shown. */
const visible = (locator: Locator) => locator.locator("visible=true").first();

/** Answer a whole module quiz that's on the page. `pick` chooses the option for each question. */
async function answerQuiz(page: Page, pick: (index: number) => "right" | "wrong") {
  const quiz = page.getByRole("region", { name: /quiz/i }).first();
  for (let i = 0; ; i++) {
    const heading = quiz.getByRole("heading", { name: /^Question \d+ of \d+/ });
    await expect(heading).toBeVisible();
    const legend = quiz.locator("legend");
    const asked = (await legend.innerText()).trim();
    const known = quiz1.find((q) => q.question === asked);
    const options = quiz.getByRole("radio");
    if (pick(i) === "right" && known) {
      await quiz.getByRole("radio", { name: known.answer, exact: true }).check();
    } else if (known) {
      const wrong = known.options.find((o) => o !== known.answer)!;
      await quiz.getByRole("radio", { name: wrong, exact: true }).check();
    } else {
      // A mixed quiz from other modules: take the first option.
      await options.first().check();
    }
    await quiz.getByRole("button", { name: "Check answer" }).click();
    const nextButton = quiz.getByRole("button", { name: /Next question|See how you did/ });
    await expect(nextButton).toBeVisible();
    // Buttons are set in capitals by the stylesheet, so compare without case.
    const last = /see how you did/i.test(await nextButton.innerText());
    await nextButton.click();
    if (last) break;
  }
  await expect(quiz.getByRole("heading", { name: /You got \d+ of \d+\./ })).toBeVisible();
}

test.describe("Starting the course", () => {
  test("Start lesson 1 from the homepage opens the first lesson of Module 1", async ({ page }) => {
    await page.goto("/");
    const start = page.getByRole("link", { name: /^Start lesson 1/ }).first();
    await expect(start).toBeVisible();
    await start.click();
    await expect(page).toHaveURL(module1[0].href);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(module1[0].title);
    await expect(visible(page.getByText(`Lesson 1 of ${module1.length}`))).toBeVisible();
  });
});

test.describe("Finishing lessons", () => {
  test("Next marks the lesson done and the homepage remembers it after a reload", async ({ page }) => {
    await page.goto(module1[0].href);
    const next = page.getByRole("navigation", { name: "Lessons" }).getByRole("link", { name: /^Next/ });
    await expect(next).toContainText(module1[1].title);
    await next.click();
    await expect(page).toHaveURL(module1[1].href);

    const done = await readStorage<string[]>(page, PROGRESS_KEY);
    expect(done).toEqual([module1[0].id]);

    await page.goto("/");
    await expect(page.getByText(/^1 of \d+ lessons done$/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Continue" }).first()).toBeVisible();
    await page.reload();
    await expect(page.getByText(/^1 of \d+ lessons done$/)).toBeVisible();
    expect(await readStorage<string[]>(page, PROGRESS_KEY)).toEqual([module1[0].id]);
  });

  test("the recap tick marks a lesson done and unticking un-marks it", async ({ page }) => {
    await page.goto(module1[1].href);
    const tick = page.getByRole("checkbox", { name: "I've finished this lesson" });
    await expect(tick).toBeEnabled();
    await tick.click();
    await expect(tick).toBeChecked();
    expect(await readStorage<string[]>(page, PROGRESS_KEY)).toEqual([module1[1].id]);
    await tick.click();
    await expect(tick).not.toBeChecked();
    expect(await readStorage<string[]>(page, PROGRESS_KEY)).toEqual([]);
  });

  test("finishing the last lesson of a module shows the module-complete celebration", async ({ page }) => {
    const allButLast = module1.slice(0, -1).map((lesson) => lesson.id);
    await seedStorage(page, { [PROGRESS_KEY]: allButLast });
    const last = module1[module1.length - 1];
    await page.goto(last.href);
    const next = page.getByRole("navigation", { name: "Lessons" }).getByRole("link", { name: /^Next/ });
    await expect(next).toContainText("Module 1 quiz");
    await next.click();
    await expect(page).toHaveURL("/module-1/quiz");

    const celebration = page.getByRole("status").filter({ hasText: "Module 1 complete" });
    await expect(celebration).toBeVisible();
    await expect(celebration.getByRole("link", { name: /See what's next/ })).toHaveAttribute("href", "/module-1/complete");
    await celebration.getByRole("button", { name: "Close" }).click();
    await expect(celebration).toBeHidden();
    expect(await readStorage<string[]>(page, PROGRESS_KEY)).toEqual(module1.map((lesson) => lesson.id));
  });
});

test.describe("Quizzes", () => {
  test("a module quiz can be taken, saves its result and shows it on the course page", async ({ page }) => {
    await page.goto("/module-1/quiz");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Module 1 quiz");
    // Get every question right except the second one.
    await answerQuiz(page, (i) => (i === 1 ? "wrong" : "right"));
    const total = quiz1.length;
    await expect(page.getByRole("heading", { name: `You got ${total - 1} of ${total}.` })).toBeVisible();
    // Without mastery levels the summary lists the lesson to review; with them it shows each lesson's level.
    await expect(page.getByText(hasMastery ? /Missed a question/ : /Have another look at this lesson/)).toBeVisible();

    const results = await readStorage<Record<string, { correct: number; total: number; review: string[] }>>(page, RESULTS_KEY);
    expect(results?.["module-1/quiz"]).toMatchObject({ correct: total - 1, total, review: [`module-1/${quiz1[1].lesson}`] });

    await page.reload();
    await expect(page.getByRole("heading", { name: `Last time, you got ${total - 1} of ${total}.` })).toBeVisible();

    await page.goto("/#module-1");
    await expect(visible(page.getByText(`Last score: ${total - 1} of ${total}`))).toBeVisible();

    // The same result, from the same store, on /quizzes.
    await page.goto("/quizzes");
    const card = page.getByRole("listitem", { name: /^Module 1:/ });
    await expect(card.getByText(`Last score: ${total - 1} of ${total}`)).toBeVisible();
  });

  test("Check your skills: the mixed quiz and the checklist both work and are kept", async ({ page }) => {
    await page.goto("/module-5/check-your-skills");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Check your skills");
    await answerQuiz(page, () => "right");
    const results = await readStorage<Record<string, { total: number }>>(page, RESULTS_KEY);
    expect(results?.["module-5/check-your-skills"]?.total).toBe(8);

    const item = page.getByRole("checkbox", { name: /live at a working URL/ });
    await expect(item).toBeEnabled();
    // The box itself is visually hidden; its label is the thing to tap.
    await page.getByText(/live at a working URL/).click();
    await expect(item).toBeChecked();
    await page.reload();
    await expect(page.getByRole("checkbox", { name: /live at a working URL/ })).toBeChecked();
    await expect(page.getByRole("heading", { name: /Last time, you got \d+ of 8\./ })).toBeVisible();
  });

  test("a quiz changes lesson levels (mastery)", async ({ page }) => {
    test.skip(!hasMastery, "Mastery levels aren't part of this checkout.");
    await page.goto("/module-1/quiz");
    await answerQuiz(page, () => "right");
    const levels = await readStorage<Record<string, string>>(page, "cfa:mastery");
    expect(levels).not.toBeNull();
    for (const q of quiz1) expect(levels?.[`module-1/${q.lesson}`]).toBe("familiar");

    await page.goto("/#module-1");
    await expect(page.getByText(/Skill level: Familiar/).first()).toBeAttached();
  });
});
