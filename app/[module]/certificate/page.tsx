import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Certificate } from "@/components/certificate";
import { PageBody, PageHeader } from "@/components/page-header";
import type { CertificateText } from "@/lib/certificate";
import { getModule, getModules, parseModuleParam } from "@/lib/lessons";
import { getLogoFiles } from "@/lib/logo";
import { moduleCompleteHref, moduleTrackHref } from "@/lib/outline";
import { lightTokens } from "@/lib/tokens";

type Props = { params: Promise<{ module: string }> };

// /module-N/certificate: for a finished module. Locked until every lesson in
// it is done (checked in the browser, where progress lives).
export async function generateStaticParams() {
  const modules = await getModules();
  return modules.map((mod) => ({ module: `module-${mod.number}` }));
}

async function find(params: Props["params"]) {
  const number = parseModuleParam((await params).module);
  return number === null ? null : getModule(number);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mod = await find(params);
  return mod
    ? { title: `Module ${mod.number} certificate`, description: `Your certificate for finishing Module ${mod.number}: ${mod.title}.` }
    : {};
}

export default async function ModuleCertificatePage({ params }: Props) {
  const mod = await find(params);
  if (!mod) notFound();
  const text: CertificateText = {
    kicker: `Module ${mod.number}`,
    title: mod.title,
    line: mod.summary,
    lessons: mod.lessons.length,
    requires: mod.lessons.map((lesson) => lesson.id),
  };

  return (
    <article>
      <PageHeader
        kicker={
          <Link href={moduleTrackHref(mod.number)} className="no-underline hover:underline">
            Module {mod.number} · {mod.title}
          </Link>
        }
        title={`Your Module ${mod.number} certificate`}
        printHidden
      >
        <p>Something to show for finishing every lesson in this module.</p>
      </PageHeader>
      <PageBody wide className="max-w-[1000px] gap-6 print:max-w-none print:gap-0">
        <Certificate
          text={text}
          lightTokens={lightTokens()}
          logoSrc={getLogoFiles().light}
          unfinished={{ href: moduleTrackHref(mod.number), label: "Back to the module" }}
        />
        <p className="m-0 print:hidden">
          <Link href={moduleCompleteHref(mod.number)}>Back to Module {mod.number} complete</Link>
        </p>
      </PageBody>
    </article>
  );
}
