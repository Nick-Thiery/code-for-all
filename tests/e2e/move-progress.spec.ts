import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";
import fs from "node:fs";
import { lessonsOf } from "./helpers";

// "Move my progress" (app/move-progress): two separate browser contexts stand
// in for two devices. Device A makes a code, QR link or file; device B loads it.

const DONE = "cfa:completed-lessons";
const MASTERY = "cfa:mastery";
const m1 = lessonsOf(1);
const m2 = lessonsOf(2);
const m3 = lessonsOf(3);

/** A "device" with some progress already on it. */
async function device(browser: Browser, done: string[], levels: Record<string, string> = {}): Promise<BrowserContext> {
  const context = await browser.newContext();
  await context.addInitScript(
    ([d, l, dk, mk]) => {
      if (localStorage.getItem(dk) === null) {
        localStorage.setItem(dk, d);
        localStorage.setItem(mk, l);
      }
    },
    [JSON.stringify(done), JSON.stringify(levels), DONE, MASTERY] as const,
  );
  return context;
}

/** The page's own code, once it's been made. */
async function codeOf(page: Page): Promise<string> {
  const box = page.getByLabel("Your progress code");
  await expect(box).toHaveValue(/^CFA1/);
  return box.inputValue();
}

/** Wait for hydration, so typing isn't wiped when React takes over the form. */
async function hydrated(page: Page) {
  await expect(page.getByText(/On this device:|Nothing to move yet/)).toBeVisible();
}

const readJson = (page: Page, key: string) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), key);

test("paste: the code from device A loads onto an empty device B", async ({ browser }) => {
  const a = await device(browser, [m1[0].id, m1[1].id], { [m1[2].id]: "familiar" });
  const pa = await a.newPage();
  await pa.goto("/move-progress");
  await expect(pa.getByText("On this device: 2 lessons done and 1 lesson with a level")).toBeVisible();
  const code = await codeOf(pa);
  expect(code).toMatch(/^CFA1[ZU][0-9a-f]{4}[A-Za-z0-9_-]+$/);

  const b = await browser.newContext();
  const pb = await b.newPage();
  await pb.goto("/move-progress");
  await expect(pb.getByText("Nothing to move yet")).toBeVisible();
  await pb.getByLabel("Paste a code, or the link from a QR code").fill(code);
  await pb.getByRole("button", { name: "Check the code" }).click();
  await expect(pb.getByText("This code has 2 lessons done and 1 lesson with a level, saved on")).toBeVisible();
  await expect(pb.getByText("This device has no progress yet")).toBeVisible();
  await pb.getByRole("button", { name: "Load it" }).click();
  await expect(pb.getByText("Done. This device now has 2 lessons done and 1 lesson with a level.")).toBeVisible();
  expect(await readJson(pb, DONE)).toEqual([m1[0].id, m1[1].id]);
  expect(await readJson(pb, MASTERY)).toEqual({ [m1[2].id]: "familiar" });
  await pb.getByRole("link", { name: "Go to the course" }).click();
  await expect(pb.getByText(/^2 of \d+ lessons done$/)).toBeVisible();
  await a.close();
  await b.close();
});

test("QR link: opening it on a device with progress offers Combine, which keeps the best of both", async ({ browser }) => {
  const a = await device(browser, [m1[0].id], { [m1[2].id]: "proficient", [m1[1].id]: "attempted" });
  const pa = await a.newPage();
  await pa.goto("/move-progress");
  await expect(pa.getByRole("img", { name: /QR code that opens/ })).toBeVisible();
  const link = `/move-progress#code=${await codeOf(pa)}`;

  const b = await device(browser, [m1[1].id], { [m1[2].id]: "familiar", [m2[0].id]: "mastered" });
  const pb = await b.newPage();
  await pb.goto(link);
  await expect(pb.getByText("This code has 1 lesson done and 2 lessons with a level")).toBeVisible();
  await expect(pb.getByText("This device already has 1 lesson done and 2 lessons with a level.")).toBeVisible();
  expect(pb.url()).not.toContain("#code="); // Taken out of the address bar once read.
  await pb.getByRole("button", { name: "Combine" }).click();
  await expect(pb.getByText("Done. This device now has 2 lessons done and 3 lessons with a level.")).toBeVisible();
  expect(((await readJson(pb, DONE)) as string[]).sort()).toEqual([m1[0].id, m1[1].id].sort());
  expect(await readJson(pb, MASTERY)).toEqual({ [m1[2].id]: "proficient", [m1[1].id]: "attempted", [m2[0].id]: "mastered" });
  await a.close();
  await b.close();
});

