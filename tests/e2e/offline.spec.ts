import { expect, test, type Page } from "@playwright/test";
import { type ChildProcess, spawn } from "node:child_process";
import { lessonsOf } from "./helpers";

// Offline behaviour with the service worker (public/sw.js). Playwright's
// setOffline doesn't reach a service worker's own fetches, so this runs its
// own copy of the built site on a spare port and stops it to go offline for
// real. (The manifest test at the bottom uses the shared server as usual.)

const PORT = 3105;
const BASE = `http://localhost:${PORT}`;
const [first, lesson] = lessonsOf(1);
const unopened = lessonsOf(3)[0];

let server: ChildProcess | null = null;

async function startServer() {
  server = spawn("npx", ["next", "start", "--port", String(PORT)], { cwd: process.cwd(), stdio: "ignore", detached: true });
  for (let i = 0; i < 120; i++) {
    try {
      if ((await fetch(`${BASE}/offline`)).ok) return;
    } catch {
      // Not up yet.
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`The site didn't start on port ${PORT}`);
}

function stopServer() {
  if (server?.pid) {
    try {
      process.kill(-server.pid, "SIGKILL");
    } catch {
      // Already gone.
    }
  }
  server = null;
}

/** Wait until the worker is active and controls this page. */
async function controlled(page: Page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise((r) => navigator.serviceWorker.addEventListener("controllerchange", r, { once: true }));
    }
  });
}

test.describe("offline", () => {
  test.use({ serviceWorkers: "allow" });
  test.describe.configure({ mode: "serial" });
  test.afterEach(() => stopServer());

  test("pages opened online still work with the server gone; an unopened page shows the offline page", async ({ context, page }) => {
    test.setTimeout(120_000);
    await startServer();
    await page.goto(`${BASE}${first.href}`);
    await controlled(page);
    // The page that installed the worker asks it to keep it; give that a moment.
    await page.waitForTimeout(1500);
    await page.goto(`${BASE}${lesson.href}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
    await page.goto(`${BASE}/module-1/quiz`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Module 1 quiz");
    await page.waitForLoadState("networkidle");

    stopServer();
    await context.setOffline(true); // For navigator.onLine and the bar; the stopped server does the rest.

    await page.goto(`${BASE}${lesson.href}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
    await expect(page.getByRole("status").filter({ hasText: "You're offline. Lessons you've opened still work." })).toBeVisible();
    const tick = page.getByRole("checkbox", { name: "I've finished this lesson" });
    await expect(tick).toBeEnabled();
    await tick.click();
    await expect(tick).toBeChecked();

    await page.goto(`${BASE}/module-1/quiz`);
    await expect(page.getByRole("heading", { name: /Question 1 of/ })).toBeVisible();
    await page.getByRole("radio").first().check();
    await page.getByRole("button", { name: "Check answer" }).click();
    await expect(page.getByRole("button", { name: /Next question/ })).toBeVisible();

    // A client-side link from one cached lesson to the next.
    await page.goto(`${BASE}${first.href}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(first.title);
    await page.getByRole("navigation", { name: "Lessons" }).getByRole("link", { name: /^Next/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);

    await page.goto(`${BASE}${unopened.href}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("You're offline.");
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();

    // Back online: Try again loads the real page and the bar goes.
    await startServer();
    await context.setOffline(false);
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(unopened.title);
    await expect(page.getByRole("status").filter({ hasText: "You're offline" })).toBeHidden();
  });
});

test("the manifest and its icons are served", async ({ request }) => {
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBe(true);
  const json = await manifest.json();
  expect(json.name).toBe("Code for All");
  expect(json.display).toBe("standalone");
  for (const icon of json.icons) expect((await request.get(icon.src)).ok()).toBe(true);
});
