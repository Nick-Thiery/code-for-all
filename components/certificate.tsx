"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { Hex } from "@/components/hex";
import { PrintButton, PrintSetup } from "@/components/kit-print";
import { formatCount } from "@/lib/format";
import {
  type CertificateText,
  NAME_MAX,
  SMALL_PRINT,
  certificateDate,
  saveCertificateName,
  useCertificateName,
} from "@/lib/certificate";
import { drawCertificate } from "@/lib/certificate-image";
import { useCompletedLessons } from "@/lib/progress";

// A certificate page (app/[module]/certificate, app/certificate). Locked
// until every lesson it needs is done. The name is typed here and kept on
// this device only (lib/certificate.ts). The certificate is always in light
// colours: the light tokens are set on it directly, so dark mode doesn't
// reach inside, and PrintSetup prints the page in light too.

type Props = {
  text: CertificateText;
  /** The light-mode tokens (lib/tokens.ts), so the certificate stays light in dark mode. */
  lightTokens: Record<string, string>;
  /** public/cfa-logo-light.png (lib/logo.ts). */
  logoSrc: string;
  /** Where to send someone who hasn't finished yet. */
  unfinished: { href: string; label: string };
};

export function Certificate({ text, lightTokens, logoSrc, unfinished }: Props) {
  const uid = useId();
  const { completed, ready } = useCompletedLessons();
  const { name: savedName, ready: nameReady } = useCertificateName();
  const [name, setName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const date = certificateDate();

  // Start from the saved name once it's known; typing takes over from there.
  const typed = name ?? savedName;
  useEffect(() => {
    if (name !== null) saveCertificateName(name);
  }, [name]);

  const doneCount = text.requires.filter((id) => completed.has(id)).length;
  const finished = ready && doneCount === text.requires.length;
  const shownName = typed.trim() || "Your name";

  async function saveImage() {
    if (!sheet.current) return;
    setSaving(true);
    setSaveError(false);
    try {
      const blob = await drawCertificate(sheet.current, text, shownName, date, logoSrc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `code-for-all-certificate-${text.kicker.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }

  // Tokens as inline variables: everything inside reads the light values.
  const light = Object.fromEntries(Object.entries(lightTokens).map(([key, value]) => [`--${key}`, value])) as CSSProperties;

  if (!ready) {
    return <p className="m-0 text-muted">Checking your progress…</p>;
  }

  if (!finished) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-border p-(--pad)">
        <p className="display m-0 text-[22px] leading-[1.25] font-[650]">Not quite yet.</p>
        <p className="m-0">
          You&apos;ve done {doneCount} of {formatCount(text.requires.length, "lesson")}. Finish them all and your
          certificate appears here.
        </p>
        <Link href={unfinished.href} className="btn btn-primary self-start">
          {unfinished.label} <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PrintSetup />
      <div className="flex flex-col gap-2 print:hidden">
        <label htmlFor={`${uid}-name`} className="font-bold">
          The name to print
        </label>
        <input
          id={`${uid}-name`}
          type="text"
          value={typed}
          maxLength={NAME_MAX}
          disabled={!nameReady}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          placeholder="Your name"
          className="w-full max-w-[420px] rounded-xl border border-border bg-surface px-4 py-3 text-[19px] text-fg"
        />
        <p className="t-meta m-0 text-muted">
          Your name stays on this device, so it&apos;s ready for your next certificate. It&apos;s never sent anywhere.
          Clear the box to forget it.
        </p>
      </div>

      {/* The certificate itself. */}
      <div
        ref={sheet}
        style={light}
        className="certificate relative box-border flex aspect-[297/210] w-full flex-col justify-between overflow-hidden rounded-[6px] border border-border bg-bg p-[5%] text-fg print:aspect-auto print:h-full print:w-full print:rounded-none"
      >
        <div className="flex items-start justify-between gap-4">
          <Image src={logoSrc} alt="Code for All" width={401} height={126} unoptimized className="h-auto w-[22%] max-w-[260px]" />
          <span aria-hidden="true" className="flex flex-wrap justify-end gap-[0.4em] text-[clamp(8px,1.6cqw,16px)]">
            {Array.from({ length: Math.min(text.lessons, 12) }, (_, i) => (
              <Hex key={i} width={22} height={24} shape="fill-deco" className="h-[1.5em] w-auto" />
            ))}
          </span>
        </div>

        <div className="flex flex-col gap-[0.6em] text-[clamp(9px,1.85cqw,22px)]">
          <span className="eyebrow text-[0.8em] leading-none">Certificate of completion</span>
          <span className="text-muted">This certifies that</span>
          <span className="display text-[clamp(20px,6cqw,72px)] leading-[1.05] font-[750] [overflow-wrap:anywhere]">{shownName}</span>
          <span className="text-muted">finished {text.kicker} of Code for All</span>
          <span className="display mt-[0.3em] text-[1.8em] leading-[1.15] font-bold">{text.title}</span>
          <span>{text.line}</span>
        </div>

        <div className="flex items-end justify-between gap-8 text-[clamp(7px,1.3cqw,15px)]">
          <span className="flex flex-col gap-[0.3em]">
            <span className="text-[0.9em] font-bold tracking-[.06em] text-muted uppercase">Date</span>
            <span className="text-[1.3em] font-bold">{date}</span>
          </span>
          <span className="max-w-[46%] text-[0.9em] leading-[1.45] text-muted">{SMALL_PRINT}</span>
        </div>
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[1.2%] min-h-[6px] bg-accent" />
      </div>

      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <PrintButton label="Print" />
        <button type="button" onClick={saveImage} disabled={saving} className="btn btn-secondary">
          {saving ? "Making the image…" : "Save as image"}
        </button>
        <span className="t-meta text-muted">Prints on one A4 page. The image is a PNG you can share.</span>
      </div>
      {saveError && (
        <p role="alert" className="m-0 text-fg">
          The image couldn&apos;t be made in this browser. Printing to PDF works instead.
        </p>
      )}
    </div>
  );
}
