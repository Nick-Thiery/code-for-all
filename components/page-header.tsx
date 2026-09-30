import type { CSSProperties, ReactNode } from "react";
import { MaskedTitle } from "@/components/masked-title";
import { titleSize } from "@/lib/format";

const TONES = {
  paper: "bg-bg",
  sky: "on-sky",
  navy: "on-navy",
  marigold: "on-marigold",
};

/**
 * The top of every page that isn't the homepage or a lesson: a kicker, the
 * title in Archivo capitals (sized by its length, its words sliding up out
 * of their masks) and a Newsreader dek, over a 2px rule. `tone` puts it on a
 * colour block; `sticker` adds the round marigold sticker ("8 questions").
 */
export function PageHeader({
  kicker,
  title,
  tone = "paper",
  sticker,
  above,
  printHidden = false,
  children,
}: {
  kicker?: ReactNode;
  title: string;
  tone?: keyof typeof TONES;
  sticker?: { big: string; small: string };
  /** Something above the kicker: a way back, a picture. */
  above?: ReactNode;
  /** Leave the header off paper: a certificate page prints only the certificate. */
  printHidden?: boolean;
  /** The dek: a sentence or two under the title. */
  children?: ReactNode;
}) {
  return (
    <header className={`${TONES[tone]} overflow-hidden border-b-2 border-line px-(--gut) print:px-0 ${printHidden ? "print:hidden" : ""}`}>
      <div className="relative mx-auto flex max-w-[1200px] flex-col pt-(--hy) pb-10 desktop:pb-[68px] print:pt-0 print:pb-6">
        {above}
        {kicker && <p className="a-fade eyebrow m-0 mb-3.5 desktop:mb-5 desktop:tracking-[.14em]">{kicker}</p>}
        <div className="flex items-end justify-between gap-6">
          <h1 className={`${titleSize(title)} m-0 max-w-[1000px]`}>
            <MaskedTitle text={title} start={0.1} />
          </h1>
          {sticker && (
            <p
              className="sticker a-spin m-0 mr-1.5 mb-1 size-[104px] flex-none desktop:mr-3 desktop:size-[138px] desktop:shadow-h5"
              style={{ "--d": ".9s" } as CSSProperties}
            >
              <span className="font-serif text-[46px] leading-[.9] font-semibold italic desktop:text-[60px]">{sticker.big}</span>
              <span className="font-display text-[11px] leading-[1.3] font-extrabold tracking-[.12em] uppercase [font-stretch:85%] desktop:text-[14px]">
                {sticker.small}
              </span>
            </p>
          )}
        </div>
        {children && (
          <div
            className="a-rise t-lead mt-5 max-w-[760px] desktop:mt-[30px] [&_p]:m-0"
            style={{ "--d": ".5s" } as CSSProperties}
          >
            {children}
          </div>
        )}
      </div>
    </header>
  );
}

/** The column under a PageHeader: the lesson's main column, so every page lines up. */
export function PageBody({ children, className = "", wide = false }: { children: ReactNode; className?: string; wide?: boolean }) {
  return (
    <div className="px-(--gut) print:px-0">
      <div className="mx-auto max-w-[1200px] pt-10 pb-16 desktop:pt-[72px] desktop:pb-[120px] print:max-w-none print:p-0">
        <div className={`${wide ? "" : "with-rail"} flex flex-col ${className}`}>{children}</div>
      </div>
    </div>
  );
}
