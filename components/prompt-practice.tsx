"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import type { PracticeSubmission } from "@/lib/practice";

type Result =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "received"; status: number; body: unknown }
  | { kind: "failed"; message: string };

type Props = {
  taskId: string;
  /** Optional task instructions, written between the opening and closing tags. */
  children?: ReactNode;
};

export function PromptPractice({ taskId, children }: Props) {
  const id = useId();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<Result>({ kind: "idle" });
  const sending = result.kind === "sending";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult({ kind: "sending" });

    const submission: PracticeSubmission = { taskId, prompt };
    let response: Response;
    try {
      response = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
    } catch {
      setResult({ kind: "failed", message: "Couldn't reach the server. Check your connection and submit again." });
      return;
    }

    try {
      setResult({ kind: "received", status: response.status, body: await response.json() });
    } catch {
      setResult({
        kind: "failed",
        message: `The server answered with something that isn't JSON (status ${response.status}).`,
      });
    }
  }

  return (
    <section
      aria-labelledby={`${id}-label`}
      data-task-id={taskId}
      className="rounded-xl border-2 border-rule p-5 text-lg leading-relaxed sm:p-6"
    >
      <p id={`${id}-label`} className="display text-xl">
        Try it
      </p>

      <div className="mt-2 [&>*+*]:mt-3">
        {children ?? (
          <p className="text-muted">
            Task <code>{taskId}</code>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-5">
        <label htmlFor={`${id}-prompt`} className="block font-bold">
          Your prompt
        </label>
        <textarea
          id={`${id}-prompt`}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={5}
          required
          className="mt-2 block w-full resize-y rounded-lg border-2 border-rule bg-paper px-4 py-3 text-lg leading-relaxed text-ink placeholder:text-muted focus-visible:border-emphasis focus-visible:outline-none"
        />
        <button
          type="submit"
          disabled={sending || prompt.trim() === ""}
          className="mt-4 rounded-full bg-accent px-6 py-2.5 font-bold text-on-accent transition-shadow hover:shadow-[inset_0_-3px_0_rgb(0_0_0/0.18)] disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted disabled:shadow-none"
        >
          {sending ? "Submitting…" : "Submit prompt"}
        </button>
      </form>

      <div aria-live="polite">
        {result.kind === "received" && (
          // Raw JSON for now. Swap this for a real feedback view once grading exists.
          <pre className="mt-5 rounded-lg bg-surface p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
            {JSON.stringify(result.body, null, 2)}
          </pre>
        )}
        {result.kind === "failed" && (
          <p role="alert" className="mt-5 font-bold">
            {result.message}
          </p>
        )}
      </div>
    </section>
  );
}
