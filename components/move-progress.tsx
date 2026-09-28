"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { CopyButton } from "@/components/copy-button";
import { Hex, HexCheck } from "@/components/hex";
import { QrCode } from "@/components/qr-code";
import { formatCount } from "@/lib/format";
import { useMastery } from "@/lib/quiz-results";
import { useCompletedLessons } from "@/lib/progress";
import { type Problem, type Snapshot, decode, encode, isEmpty, levelledCount, shareLink, today } from "@/lib/transfer";
import { applySnapshot, readSnapshot } from "@/lib/transfer-storage";

// "Move my progress" (app/move-progress/page.tsx). Two halves: this device's
// progress as a code, a QR code and a file; and a box to load a code from
// another device, asking before it changes anything here. Everything happens
// in this browser: the code is never sent anywhere (lib/transfer.ts).

const PROBLEMS: Record<Problem, string> = {
  "not-a-code":
    "That doesn't look like a Code for All progress code. It starts with CFA. Check you copied all of it, then try again.",
  "too-old": "This code is from an older version of Code for All, so it can't be read any more. Make a new one on the other device.",
  "too-new": "This code was made by a newer version of Code for All. Reload this page and try again.",
  damaged: "That code has a mistake in it, like a missing letter. Copy it again and try once more.",
};

type Loading =
  | { kind: "idle" }
  | { kind: "problem"; problem: Problem }
  | { kind: "ready"; snapshot: Snapshot; here: Snapshot }
  | { kind: "loaded"; snapshot: Snapshot };

