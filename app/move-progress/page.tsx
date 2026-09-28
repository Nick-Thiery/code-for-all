import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/callout";
import { MoveProgress } from "@/components/move-progress";

export const metadata: Metadata = {
  title: "Move my progress",
  description:
    "Carry your Code for All progress to another device with a code, a QR code or a file. No account needed, and nothing is sent to a server.",
};

export default function MoveProgressPage() {
  return (
    <div className="px-(--gut)">
      <article className="mx-auto flex max-w-[720px] flex-col gap-8 pt-(--hy) pb-(--sec)">
        <header className="flex flex-col gap-3.5">
          <span className="eyebrow">No account needed</span>
          <h1 className="t-h1 m-0">Move my progress</h1>
          <p className="t-lead m-0">
            Your progress is saved on this device only. To carry on somewhere else, like going from a school laptop
            to your phone, take a code with you and load it there.
          </p>
        </header>

        <Callout kind="headsup">
          <p>
            The code is made on this device and read on the other one. It&apos;s never sent to us or to anyone else,
            and it holds only which lessons you&apos;ve done and their levels. Nothing about you.{" "}
            <Link href="/privacy">More on privacy</Link>.
          </p>
        </Callout>

        <MoveProgress />
      </article>
    </div>
  );
}
