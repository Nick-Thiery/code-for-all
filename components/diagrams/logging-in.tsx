"use client";

import type { ReactNode } from "react";
import { Diagram, FlowArrow, diagramCard, diagramLabel } from "@/components/diagram";

// Lesson 8.4, "How logging in works" (design: "8.4 · How logging in works").
// Sign up, log in and log out as three cards: the new row in the user table,
// the token the browser is handed, and the token thrown away. Side by side on
// desktop; stacked, with the arrows pointing down, below that.
//
// A client component because diagramCard and diagramLabel come from the
// "use client" module components/diagram.tsx: a server component would get
// client references there, not the class strings.

const ALT =
  "Three steps joined by arrows: sign up, log in, log out. " +
  "Sign up: you type your email, james@example.com, and a password, shown as dots. " +
  "An arrow points down to the user table, which gets a new row holding james@… and k9#Fq2x…: " +
  "your email and a scrambled version of your password. " +
  "Log in: a tick says your email and password match, and your browser is handed a token, " +
  'a sticker that says "this is James" and expires on its own. ' +
  "Your browser shows the token on every request, so you don't retype your password. " +
  'Log out: the "this is James" token is crossed out, next to a bin. ' +
  "The token is thrown away, and the site stops recognising you.";

export function LoginDiagram() {
  return (
    <Diagram alt={ALT} caption="All three are requests to another computer. Logging in is just an API call.">
      <div className="flex flex-col gap-2 desktop:flex-row">
        <Step title="Sign up" note="A new row: your email and a scrambled password.">
          {/* Capped so the form doesn't stretch across a stacked card. */}
          <div className="flex w-full max-w-[300px] flex-col gap-2.5 self-center">
            <div className="flex flex-col gap-1.5">
              <Field>
                <span className="[overflow-wrap:anywhere]">james@example.com</span>
              </Field>
              <Field>
                <span className="tracking-[.2em]">••••••••</span>
              </Field>
            </div>
            <svg
              width="18"
              height="22"
              viewBox="0 0 18 22"
              aria-hidden="true"
              className="flex-none self-center fill-none stroke-accent stroke-[2.5]"
            >
              <path d="M9 2v16M3 12l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="overflow-hidden rounded-lg border border-accent">
              <div className={`${diagramLabel} bg-accent px-2.5 py-1 text-on-accent`}>User table</div>
              <div className="grid grid-cols-2 gap-2 px-2.5 py-1.5 font-mono text-[13px] leading-[1.4]">
                <span>james@…</span>
                <span>k9#Fq2x…</span>
              </div>
            </div>
          </div>
        </Step>

        <DownThenRight />

        <Step
          title="Log in"
          note="Your browser shows the token on every request, so you don't retype your password."
        >
          <p className="m-0 flex items-center gap-2 text-[15px] leading-[1.3] font-bold text-accent">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="flex-none">
              <circle cx="12" cy="12" r="11" className="fill-accent" />
              <path
                d="M7 12.5l3.2 3.2L17 9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fill-none stroke-on-accent stroke-[2.6]"
              />
            </svg>
            Email and password match
          </p>
          <div className="mt-1.5 flex w-full max-w-[190px] -rotate-4 flex-col items-center gap-1 self-center rounded-2xl bg-deco px-2 py-3.5 text-center text-on-deco shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_18%,transparent)] dark:shadow-none">
            <span className={diagramLabel}>Token</span>
            <span className="font-display text-[18px] leading-[1.2] font-extrabold">“this is James”</span>
            <span className="text-[13px] leading-[1.3]">expires on its own</span>
          </div>
        </Step>

        <DownThenRight />

        <Step title="Log out" note="The token is thrown away. The site stops recognising you.">
          <div className="mt-1.5 flex w-full max-w-[190px] flex-col items-center gap-1 self-center rounded-2xl border-2 border-dashed border-pip px-2 py-3.5 text-center text-muted">
            <span className={diagramLabel}>Token</span>
            <span className="font-display text-[18px] leading-[1.2] font-extrabold line-through">
              “this is James”
            </span>
          </div>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="flex-none self-center fill-none stroke-muted stroke-[1.8]"
          >
            <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Step>
      </div>
    </Diagram>
  );
}

function Step({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <div className={`${diagramCard} flex min-w-0 flex-1 flex-col gap-2.5 p-4`}>
      <span className="font-display text-[21px] leading-[1.2] font-extrabold">{title}</span>
      {children}
      <span className="mt-auto pt-1 text-[15px] leading-[1.4] text-muted">{note}</span>
    </div>
  );
}

/** One line of the sign-up form. */
function Field({ children }: { children: ReactNode }) {
  return (
    <span className="flex min-h-[30px] items-center rounded-lg border border-border px-2.5 py-1 text-[14px] leading-[1.3] text-muted">
      {children}
    </span>
  );
}

/** FlowArrow points right from tablet up; these cards only sit side by side from desktop. */
function DownThenRight() {
  return (
    <div className="flex justify-center tablet:max-desktop:rotate-90">
      <FlowArrow />
    </div>
  );
}