function describe(snapshot: Snapshot) {
  const levels = levelledCount(snapshot);
  const parts = [formatCount(snapshot.done.size, "lesson") + " done"];
  if (levels > 0) parts.push(`${formatCount(levels, "lesson")} with a level`);
  return parts.join(" and ");
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? null
    : parsed.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function MoveProgress() {
  const uid = useId();
  const { completed, ready } = useCompletedLessons();
  const { levels } = useMastery();
  const date = today();
  // This device's progress, kept in step with storage.
  const here = useMemo<Snapshot>(() => ({ done: completed, levels, date }), [completed, levels, date]);
  const [code, setCode] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    encode(here).then((made) => {
      if (!cancelled) setCode(made);
    });
    return () => {
      cancelled = true;
    };
  }, [here, ready]);

  // ---- Loading a code ----
  const [pasted, setPasted] = useState("");
  const [loading, setLoading] = useState<Loading>({ kind: "idle" });
  const resultRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function checkCode(text: string) {
    const result = await decode(text);
    if (!result.ok) setLoading({ kind: "problem", problem: result.problem });
    else setLoading({ kind: "ready", snapshot: result.snapshot, here: readSnapshot() });
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  // A QR link opens this page with the code after "#": fill it in and check it.
  useEffect(() => {
    const fromHash = /#code=([^&]+)/.exec(window.location.hash)?.[1];
    if (!fromHash) return;
    const text = decodeURIComponent(fromHash);
    setPasted(text);
    void checkCode(text);
    // The code stays in this page's box; the address bar doesn't need it any more.
    history.replaceState(null, "", window.location.pathname);
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void checkCode(pasted);
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    const text = await file.text();
    setPasted(text.trim());
    await checkCode(text);
  }

  function load(how: "replace" | "combine") {
    if (loading.kind !== "ready") return;
    const applied = applySnapshot(loading.snapshot, how);
    setLoading({ kind: "loaded", snapshot: applied });
    setPasted("");
    if (fileRef.current) fileRef.current.value = "";
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  function download() {
    if (!code) return;
    const blob = new Blob([`${code}\n`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code-for-all-progress-${date}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const link = code && origin ? shareLink(origin, code) : null;
  const nothingHere = ready && isEmpty(here);

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby={`${uid}-take`} className="flex flex-col gap-4">
        <h2 id={`${uid}-take`} className="t-h2 m-0">
          Take your progress with you
        </h2>
        {!ready ? (
          <p className="m-0 text-muted">Reading your progress…</p>
        ) : nothingHere ? (
          <p className="m-0">
            Nothing to move yet: no lessons are marked done on this device. Once you&apos;ve finished a lesson, your
            code appears here.
          </p>
        ) : (
          <>
            <p className="m-0">
              On this device: <strong>{describe(here)}</strong>. Get it onto another device in any of these ways.
            </p>
            <ol className="m-0 flex list-none flex-col gap-4 p-0">
              <li className="flex flex-col gap-2.5 rounded-[20px] border-[1.5px] border-border p-(--pad)">
                <h3 className="t-h3 m-0">1. Copy the code</h3>
                <p className="t-meta m-0 text-muted">Paste it into a message to yourself, then into the box below on the other device.</p>
                <label htmlFor={`${uid}-code`} className="sr-only">
                  Your progress code
                </label>
                <textarea
                  id={`${uid}-code`}
                  readOnly
                  value={code ?? "Making your code…"}
                  rows={3}
                  onFocus={(event) => event.currentTarget.select()}
                  className="w-full resize-none rounded-[14px] border-[1.5px] border-border bg-surface2 px-4 py-3 font-mono text-[15px] leading-[1.5] text-fg [overflow-wrap:anywhere]"
                />
                {code && <CopyButton text={code} className="btn btn-primary self-start" />}
              </li>
              <li className="flex flex-col gap-2.5 rounded-[20px] border-[1.5px] border-border p-(--pad)">
                <h3 className="t-h3 m-0">2. Scan the QR code</h3>
                <p className="t-meta m-0 text-muted">
                  Point the other device&apos;s camera at it. It opens this page there with your code already filled in.
                </p>
                {link ? (
                  <QrCode text={link} label="QR code that opens Move my progress with your code filled in" />
                ) : (
                  <p className="m-0 text-muted">Making your QR code…</p>
                )}
              </li>
              <li className="flex flex-col gap-2.5 rounded-[20px] border-[1.5px] border-border p-(--pad)">
                <h3 className="t-h3 m-0">3. Save a file</h3>
                <p className="t-meta m-0 text-muted">
                  A small text file with your code in it. Move it however you like, then choose it below on the other
                  device.
                </p>
                <button type="button" onClick={download} disabled={!code} className="btn btn-secondary self-start">
                  Download the file
                </button>
              </li>
            </ol>
          </>
        )}
      </section>

      <section aria-labelledby={`${uid}-bring`} className="flex flex-col gap-4">
        <h2 id={`${uid}-bring`} className="t-h2 m-0">
          Bring progress to this device
        </h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label htmlFor={`${uid}-paste`} className="font-bold">
            Paste a code, or the link from a QR code
          </label>
          <textarea
            id={`${uid}-paste`}
            value={pasted}
            onChange={(event) => setPasted(event.target.value)}
            rows={3}
            placeholder="CFA1…"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="w-full resize-y rounded-[14px] border-[1.5px] border-border bg-surface px-4 py-3 font-mono text-[15px] leading-[1.5] text-fg [overflow-wrap:anywhere]"
          />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <button type="submit" disabled={pasted.trim() === ""} className="btn btn-primary">
              Check the code
            </button>
            <label className="btn btn-secondary cursor-pointer has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-accent">
              Or choose the file
              <input
                ref={fileRef}
                type="file"
                accept=".txt,text/plain"
                onChange={(event) => void onFile(event.target.files?.[0])}
                className="sr-only"
              />
            </label>
          </div>
        </form>

        <div ref={resultRef} tabIndex={-1} aria-live="polite" className="outline-offset-[6px]">
          {loading.kind === "problem" && (
            <div className="flex flex-col gap-2 rounded-[14px] border-[1.5px] border-border px-[18px] py-4">
              <p className="display m-0 text-[21px] leading-[1.3] font-[650]">That code didn&apos;t work.</p>
              <p className="m-0">{PROBLEMS[loading.problem]}</p>
            </div>
          )}

          {loading.kind === "ready" && (
            <div className="flex flex-col gap-4 rounded-[20px] bg-tint p-(--pad)">
              <div className="flex flex-col gap-1">
                <p className="display m-0 text-[21px] leading-[1.3] font-[650]">
                  This code has {describe(loading.snapshot)}
                  {formatDate(loading.snapshot.date) ? `, saved on ${formatDate(loading.snapshot.date)}.` : "."}
                </p>
                {isEmpty(loading.here) ? (
                  <p className="m-0">This device has no progress yet, so loading it changes nothing else.</p>
                ) : (
                  <p className="m-0">
                    This device already has {describe(loading.here)}. <strong>Combine</strong> keeps both: a lesson
                    counts as done if it&apos;s done on either, and each lesson keeps its higher level.{" "}
                    <strong>Replace</strong> throws away what&apos;s here and uses the code instead.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {isEmpty(loading.here) ? (
                  <button type="button" onClick={() => load("replace")} className="btn btn-primary">
                    Load it
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={() => load("combine")} className="btn btn-primary">
                      Combine
                    </button>
                    <button type="button" onClick={() => load("replace")} className="btn btn-secondary">
                      Replace what&apos;s here
                    </button>
                  </>
                )}
                <button type="button" onClick={() => setLoading({ kind: "idle" })} className="btn btn-small">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading.kind === "loaded" && (
            <div className="flex flex-col gap-3 rounded-[20px] bg-tint p-(--pad)">
              <p className="display m-0 flex items-center gap-2.5 text-[21px] leading-[1.3] font-[650]">
                <Hex width={26} height={28} shape="fill-accent stroke-accent stroke-2" className="flex-none">
                  <HexCheck className="stroke-on-accent stroke-[2.6]" />
                </Hex>
                Done. This device now has {describe(loading.snapshot)}.
              </p>
              <Link href="/" className="btn btn-primary self-start">
                Go to the course <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
