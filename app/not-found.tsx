import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="px-(--gut)">
      {/* The metadata API doesn't reach not-found pages; React puts this in <head>. */}
      <title>{`Page not found | ${site.name}`}</title>
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-[18px] py-12 text-center tablet:py-(--sec)">
        {/* An MRT line that runs out: three stops, then a dashed gap and a "?". */}
        <div aria-hidden="true" className="relative mb-3 h-24 w-full max-w-[400px]">
          <span className="absolute top-11 left-3.5 h-2 w-[calc(64%-14px)] rounded bg-accent" />
          <span className="absolute top-[46px] left-[64%] w-[calc(24%-22px)] border-t-4 border-dashed border-pip" />
          {["0px", "calc(32% - 14px)", "calc(64% - 14px)"].map((left) => (
            <span
              key={left}
              className="absolute top-[34px] box-border size-7 rounded-full border-[6px] border-accent bg-bg"
              style={{ left }}
            />
          ))}
          <span className="absolute top-3 right-0 box-border grid size-[72px] place-items-center rounded-full border-[3px] border-dashed border-pip bg-bg font-display text-[32px] font-bold text-muted [font-variation-settings:'CASL'_0]">
            ?
          </span>
        </div>
        <span className="eyebrow">Page not found</span>
        <h1 className="t-h1 m-0">This stop isn&apos;t on the line.</h1>
        <p className="m-0 max-w-[28em]">
          The page you&apos;re looking for doesn&apos;t exist, or it has moved. Your progress is safe.
        </p>
        <Link href="/" className="btn btn-primary mt-2">
          Back to the course
        </Link>
      </div>
    </div>
  );
}
