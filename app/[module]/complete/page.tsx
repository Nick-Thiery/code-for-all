import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Honeycomb } from "@/components/honeycomb";
import { getModule, getModules, getPlannedModule, getSkillsChecks, parseModuleParam } from "@/lib/lessons";
import { courseCertificateHref, moduleCertificateHref, moduleHref, skillsCheckHref } from "@/lib/outline";

type Props = { params: Promise<{ module: string }> };

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
    ? { title: `Module ${mod.number} complete`, description: `You've finished Module ${mod.number}: ${mod.title}.` }
    : {};
}

export default async function ModuleCompletePage({ params }: Props) {
  const mod = await find(params);
  if (!mod) notFound();
  const nextNumber = mod.number + 1;
  const [next, planned, skills] = await Promise.all([
    getModule(nextNumber),
    getPlannedModule(nextNumber),
    getSkillsChecks(),
  ]);
  const hasSkillsCheck = skills.pages.some((page) => page.after === mod.number);
  // The last module that's out: finishing it can mean finishing the course.
  const isLast = (await getModules()).every((m) => m.number <= mod.number);

  return (
    <div className="px-(--gut)">
      <div className="mx-auto flex max-w-[760px] flex-col items-center gap-5 pt-(--hy) pb-12 tablet:pb-(--sec) text-center">
        <Honeycomb lessons={mod.lessons.length} />
        <span className="eyebrow">Module {mod.number} complete</span>
        <h1 className="t-hero m-0 leading-[1.05]">You finished {mod.title}.</h1>
        <p className="t-lead m-0 max-w-[30em]">{mod.summary}</p>

        <div className="mt-6 grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4 text-left">
          <div className="flex flex-col gap-1.5 rounded-2xl border border-border p-6">
            <h2 className="display m-0 text-[22px] leading-[1.25] font-[650]">Show someone what you made</h2>
            <p className="m-0">Explaining how you made it is the best way to remember it.</p>
          </div>
          <div className="flex flex-col gap-1.5 rounded-2xl border border-border p-6">
            <h2 className="display m-0 text-[22px] leading-[1.25] font-[650]">Get your certificate</h2>
            <p className="m-0">
              {isLast
                ? "One for this module, and one for the whole course now that you've finished every module that's out."
                : "Your name, the module and the date, to print or save as an image."}
            </p>
            <Link href={moduleCertificateHref(mod.number)} className="text-link">
              Module {mod.number} certificate →
            </Link>
            {isLast && (
              <Link href={courseCertificateHref} className="text-link">
                Course certificate →
              </Link>
            )}
          </div>
          {hasSkillsCheck && (
            <div className="flex flex-col gap-1.5 rounded-2xl border border-accent p-6">
              <h2 className="display m-0 text-[22px] leading-[1.25] font-[650]">Check your skills</h2>
              <p className="m-0">
                A mixed quiz on {mod.number === 1 ? "Module 1" : `Modules 1 to ${mod.number}`}, and a checklist for your
                final project.
              </p>
              <Link href={skillsCheckHref(mod.number)} className="text-link">
                Check your skills →
              </Link>
            </div>
          )}
          {planned && (
            <div className="flex flex-col gap-1.5 rounded-2xl bg-tint p-6">
              {next ? (
                <>
                  <h2 className="display m-0 text-[22px] leading-[1.25] font-[650]">Up next: Module {nextNumber}</h2>
                  <p className="m-0">
                    {next.title}. {next.summary}
                  </p>
                  <Link href={next.lessons[0].href} className="text-link">
                    Start Module {nextNumber} →
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="display m-0 text-[22px] leading-[1.25] font-[650]">
                    Module {nextNumber} is on the way
                  </h2>
                  <p className="m-0">
                    {planned.title}. Your progress stays saved on this device.
                  </p>
                  <Link href={moduleHref(nextNumber)} className="text-link">
                    See what&apos;s coming →
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
        <Link href="/" className="text-link self-center">
          Back to the course
        </Link>
      </div>
    </div>
  );
}
