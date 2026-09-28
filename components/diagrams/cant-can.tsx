"use client";

import { Diagram } from "@/components/diagram";
import { Icon, Label, Line, Window } from "@/components/diagrams/parts";

// Lesson 8.1: a page that can't fetch live data or remember users, next to
// one that can. The temperature and the name match the module's examples
// (the Open-Meteo request in 8.3, "this is James" in 8.4).

const ALT =
  "Two browser windows side by side. Left, your site now: it says Hi, stranger, with a crossed-out line 'Who are you? I forgot', and a weather box reading 'Weather: ??' with a crossed-out line 'I only know my own files'. " +
  "Right, with APIs and authentication: it says Hi, James, with a tick and the line 'I remember you', and a weather box reading Singapore: 31.2°C with a tick and the line 'live, from a weather service'.";

export function CantCanDiagram() {
  return (
    <Diagram alt={ALT} caption="Left: your site today. Right: the same site after this module, with live data and a memory for who's there.">
      <div className="grid gap-3 tablet:grid-cols-2">
        <Window title="Your site now">
          <div className="flex flex-col gap-3 p-3.5">
            <span className="font-display text-[20px] leading-[1.2] font-extrabold text-fg">Hi, stranger.</span>
            <Row bad>Who are you? I forgot.</Row>
            <Box label="Weather" value="??" />
            <Row bad>I only know my own files.</Row>
            <Line w="80%" />
            <Line w="60%" />
          </div>
        </Window>
        <Window title="With APIs and authentication">
          <div className="flex flex-col gap-3 p-3.5">
            <span className="font-display text-[20px] leading-[1.2] font-extrabold text-fg">Hi, James.</span>
            <Row>I remember you.</Row>
            <Box label="Singapore" value="31.2°C" live />
            <Row>Live, from a weather service.</Row>
            <Line w="80%" />
            <Line w="60%" />
          </div>
        </Window>
      </div>
    </Diagram>
  );
}

function Row({ bad = false, children }: { bad?: boolean; children: string }) {
  return (
    <span className="flex items-center gap-2 text-[14px] leading-[1.4]">
      <Icon name={bad ? "cross" : "check"} size={18} className={bad ? "stroke-muted" : "stroke-accent"} />
      <span className={bad ? "text-muted line-through" : "text-fg"}>{children}</span>
    </span>
  );
}

function Box({ label, value, live = false }: { label: string; value: string; live?: boolean }) {
  return (
    <span className={`flex items-center justify-between rounded-xl px-3 py-2 ${live ? "bg-tint" : "bg-surface2"}`}>
      <Label className={live ? "text-accent" : "text-muted"}>{label}</Label>
      <span className={`font-display text-[22px] leading-none font-extrabold ${live ? "text-accent" : "text-muted"}`}>{value}</span>
    </span>
  );
}
