import fs from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import matter from "gray-matter";
import { lessonsOf, useTheme } from "./helpers";

// Site search (components/site-search.tsx, components/search-panel.tsx,
// lib/search.ts): opening and closing it, what it finds, the keyboard, what
// it doesn't send or save, accessibility, and a header that fits beside it.
// On phones Search is the first row of the menu; from 600px it's a button
// beside the theme switch.

const wordle = lessonsOf(7).find((lesson) => /wordle/i.test(lesson.title))!;
const todays = lessonsOf(2).find((lesson) => lesson.title.includes("'"))!;

/** Modules in course.yml that aren't out yet, with their planned lessons. */
const comingSoon = (() => {
  const source = fs.readFileSync(path.join(process.cwd(), "content", "course.yml"), "utf8");
  const { phases } = matter(`---\n${source}\n---\n`).data as {
    phases: { modules: { number: number; title: string; planned?: string[] }[] }[];
  };
  return phases
    .flatMap((phase) => phase.modules)
    .filter((mod) => !fs.existsSync(path.join(process.cwd(), "content", `module-${mod.number}`)));
})();

const isPhone = (testInfo: TestInfo) => testInfo.project.name === "phone";

/** The Search button a learner would press: in the menu on phones, in the header from 600px. */
async function searchButton(page: Page, testInfo: TestInfo) {
  if (isPhone(testInfo)) {
    const menu = page.getByRole("button", { name: /^(Menu|Open menu)$/ }).locator("visible=true").first();
    if ((await menu.getAttribute("aria-expanded")) !== "true") await menu.click();
  }
  return page.getByRole("button", { name: "Search", exact: true }).locator("visible=true").first();
}

async function openSearch(page: Page, testInfo: TestInfo) {
  await (await searchButton(page, testInfo)).click();
  const box = page.getByRole("combobox", { name: "Search the course" });
  await expect(box).toBeFocused();
  return box;
}

const dialog = (page: Page) => page.getByRole("dialog", { name: "Search the course" });
const results = (page: Page) => page.getByRole("listbox", { name: "Search results" });

