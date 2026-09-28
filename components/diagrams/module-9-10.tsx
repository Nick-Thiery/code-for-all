"use client";

// The Module 9 and 10 diagrams, drawn with the shared pieces in parts.tsx.
// Every word is HTML, so they reflow on phones; no text is under 13px.

import { Diagram } from "@/components/diagram";
import { Card, Chip, Flow, Icon, Label, Note, NumberHex, type IconName } from "@/components/diagrams/parts";

/* ---- 9.1: DNS, the phonebook of the internet ---- */

const DNS_ALT =
  "Three steps joined by arrows. 1, You type a name: example.com. 2, DNS looks it up, drawn as a phonebook with the entry example.com next to a string of numbers, the IP address. " +
  "3, Your browser goes to that number and the site's computer answers with the page.";

export function DnsDiagram() {
  return (
    <Diagram alt={DNS_ALT} caption="You type a name. DNS looks up the number. Your browser goes to the number.">
      <Flow>
        <Card n={1} title="You type a name" className="tablet:flex-1">
          <span className="self-start rounded-lg bg-surface2 px-2.5 py-1 font-mono text-[14px] text-fg">example.com</span>
          <Note className="text-muted">Names are for people.</Note>
        </Card>
        <Card n={2} title="DNS looks it up" tone="tint" className="tablet:flex-1">
          <div className="flex flex-col gap-1 rounded-lg bg-surface p-2 ring-1 ring-border" aria-hidden="true">
            <span className="flex items-center justify-between gap-2 font-mono text-[13px]">
              <span className="text-fg">example.com</span>
              <span className="text-accent">93.184.215.14</span>
            </span>
            <span className="h-1.5 w-3/4 rounded-full bg-track" />
            <span className="h-1.5 w-2/3 rounded-full bg-track" />
          </div>
          <Note className="text-muted">The phonebook: name to number.</Note>
        </Card>
        <Card n={3} title="Your browser goes there" className="tablet:flex-1">
          <div className="flex items-center gap-2">
            <Icon name="globe" />
            <Note className="text-muted">The computer at that number sends back the page.</Note>
          </div>
        </Card>
      </Flow>
    </Diagram>
  );
}

/* ---- 9.3: the four parts of SEO ---- */

const SEO: { icon: IconName; name: string; what: string }[] = [
  { icon: "page", name: "On-page", what: "Keywords in titles, meta descriptions, headings and content." },
  { icon: "globe", name: "Off-page", what: "Authority and backlinks: other sites linking to yours." },
  { icon: "steps", name: "Technical", what: "Crawlability, speed and mobile-friendliness." },
  { icon: "book", name: "Content quality", what: "Genuinely useful content. This one matters most." },
];

export function SeoDiagram() {
  return (
    <Diagram
      alt={"The four key components of SEO. " + SEO.map((s, i) => `${i + 1}, ${s.name}: ${s.what}`).join(" ")}
      caption="The four parts of SEO. Three you can tune; the fourth, being useful, is the one that counts most."
    >
      <div className="grid gap-2.5 tablet:grid-cols-2">
        {SEO.map((part, index) => (
          <Card key={part.name} n={index + 1} title={part.name} tone={index === 3 ? "tint" : "surface"}>
            <div className="flex items-start gap-2.5">
              <Icon name={part.icon} />
              <Note className="text-muted">{part.what}</Note>
            </div>
          </Card>
        ))}
      </div>
    </Diagram>
  );
}

/* ---- 9.4: the channels for getting users ---- */

const CHANNELS: { icon: IconName; name: string; what: string; free: boolean }[] = [
  { icon: "eye", name: "Search (SEO)", what: "People find you when they search.", free: true },
  { icon: "chat", name: "Social media", what: "Your own posts, where people already are.", free: true },
  { icon: "person", name: "Word of mouth", what: "People tell people.", free: true },
  { icon: "tag", name: "Google Ads", what: "Paid adverts at the top of search results.", free: false },
  { icon: "refresh", name: "Email automation", what: "Emails that send themselves.", free: false },
  { icon: "branch", name: "Affiliate marketing", what: "Others promote you for a share.", free: false },
  { icon: "puzzle", name: "SMMA", what: "An agency runs your social media.", free: false },
];

