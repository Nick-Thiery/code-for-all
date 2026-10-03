import { expect, test, type Page } from "@playwright/test";
import { lessonsOf, quizOf } from "./helpers";

// Keyboard only: everything that takes focus shows a focus ring, and a quiz
// can be played through with Tab, arrow keys, Space and Enter alone.

type FocusReport = { tag: string; text: string; ring: boolean; hidden: boolean };

/**
 * Tab through the page. For each element that takes focus, check that it,
 * or one of its ancestors (a row or label that draws the ring for a hidden
 * control), has a visible outline or box-shadow ring.
 */
async function tabThrough(page: Page, limit = 300): Promise<FocusReport[]> {
  const seen: FocusReport[] = [];
  await page.locator("body").focus();
  for (let i = 0; i < limit; i++) {
    await page.keyboard.press("Tab");
    const report = await page.evaluate((): FocusReport | "wrapped" | null => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      // Each element is marked the first time it takes focus; meeting a
      // marked one again means Tab has gone all the way round.
      if (el.dataset.kbVisited) return "wrapped";
      el.dataset.kbVisited = "1";
      const ringOn = (node: Element) => {
        const style = getComputedStyle(node);
        const outline = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
        const shadow = style.boxShadow !== "none" && style.boxShadow !== "";
        return outline || shadow;
      };
      let ring = false;
      let node: Element | null = el;
      for (let depth = 0; node && depth < 4 && !ring; depth++, node = node.parentElement) ring = ringOn(node);
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        text: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 60),
        ring,
        hidden: rect.width === 0 || rect.height === 0,
      };
    });
    if (!report || report === "wrapped") break;
    seen.push(report);
  }
  return seen;
}

const pages = [
  { name: "homepage", path: "/" },
  { name: "Contents", path: "/contents" },
  { name: "a lesson", path: lessonsOf(1)[3].href },
  { name: "a module quiz", path: "/module-1/quiz" },
  { name: "Check your skills", path: "/module-5/check-your-skills" },
  { name: "Run a session", path: "/run-it" },
  { name: "the glossary", path: "/glossary" },
  { name: "the quizzes page", path: "/quizzes" },
];

for (const { name, path } of pages) {
  test(`every control on ${name} is reachable with a visible focus ring`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const focused = await tabThrough(page);
    // Every link, button and enabled control in the page should have been
    // reached. A radio group is one Tab stop, however many options it has.
    const controls = await page.evaluate(() => {
      const all = [...document.querySelectorAll<HTMLElement>(
        "a[href]:not([tabindex='-1']), button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex='-1'])",
      )].filter((el) => el.checkVisibility?.() ?? true);
      const radios = new Set(all.filter((el) => el instanceof HTMLInputElement && el.type === "radio").map((el) => (el as HTMLInputElement).name));
      return all.filter((el) => !(el instanceof HTMLInputElement && el.type === "radio")).length + radios.size;
    });
    expect(focused.length, `Tab reached ${focused.length} of ${controls} controls`).toBeGreaterThanOrEqual(controls);
    const noRing = focused.filter((f) => !f.ring);
    expect(noRing, `Focused without a visible ring:\n${JSON.stringify(noRing, null, 2)}`).toEqual([]);
  });
}

test("the homepage's Skip to content link appears on focus and works", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("the course grid's module cards work from the keyboard", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "phone", "Module cards are only on tablet and up; phones get the list.");
  await page.goto("/contents");
  const card = page.getByRole("button", { name: /Module 2/ }).first();
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("region", { name: /Module 2/ })).toBeVisible();
});

test("a module opens in place from the keyboard on phones", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "phone", "The in-place list is the phone layout.");
  await page.goto("/contents");
  const toggle = page.getByRole("button", { name: /Module 2/ }).locator("visible=true").first();
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: new RegExp(lessonsOf(2)[0].title) }).locator("visible=true").first()).toBeVisible();
});

