import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/callout";
import { Hex, HexCheck } from "@/components/hex";
import { getOutline } from "@/lib/lessons";
import { allLessons } from "@/lib/outline";
import { practiceCopy } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hands-on access",
  description: "How access works for the hands-on parts of Code for All, and what works without it.",
};

type Props = { searchParams: Promise<{ from?: string }> };

// The device guide. Every lesson's "You'll need" box links here, and so do
// lesson 1.1 and the install steps.
const devices = [
  {
    id: "laptop",
    name: "Windows or Mac laptop",
    points: [
      { ok: true, text: "Everything in the course works." },
      { ok: true, text: "Claude Code installs as an app, in Module 3." },
    ],
  },
  {
    id: "chromebook",
    name: "Chromebook, or a school device that blocks installs",
    points: [
      { ok: true, text: "Every browser tool works: Lovable, Claude, Claude Design, GitHub, Vercel, Supabase, Excel on the web." },
      { ok: true, text: "For Claude Code, use Claude Code on the web (needs a GitHub account, shown in Module 6), or a session laptop." },
      { ok: false, text: "The Claude Code desktop app and Claude for Excel's add-in can't be installed." },
    ],
  },
  {
    id: "phone",
    name: "iPad or phone",
    points: [
      { ok: true, text: "Reading, practice and quizzes all work. Your progress is saved on the device." },
      { ok: false, text: "Building needs a laptop or Chromebook. Do the hands-on parts in a session, or on a shared computer." },
    ],
  },
];

export default async function AccessPage({ searchParams }: Props) {
  const outline = await getOutline();
  const lessons = allLessons(outline);
  // The lesson notice links here with ?from=<lesson id>, so we can send them back.
  const { from } = await searchParams;
  const cameFrom = lessons.find((lesson) => lesson.id === from);
  const handsOn = lessons.filter((lesson) => lesson.requiresAccount);

  return (
    <div className="px-(--gut)">
      <article className="mx-auto flex max-w-[720px] flex-col gap-6 pt-(--hy) pb-12 tablet:pb-(--sec)">
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

        <section className="flex flex-col gap-3.5 rounded-2xl border border-border p-(--pad)">
          <h2 className="t-h3 m-0">Works without it</h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {[
              "Reading every lesson, including the hands-on ones",
              practiceCopy.accessItem,
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

        <h2 id="devices" className="t-h2 mt-6 mb-0 scroll-mt-6">
          Which device do you have?
        </h2>
        <p className="m-0">
          Reading, practice and quizzes work on anything with a browser. The building parts depend on your device.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-4">
          {devices.map((device) => (
            <section
              key={device.name}
              aria-labelledby={`device-${device.id}`}
              className="flex flex-col gap-2 rounded-2xl border border-border p-5"
            >
              <h3 id={`device-${device.id}`} className="display m-0 text-[21px] leading-[1.3] font-bold">
                {device.name}
              </h3>
              <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[17px] leading-[1.5]">
                {device.points.map((point) => (
                  <li key={point.text} className="flex items-start gap-2.5">
                    <Hex
                      width={18}
                      height={20}
                      shape={point.ok ? "fill-accent" : "fill-none stroke-pip stroke-2"}
                      className="mt-[5px] flex-none"
                    >
                      {point.ok && <HexCheck className="stroke-on-accent stroke-[2.6]" />}
                    </Hex>
                    <span>{point.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="m-0">
          Claude Code on the web runs in your browser at claude.ai/code, or in the Code tab of the Claude app on a
          phone, with nothing to install. It needs a GitHub repository connected, which you set up in{" "}
          <Link href="/module-6">Module 6</Link>, and the access your session gives you. A session laptop works for
          everything.
        </p>
        <p className="m-0">
          Switching between devices? Your progress is saved on the device you used, not in an account. Use{" "}
          <Link href="/move-progress">Move my progress</Link> to carry it across with a code, a QR code or a file.
          On limited data, open the lessons you want while you have Wi-Fi: lessons you&apos;ve already opened keep
          working offline, and you can add the site to your home screen like an app.
        </p>

        <h2 id="cost" className="t-h2 mt-6 mb-0 scroll-mt-6">
          What does it cost?
        </h2>
        <p className="m-0">
          Nothing. The course is free, and every tool it uses is either free or comes through your Code for All
          access. Nothing on this site or in the lessons should ever ask you for a bank card. If a tool asks for one,
          stop: you&apos;re on the wrong page or the wrong plan. Ask in your session, or <Link href="/help">get help</Link>.
        </p>

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
