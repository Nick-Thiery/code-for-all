import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getModule, getPlannedModule, parseModuleParam } from "@/lib/lessons";
import { moduleTrackHref } from "@/lib/outline";

type Props = { params: Promise<{ module: string }> };

// /module-N. A released module lives on the course page, so this goes there.
// A module that's in the course plan but not out yet gets the Coming soon
// page. Anything else is a 404.
async function resolve(params: Props["params"]) {
  const number = parseModuleParam((await params).module);
  if (number === null) return null;
  if (await getModule(number)) return { released: true as const, number };
  const planned = await getPlannedModule(number);
  return planned ? { released: false as const, number, planned } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await resolve(params);
  return found && !found.released
    ? {
        title: `Module ${found.number}: coming soon`,
        description: `Module ${found.number}, ${found.planned.title}, isn't out yet. ${found.planned.summary}`,
      }
    : {};
}

export default async function ModulePage({ params }: Props) {
  const found = await resolve(params);
  if (!found) notFound();
  if (found.released) redirect(moduleTrackHref(found.number));

  return (
    <div className="px-(--gut)">
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-[18px] py-(--sec) text-center">
        <ComingSoonHoneycomb />
        <span className="eyebrow">Module {found.number} · Coming soon</span>
        <h1 className="t-h1 m-0">{found.planned.title}</h1>
        <p className="m-0 max-w-[28em]">{found.planned.summary} We&apos;re writing this module now.</p>
        <p className="t-meta m-0 max-w-[28em] text-muted">
          There&apos;s nothing to sign up for. Just check back. Your progress stays saved on this device.
        </p>
        <Link href="/" className="btn btn-primary mt-2">
          Back to the course
        </Link>
      </div>
    </div>
  );
}

function ComingSoonHoneycomb() {
  const ring = [
    "-25,-69.3 -2.5,-56.3 -2.5,-30.3 -25,-17.3 -47.5,-30.3 -47.5,-56.3",
    "25,-69.3 47.5,-56.3 47.5,-30.3 25,-17.3 2.5,-30.3 2.5,-56.3",
    "50,-26 72.5,-13 72.5,13 50,26 27.5,13 27.5,-13",
    "25,17.3 47.5,30.3 47.5,56.3 25,69.3 2.5,56.3 2.5,30.3",
    "-25,17.3 -2.5,30.3 -2.5,56.3 -25,69.3 -47.5,56.3 -47.5,30.3",
    "-50,-26 -27.5,-13 -27.5,13 -50,26 -72.5,13 -72.5,-13",
  ];
  return (
    <svg width="170" height="162" viewBox="-80 -76 160 152" aria-hidden="true" className="mb-2">
      {ring.map((points) => (
        <polygon
          key={points}
          points={points}
          strokeLinejoin="round"
          className="fill-none stroke-pip stroke-2 [stroke-dasharray:5_4]"
        />
      ))}
      <polygon
        points="0,-26 22.5,-13 22.5,13 0,26 -22.5,13 -22.5,-13"
        strokeLinejoin="round"
        className="fill-tint stroke-deco stroke-[2.5]"
      />
    </svg>
  );
}
