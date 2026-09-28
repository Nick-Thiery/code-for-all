import { expect, test } from "@playwright/test";
import { lessonsOf, readStorage } from "./helpers";

// The Help page, the device guide, You'll need boxes, saved work that
// follows the learner, tappable terms and the Stuck box's Help link (the
// learner-help pull request).

const SAVED_WORK_KEY = "cfa:saved-work";
const QUESTIONS = [
  "I don't have a laptop.",
  "My school device won't let me install things.",
  "I can't sign up for a tool.",
  "My internet or data is limited.",
  "I'm on a new device and my progress is gone.",
  "Something broke and I don't know why.",
  "What does this word mean?",
  "Who can I ask?",
];

test.describe("Help page", () => {
  test("answers every question and links to access, the glossary and Move my progress", async ({ page }) => {
    await page.goto("/help");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Stuck? Start here.");
    for (const question of QUESTIONS) {
      await expect(page.getByRole("heading", { name: question, level: 2 })).toBeVisible();
    }
    await expect(page.locator('a[href="/access"]').first()).toBeVisible();
    await expect(page.locator('a[href="/glossary"]').first()).toBeVisible();
    await expect(page.locator('a[href="/move-progress"]').first()).toBeVisible();
    await expect(page.locator('a[href="/access#devices"]').first()).toBeVisible();
    // The copyable "here's the error" prompt.
    await expect(page.getByText("Prompt: Here's the error, please help")).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy" }).first()).toBeVisible();
  });

  test("is linked from the footer and from a lesson's Stuck box", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Footer" }).getByRole("link", { name: "Help" })).toHaveAttribute("href", "/help");

    const lesson = lessonsOf(1).find((l) => l.slug === "meet-lovable")!;
    await page.goto(lesson.href);
    await page.getByRole("button", { name: /Stuck\?/ }).click();
    await expect(page.getByRole("link", { name: "Help page" })).toHaveAttribute("href", "/help");
  });
});

test.describe("Device guide and cost", () => {
  test("/access says what each device can do and that nothing costs anything", async ({ page }) => {
    await page.goto("/access#devices");
    await expect(page.getByRole("heading", { name: "Which device do you have?" })).toBeVisible();
    for (const device of ["Windows or Mac laptop", "Chromebook, or a school device that blocks installs", "iPad or phone"]) {
      await expect(page.getByRole("heading", { name: device })).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "What does it cost?" })).toBeVisible();
    await expect(page.locator('a[href="/move-progress"]').first()).toBeVisible();
  });
});

test.describe("You'll need", () => {
  test("a hands-on lesson opens with device, access, earlier work and time", async ({ page }) => {
    const lesson = lessonsOf(1).find((l) => l.slug === "build-about-me")!;
    await page.goto(lesson.href);
    const box = page.getByRole("region", { name: "You'll need" });
    await expect(box).toBeVisible();
    for (const label of ["Device", "Access", "From earlier", "Time"]) {
      await expect(box.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(box.getByText(/About \d+ minutes/)).toBeVisible();
    await expect(box.getByRole("link", { name: "Which device do you have?" })).toHaveAttribute("href", "/access#devices");
  });
});

test.describe("Saved work", () => {
  test("text saved in one lesson is shown back with Copy in the next, and nothing is sent anywhere", async ({ page }) => {
    const sprint = lessonsOf(2).find((l) => l.slug === "solo-sprint")!;
    const refine = lessonsOf(2).find((l) => l.slug === "better-prompts-with-ai")!;
    const prompt = "Create a quiz site about noodles, for teenagers, colourful, works on a phone.";

    await page.goto(sprint.href);
    const box = page.getByLabel("Your exact prompt for Lovable");
    await expect(box).toBeEditable();
    await box.fill(prompt);
    await expect(page.getByText("Saved on this device.")).toBeVisible();
    expect(await readStorage<Record<string, string>>(page, SAVED_WORK_KEY)).toEqual({ "solo-sprint-prompt": prompt });

    await page.goto(refine.href);
    await expect(page.getByText("Here's your exact prompt from the solo sprint.")).toBeVisible();
    await expect(page.locator("pre", { hasText: prompt })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy" }).first()).toBeVisible();

    // Emptying the box forgets it, and the later lesson offers the sample instead.
    await page.goto(sprint.href);
    await page.getByLabel("Your exact prompt for Lovable").fill("");
    expect(await readStorage(page, SAVED_WORK_KEY)).toBeNull();
    await page.goto(refine.href);
    await expect(page.getByText(/Nothing saved yet/)).toBeVisible();
    await expect(page.getByRole("link", { name: /go back to the solo sprint/ })).toHaveAttribute("href", sprint.href);
  });

  test("the practice card keeps its draft on this device and lesson 1.6 shows it", async ({ page }) => {
    const practice = lessonsOf(1).find((l) => l.slug === "the-art-of-prompting")!;
    const build = lessonsOf(1).find((l) => l.slug === "build-about-me")!;
    await page.goto(practice.href);
    const draft = "Role: web designer. Goal: an About me site for a teenager who likes badminton.";
    await page.getByLabel("Your prompt").fill(draft);
    await page.goto(build.href);
    await expect(page.locator("pre", { hasText: draft })).toBeVisible();
  });
});

test.describe("Tappable terms", () => {
  test("a term without its own definition shows the glossary's, with a link to the entry", async ({ page }) => {
    // 3.4 uses <Term>Chrome extension</Term>, defined inline in 1.2.
    const lesson = lessonsOf(3).find((l) => l.slug === "quick-business-lesson")!;
    await page.goto(lesson.href);
    const term = page.getByRole("button", { name: "Chrome extension" }).first();
    await term.click();
    await expect(term).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(/Chrome extension:/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Glossary/ }).first()).toHaveAttribute("href", /^\/glossary#term-/);
  });

  test("the glossary lists inline definitions too", async ({ page }) => {
    await page.goto("/glossary");
    await expect(page.locator("#term-chrome-extension")).toBeVisible();
    await expect(page.locator("#term-terminal")).toBeVisible();
  });
});
