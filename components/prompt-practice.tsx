"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { Hex, HEX_POINTS } from "@/components/hex";
import {
  PROMPT_MAX,
  PROMPT_NEAR,
  SCORE_WORDS,
  SKILLS,
  type PracticeResponse,
  type PracticeSubmission,
  type Score,
} from "@/lib/practice";
import { isMockName, mockFixture, type MockName } from "@/lib/practice-mock";

type Graded = Extract<PracticeResponse, { status: "graded" }>;
type Scores = Graded["scores"];

type Notice = { title: string; body: string; note?: string; action?: "focus" | "submit"; button?: string };

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; result: Graded; previous: Scores | null }
  | { kind: "notice"; notice: Notice; locked: boolean };

const NOTICES = {
  offtopic: {
    title: "This doesn't look like a prompt for this task.",
    body: "Want to have another go?",
    note: "Check the task above, then write a prompt for it.",
    action: "focus",
    button: "Have another go",
  },
  error: {
    title: "That didn't work on our end, not yours.",
    body: "Try again in a moment.",
    note: "Your prompt is safe in the box above.",
    action: "submit",
    button: "Try again",
  },
  offline: {
    title: "Couldn't reach the server.",
    body: "Check your connection and submit again.",
    note: "Your prompt is safe in the box above.",
    action: "submit",
    button: "Try again",
  },
  hourly: {
    title: "You've practised a lot this hour.",
    body: "Take a short break and come back in a bit.",
    note: "Your prompt will still be here when you're back.",
  },
  daily: {
    title: "We've hit today's practice limit for everyone.",
    body: "Come back tomorrow. The lesson itself still works.",
  },
} satisfies Record<string, Notice>;

type Props = {
  taskId: string;
  /** Optional hint, behind a "Need a hint?" button. */
  hint?: string;
  /** Optional task instructions, written between the opening and closing tags. */
  children?: ReactNode;
};