test("a quiz can be played with the keyboard alone", async ({ page }) => {
  const quiz1 = quizOf(1);
  await page.goto("/module-1/quiz");
  const quiz = page.getByRole("region", { name: /quiz/i }).first();
  for (let i = 0; i < quiz1.length; i++) {
    const heading = quiz.getByRole("heading", { name: `Question ${i + 1} of ${quiz1.length}` });
    await expect(heading).toBeVisible();
    if (i > 0) await expect(heading).toBeFocused(); // Focus moves to the new question after "Next".

    // Tab to the radios, pick the right answer with the arrow keys.
    const asked = (await quiz.locator("legend").innerText()).trim();
    const known = quiz1.find((q) => q.question === asked)!;
    const radios = quiz.getByRole("radio");
    const right = known.options.indexOf(known.answer);
    await radios.first().focus();
    await expect(radios.first()).toBeFocused();
    // Space selects the focused radio; arrows move (and select) among them.
    await page.keyboard.press("Space");
    for (let step = 0; step < right; step++) await page.keyboard.press("ArrowDown");
    await expect(quiz.getByRole("radio", { name: known.answer, exact: true })).toBeChecked();

    // Enter in a radio group submits the form: "Check answer".
    await page.keyboard.press("Enter");
    await expect(quiz.getByText("That's right.")).toBeVisible();
    const next = quiz.getByRole("button", { name: /Next question|See how you did/ });
    await expect(next).toBeFocused(); // Focus moves to the Next button after checking.
    await page.keyboard.press("Enter");
  }
  const summary = quiz.getByRole("heading", { name: `You got ${quiz1.length} of ${quiz1.length}.` });
  await expect(summary).toBeVisible();
  await expect(summary).toBeFocused();
  // Try again is reachable and works.
  await quiz.getByRole("button", { name: "Try again" }).focus();
  await page.keyboard.press("Enter");
  await expect(quiz.getByRole("heading", { name: `Question 1 of ${quiz1.length}` })).toBeFocused();
});

test("Check your skills' checklist ticks with Space", async ({ page }) => {
  await page.goto("/module-5/check-your-skills");
  const box = page.getByRole("checkbox", { name: /live at a working URL/ });
  await expect(box).toBeEnabled();
  await box.focus();
  await expect(box).toBeFocused();
  // The box is visually hidden; its label must draw the ring.
  const ring = await box.evaluate((el) => {
    const label = el.closest("label")!;
    const style = getComputedStyle(label);
    return style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
  });
  expect(ring).toBe(true);
  await page.keyboard.press("Space");
  await expect(box).toBeChecked();
});

test("the retry round can be reached and played with the keyboard alone", async ({ page }) => {
  const quiz1 = quizOf(1);
  await page.goto("/module-1/quiz");
  const quiz = page.getByRole("region", { name: /quiz/i }).first();

  /** Tab to the options, pick with Space and the arrow keys, check with Enter, move on with Enter. */
  async function answerWithKeys(heading: string, wrong: boolean) {
    await expect(quiz.getByRole("heading", { name: heading })).toBeFocused();
    const asked = (await quiz.locator("legend").innerText()).trim();
    const q = quiz1.find((item) => item.question === asked)!;
    // The order on screen: a retry reshuffles the options.
    const shown = await quiz.getByRole("radio").evaluateAll((els) => els.map((el) => (el as HTMLInputElement).value));
    const target = wrong ? shown.findIndex((o) => o !== q.answer) : shown.indexOf(q.answer);
    await page.keyboard.press("Tab");
    await expect(quiz.getByRole("radio").first()).toBeFocused();
    await page.keyboard.press("Space");
    for (let step = 0; step < target; step++) await page.keyboard.press("ArrowDown");
    await expect(quiz.getByRole("radio", { name: shown[target], exact: true })).toBeChecked();
    await page.keyboard.press("Enter");
    await expect(quiz.getByRole("button", { name: /Next question|See how you did/ })).toBeFocused();
    await page.keyboard.press("Enter");
  }

  /** Press Tab until `target` has focus. */
  async function tabTo(target: ReturnType<typeof quiz.getByRole>) {
    for (let i = 0; i < 20 && !(await target.evaluate((el) => el === document.activeElement)); i++) {
      await page.keyboard.press("Tab");
    }
    await expect(target).toBeFocused();
  }

  // Focus isn't moved on load, so start at the first question's heading.
  await quiz.getByRole("heading", { name: `Question 1 of ${quiz1.length}` }).focus();
  for (let i = 0; i < quiz1.length; i++) await answerWithKeys(`Question ${i + 1} of ${quiz1.length}`, i < 2);
  await expect(quiz.getByRole("heading", { name: `You got ${quiz1.length - 2} of ${quiz1.length}.` })).toBeFocused();

  // Tab from the summary heading reaches "Try the ones I missed", announced as a button, before Try again.
  const tryMissed = quiz.getByRole("button", { name: "Try the ones I missed" });
  await tabTo(tryMissed);
  await page.keyboard.press("Tab");
  await expect(quiz.getByRole("button", { name: "Try again" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(tryMissed).toBeFocused();
  await page.keyboard.press("Enter");

  // Focus lands on the first retry question's heading, as it does when a quiz starts.
  await answerWithKeys("Retry · question 1 of 2", false);
  await answerWithKeys("Retry · question 2 of 2", false);
  await expect(quiz.getByRole("heading", { name: "You got 2 of the 2 you'd missed." })).toBeFocused();
  await expect(tryMissed).toHaveCount(0);
  await tabTo(quiz.getByRole("button", { name: "Take the whole quiz again" }));
  await page.keyboard.press("Enter");
  await expect(quiz.getByRole("heading", { name: `Question 1 of ${quiz1.length}` })).toBeFocused();
});
