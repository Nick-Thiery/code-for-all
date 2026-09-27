import { isValidElement, type ReactElement, type ReactNode } from "react";
import { CopyButton } from "@/components/copy-button";
import { PromptBlock } from "@/components/prompt-block";
import { ScrollArea } from "@/components/scroll-area";

type Kind = "tag" | "attr" | "str" | "com" | "plain";
type Token = { text: string; kind: Kind };

const LANGUAGE_NAMES: Record<string, string> = {
  html: "HTML",
  xml: "XML",
  svg: "SVG",
  css: "CSS",
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  json: "JSON",
  py: "Python",
  python: "Python",
  bash: "Terminal",
  sh: "Terminal",
  text: "Text",
  console: "Console",
};

const kindClass: Record<Kind, string> = {
  tag: "text-c-tag",
  attr: "text-c-attr",
  str: "text-c-str",
  com: "text-c-com italic",
  plain: "",
};

/**
 * A code sample with line numbers. In MDX, use a fenced block; add a file
 * name after the language if you like:
 *
 *   ```html title="index.html"
 *   <h1 class="name">Hi, I'm Aisyah</h1>
 *   ```
 *
 * HTML is coloured (tags, attributes, strings, comments). Other languages
 * are shown plain.
 */
export function CodeBlock({ code, language, title }: { code: string; language?: string; title?: string }) {
  const lang = language?.toLowerCase();
  const tokens = lang && ["html", "xml", "svg"].includes(lang) ? tokenizeMarkup(code) : [{ text: code, kind: "plain" as const }];
  const lines = splitLines(tokens);
  const languageName = lang ? (LANGUAGE_NAMES[lang] ?? lang.toUpperCase()) : undefined;

  return (
    <figure className="m-0 overflow-hidden rounded-xl border-[1.5px] border-border bg-surface2 text-fg">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border py-1.5 pr-1.5 pl-4 text-[15px] leading-[1.5] text-muted">
        <span className="font-mono">{title}</span>
        <span className="flex items-center gap-3">
          {languageName && languageName !== title && <span>{languageName}</span>}
          <CopyButton text={code} />
        </span>
      </figcaption>
      <ScrollArea fade="var(--surface2)" className="py-3.5" hintClassName="border-t border-border px-4 py-2 text-muted">
        <pre className="m-0">
          <code className="grid grid-cols-[auto_1fr] gap-x-4 font-mono text-[16px] leading-[1.8]">
            {lines.map((line, index) => (
              <Line key={index} number={index + 1} tokens={line} />
            ))}
          </code>
        </pre>
      </ScrollArea>
    </figure>
  );
}

function Line({ number, tokens }: { number: number; tokens: Token[] }) {
  return (
    <>
      <span aria-hidden="true" className="pl-4 text-right text-c-com select-none">
        {number}
      </span>
      <span className="pr-4 whitespace-pre print:whitespace-pre-wrap print:[overflow-wrap:anywhere]">
        {tokens.map((token, index) =>
          token.kind === "plain" ? (
            token.text
          ) : (
            <span key={index} className={kindClass[token.kind]}>
              {token.text}
            </span>
          ),
        )}
      </span>
    </>
  );
}

/** For MDX: fenced code arrives as <pre><code className="language-x" data-meta="...">. */
export function MdxPre({ children }: { children?: ReactNode }) {
  if (!isValidElement(children)) return <pre>{children}</pre>;
  const props = (children as ReactElement<{ className?: string; children?: ReactNode; "data-meta"?: string }>).props;
  const language = /language-(\S+)/.exec(props.className ?? "")?.[1];
  const title = /title="([^"]*)"/.exec(props["data-meta"] ?? "")?.[1];
  const code = typeof props.children === "string" ? props.children : String(props.children ?? "");
  const text = code.replace(/\n$/, "");
  // ```prompt blocks are prompts to paste into an AI tool, with a Copy button.
  if (language === "prompt") return <PromptBlock text={text} title={title} />;
  return <CodeBlock code={text} language={language} title={title} />;
}

function tokenizeMarkup(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const push = (text: string, kind: Kind) => text && tokens.push({ text, kind });

  while (i < source.length) {
    if (source.startsWith("<!--", i)) {
      const end = source.indexOf("-->", i);
      const stop = end === -1 ? source.length : end + 3;
      push(source.slice(i, stop), "com");
      i = stop;
      continue;
    }
    const open = /^<\/?[A-Za-z][\w:-]*/.exec(source.slice(i));
    if (open) {
      push(open[0], "tag");
      i += open[0].length;
      // Attributes, until the tag closes.
      while (i < source.length) {
        const rest = source.slice(i);
        const close = /^\/?>/.exec(rest);
        if (close) {
          push(close[0], "tag");
          i += close[0].length;
          break;
        }
        const match =
          /^\s+/.exec(rest) ?? /^"[^"]*"|^'[^']*'/.exec(rest) ?? /^[^\s=>"'/]+/.exec(rest) ?? /^[=/]/.exec(rest);
        if (!match) break;
        const text = match[0];
        push(text, /^["']/.test(text) ? "str" : /^[\s=/]/.test(text) ? "plain" : "attr");
        i += text.length;
      }
      continue;
    }
    const next = source.indexOf("<", i + 1);
    const stop = next === -1 ? source.length : next;
    push(source.slice(i, stop), "plain");
    i = stop;
  }
  return tokens;
}

function splitLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const token of tokens) {
    token.text.split("\n").forEach((part, index) => {
      if (index > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ text: part, kind: token.kind });
    });
  }
  return lines;
}
