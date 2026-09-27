import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Certificate } from "@/components/certificate";
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
    <div className="px-(--gut) print:px-0">
      <article className="mx-auto flex max-w-[1000px] flex-col gap-6 pt-(--hy) pb-(--sec) print:max-w-none print:gap-0 print:p-0">
        <header className="flex flex-col gap-3.5 print:hidden">
          <p className="t-meta m-0">
            <Link href={moduleTrackHref(mod.number)} className="font-bold">
              Module {mod.number}: {mod.title}
            </Link>
          </p>
          <h1 className="t-h1 m-0">Your Module {mod.number} certificate</h1>
          <p className="t-lead m-0">Something to show for finishing every lesson in this module.</p>
        </header>
        <Certificate
          text={text}
          lightTokens={lightTokens()}
          logoSrc={getLogoFiles().light}
          unfinished={{ href: moduleTrackHref(mod.number), label: "Back to the module" }}
        />
        <p className="m-0 print:hidden">
          <Link href={moduleCompleteHref(mod.number)}>Back to Module {mod.number} complete</Link>
        </p>
      </article>
    </div>
  );
}
