import Link from "next/link";
import type { ReactNode } from "react";
import type { LessonNeeds } from "@/lib/lessons";

/**
 * The "You'll need" box at the top of a hands-on lesson: device, access,
 * anything from earlier lessons, and time. It replaces the plain "Hands-on:
 * needs access" notice on lessons that set `needs` in their frontmatter.
 */
export function YouNeed({ lessonId, needs, minutes }: { lessonId: string; needs: LessonNeeds; minutes: number }) {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "Device", value: withLinks(needs.device) },
    ...(needs.access.length > 0
      ? [
          {
            label: "Access",
            value: (
              <>
                {list(needs.access.map(withLinks))}. Free through your{" "}
                <Link href={`/access?from=${encodeURIComponent(lessonId)}`}>Code for All access</Link>. Nothing here asks
                for a card.
              </>
            ),
          },
        ]
      : []),
    ...(needs.before.length > 0 ? [{ label: "From earlier", value: list(needs.before.map(withLinks)) }] : []),
    { label: "Time", value: `About ${minutes} minutes` },
  ];

  return (
    <section aria-labelledby="you-need" className="flex flex-col gap-3 rounded-2xl bg-tint px-[22px] py-[18px]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="you-need" className="display m-0 text-[20px] leading-[1.3] font-bold">
          You&apos;ll need
        </h2>
        <Link href={`/access?from=${encodeURIComponent(lessonId)}`} className="text-[16px] font-bold">
          Hands-on: needs access
        </Link>
      </div>
      <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-[17px] leading-[1.5]">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="font-bold text-muted">{row.label}</dt>
            <dd className="m-0">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="t-meta m-0 text-muted">
        You can read the whole lesson without any of this. <Link href="/access#devices">Which device do you have?</Link>
      </p>
    </section>
  );
}

/** "a, b and c" from ReactNodes. */
function list(items: ReactNode[]): ReactNode {
  return items.map((item, index) => (
    <span key={index}>
      {index > 0 && (index === items.length - 1 ? " and " : ", ")}
      {item}
    </span>
  ));
}

/** Turns [text](/href) in a frontmatter string into links. */
function withLinks(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    parts.push(text.slice(last, match.index));
    const href = match[2];
    parts.push(
      href.startsWith("/") ? (
        <Link key={match.index} href={href}>
          {match[1]}
        </Link>
      ) : (
        <a key={match.index} href={href}>
          {match[1]}
        </a>
      ),
    );
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return parts;
}
