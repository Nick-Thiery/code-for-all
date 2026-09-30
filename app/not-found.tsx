import Link from "next/link";
import { PageBody, PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <article>
      {/* The metadata API doesn't reach not-found pages; React puts this in <head>. */}
      <title>{`Page not found | ${site.name}`}</title>
      <PageHeader
        tone="sky"
        kicker="Page not found"
        title="This stop isn't on the line."
        above={
          // An MRT line that runs out: three stops, then a dashed gap and a "?".
          <div aria-hidden="true" className="relative mb-8 h-[76px] w-full max-w-[420px]">
            <span className="absolute top-[30px] left-3.5 box-border h-3.5 w-[calc(64%-14px)] border-2 border-line bg-accent" />
            <span className="absolute top-[36px] left-[64%] w-[calc(22%-14px)] border-t-2 border-dashed border-line" />
            {["0px", "calc(32% - 15px)", "calc(64% - 15px)"].map((left) => (
              <span
                key={left}
                className="absolute top-[22px] box-border size-[30px] rounded-full border-2 border-line bg-marigold"
                style={{ left }}
              />
            ))}
            <span className="numeral absolute top-0 right-0 box-border grid size-[76px] place-items-center rounded-full border-2 border-dashed border-line bg-paper pt-1 text-[44px] text-ink">
              ?
            </span>
          </div>
        }
      >
        <p>The page you&apos;re looking for doesn&apos;t exist, or it has moved. Your progress is safe.</p>
      </PageHeader>
      <PageBody>
        <Link href="/" className="btn btn-primary self-start">
          Back to the course
        </Link>
      </PageBody>
    </article>
  );
}
