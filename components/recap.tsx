import { FinishedToggle } from "@/components/finished-toggle";

type Props = {
  slug: string;
  /** From the lesson's optional `recap` list. */
  points: string[];
  /** Shown when there are no recap points. */
  fallback: string;
};

export function Recap({ slug, points, fallback }: Props) {
  return (
    <section aria-labelledby="recap-heading" className="mt-16 rounded-2xl bg-surface p-6 sm:p-8">
      <h2 id="recap-heading" className="display text-2xl">
        Recap
      </h2>
      {points.length > 0 ? (
        <ul className="mt-4 space-y-2.5 text-lg leading-relaxed">
          {points.map((point, index) => (
            <li key={index} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.6em] size-2 shrink-0 rounded-full bg-emphasis" />
              {point}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-lg leading-relaxed">{fallback}</p>
      )}
      <div className="mt-6 border-t-2 border-rule pt-5">
        <FinishedToggle slug={slug} />
      </div>
    </section>
  );
}
