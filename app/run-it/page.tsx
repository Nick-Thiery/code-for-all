import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Run it",
  description: "Materials for facilitators running Code for All sessions.",
};

// Stub. Facilitator materials go here.
export default function RunItPage() {
  return (
    <article>
      <h1 className="display text-[2.25rem] leading-[1.08] sm:text-5xl">Run it</h1>
      <p className="mt-4 text-xl leading-relaxed text-muted sm:text-[1.375rem]">
        Materials for facilitators running Code for All sessions.
      </p>
      <p className="mt-10 rounded-xl bg-surface p-5">Nothing here yet.</p>
    </article>
  );
}
