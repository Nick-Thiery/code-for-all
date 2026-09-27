import { Hex } from "@/components/hex";
import { PauseOffscreen } from "@/components/pause-offscreen";
import s from "@/components/hero-gallery.module.css";

// The homepage hero visual (design: "B · What you'll build"): projects from
// the course dealt out like cards, each with its own small loop. It's CSS
// only; motion, sizes and the phone layout are in hero-gallery.module.css.
// With reduced motion on, or when printing, the finished cards are simply
// there. One picture to a screen reader, so it has a label, not its text.
export function HeroGallery() {
  return (
    <PauseOffscreen
      role="img"
      aria-label="Projects you'll build in the course: your own website, a quiz, a live weather card, a word game and a Chrome extension that tidies your tabs."
      className={s.gallery}
    >
      <svg viewBox="0 0 580 600" aria-hidden="true" className={s.backdrop}>
        <polygon points="290,210 429,290 429,450 290,530 151,450 151,290" className={s.bigHex} />
        <polygon points="560,-10 603,15 603,65 560,90 517,65 517,15" className={s.cornerHex} />
        <polygon points="40,560 57.3,570 57.3,590 40,600 22.7,590 22.7,570" className={s.dotHex} />
      </svg>

      <div className={`${s.card} ${s.quiz}`}>
        <Chip module={2} kind="Quiz" />
        <span className={`${s.title} ${s.more}`}>Which hawker dish are you?</span>
        <div className={s.options}>
          {["Chicken rice", "Laksa", "Roti prata"].map((option) => (
            <span key={option} className={s.option}>
              {option}
            </span>
          ))}
        </div>
      </div>

      <div className={`${s.card} ${s.weather}`}>
        <div className={s.weatherTop}>
          <Chip module={8} kind="Live data" />
          <span className={s.live}>
            <span className={s.liveDot} />
            LIVE
          </span>
        </div>
        <div className={s.reading}>
          <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={s.weatherIcon}>
            <g className={s.sun}>
              <circle cx="18" cy="18" r="8" />
              <path d="M18 4v4M18 28v4M4 18h4M28 18h4M8 8l2.8 2.8M25.2 25.2L28 28M8 28l2.8-2.8M25.2 10.8L28 8" />
            </g>
            <path d="M14 38h20a8 8 0 0 0 0-16 11 11 0 0 0-20 3 6.5 6.5 0 0 0 0 13z" className={s.cloud} />
          </svg>
          <span className={s.temp}>31°C</span>
        </div>
        <span className={s.place}>Singapore, right now</span>
        <span className={s.source}>From a free weather API</span>
      </div>

      <div className={`${s.card} ${s.words}`}>
        <Chip module={7} kind="Team build" />
        <span className={`${s.title} ${s.more}`}>Word game</span>
        <div className={s.board}>
          {GUESSES.map((guess, row) =>
            [...guess].map((letter, i) => (
              <span
                key={`${row}-${i}`}
                className={`${s.tile} ${ANSWER[i] === letter ? s.hit : s.miss}`}
                style={{ animationDelay: `${(1.4 + row * 1.2 + i * 0.15).toFixed(2)}s` }}
              >
                {letter}
              </span>
            )),
          )}
        </div>
      </div>

      <div className={`${s.card} ${s.tabs}`}>
        <Chip module={3} kind="Extension" />
        <div className={`${s.toolbar} ${s.more}`}>
          <span className={s.address} />
          <span className={s.extIcon}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="4" width="7" height="7" rx="1.5" />
              <rect x="14" y="4" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
        </div>
        <div className={s.popup}>
          <span className={s.popupTitle}>Tab Tidy</span>
          <span className={s.note}>12 tabs sorted into 3 groups</span>
          <span className={s.bars}>
            <span />
            <span />
            <span />
          </span>
          <span className={s.tidy}>Tidy again</span>
        </div>
      </div>

      <div className={`${s.card} ${s.site}`}>
        <span className={`${s.chip} ${s.chipMain}`}>
          <Hex width={10} height={11} shape="fill-deco dark:fill-on-accent" className={s.chipHex} />
          Module 1 · Your website
        </span>
        <div className={s.page}>
          <div className={s.masthead}>
            <span className={s.name}>
              Hi, I&apos;m Aisyah
              <span className={s.cursor} />
            </span>
            <span className={s.bio}>Cats, badminton and drawing.</span>
          </div>
          <div className={s.sections}>
            <span className={`${s.section} ${s.mochi}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 20c0-5 3-8 7-8s7 3 7 8M6 9l1-5 3 3h4l3-3 1 5" />
                <circle cx="12" cy="11" r="4" />
              </svg>
              Meet Mochi
            </span>
            <span className={`${s.section} ${s.badminton}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 19l7-7M14 4l6 6-5 5-6-6z" />
                <circle cx="6" cy="6" r="2" />
              </svg>
              Badminton
            </span>
          </div>
        </div>
      </div>

      <span className={s.caption}>Real projects from the course</span>
    </PauseOffscreen>
  );
}

// The word game: three guesses at FLAME. A letter in the right place is a hit.
const ANSWER = "FLAME";
const GUESSES = ["STARE", "PLANE", ANSWER];

/** "Module 2 · Quiz". On phones only "Module 2" fits. */
function Chip({ module, kind }: { module: number; kind: string }) {
  return (
    <span className={s.chip}>
      <Hex width={10} height={11} shape="fill-accent" className={s.chipHex} />
      Module {module}
      <span className={s.more}>· {kind}</span>
    </span>
  );
}