test.describe("Site search", () => {
  test("opens with the Search button and with /, and closes back to the button", async ({ page }, testInfo) => {
    await page.goto("/glossary");
    const button = await searchButton(page, testInfo);
    await expect(button).toHaveAttribute("aria-haspopup", "dialog");
    await openSearch(page, testInfo);
    await expect(dialog(page)).toBeVisible();
    await expect(dialog(page)).toHaveAttribute("aria-modal", "true");

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await expect(button).toBeFocused();
    if (isPhone(testInfo)) {
      // Opened from the menu: the menu is still open.
      await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "true");
    }

    await openSearch(page, testInfo);
    await dialog(page).getByRole("button", { name: "Close" }).click();
    await expect(dialog(page)).toBeHidden();
    await expect(button).toBeFocused();

    if (!isPhone(testInfo)) {
      // A click on the backdrop, outside the panel.
      await openSearch(page, testInfo);
      const viewport = page.viewportSize()!;
      await page.mouse.click(12, viewport.height - 12);
      await expect(dialog(page)).toBeHidden();
      await expect(button).toBeFocused();
    }

    await page.locator("main h1").click();
    await page.keyboard.press("/");
    await expect(dialog(page)).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Search the course" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
  });

  test("/ typed in a text box, or with another dialog open, doesn't open search", async ({ page }) => {
    const sprint = lessonsOf(2).find((lesson) => lesson.slug === "solo-sprint")!;
    await page.goto(sprint.href);
    const box = page.getByLabel("Your exact prompt for Lovable");
    await box.click();
    await page.keyboard.type("a/b");
    await expect(box).toHaveValue("a/b");
    await expect(dialog(page)).toBeHidden();

    // An enlarged figure is a dialog too.
    await page.goto(lessonsOf(1).find((lesson) => lesson.slug === "meet-lovable")!.href);
    await page.getByRole("button", { name: /^Enlarge image/ }).first().click();
    await expect(page.getByRole("dialog").first()).toBeVisible();
    await page.keyboard.press("/");
    await expect(dialog(page)).toBeHidden();
  });

  test("“Wordle” opens its lesson", async ({ page }, testInfo) => {
    await page.goto("/");
    const box = await openSearch(page, testInfo);
    await box.fill("Wordle");
    const first = results(page).getByRole("option").first();
    await expect(first).toContainText(wordle.title);
    await expect(first.locator("mark").first()).toHaveText(/wordle/i);
    await first.click();
    await expect(page).toHaveURL(wordle.href);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(wordle.title);
    await expect(dialog(page)).toBeHidden();
  });

  test("“Repository” goes to its glossary entry and “laptop” to its Help answer", async ({ page }, testInfo) => {
    await page.goto("/");
    let box = await openSearch(page, testInfo);
    await box.fill("Repository");
    const term = results(page).getByRole("group", { name: /^Glossary/ }).getByRole("option", { name: /^Repository/ });
    await expect(term).toHaveAttribute("href", "/glossary#term-repository");
    await term.click();
    await expect(page).toHaveURL(/\/glossary#term-repository$/);
    await expect(page.locator("#term-repository")).toBeInViewport();

    box = await openSearch(page, testInfo);
    await box.fill("laptop");
    const help = results(page).getByRole("group", { name: /^Help/ }).getByRole("option").first();
    await expect(help).toHaveAttribute("href", "/help#no-laptop");
    await help.click();
    await expect(page).toHaveURL(/\/help#no-laptop$/);
    await expect(page.getByRole("heading", { name: "I don't have a laptop.", level: 2 })).toBeInViewport();
  });

  test("finds quizzes, Check your skills and the Coming soon modules, but not their planned lessons", async ({ page }, testInfo) => {
    await page.goto("/");
    const box = await openSearch(page, testInfo);
    await box.fill("module 1 quiz");
    await expect(results(page).getByRole("group", { name: /^Quizzes/ }).getByRole("option").first()).toHaveAttribute("href", "/module-1/quiz");

    await box.fill("check your skills");
    const quizzes = results(page).getByRole("group", { name: /^Quizzes/ });
    await expect(quizzes.locator('[href="/module-5/check-your-skills"]')).toBeVisible();
    await expect(quizzes.locator('[href="/module-8/check-your-skills"]')).toBeVisible();

    await box.fill("quiz");
    await expect(quizzes.getByText(/^Showing 3 of \d+$/)).toBeVisible();
    await expect(quizzes.getByRole("option")).toHaveCount(3);

    expect(comingSoon.length).toBeGreaterThan(0);
    for (const mod of comingSoon) {
      await box.fill(mod.title);
      await expect(results(page).locator(`[href="/module-${mod.number}"]`)).toContainText(`Module ${mod.number} · Coming soon`);
      const planned = mod.planned?.find((title) => title.length > 12);
      if (planned) {
        await box.fill(planned);
        await expect(page.locator(`[role="option"][href="/module-${mod.number}"]`)).toHaveCount(0);
      }
    }
  });

  test("ignores capitals, accents, apostrophes and hyphens, and needs every word", async ({ page }, testInfo) => {
    await page.goto("/");
    const box = await openSearch(page, testInfo);
    const firstOption = results(page).getByRole("option").first();

    await box.fill("WÖRDLE");
    await expect(firstOption).toHaveAttribute("href", wordle.href);
    await box.fill("recreate wordle");
    await expect(firstOption).toHaveAttribute("href", wordle.href);
    await box.fill(todays.title.replace(/'/g, "").toLowerCase());
    await expect(firstOption).toHaveAttribute("href", todays.href);
    await box.fill("dont have a laptop");
    await expect(firstOption).toHaveAttribute("href", "/help#no-laptop");
    await box.fill("subagents");
    await expect(results(page).getByRole("option", { name: /Sub-agents/i })).toBeVisible();
    await box.fill("sub agents");
    await expect(results(page).getByRole("option", { name: /Sub-agents/i })).toBeVisible();

    await box.fill("wordle zzzzqx");
    await expect(page.getByText("No results for “wordle zzzzqx”")).toBeVisible();
  });

  test("a title match ranks above the meta line and the summary", async ({ page }, testInfo) => {
    await page.goto("/");
    const box = await openSearch(page, testInfo);
    await box.fill("github");
    const options = results(page).getByRole("group", { name: /^Lessons/ }).getByRole("option");
    // Every lesson with GitHub in its title comes before any that only mention it.
    const titles = await options.evaluateAll((els) => els.map((el) => el.querySelector(".font-serif")?.textContent ?? ""));
    const firstWithout = titles.findIndex((title) => !/github/i.test(title));
    expect(firstWithout).toBeGreaterThan(0);
    expect(titles.slice(firstWithout).some((title) => /github/i.test(title))).toBe(false);
  });

  test("arrow keys move the highlight and Enter opens it", async ({ page }, testInfo) => {
    await page.goto("/");
    const box = await openSearch(page, testInfo);
    await box.fill("github");
    const options = results(page).getByRole("option");
    await expect(options.first()).toBeVisible();
    await expect(box).toHaveAttribute("aria-expanded", "true");
    await expect(box).not.toHaveAttribute("aria-activedescendant");

    await page.keyboard.press("ArrowDown");
    await expect(box).toHaveAttribute("aria-activedescendant", (await options.nth(0).getAttribute("id"))!);
    await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowDown");
    await expect(box).toHaveAttribute("aria-activedescendant", (await options.nth(1).getAttribute("id"))!);
    await expect(options.nth(0)).toHaveAttribute("aria-selected", "false");
    await page.keyboard.press("ArrowUp");
    await expect(box).toHaveAttribute("aria-activedescendant", (await options.nth(0).getAttribute("id"))!);
    await expect(box).toBeFocused();

    const href = (await options.nth(0).getAttribute("href"))!;
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(href);
    await expect(dialog(page)).toBeHidden();
  });

  test("before typing it shows a hint and suggestions; with no matches it points to Help", async ({ page }, testInfo) => {
    await page.goto("/");
    const box = await openSearch(page, testInfo);
    await expect(dialog(page).getByText("Find a lesson, a quiz, a key term, a help answer or a page.")).toBeVisible();
    const suggestion = dialog(page).getByRole("button", { name: "Wordle" });
    await suggestion.click();
    await expect(box).toHaveValue("Wordle");
    await expect(box).toBeFocused();
    await expect(results(page).getByRole("option").first()).toHaveAttribute("href", wordle.href);

    await box.fill("qqzzxx");
    await expect(dialog(page).getByText("No results for “qqzzxx”")).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: "No results" })).toBeAttached();
    await expect(box).toHaveAttribute("aria-expanded", "false");
    await dialog(page).getByRole("link", { name: "See Help" }).click();
    await expect(page).toHaveURL("/help");
  });

  test("keeps focus inside and the page behind still", async ({ page }, testInfo) => {
    await page.goto("/glossary");
    await page.locator("main h1").click();
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.keyboard.press("/");
    const box = page.getByRole("combobox", { name: "Search the course" });
    await expect(box).toBeFocused();
    const before = await page.evaluate(() => window.scrollY);
    expect(before).toBe(400);
    await box.fill("git");
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press(i % 3 === 2 ? "Shift+Tab" : "Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest("dialog[open]"))).toBe(true);
    }
    // The lock is set and released in an effect just after the dialog opens or closes, so wait for it.
    const overflow = () => page.evaluate(() => getComputedStyle(document.documentElement).overflow);
    await expect.poll(overflow).toBe("hidden");
    if (!isPhone(testInfo)) {
      await page.mouse.move(12, 300);
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(200);
      expect(await page.evaluate(() => window.scrollY)).toBe(before);
    }
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await expect.poll(overflow).not.toBe("hidden");
  });

  test("sends and saves nothing that's typed", async ({ page }, testInfo) => {
    const secret = "zebrawaffle";
    const seen: string[] = [];
    page.on("request", (request) => seen.push(`${request.url()} ${request.postData() ?? ""}`));
    await page.goto("/");
    const box = await openSearch(page, testInfo);
    await box.pressSequentially(`${secret} wordle`);
    await expect(page.getByText(`No results for “${secret} wordle”`)).toBeVisible();
    await box.fill("wordle");
    await expect(results(page).getByRole("option").first()).toBeVisible();
    await page.waitForLoadState("networkidle");

    expect(seen.filter((entry) => entry.includes(secret))).toEqual([]);
    expect(seen.filter((entry) => entry.includes("/search-index.json"))).toHaveLength(1);
    const stored = await page.evaluate(() => JSON.stringify([{ ...localStorage }, { ...sessionStorage }, document.cookie]));
    expect(stored).not.toContain(secret);
    expect(stored).not.toContain("wordle");
  });

  test.describe("without a service worker", () => {
    // page.route doesn't see a service worker's own fetches, so if the worker
    // took control first it would fetch the index and get round the block.
    test.use({ serviceWorkers: "block" });

    test("says so when the index can't load, and Try again works", async ({ page }, testInfo) => {
      await page.route("**/search-index.json", (route) => route.abort("internetdisconnected"));
      await page.goto("/");
      await (await searchButton(page, testInfo)).click();
      await expect(dialog(page).getByText("Search couldn't load")).toBeVisible();
      await page.unroute("**/search-index.json");
      await dialog(page).getByRole("button", { name: "Try again" }).click();
      await expect(page.getByRole("combobox", { name: "Search the course" })).toBeFocused();
    });
  });
});