test("Replace throws away what's on the device", async ({ browser }) => {
  const a = await device(browser, [m1[0].id]);
  const pa = await a.newPage();
  await pa.goto("/move-progress");
  const code = await codeOf(pa);

  const b = await device(browser, [m3[0].id], { [m3[0].id]: "familiar" });
  const pb = await b.newPage();
  await pb.goto("/move-progress");
  await hydrated(pb);
  await pb.getByLabel("Paste a code, or the link from a QR code").fill(`  ${code}\n`); // Whitespace is fine.
  await pb.getByRole("button", { name: "Check the code" }).click();
  await pb.getByRole("button", { name: "Replace what's here" }).click();
  await expect(pb.getByText("Done. This device now has 1 lesson done.")).toBeVisible();
  expect(await readJson(pb, DONE)).toEqual([m1[0].id]);
  expect(await readJson(pb, MASTERY)).toEqual({});
  await a.close();
  await b.close();
});

test("file: download on device A, choose it on device B", async ({ browser }, testInfo) => {
  const a = await device(browser, [m1[0].id, m1[2].id]);
  const pa = await a.newPage();
  await pa.goto("/move-progress");
  await expect(pa.getByRole("button", { name: "Download the file" })).toBeEnabled();
  const [download] = await Promise.all([pa.waitForEvent("download"), pa.getByRole("button", { name: "Download the file" }).click()]);
  expect(download.suggestedFilename()).toMatch(/^code-for-all-progress-\d{4}-\d{2}-\d{2}\.txt$/);
  const file = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(file);
  expect(fs.readFileSync(file, "utf8")).toMatch(/^CFA1/);

  const b = await browser.newContext();
  const pb = await b.newPage();
  await pb.goto("/move-progress");
  await hydrated(pb);
  await pb.locator("input[type=file]").setInputFiles(file);
  await expect(pb.getByText("This code has 2 lessons done, saved on")).toBeVisible();
  await pb.getByRole("button", { name: "Load it" }).click();
  await expect(pb.getByText("Done. This device now has 2 lessons done.")).toBeVisible();
  await a.close();
  await b.close();
});

test("a bad, old, new or damaged code gets a friendly message, and Cancel backs out", async ({ page }) => {
  await page.goto("/move-progress");
  await hydrated(page);
  const box = page.getByLabel("Paste a code, or the link from a QR code");
  const check = page.getByRole("button", { name: "Check the code" });
  await box.fill("hello there");
  await check.click();
  await expect(page.getByText(/doesn't look like a Code for All progress code/)).toBeVisible();
  await box.fill("CFA0Zabcdefgh");
  await check.click();
  await expect(page.getByText(/older version/)).toBeVisible();
  await box.fill("CFA9Zabcdefgh");
  await check.click();
  await expect(page.getByText(/newer version/)).toBeVisible();

  // A real code with one character missing.
  await page.evaluate(([k, id]) => localStorage.setItem(k, JSON.stringify([id])), [DONE, m1[2].id] as const);
  await page.reload();
  const code = await codeOf(page);
  await box.fill(code.slice(0, 20) + code.slice(21));
  await check.click();
  await expect(page.getByText(/has a mistake in it/)).toBeVisible();

  await box.fill(code);
  await check.click();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText(/This code has/)).toBeHidden();
});
