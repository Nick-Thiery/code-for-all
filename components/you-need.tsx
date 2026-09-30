import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";
import type { LessonNeeds } from "@/lib/lessons";

/**
 * The "You'll need" box at the top of a hands-on lesson: device, access,
 * anything from earlier lessons, and time. It replaces the plain "Hands-on:
 * needs access" notice on lessons that set `needs` in their frontmatter.
 */
export function YouNeed({ lessonId, needs, minutes }: { lessonId: string; needs: LessonNeeds; minutes: number }) {
  const rows: { label: string; icon: IconName; value: ReactNode }[] = [
    { label: "Device", icon: "laptop", value: withLinks(needs.device) },
    ...(needs.access.length > 0
      ? [
          {
            label: "Access",
            icon: "key" as const,
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
    ...(needs.before.length > 0
      ? [{ label: "From earlier", icon: "page" as const, value: list(needs.before.map(withLinks)) }]
      : []),
    { label: "Time", icon: "clock", value: `About ${minutes} minutes` },
  ];

  return (
    <div className="rail-block flex flex-col gap-3.5">
      <span className="rail-label">Before you start</span>
      <section
        aria-labelledby="you-need"
        className="on-marigold a-rise flex flex-col gap-5 rounded-md border-2 border-line px-[22px] pt-[22px] pb-6 shadow-h6 desktop:gap-6 desktop:px-8 desktop:pt-7 desktop:pb-8 desktop:shadow-h8"
        style={{ "--d": ".3s" } as CSSProperties}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
          <h2 id="you-need" className="t-block m-0">
            You&apos;ll need
          </h2>
          <Link href={`/access?from=${encodeURIComponent(lessonId)}`} className="text-[16px] font-bold">
            Hands-on: needs access
          </Link>
        </div>
        <dl className="m-0 grid gap-x-6 gap-y-4 tablet:grid-cols-2">
          {rows.map((row) => (
            // The icon tile sits in the space the row leaves on its left.
            <div key={row.label} className="relative flex min-h-12 flex-col gap-0.5 pt-0.5 pl-[62px] desktop:min-h-14 desktop:pl-[70px]">
              <dt className="kicker text-[13px] desktop:text-[13px]">
                <span className="on-surface absolute top-0 left-0 box-border grid size-12 place-items-center rounded-md border-2 border-line text-accent desktop:size-14">
                  <Icon name={row.icon} size={28} stroke={1.9} />
                </span>
                {row.label}
              </dt>
              <dd className="m-0 text-[17px] leading-[1.4] desktop:text-[18px]">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="t-meta m-0">
          You can read the whole lesson without any of this. <Link href="/access#devices">Which device do you have?</Link>
        </p>
      </section>
    </div>
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