for (const theme of ["light", "dark"] as const) {
  test(`the open search dialog has no serious or critical accessibility issues in ${theme} mode`, async ({ page }, testInfo) => {
    await useTheme(page, theme);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const box = await openSearch(page, testInfo);
    for (const [state, query] of [["empty", ""], ["with results", "git"], ["with no results", "qqzzxx"]] as const) {
      await box.fill(query);
      if (query === "git") await page.keyboard.press("ArrowDown");
      await expect(dialog(page).getByText(query === "" ? "Find a lesson" : query === "git" ? "Lessons" : "No results for")
        .first()).toBeVisible();
      const axe = await new AxeBuilder({ page })
        .include("dialog[open]")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      const blocking = axe.violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => ({ id: v.id, help: v.help, nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 5) }));
      expect(blocking, `${state}: ${JSON.stringify(blocking, null, 2)}`).toEqual([]);
    }
  });
}

test("the header fits at 320, 375, 768, 960 and 1280, on a page and on a lesson", async ({ page }) => {
  // Module 5 has the most lessons, so the longest row of segments.
  const longest = [5, 6, 1].map((n) => lessonsOf(n)).sort((a, b) => b.length - a.length)[0];
  for (const width of [320, 375, 768, 960, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of ["/help", longest[longest.length - 1].href]) {
      await page.goto(path);
      const problems = await page.evaluate(() => {
        const header = document.querySelector("header")!;
        const found: string[] = [];
        if (document.documentElement.scrollWidth > window.innerWidth) found.push("the page scrolls sideways");
        const shown = [...header.querySelectorAll<HTMLElement>("a, button, [role=img], .eyebrow")].filter(
          (el) => el.checkVisibility() && el.getBoundingClientRect().width > 0 && !el.closest("[hidden]"),
        );
        // Only the innermost of nested items, so a link isn't compared with its own label.
        const items = shown.filter((el) => !shown.some((other) => other !== el && el.contains(other)));
        const name = (el: HTMLElement) => (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 30);
        for (const el of items) {
          const box = el.getBoundingClientRect();
          if (box.left < 0 || box.right > window.innerWidth) found.push(`${name(el)} is off screen`);
        }
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            const a = items[i].getBoundingClientRect();
            const b = items[j].getBoundingClientRect();
            if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) {
              found.push(`${name(items[i])} overlaps ${name(items[j])}`);
            }
          }
        }
        return found;
      });
      expect(problems, `${path} at ${width}px`).toEqual([]);
    }
    // From 600px Search is in the header itself (on a lesson's desktop bar, when there's room).
    await page.goto("/help");
    const search = page.locator("header").getByRole("button", { name: "Search", exact: true }).locator("visible=true");
    await expect(search).toHaveCount(width >= 600 ? 1 : 0);
  }
});

