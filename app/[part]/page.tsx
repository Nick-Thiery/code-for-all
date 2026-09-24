import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOutline, parsePartParam } from "@/lib/lessons";
import { partTrackHref } from "@/lib/outline";

type Props = { params: Promise<{ part: string }> };

// /part-N. A released part lives on the course page, so this goes there.
// The next unreleased part gets the Coming soon page. Anything else is a 404.
async function resolve(params: Props["params"]) {
  const number = parsePartParam((await params).part);
  if (number === null) return null;
  const outline = await getOutline();
  if (outline.parts.some((part) => part.number === number)) return { released: true as const, number };
  if (number === outline.upcoming.number) return { released: false as const, number };
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await resolve(params);
  return found && !found.released ? { title: `Part ${found.number}: coming soon` } : {};
}

export default async function PartPage({ params }: Props) {
  const found = await resolve(params);
  if (!found) notFound();
  if (found.released) redirect(partTrackHref(found.number));

  return (
    <div className="px-(--gut)">
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-[18px] py-(--sec) text-center">
        <ComingSoonHoneycomb />
        <span className="eyebrow">Part {found.number}</span>
        <h1 className="t-h1 m-0">Coming soon</h1>
        <p className="m-0 max-w-[28em]">
          We&apos;re building Part {found.number} now. It picks up where Part {found.number - 1} ends, with bigger
          things to build.
        </p>
        <p className="t-meta m-0 max-w-[28em] text-muted">
          There&apos;s nothing to sign up for. Just check back. Your Part {found.number - 1} progress stays saved on
          this device.
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
