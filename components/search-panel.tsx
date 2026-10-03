"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { type Range, type SearchIndex, markPieces, prepareIndex, search } from "@/lib/search";

// The inside of the search dialog (components/site-search.tsx), downloaded
// the first time search opens. The box is a combobox over one listbox of
// results grouped Lessons, Quizzes, Glossary, Help and Pages. Focus stays in the
// box: the arrow keys move the highlighted result (aria-activedescendant)
// and Enter opens it. Every result is a real link.

/** Shown before anything is typed. Only the ones that find something appear. */
const SUGGESTIONS = ["Prompt", "Wordle", "GitHub", "API", "Laptop"];

export type SearchPanelProps = {
  index: SearchIndex;
  /** A result is being opened: close without moving focus back. */
  onNavigate: () => void;
};

export function SearchPanel({ index, onNavigate }: SearchPanelProps) {
  const id = useId();
  const listboxId = `${id}-results`;
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<number | null>(null);

  const prepared = useMemo(() => prepareIndex(index), [index]);
  const groups = useMemo(() => search(prepared, query), [prepared, query]);
  const suggestions = useMemo(() => SUGGESTIONS.filter((word) => search(prepared, word).length > 0), [prepared]);
  const hits = groups.flatMap((group) => group.hits);
  const total = groups.reduce((sum, group) => sum + group.total, 0);
  const typed = query.trim() !== "" && /[\p{L}\p{N}]/u.test(query);
  const optionId = (n: number) => `${id}-option-${n}`;
  const activeId = active !== null && active < hits.length ? optionId(active) : undefined;

  useEffect(() => input.current?.focus(), []);
  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (hits.length === 0) return;
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((current) =>
        current === null ? (step === 1 ? 0 : hits.length - 1) : (current + step + hits.length) % hits.length,
      );
    } else if (event.key === "Enter" && activeId) {
      event.preventDefault();
      document.getElementById(activeId)?.click();
    }
  };

  const pick = (word: string) => {
    setQuery(word);
    setActive(null);
    input.current?.focus();
  };

  let n = 0;
  return (
    // One scrolling area, the box pinned at its top, so the results can be
    // scrolled from the keyboard too.
    <div className="min-h-0 flex-1 scroll-pt-[88px] overflow-y-auto overscroll-contain bg-paper2">
      <div className="sticky top-0 z-10 border-b-2 border-line bg-paper px-(--gut) pt-1 pb-4">
        <div className="flex items-center gap-3 rounded border-2 border-line bg-surface pl-3 focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-focus">
          <Icon name="search" size={22} stroke={2.4} className="text-muted" />
          <input
            ref={input}
            type="search"
            role="combobox"
            aria-label="Search the course"
            aria-expanded={hits.length > 0}
            aria-controls={hits.length > 0 ? listboxId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="go"
            placeholder="Lessons, quizzes, words…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(null);
            }}
            onKeyDown={onKeyDown}
            className="h-13 min-w-0 flex-1 border-0 bg-transparent pr-3 font-serif text-[21px] text-fg outline-none [&::-webkit-search-cancel-button]:appearance-none"
          />
        </div>
      </div>

      <div>
        <p role="status" className="sr-only">
          {typed ? (total === 0 ? "No results" : `${total} ${total === 1 ? "result" : "results"}`) : ""}
        </p>

        {!typed ? (
          <div className="flex flex-col gap-4 px-(--gut) py-5">
            <p className="m-0 font-serif text-[20px] leading-[1.35]">Find a lesson, a quiz, a key term, a help answer or a page.</p>
            {suggestions.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="kicker mr-1">Try</span>
                {suggestions.map((word) => (
                  <button key={word} type="button" onClick={() => pick(word)} className="btn btn-small">
                    {word}
                  </button>
                ))}
              </div>
            )}
            <p className="t-meta m-0 text-muted max-tablet:hidden">
              <Key>↑</Key> <Key>↓</Key> to move, <Key>Enter</Key> to open, <Key>Esc</Key> to close. Press <Key>/</Key> on
              any page to search.
            </p>
          </div>
        ) : hits.length === 0 ? (
          <div className="flex flex-col gap-2 px-(--gut) py-5">
            <p className="m-0 font-serif text-[22px] leading-[1.25] font-semibold">No results for “{query.trim()}”</p>
            <p className="t-meta m-0">
              Check the spelling or try fewer words. Still stuck?{" "}
              <Link href="/help" prefetch={false} onClick={onNavigate}>
                See Help
              </Link>
            </p>
          </div>
        ) : (
          <div role="listbox" id={listboxId} aria-label="Search results" className="pb-2">
            {groups.map((group) => (
              <ul key={group.key} role="group" aria-labelledby={`${id}-${group.key}`} className="m-0 list-none p-0">
                <li
                  role="presentation"
                  id={`${id}-${group.key}`}
                  className="kicker flex flex-wrap items-baseline justify-between gap-x-3 border-t-2 border-line px-(--gut) pt-4 pb-2 first:border-t-0"
                >
                  {group.label}
                  {group.total > group.hits.length && (
                    <span className="font-sans text-[14px] font-normal tracking-normal text-muted normal-case">
                      Showing {group.hits.length} of {group.total}
                    </span>
                  )}
                </li>
                {group.hits.map((hit) => {
                  const index = n++;
                  return (
                    <li key={hit.item.href} role="presentation">
                      <Link
                        id={optionId(index)}
                        role="option"
                        aria-selected={index === active}
                        href={hit.item.href}
                        prefetch={false}
                        tabIndex={-1}
                        onClick={(event) => {
                          if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onNavigate();
                        }}
                        className="flex flex-col gap-1 border-t-2 border-hairline px-(--gut) py-3 text-fg no-underline hover:bg-paper-hover hover:text-fg aria-selected:bg-sky"
                      >
                        {hit.item.meta && (
                          <span className="kicker">
                            <Marked text={hit.item.meta} ranges={hit.marks.meta} />
                          </span>
                        )}
                        <span className="font-serif text-[20px] leading-[1.2] font-semibold desktop:text-[21px]">
                          <Marked text={hit.item.title} ranges={hit.marks.title} />
                        </span>
                        {hit.text && (
                          <span className="t-meta line-clamp-2 text-muted">
                            <Marked text={hit.text} ranges={hit.marks.text} />
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Marked({ text, ranges }: { text: string; ranges: Range[] }) {
  return markPieces(text, ranges).map((piece, i) =>
    piece.marked ? (
      <mark key={i} className="rounded-[2px] bg-marigold text-on-marigold">
        {piece.text}
      </mark>
    ) : (
      piece.text
    ),
  );
}

function Key({ children }: { children: string }) {
  return (
    <kbd className="rounded-[3px] border-2 border-line bg-surface px-1.5 font-display text-[13px] font-extrabold tracking-[.06em] text-fg [font-stretch:85%]">
      {children}
    </kbd>
  );
}