// Help answers and the site's own pages ("Search more of the site").
test.describe("Search: Help answers and pages", () => {
  async function searchFor(page: import("@playwright/test").Page, query: string) {
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: "Search the course" });
    // "/" opens search on any page, phone or desktop, once the page has hydrated.
    await expect(async () => {
      if (!(await dialog.isVisible())) await page.keyboard.press("/");
      await expect(dialog).toBeVisible({ timeout: 1_000 });
    }).toPass();
    await dialog.getByRole("combobox", { name: "Search the course" }).fill(query);
    return dialog;
  }

  test("a word only in a Help answer finds it, with a snippet, and opens its anchor", async ({ page }) => {
    const dialog = await searchFor(page, "error");
    const result = dialog
      .getByRole("group", { name: /^Help/ })
      .getByRole("option", { name: /Something broke and I don't know why\./ });
    await expect(result).toHaveAttribute("href", "/help#broke");
    await expect(result.locator("mark").first()).toHaveText(/^error$/i);
    // The answer, not the question, holds the match, so a short snippet of it shows.
    const snippet = result.locator("span").last();
    await expect(snippet).toContainText("An error is information");
    expect((await snippet.textContent())!.length).toBeLessThanOrEqual(125);

    await result.click();
    await expect(page).toHaveURL(/\/help#broke$/);
    await expect(page.getByRole("heading", { name: "Something broke and I don't know why.", level: 2 })).toBeInViewport();
  });

  test("a match deep in an answer shows the snippet around it, cut with an ellipsis", async ({ page }) => {
    const dialog = await searchFor(page, "stuck");
    const result = dialog.getByRole("group", { name: /^Help/ }).getByRole("option", { name: /Something broke/ });
    const snippet = result.locator("span").last();
    await expect(snippet).toHaveText(/^…Every hands-on lesson also has a Stuck\? box/);
    await expect(snippet.locator("mark")).toHaveText("Stuck");
  });

  for (const [query, href] of [
    ["devices", "/access#devices"],
    ["privacy", "/privacy"],
    ["session kit", "/run-it#kit"],
  ] as const) {
    test(`"${query}" finds ${href} under Pages`, async ({ page }) => {
      const dialog = await searchFor(page, query);
      const pages = dialog.getByRole("group", { name: /^Pages/ });
      const result = pages.getByRole("option").first();
      await expect(result).toHaveAttribute("href", href);
      await result.click();
      await expect(page).toHaveURL(new RegExp(`${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
      const [, id] = href.split("#");
      if (id) await expect(page.locator(`[id="${id}"]`)).toBeInViewport();
    });
  }

  test("every Pages result links to a page that loads, and to an anchor that's on it", async ({ page, request }) => {
    const index = await (await request.get("/search-index.json")).json();
    const pages: { t: string; h: string }[] = index.pages;
    expect(pages.length).toBeGreaterThanOrEqual(17);
    for (const entry of pages) {
      const [path, id] = entry.h.split("#");
      const response = await page.goto(path);
      expect(response?.status(), `${entry.t} (${entry.h})`).toBe(200);
      if (id) await expect(page.locator(`[id="${id}"]`), `${entry.t} (${entry.h})`).toHaveCount(1);
    }
  });
});
