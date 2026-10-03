import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/callout";
import { Icon } from "@/components/icons";
import { PageBody, PageHeader } from "@/components/page-header";
import { getOutline } from "@/lib/lessons";
import { allLessons, contentsHref } from "@/lib/outline";
import { practiceCopy } from "@/lib/site";
import { ACCESS_SECTIONS, pageMetadata } from "@/lib/site-pages";

export const metadata: Metadata = pageMetadata("access");

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
    <article>
      <PageHeader kicker="Hands-on lessons" title="How hands-on access works">
        <p>
          {handsOn.length === 1 ? "One lesson has" : "Some lessons have"} a hands-on part that uses a tool like Lovable or
          Claude Code. Access for those parts is set up for you through a Code for All session, or by a teacher running
          one. Everything else on Code for All works without it.
        </p>
      </PageHeader>
      <PageBody className="gap-6">
        <section className="card flex flex-col gap-3.5 p-(--pad)">
          <h2 className="t-block m-0">Works without it</h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {[
              "Reading every lesson, including the hands-on ones",
              practiceCopy.accessItem,
              "Saving your progress on this device",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Tick ok />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <h2 id={ACCESS_SECTIONS.devices.id} className="t-h2 mt-10 mb-0 scroll-mt-6">
          {ACCESS_SECTIONS.devices.title}
        </h2>
        <p className="m-0">{ACCESS_SECTIONS.devices.description}</p>
        <div className="my-2 grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-5 wide:-mr-[310px]">
          {devices.map((device) => (
            <section
              key={device.name}
              aria-labelledby={`device-${device.id}`}
              className="card flex flex-col gap-3 p-5 shadow-h5 desktop:shadow-h6"
            >
              <h3 id={`device-${device.id}`} className="display m-0 text-[23px] leading-[1.15]">
                {device.name}
              </h3>
              <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[17px] leading-[1.5]">
                {device.points.map((point) => (
                  <li key={point.text} className="flex items-start gap-2.5">
                    <Tick ok={point.ok} small />
                    <span>
                      <span className="sr-only">{point.ok ? "Works: " : "Doesn't work: "}</span>
                      {point.text}
                    </span>
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

        <h2 id={ACCESS_SECTIONS.cost.id} className="t-h2 mt-10 mb-0 scroll-mt-6">
          {ACCESS_SECTIONS.cost.title}
        </h2>
        <p className="m-0">
          {ACCESS_SECTIONS.cost.description} Nothing on this site or in the lessons should ever ask you for a bank
          card. If a tool asks for one, stop: you&apos;re on the wrong page or the wrong plan. Ask in your session, or <Link href="/help">get help</Link>.
        </p>

        <h2 className="t-h2 mt-10 mb-0">Which tools need access?</h2>
        <p className="m-0">
          The hands-on parts use Lovable, Claude and Claude Code, GitHub, Vercel and Supabase. Each lesson that needs
          one says so at the top, and each hands-on section is marked &ldquo;Hands-on: needs access&rdquo;.
        </p>

        <h2 className="t-h2 mt-10 mb-0">Why do some lessons need access?</h2>
        <p className="m-0">
          These tools do real work for you, like building a site or putting it online, and they need an account
          behind them to do it. In a session, that&apos;s taken care of for you, which is why the hands-on parts are
          done with a session.
        </p>

        <h2 className="t-h2 mt-10 mb-0">How do I get access?</h2>
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

        <h2 className="t-h2 mt-10 mb-0">No access yet?</h2>
        <p className="m-0">
          That&apos;s okay. Read the hands-on parts anyway so you know every step. When you get access, you&apos;ll be
          ready to go.
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          {cameFrom && (
            <Link href={cameFrom.href} className="btn btn-primary">
              <Icon name="arrow-left" size={20} stroke={2.6} /> Back to Lesson {cameFrom.number}
            </Link>
          )}
          <Link href={contentsHref} className={cameFrom ? "btn btn-secondary" : "btn btn-primary"}>
            Go to the course
          </Link>
        </div>
      </PageBody>
    </article>
  );
}

/** A square with a tick for "works", or a cross for "doesn't". */
function Tick({ ok, small = false }: { ok: boolean; small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`box-border grid flex-none place-items-center rounded-[3px] border-2 border-line ${
        small ? "mt-[3px] size-5" : "mt-0.5 size-6 desktop:mt-1"
      } ${ok ? "bg-accent text-on-accent" : "bg-surface text-fg"}`}
    >
      <Icon name={ok ? "check" : "cross"} size={small ? 12 : 15} stroke={3.4} />
    </span>
  );
}
