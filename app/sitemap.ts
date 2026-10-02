import type { MetadataRoute } from "next";
import { KIT_PAGES, getKit, kitHref, type KitPage } from "@/lib/facilitator";
import { getModules, getSkillsChecks } from "@/lib/lessons";
import { quizHref, skillsCheckHref } from "@/lib/outline";
import { siteUrl } from "@/lib/site";

// /sitemap.xml: every released page. /module-N (it redirects to /contents), coming-soon modules, the "module complete" pages and /api are left out.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [modules, kit, skills] = await Promise.all([getModules(), getKit(), getSkillsChecks()]);
  const kitPages = Object.keys(KIT_PAGES) as KitPage[];

  const paths = [
    "/",
    "/contents",
    ...modules.flatMap((module) => [
      ...module.lessons.map((lesson) => lesson.href),
      ...(module.quiz ? [quizHref(module.number)] : []),
      ...(skills.pages.some((page) => page.after === module.number) ? [skillsCheckHref(module.number)] : []),
    ]),
    "/quizzes",
    "/access",
    "/run-it",
    ...kitPages.flatMap((page) => [kitHref(page), ...kit.sheets.map((sheet) => kitHref(page, sheet.module.number))]),
    "/glossary",
    "/about",
    "/privacy",
  ];

  const base = siteUrl();
  return paths.map((path) => ({ url: new URL(path, base).toString() }));
}