export function GettingUsersDiagram() {
  return (
    <Diagram
      alt={
        "Ways to get users, split into free and paid. Free: " +
        CHANNELS.filter((c) => c.free).map((c) => `${c.name} (${c.what})`).join("; ") +
        ". Costs money: " +
        CHANNELS.filter((c) => !c.free).map((c) => `${c.name} (${c.what})`).join("; ") +
        ". Start with the free ones."
      }
      caption="Ways to get users. Start with the free ones on the left."
    >
      <div className="grid gap-3 tablet:grid-cols-2">
        {[true, false].map((free) => (
          <div key={String(free)} className="flex flex-col gap-2 rounded-2xl bg-surface/60 p-3 dark:bg-surface2/60">
            <Label className={free ? "text-accent" : "text-muted"}>{free ? "Free: start here" : "Costs money"}</Label>
            {CHANNELS.filter((c) => c.free === free).map((channel) => (
              <div key={channel.name} className="flex items-center gap-3 rounded-xl bg-surface p-2.5 ring-1 ring-border">
                <span className={`grid size-10 flex-none place-items-center rounded-full ${free ? "bg-tint" : "bg-surface2"}`}>
                  <Icon name={channel.icon} className={free ? "stroke-accent" : "stroke-muted"} />
                </span>
                <span className="flex flex-col">
                  <span className="text-[15px] leading-[1.3] font-bold text-fg">{channel.name}</span>
                  <span className="text-[14px] leading-[1.4] text-muted">{channel.what}</span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Diagram>
  );
}

/* ---- 9.5: two kinds of project ---- */

export function ProjectPathsDiagram() {
  const paths = [
    { name: "Business-forward", items: ["a Chrome extension", "an automation", "a SaaS", "a service"], icon: "hammer" as IconName },
    { name: "Social impact", items: ["help businesses", "raise awareness"], icon: "person" as IconName },
  ];
  return (
    <Diagram
      alt={
        "Two kinds of project side by side. Business-forward: a Chrome extension, an automation, a SaaS, a service. Social impact: help businesses, raise awareness. " +
        "Under both: challenge yourself, don't pick low hanging fruit."
      }
      caption="Two kinds of project. Both count. Either way, challenge yourself."
    >
      <div className="flex flex-col gap-3">
        <div className="grid gap-2.5 tablet:grid-cols-2">
          {paths.map((path) => (
            <Card key={path.name} icon={<Icon name={path.icon} />} title={path.name}>
              <div className="flex flex-wrap gap-1.5">
                {path.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <span className="self-center rounded-full bg-accent px-4 py-1.5 text-[14px] font-bold text-on-accent">
          Challenge yourself. Don&apos;t pick low hanging fruit.
        </span>
      </div>
    </Diagram>
  );
}

/* ---- 9.6: the six requirements ---- */

const REQUIREMENTS = [
  "A clear goal and deliverables",
  "Legal and reasonable",
  "Needs fewer than 15 employees",
  "Real data behind any claims",
  "Something you're interested in",
  "Real value, not just information",
];

export function RequirementsDiagram() {
  return (
    <Diagram
      alt={"The six requirements as a tick list: " + REQUIREMENTS.join("; ") + "."}
      caption="Six ticks. An idea that gets all six is ready to build."
    >
      <ol className="m-0 grid list-none gap-2 p-0 tablet:grid-cols-2">
        {REQUIREMENTS.map((item, index) => (
          <li key={item} className="flex items-center gap-2.5 rounded-xl bg-surface p-2.5 ring-1 ring-border">
            <NumberHex n={index + 1} size={26} />
            <span className="text-[15px] leading-[1.35] text-fg">{item}</span>
            <Icon name="check" size={18} className="ml-auto stroke-accent" />
          </li>
        ))}
      </ol>
    </Diagram>
  );
}

/* ---- 9.7: from ideas to the risky part ---- */

export function PlanBoardDiagram() {
  return (
    <Diagram
      alt={
        "Four steps joined by arrows. 1, Board: ideas on sticky notes, grouped. 2, Master doc: what it is, who it's for, what done looks like. " +
        "3, Task sheets: what needs doing and whether it's finished. 4, Build the risky part first: the hardest feature, with no styling yet."
      }
      caption="Board, master doc, task sheets, then the risky part first. Styling comes last."
    >
      <Flow>
        <Card n={1} title="Board" className="tablet:flex-1">
          <div className="flex flex-wrap gap-1.5" aria-hidden="true">
            {["bg-(--part-audience)", "bg-(--part-goal)", "bg-(--part-pages)", "bg-(--part-style)"].map((bg, i) => (
              <span key={i} className={`h-7 w-9 rounded ${bg}`} />
            ))}
          </div>
          <Note className="text-muted">Every idea out, then grouped.</Note>
        </Card>
        <Card n={2} title="Master doc" className="tablet:flex-1">
          <Note className="text-muted">What it is, who it&apos;s for, what &ldquo;done&rdquo; looks like.</Note>
        </Card>
        <Card n={3} title="Task sheets" className="tablet:flex-1">
          <Note className="text-muted">What needs doing, and what&apos;s finished.</Note>
        </Card>
        <Card n={4} title="Risky part first" tone="tint" className="tablet:flex-1">
          <div className="flex items-start gap-2">
            <Icon name="hammer" />
            <Note className="text-muted">Prove the hardest feature works. No styling yet.</Note>
          </div>
        </Card>
      </Flow>
    </Diagram>
  );
}

/* ---- 10.2: what a finished project looks like ---- */

const RUBRIC: { icon: IconName; name: string; ask: string }[] = [
  { icon: "globe", name: "It ships", ask: "Live at a URL anyone can open, on a phone and a laptop, nothing broken." },
  { icon: "person", name: "It solves something real", ask: "For someone you can name, in a way you can explain." },
  { icon: "check", name: "It works end to end", ask: "Start to finish without breaking." },
  { icon: "sparkle", name: "AI-assisted workflow", ask: "You can show a prompt that failed and how you fixed it." },
  { icon: "branch", name: "Craft and version control", ask: "Care over the details, and a repo with a history." },
];

export function RubricDiagram() {
  return (
    <Diagram
      alt={"The five things a finished project has. " + RUBRIC.map((r, i) => `${i + 1}, ${r.name}: ${r.ask}`).join(" ")}
      caption="Five questions to ask about your project. No points, no score."
    >
      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {RUBRIC.map((row, index) => (
          <li key={row.name} className="flex items-center gap-3 rounded-2xl bg-surface p-3 ring-1 ring-border">
            <NumberHex n={index + 1} />
            <span className="grid size-9 flex-none place-items-center rounded-full bg-tint">
              <Icon name={row.icon} size={20} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[15px] leading-[1.3] font-bold text-fg">{row.name}</span>
              <span className="text-[14px] leading-[1.4] text-muted">{row.ask}</span>
            </span>
          </li>
        ))}
      </ol>
    </Diagram>
  );
}

/* ---- 10.3: the five-minute demo ---- */

const DEMO = [
  { name: "The problem", minutes: 1 },
  { name: "Show it working", minutes: 2 },
  { name: "What was hard", minutes: 1 },
  { name: "What's next", minutes: 1 },
];

export function DemoPlanDiagram() {
  return (
    <Diagram
      alt={
        "A five-minute demo as a bar split into four parts: " +
        DEMO.map((d) => `${d.name}, about ${d.minutes} minute${d.minutes > 1 ? "s" : ""}`).join("; ") +
        "."
      }
      caption="Five minutes, four parts. Show it working gets the most time."
    >
      <div className="flex flex-col gap-3">
        <div className="flex h-9 overflow-hidden rounded-full ring-1 ring-border" aria-hidden="true">
          {DEMO.map((part, index) => (
            <span
              key={part.name}
              className={`flex items-center justify-center text-[13px] font-bold ${index % 2 === 0 ? "bg-tint text-accent" : "bg-accent text-on-accent"}`}
              style={{ flex: part.minutes }}
            >
              {part.minutes} min
            </span>
          ))}
        </div>
        <ol className="m-0 grid list-none gap-2 p-0 tablet:grid-cols-4">
          {DEMO.map((part, index) => (
            <li key={part.name} className="flex items-center gap-2">
              <NumberHex n={index + 1} size={26} />
              <span className="flex flex-col">
                <span className="text-[15px] leading-[1.3] font-bold text-fg">{part.name}</span>
                <Label>about {part.minutes} min</Label>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Diagram>
  );
}
