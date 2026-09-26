import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/callout";
import { Hex, HexCheck } from "@/components/hex";
import { getOutline } from "@/lib/lessons";
import { allLessons } from "@/lib/outline";

export const metadata: Metadata = {
  title: "Hands-on access",
  description: "How access works for the hands-on parts of Code for All, and what works without it.",
};

type Props = { searchParams: Promise<{ from?: string }> };

export default async function AccessPage({ searchParams }: Props) {
  const outline = await getOutline();
  const lessons = allLessons(outline);
  // The lesson notice links here with ?from=<lesson id>, so we can send them back.
  const { from } = await searchParams;
  const cameFrom = lessons.find((lesson) => lesson.id === from);
  const handsOn = lessons.filter((lesson) => lesson.requiresAccount);

  return (
    <div className="px-(--gut)">
      <article className="mx-auto flex max-w-[720px] flex-col gap-6 pt-(--hy) pb-(--sec)">
        <header className="flex flex-col gap-3.5">
          <span className="eyebrow">Hands-on lessons</span>
          <h1 className="t-h1 m-0">How hands-on access works</h1>
          <p className="t-lead m-0">
            {handsOn.length === 1 ? "One lesson has" : "Some lessons have"} a hands-on part that uses a tool like Lovable or
            Claude Code.
            Access for those parts is set up for you through a Code for All session, or by a teacher running one.
            Everything else on Code for All works without it.
          </p>
        </header>

        <section className="flex flex-col gap-3.5 rounded-[20px] border-[1.5px] border-border p-(--pad)">
          <h2 className="t-h3 m-0">Works without it</h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {[
              "Reading every lesson, including the hands-on ones",
              "Practice with AI feedback",
              "Saving your progress on this device",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Hex width={22} height={24} shape="fill-accent" className="mt-[3px] flex-none">
                  <HexCheck className="stroke-on-accent stroke-[2.4]" />
                </Hex>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <h2 className="t-h2 mt-6 mb-0">Which tools need access?</h2>
        <p className="m-0">
          The hands-on parts use Lovable, Claude and Claude Code, GitHub, Vercel and Supabase. Each lesson that needs
          one says so at the top, and each hands-on section is marked &ldquo;Hands-on: needs access&rdquo;.
        </p>

        <h2 className="t-h2 mt-6 mb-0">Why do some lessons need access?</h2>
        <p className="m-0">
          These tools do real work for you, like building a site or putting it online, and they need an account
          behind them to do it. In a session, that&apos;s taken care of for you, which is why the hands-on parts are
          done with a session.
        </p>

        <h2 className="t-h2 mt-6 mb-0">How do I get access?</h2>
        <p className="m-0">
          Through a Code for All session, or through a teacher or group that runs one. They set everything up, so you
          don&apos;t need to sign up for Lovable or Claude yourself. A few later lessons use GitHub, Vercel and
          Supabase, where you sign in with a GitHub account: do those steps in a session, with your teacher&apos;s
          go-ahead.
        </p>
        <Callout kind="tip">
          <p>
            Know a teacher, club leader or youth worker who might run a session? Send them to the{" "}
            <Link href="/run-it">Run a session</Link> page. Everything they need is there, free.
          </p>
        </Callout>

        <h2 className="t-h2 mt-6 mb-0">No access yet?</h2>
        <p className="m-0">
          That&apos;s okay. Read the hands-on parts anyway so you know every step. When you get access, you&apos;ll be
          ready to go.
        </p>

        <div className="mt-2 flex flex-wrap gap-3">
          {cameFrom && (
            <Link href={cameFrom.href} className="btn btn-primary">
              <span aria-hidden="true">←</span> Back to Lesson {cameFrom.number}
            </Link>
          )}
          <Link href="/" className={cameFrom ? "btn btn-secondary" : "btn btn-primary"}>
            Go to the course
          </Link>
        </div>
      </article>
    </div>
  );
}
