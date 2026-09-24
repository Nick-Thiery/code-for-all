import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Honeycomb } from "@/components/honeycomb";
import { getPart, getParts, parsePartParam } from "@/lib/lessons";
import { partHref } from "@/lib/outline";

type Props = { params: Promise<{ part: string }> };

export async function generateStaticParams() {
  const parts = await getParts();
  return parts.map((part) => ({ part: `part-${part.number}` }));
}

async function find(params: Props["params"]) {
  const number = parsePartParam((await params).part);
  return number === null ? null : getPart(number);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const part = await find(params);
  return part ? { title: `Part ${part.number} complete` } : {};
}

export default async function PartCompletePage({ params }: Props) {
  const part = await find(params);
  if (!part) notFound();
  const nextPart = await getPart(part.number + 1);
  const nextNumber = part.number + 1;

  return (
    <div className="px-(--gut)">
      <div className="mx-auto flex max-w-[760px] flex-col items-center gap-5 pt-(--hy) pb-(--sec) text-center">
        <Honeycomb lessons={part.lessons.length} />
        <span className="eyebrow">Part {part.number} complete</span>
        <h1 className="t-hero m-0 leading-[1.05]">{part.completeHeading}</h1>
        <p className="t-lead m-0 max-w-[30em]">{part.completeText}</p>

        <div className="mt-6 grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4 text-left">
          <div className="flex flex-col gap-1.5 rounded-[20px] border-[1.5px] border-border p-6">
            <h2 className="display m-0 text-[22px] leading-[1.25] font-[650]">{part.shareTitle}</h2>
            <p className="m-0">{part.shareText}</p>
          </div>
          <div className="flex flex-col gap-1.5 rounded-[20px] bg-tint p-6">
            {nextPart ? (
              <>
                <h2 className="display m-0 text-[22px] leading-[1.25] font-[650]">Part {nextNumber} is ready</h2>
                <p className="m-0">{nextPart.summary}</p>
                {nextPart.lessons[0] && (
                  <Link href={nextPart.lessons[0].href} className="text-link">
                    Start Part {nextNumber} →
                  </Link>
                )}
              </>
            ) : (
              <>
                <h2 className="display m-0 text-[22px] leading-[1.25] font-[650]">Part {nextNumber} is on the way</h2>
                <p className="m-0">Bigger builds are coming. Your progress stays saved on this device.</p>
                <Link href={partHref(nextNumber)} className="text-link">
                  See what&apos;s coming →
                </Link>
              </>
            )}
          </div>
        </div>
        <Link href="/" className="text-link self-center">
          Back to the course
        </Link>
      </div>
    </div>
  );
}
