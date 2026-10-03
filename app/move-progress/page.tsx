import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/callout";
import { MoveProgress } from "@/components/move-progress";
import { PageBody, PageHeader } from "@/components/page-header";
import { pageMetadata } from "@/lib/site-pages";

export const metadata: Metadata = pageMetadata("moveProgress");

export default function MoveProgressPage() {
  return (
    <article>
      <PageHeader kicker="No account needed" title="Move my progress">
        <p>
          Your progress is saved on this device only. To carry on somewhere else, like going from a school laptop to
          your phone, take a code with you and load it there.
        </p>
      </PageHeader>
      <PageBody className="gap-10 desktop:gap-14">

        <Callout kind="headsup">
          <p>
            The code is made on this device and read on the other one. It&apos;s never sent to us or to anyone else,
            and it holds only which lessons you&apos;ve done and their levels. Nothing about you.{" "}
            <Link href="/privacy">More on privacy</Link>.
          </p>
        </Callout>

        <MoveProgress />
      </PageBody>
    </article>
  );
}