export function PromptPractice({ taskId, hint, children }: Props) {
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [lastScores, setLastScores] = useState<Scores | null>(null);
  const [hintOpen, setHintOpen] = useState(false);

  const busy = status.kind === "loading";
  const locked = status.kind === "notice" && status.locked;
  const canSubmit = text.trim() !== "" && !busy && !locked;

  // Focus the headline when an answer arrives, so screen readers hear it.
  const wasLoading = useRef(false);
  useEffect(() => {
    if (wasLoading.current && !busy) headlineRef.current?.focus();
    wasLoading.current = busy;
  }, [busy]);

  // ?mock=<name>: open in one of the fixture states. See lib/practice-mock.ts.
  const submitRef = useRef(submit);
  submitRef.current = submit;
  useEffect(() => {
    const mock = new URLSearchParams(window.location.search).get("mock");
    if (!isMockName(mock)) return;
    const fixture = mockFixture(taskId, mock);
    if (!fixture) return;
    setText(fixture.text);
    if (fixture.previousScores) setLastScores(fixture.previousScores);
    if (fixture.start === "loading") setStatus({ kind: "loading" });
    if (fixture.start === "submit") void submitRef.current(fixture.text, mock, fixture.previousScores ?? null);
  }, [taskId]);

  async function submit(prompt = text, mock: MockName | null = null, previous = lastScores) {
    if (!prompt.trim()) return;
    setStatus({ kind: "loading" });
    setSubmitted(prompt);

    const submission: PracticeSubmission = { taskId, prompt };
    let response: Response;
    try {
      response = await fetch(`/api/practice${mock ? `?mock=${mock}` : ""}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
    } catch {
      setStatus({ kind: "notice", notice: NOTICES.offline, locked: false });
      return;
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      setStatus({ kind: "notice", notice: NOTICES.error, locked: false });
      return;
    }

    const answer = body as Partial<PracticeResponse> & { error?: string };
    if (response.ok && answer.status === "graded") {
      const result = answer as Graded;
      setStatus({ kind: "result", result, previous });
      setLastScores(result.scores);
    } else if (response.ok && answer.status === "offtopic") {
      setStatus({ kind: "notice", notice: NOTICES.offtopic, locked: false });
    } else if (answer.status === "limited") {
      const scope = (answer as Extract<PracticeResponse, { status: "limited" }>).scope;
      setStatus({ kind: "notice", notice: scope === "daily" ? NOTICES.daily : NOTICES.hourly, locked: true });
    } else if (response.status === 400 && typeof answer.error === "string") {
      // A mistake in how the card was set up, not the learner's fault.
      setStatus({ kind: "notice", notice: { ...NOTICES.error, body: answer.error }, locked: false });
    } else {
      setStatus({ kind: "notice", notice: NOTICES.error, locked: false });
    }
  }

  // Try again: back to the box, caret at the end. The text is never cleared.
  function focusPrompt() {
    const box = textareaRef.current;
    if (!box) return;
    box.focus();
    box.setSelectionRange(box.value.length, box.value.length);
  }

  const length = text.length;
  const near = length >= PROMPT_NEAR;
  const limitMessage =
    length >= PROMPT_MAX
      ? "That's the limit. Try trimming a sentence or two."
      : near
        ? "Getting close to the limit. Shorter prompts often work better."
        : "";

  return (
    <section aria-labelledby={`${id}-label`} data-task-id={taskId} className="flex flex-col gap-5 text-left text-fg">
      <div className="overflow-hidden rounded-[20px] border-[1.5px] border-border bg-surface">
        <div className="flex flex-col gap-2.5 bg-tint p-(--pad)">
          <div className="flex items-center gap-2">
            <Hex width={18} height={20} shape="fill-deco" />
            <span
              id={`${id}-label`}
              className="font-display text-[16px] leading-none font-bold tracking-[.06em] text-accent uppercase [font-variation-settings:'CASL'_0.6]"
            >
              Practice
            </span>
          </div>
          <div className="display text-(length:--task) leading-[1.3] font-semibold [&_p]:m-0">
            {children ?? (
              <p>
                Task <code>{taskId}</code>
              </p>
            )}
          </div>
          {hint && (
            <>
              <button
                type="button"
                aria-expanded={hintOpen}
                onClick={() => setHintOpen((open) => !open)}
                className="min-h-11 cursor-pointer self-start border-0 bg-transparent p-0 font-[inherit] text-[17px] font-bold text-accent underline underline-offset-4"
              >
                {hintOpen ? "Hide hint" : "Need a hint?"}
              </button>
              {hintOpen && <p className="-mt-1.5 mb-0">{hint}</p>}
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 p-(--pad)">
          <label htmlFor={`${id}-prompt`} className="text-[18px] font-bold">
            Your prompt
          </label>
          <textarea
            ref={textareaRef}
            id={`${id}-prompt`}
            value={text}
            onChange={(event) => setText(event.target.value.slice(0, PROMPT_MAX))}
            maxLength={PROMPT_MAX}
            readOnly={busy}
            rows={6}
            placeholder="Write your prompt here..."
            aria-describedby={`${id}-count ${id}-msg`}
            className="box-border min-h-[180px] w-full resize-y rounded-xl border-2 border-border bg-surface p-4 font-mono text-[17px] leading-[1.6] text-fg"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[16px] leading-[1.5]">
            <span id={`${id}-msg`} aria-live="polite" className="flex-[1_1_220px] font-bold text-accent">
              {limitMessage}
            </span>
            <span
              id={`${id}-count`}
              className={`ml-auto tabular-nums ${near ? "font-bold text-accent" : "text-muted"}`}
            >
              {length.toLocaleString("en-US")} / {PROMPT_MAX.toLocaleString("en-US")}
            </span>
          </div>
          <p className="t-meta mt-1.5 mb-0 text-muted">
            Your feedback is written by AI. Don&apos;t include personal details like your address or phone number.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <button type="button" onClick={() => void submit()} disabled={!canSubmit} className="btn btn-primary">
              Get feedback
            </button>
            {text.trim() === "" && status.kind === "idle" && (
              <span className="t-meta text-muted">Write something first, then ask for feedback.</span>
            )}
          </div>
        </div>
      </div>

      {status.kind === "loading" && (
        <div
          role="status"
          className="flex items-center gap-[18px] rounded-[20px] border-[1.5px] border-border bg-surface p-(--pad)"
          style={{ animation: "cfaRise 300ms ease both" }}
        >
          <div aria-hidden="true" className="flex flex-none gap-1.5">
            {[0, 200, 400].map((delay) => (
              <Hex
                key={delay}
                width={18}
                height={20}
                shape="fill-deco"
                style={{ animation: `cfaBreathe 1.4s ease-in-out ${delay}ms infinite` }}
              />
            ))}
          </div>
          <div>
            <p className="display m-0 text-[22px] leading-[1.3] font-semibold">Reading your prompt...</p>
            <p className="t-meta mt-0.5 mb-0 text-muted">This usually takes a few seconds.</p>
          </div>
        </div>
      )}

      {status.kind === "notice" && (
        <NoticeCard
          notice={status.notice}
          headlineRef={headlineRef}
          onAction={status.notice.action === "submit" ? () => void submit() : focusPrompt}
        />
      )}

      {status.kind === "result" && (
        <Feedback
          id={id}
          result={status.result}
          previous={status.previous}
          prompt={submitted}
          headlineRef={headlineRef}
          onTryAgain={focusPrompt}
        />
      )}
    </section>
  );
}

function NoticeCard({
  notice,
  headlineRef,
  onAction,
}: {
  notice: Notice;
  headlineRef: RefObject<HTMLHeadingElement | null>;
  onAction: () => void;
}) {
  return (
    <div
      className="flex items-start gap-4 rounded-[20px] border-[1.5px] border-border bg-surface p-(--pad)"
      style={{ animation: "cfaRise 360ms ease both" }}
    >
      <Hex width={28} height={30} shape="fill-none stroke-deco stroke-2" className="mt-0.5 flex-none" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 ref={headlineRef} tabIndex={-1} className="display m-0 text-[22px] leading-[1.3] font-semibold">
          {notice.title}
        </h3>
        <p className="m-0">{notice.body}</p>
        {notice.note && <p className="t-meta m-0 text-muted">{notice.note}</p>}
        {notice.button && (
          <div className="mt-2.5">
            <button type="button" onClick={onAction} className="btn btn-secondary min-h-12 px-[22px]">
              {notice.button}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Feedback({
  id,
  result,
  previous,
  prompt,
  headlineRef,
  onTryAgain,
}: {
  id: string;
  result: Graded;
  previous: Scores | null;
  prompt: string;
  headlineRef: RefObject<HTMLHeadingElement | null>;
  onTryAgain: () => void;
}) {
  const [open, setOpen] = useState([false, false, false]);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const allNailed = result.scores.every((score) => score === 2);
  const improved = previous
    ? result.scores.map((score, i) => ({ i, from: previous[i], to: score })).filter((x) => x.to > x.from)
    : [];
  const { fix } = result;

  function copy() {
    const rewrite = result.rewrite.map((part) => part.text).join("").trim();
    navigator.clipboard?.writeText(rewrite).catch(() => {});
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article
      aria-labelledby={`${id}-head`}
      className="flex flex-col gap-6 rounded-[20px] border-[1.5px] border-border bg-surface p-(--pad)"
    >
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <p className="kicker m-0">Feedback on your prompt</p>
          {allNailed && (
            <span aria-hidden="true" className="flex gap-[3px]">
              {[700, 820, 940].map((delay) => (
                <Hex
                  key={delay}
                  width={13}
                  height={14}
                  shape="fill-deco"
                  style={{ animation: `cfaPop 500ms ${delay}ms both` }}
                />
              ))}
            </span>
          )}
        </div>
        <h3
          id={`${id}-head`}
          ref={headlineRef}
          tabIndex={-1}
          className="display m-0 text-(length:--head) leading-[1.25] font-[650] outline-offset-[6px]"
          style={{ animation: "cfaRise 400ms ease both" }}
        >
          {result.headline}
        </h3>
      </header>

      {improved.length > 0 && (
        <div
          className="flex flex-col gap-1.5 rounded-[14px] bg-tint px-5 py-4"
          style={{ animation: "cfaRise 400ms 100ms ease both" }}
        >
          <p className="display m-0 text-[16px] font-bold">Since your last try</p>
          {improved.map(({ i, from, to }) => (
            <div key={i} className="flex min-h-10 flex-wrap items-center gap-x-3 gap-y-1">
              <span className="sr-only">
                {SKILLS[i].name} went from {SCORE_WORDS[from]} to {SCORE_WORDS[to]}.
              </span>
              <strong aria-hidden="true">{SKILLS[i].name}:</strong>
              <span aria-hidden="true" className="inline-flex items-center gap-2 text-muted">
                <span className="flex gap-[3px]">
                  {[0, 1].map((k) => (
                    <Hex
                      key={k}
                      width={16}
                      height={18}
                      shape={from > k ? "fill-muted stroke-muted stroke-2" : "fill-none stroke-pip stroke-2"}
                    />
                  ))}
                </span>
                {SCORE_WORDS[from]}
              </span>
              <span
                aria-hidden="true"
                className="font-bold text-accent"
                style={{ animation: "cfaSlide 400ms 350ms ease both" }}
              >
                →
              </span>
              <span
                aria-hidden="true"
                className="inline-flex items-center gap-2"
                style={{ animation: "cfaSlide 400ms 500ms ease both" }}
              >
                <span className="flex gap-[3px]">
                  {[0, 1].map((k) =>
                    to > k && from <= k ? (
                      <span key={k} className="relative block h-6 w-[22px]">
                        <svg
                          width="22"
                          height="24"
                          viewBox="0 0 24 26"
                          className="ripple absolute inset-0"
                          style={{ animation: "cfaRing 1s 900ms ease-out both" }}
                        >
                          <polygon points={HEX_POINTS} className="fill-none stroke-deco stroke-2" />
                        </svg>
                        <Hex
                          width={22}
                          height={24}
                          shape="fill-accent stroke-accent stroke-2"
                          className="absolute inset-0"
                          style={{ animation: "cfaPop 550ms 750ms cubic-bezier(.3,1.4,.5,1) both" }}
                        />
                      </span>
                    ) : (
                      <Hex key={k} width={22} height={24} shape={pipShape(to > k)} />
                    ),
                  )}
                </span>
                <strong className="text-[20px]">{SCORE_WORDS[to]}</strong>
              </span>
            </div>
          ))}
        </div>
      )}

      <div role="list" aria-label="Your scores" className="flex flex-col border-t border-border">
        {result.scores.map((score, i) => (
          <div
            key={i}
            role="listitem"
            className="flex flex-wrap items-center gap-x-4 border-b border-border py-2.5"
            style={{ animation: `cfaRise 420ms cubic-bezier(.2,.7,.2,1) ${150 + i * 100}ms both` }}
          >
            <button
              type="button"
              aria-expanded={open[i]}
              onClick={() => setOpen((o) => o.map((v, j) => (j === i ? !v : v)))}
              className="flex min-h-11 flex-[1_1_140px] cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 text-left font-[inherit] text-[19px] leading-[1.3] font-bold text-fg"
            >
              {SKILLS[i].name}
              <span
                aria-hidden="true"
                className="grid size-[22px] flex-none place-items-center rounded-full border-[1.5px] border-muted text-[13px] leading-none text-muted"
              >
                ?
              </span>
            </button>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="flex gap-1">
                <Hex width={22} height={24} shape={pipShape(score >= 1)} />
                <Hex width={22} height={24} shape={pipShape(score >= 2)} />
              </span>
              <span className="min-w-[7.2em] text-[19px] font-bold">{SCORE_WORDS[score as Score]}</span>
            </div>
            {open[i] && <p className="mt-0 mb-1.5 basis-full text-[17px] leading-[1.5] text-muted">{SKILLS[i].meaning}</p>}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="display m-0 text-[20px] leading-[1.3] font-bold">
          {fix.kind === "stretch" ? "Want a challenge?" : "One thing to try"}
        </h4>
        {fix.kind === "quote" && (
          <div className="flex flex-col gap-3 rounded-[14px] border-[1.5px] border-border px-5 py-[18px]">
            <div className="flex flex-col items-start gap-1.5">
              <span className="kicker tracking-[.03em]">From your prompt</span>
              <mark className="rounded-lg bg-tint px-2.5 py-1 font-mono text-[18px] leading-[1.5] text-fg">
                “{quoteFromPrompt(prompt, fix.quote)}”
              </mark>
            </div>
            <p className="m-0">
              <strong>Why:</strong> {fix.why}
            </p>
            <p className="m-0">
              <strong>Try:</strong> {fix.try}
            </p>
          </div>
        )}
        {fix.kind === "missing" && (
          <div className="flex flex-col gap-3 rounded-[14px] border-[1.5px] border-border px-5 py-[18px]">
            <span className="kicker tracking-[.03em]">Something to add:</span>
            <div className="flex items-start gap-2.5 rounded-[10px] border-2 border-dashed border-deco px-3.5 py-2.5">
              <span aria-hidden="true" className="text-[22px] leading-[1.3] font-bold text-accent">
                +
              </span>
              <span>{fix.add}</span>
            </div>
            <p className="m-0">
              <strong>Why:</strong> {fix.why}
            </p>
          </div>
        )}
        {fix.kind === "stretch" && (
          <div className="flex items-start gap-3 rounded-[14px] bg-tint px-5 py-[18px]">
            <Hex width={20} height={22} shape="fill-none stroke-accent stroke-[2.5]" className="mt-1 flex-none" />
            <p className="m-0">{fix.text}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div>
            <h4 className="display m-0 text-[20px] leading-[1.3] font-bold">{result.rewriteLabel}</h4>
            <p className="t-meta mt-0.5 mb-0 text-muted">New parts are underlined.</p>
          </div>
          <button type="button" onClick={copy} className="btn btn-small min-w-24 text-[17px]">
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <span aria-live="polite" className="sr-only">
          {copied ? "Copied to clipboard" : ""}
        </span>
        <div className="rounded-xl border-[1.5px] border-border bg-surface2 px-[18px] py-4 font-mono text-[17px] leading-[1.7] [overflow-wrap:anywhere] whitespace-pre-wrap">
          {result.rewrite.map((part, index) =>
            part.added ? (
              <mark
                key={index}
                className="rounded-[3px] bg-tint px-0.5 py-px text-fg underline decoration-accent decoration-2 underline-offset-4"
              >
                {part.text}
              </mark>
            ) : (
              <span key={index}>{part.text}</span>
            ),
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 border-t border-border pt-5">
        <button type="button" onClick={onTryAgain} className="btn btn-primary">
          Try again
        </button>
        <span className="t-meta text-muted">Your prompt stays in the box above, ready to edit.</span>
      </div>
    </article>
  );
}

function pipShape(on: boolean) {
  return on ? "fill-accent stroke-accent stroke-2" : "fill-none stroke-pip stroke-2";
}

/** The learner's own words, with their capitals, when the quote is in their prompt. */
function quoteFromPrompt(prompt: string, quote: string) {
  const at = prompt.toLowerCase().indexOf(quote.toLowerCase());
  return at === -1 ? quote : prompt.slice(at, at + quote.length);
}
