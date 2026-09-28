import { expect, test } from "@playwright/test";
import fs from "node:fs";
import { lessonsOf, seedStorage } from "./helpers";

// Certificates (app/[module]/certificate, app/certificate): locked until every
// lesson is done, the name kept on the device, print as one A4 page, and a PNG.

const DONE = "cfa:completed-lessons";
const NAME = "cfa:certificate-name";
const module1 = lessonsOf(1).map((lesson) => lesson.id);

test("locked until every lesson is done; then the name, the PNG and a one-page print", async ({ page }) => {
  await page.goto("/module-1/certificate");
  await expect(page.getByText("Not quite yet.")).toBeVisible();
  await expect(page.getByText(`You've done 0 of ${module1.length} lessons.`)).toBeVisible();

  await page.evaluate(([k, ids]) => localStorage.setItem(k, JSON.stringify(ids)), [DONE, module1] as const);
  await page.reload();
  const name = page.getByLabel("The name to print");
  await expect(name).toBeEnabled();
  await name.fill("Aisyah Tan");
  const sheet = page.locator(".certificate");
  await expect(sheet).toContainText("Aisyah Tan");
  await expect(sheet).toContainText("finished Module 1 of Code for All");
  await expect(sheet).toContainText("isn't a grade");
  await page.reload();
  await expect(page.getByLabel("The name to print")).toHaveValue("Aisyah Tan"); // Kept on the device.
  expect(await page.evaluate((k) => localStorage.getItem(k), NAME)).toBe("Aisyah Tan");

  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Save as image" }).click()]);
  expect(download.suggestedFilename()).toBe("code-for-all-certificate-module-1.png");
  const file = test.info().outputPath(download.suggestedFilename());
  await download.saveAs(file);
  expect(fs.statSync(file).size).toBeGreaterThan(20_000);

  // Print: one page, controls hidden. (PDF output is Chromium-only.)
  await page.emulateMedia({ media: "print" });
  await expect(page.getByLabel("The name to print")).toBeHidden();
  await expect(sheet).toBeVisible();
  if (test.info().project.name === "desktop") {
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    expect(pages).toBe(1);
  }
  await page.emulateMedia({ media: "screen" });

  // Clearing the box forgets the name.
  await page.getByLabel("The name to print").fill("");
  expect(await page.evaluate((k) => localStorage.getItem(k), NAME)).toBeNull();
  await expect(sheet).toContainText("Your name");
});

test("the course certificate stays locked with only Module 1 done", async ({ page }) => {
  await seedStorage(page, { [DONE]: module1 });
  await page.goto("/certificate");
  await expect(page.getByText("Not quite yet.")).toBeVisible();
});

test("the module-complete celebration offers the certificate", async ({ page }) => {
  await seedStorage(page, { [DONE]: module1.slice(0, -1) });
  await page.goto(lessonsOf(1).at(-1)!.href);
  await page.getByRole("navigation", { name: "Lessons" }).getByRole("link", { name: /^Next/ }).click();
  const card = page.getByRole("status").filter({ hasText: "Module 1 complete" });
  const link = card.getByRole("link", { name: /Get your certificate/ });
  await expect(link).toHaveAttribute("href", "/module-1/certificate");
  await link.click();
  await expect(page).toHaveURL("/module-1/certificate");
  await expect(page.getByLabel("The name to print")).toBeVisible();
});
