import type { Metadata } from "next";
import Link from "next/link";
import { Certificate } from "@/components/certificate";
import { PageBody, PageHeader } from "@/components/page-header";
import type { CertificateText } from "@/lib/certificate";
import { formatCount } from "@/lib/format";
import { getModules, getPhases } from "@/lib/lessons";
import { getLogoFiles } from "@/lib/logo";
import { contentsHref } from "@/lib/outline";
import { lightTokens } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Course certificate",
  description: "Your certificate for finishing every module of Code for All that's out.",
};

// /certificate: the course certificate, for finishing every lesson in every
// released module. Locked until then (checked in the browser).
export default async function CourseCertificatePage() {
  const [modules, phases] = await Promise.all([getModules(), getPhases()]);
  const lessons = modules.flatMap((mod) => mod.lessons);
  const last = modules[modules.length - 1];
  const covered = phases
    .filter((phase) => phase.modules.some((mod) => modules.some((m) => m.number === mod.number)))
    .map((phase) => phase.title.toLowerCase());
  const text: CertificateText = {
    kicker: last ? `all ${formatCount(modules.length, "module")}` : "the course",
    title: "Code for All",
    line: `${formatCount(lessons.length, "lesson")} across Modules 1 to ${last?.number ?? 1}: ${covered.join(" and ")}.`,
    lessons: modules.length,
    requires: lessons.map((lesson) => lesson.id),
  };

  return (
    <article>
      <PageHeader kicker="The whole course" title="Your course certificate" printHidden>
        <p>For finishing every lesson in all {formatCount(modules.length, "module")} that are out.</p>
      </PageHeader>
      <PageBody wide className="max-w-[1000px] gap-6 print:max-w-none print:gap-0">
        <Certificate
          text={text}
          lightTokens={lightTokens()}
          logoSrc={getLogoFiles().light}
          unfinished={{ href: contentsHref, label: "Back to the course" }}
        />
        <p className="m-0 print:hidden">
          <Link href={contentsHref}>Back to the course</Link>
        </p>
      </PageBody>
    </article>
  );
}
