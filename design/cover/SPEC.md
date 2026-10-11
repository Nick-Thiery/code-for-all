# Cover redesign: build spec

Nick picked **Cover** (Round 3, direction B) for the whole site: a bold magazine look with big condensed type, colour blocks and hard shadows. This folder is the design reference for building it.

## What's here

| File | What it is |
|---|---|
| `CoverHome.dc.html` | Homepage, 1440 wide |
| `CoverHomePhone.dc.html` | Homepage, 390 wide |
| `CoverLesson.dc.html` | Lesson page (lesson 1.6), 1440 wide |
| `CoverLessonPhone.dc.html` | Lesson page, 390 wide |
| `support.js` | Runtime so the mocks open in a browser |

Each mock is one HTML file: the CSS (`@keyframes`, hover and `:has()` rules) is in the `<style>` block inside `<helmet>`, and everything else is inline styles. Read them for exact sizes, colours, spacing and motion. Open one in a browser to see it move. The mocks are fixed-width pictures of two widths; build real responsive pages from them.

## Ground rules

- **Presentation only.** Keep every route, all MDX content, frontmatter, progress saving, quizzes, practice grading, glossary, run-it kit, print styles, privacy behaviour and metadata exactly as they are. Change layout, type, colour, components and motion.
- **Real content wins.** The mocks' copy is sample copy. Where it differs from the site (lesson 1.6's steps, the heads-up text, the Stuck items, homepage wording), keep the site's words.
- **Start from the latest `origin/main`**, on a new branch. The local `site-upgrade` branch is old; leave it alone.
- **CLAUDE.md still applies:** tokens only (never hardcode a colour), dark mode via `[data-theme="dark"]`, British spelling, no dead buttons, print in light colours, no personal data in images, never commit to `main`.
- **Logo:** use the real logo files (`public/cfa-logo-*.png`, via `lib/logo.ts`). The hexagon in the mocks is a stand-in; don't copy it.
- Commit this folder as `design/cover/` and update CLAUDE.md's Design section to point at it (it now points at `design/Code for All Website.dc.html`).

## Tokens

Replace the spec-sheet block at the top of `app/globals.css` with this. The old names that components already use are kept as aliases, so nothing breaks while you move components over.

```css
:root {
  /* Cover palette */
  --paper:#F4EFE6; --paper2:#FFFBF2; --paper-hover:#EAE3D5; --surface:#FFFFFF;
  --ink:#111820; --ink2:#3A424B; --muted:#4E5660;
  --navy:#00487E; --navy-deep:#002E52; --on-navy:#F4EFE6; --on-navy-muted:#A9DBFF; --on-navy-soft:#C4DCF0; --rule-on-navy:#2E6FA6;
  --marigold:#F5B83D; --marigold-deep:#D99A1E; --on-marigold:#111820;
  --sky:#A9DBFF; --tomato:#E4572E; --tomato-tint:#FFC7B4;
  --block-ink:#111820; --on-block-ink:#F4EFE6;   /* heads-up callout, footer */
  --line:#111820;          /* 2px borders and rules */
  --hairline:#D9D1C2;      /* light dividers inside cards */
  --shadow:#111820;        /* hard offset shadows */
  --ruled:#CFE2F2;         /* index-card lines */
  /* Prompt parts (lesson 1.4 ladder, part labels) */
  --part-scope:rgba(245,184,61,.5);  --part-scope-line:#D99A1E;
  --part-spec:rgba(71,179,255,.32);  --part-spec-line:#1D86D8;
  --part-ctx:rgba(228,87,46,.2);     --part-ctx-line:#D2502A;
  /* Aliases for existing components */
  --bg:var(--paper); --surface2:var(--paper2); --text:var(--ink); --border:var(--line);
  --accent:var(--navy); --on-accent:#FFFFFF; --tint:var(--sky); --deco:var(--marigold);
}
[data-theme="dark"] {
  --paper:#10161D; --paper2:#17202A; --paper-hover:#1F2A36; --surface:#1A232D;
  --ink:#F1EBDF; --ink2:#D2CBBE; --muted:#A7B0BA;
  --navy:#0B3A63; --navy-deep:#082C4B; --on-navy:#F1EBDF; --on-navy-muted:#9CCBF0; --on-navy-soft:#C4DCF0; --rule-on-navy:#2A5A85;
  --marigold:#F5B83D; --marigold-deep:#E3A92B; --on-marigold:#111820;
  --sky:#173F5F; --tomato:#F07A55; --tomato-tint:#4A2A22;
  --block-ink:#070B0F; --on-block-ink:#F1EBDF;
  --line:#E9E2D4; --hairline:#2E3945; --shadow:rgba(241,235,223,.22); --ruled:#27384A;
  --accent:#7CC8FF; --on-accent:#10161D;
}
```

Text on marigold always uses `--on-marigold` (it stays dark in both themes), and ink-coloured blocks use `--block-ink` / `--on-block-ink`, so they don't flip to cream in dark mode. Text on sky and navy blocks uses `--ink` and `--on-navy`, which flip correctly.

Register the new tokens in the `@theme` block so they work as Tailwind classes (`bg-paper`, `text-navy`) the same way the current ones do.

Contrast is checked for the main pairs (ink on paper 15.6:1, muted on paper 6.5:1, paper on navy 8.2:1, marigold on navy 5.3:1, ink on marigold 10:1, ink on sky 12:1; dark text on dark paper 15.3:1). The dim "opening soon" numerals (`#6E9CC2` on navy, 3.2:1) are only allowed at 24px and up. Recheck any new pair.

The sizes (`--gut`, `--h1`…) in the old block can stay as they are, or be replaced by the scale below.

## Type

Load with `next/font/google` and expose as CSS variables:

- **Archivo** (variable, `axes: ['wdth']`): display. Always uppercase. `font-stretch` 62–72% for headlines and numerals (weight 800–900), 85% for kickers, labels and buttons (weight 700–800, letter-spacing .08–.14em). If `font-stretch` doesn't take, use `font-variation-settings: 'wdth' 66`.
- **Newsreader** (normal and italic, `axes: ['opsz']`): card titles, questions, lede and dek, captions, pull quotes, and the one italic word in a headline ("real").
- **Atkinson Hyperlegible Next**: body text and UI.
- Keep the current mono for code.

Scale (desktop → phone; use `clamp()` in between):

| Use | Desktop | Phone |
|---|---|---|
| Home hero h1 | 214px, line-height .84 | 100px, 4 lines |
| Section h2 (home) | 128px, lh .86 | 60px |
| Lesson h1 | 64px, lh .95 (see Lesson page) | 40px |
| Lesson h2 | 38px, author's case (see Lesson page) | 28px |
| Card titles (Newsreader) | 36–52px | 26–34px |
| Lede (Newsreader) | 27–29px | 22px |
| Body | 20px / 1.6 | 18px / 1.55 |
| Kicker | 15px | 12–13px |

## Shape and layout

- 2px ink borders, 4–6px radius, hard offset shadows with no blur (`box-shadow: 8px 8px 0 var(--shadow)`; 5–6px on small things, 10px on figures). No gradients, blur shadows or glass.
- Slight rotation for "stuck on" things: cards ±2–9°, the sticker 12°, the prompt card −0.6°.
- 2px ink rules between rows in lists, TOCs and Stuck questions.
- Desktop content width 1200px with 120px side padding at 1440; 12-column grid, 40px gutters. Phone: 20px side padding.
- Pages outside lessons can hang section labels in a rail at ≥1280px (`.with-rail`, `.rail-label`). A lesson is one column (max 720px) at every width: see Lesson page.
- Buttons and toggles are at least 44px high.

## Homepage (top to bottom)

1. **Header:** wordmark left (logo image plus "CODE FOR ALL" in Archivo), nav Course / Run a session / Help in Archivo caps, current page as a marigold chip with 2px border, square theme toggle. 2px ink bottom border. Phone: logo, theme toggle, and a marigold MENU button.
2. **Hero (navy):** issue line with a rule ("Free course · Ages 13 to 16 · Singapore" / lesson count from the outline). Headline "Build *real* things with AI." with "real" in Newsreader italic marigold; each line slides up from a mask. Subtitle, marigold CTA "Start lesson 1" with hard shadow, "See what's inside" link, the "Free · No sign-up · progress saves on this device" note. On the right, three fanned lesson cards (Module 1 lessons 1–3 from the outline, with durations) and a round marigold "Free / No sign-up" sticker. For a learner with progress, the front card becomes "Continue" with their next lesson (same logic as the current Start here card).
3. **Ticker (marigold):** the project names scrolling (`aria-hidden`; it repeats the next section).
4. **What you'll make:** numbered rows (the number is the module number, rolling like an odometer): the About me site (1), Tab Tidy (3), the word game (7), live weather (8), and the hawker quiz (2) if you keep all five. Reuse the current gallery's mini-mocks as the tilted thumbnails.
5. **How it works:** three joined colour blocks (sky, marigold, white) with 170px numerals. Keep the site's current three steps and wording, including the sample-feedback line.
6. **Contents (navy):** the course grid, restyled as a magazine contents page: parts as marigold kickers with a cream top rule, modules as rows with big italic Newsreader numbers, titles and lesson counts; Check your skills rows in marigold italic; Part 3 with an OPENING SOON stamp. **Keep all of CourseGrid's behaviour:** statuses, opening on the learner's current module, a module's lessons shown when picked (aria-pressed / aria-expanded as now), hands-on icons, the quiz link and "Got progress on another device?".
7. **Run it with your group (marigold):** stats (13–16 year olds · 10 sessions, 90 minutes each · 1 laptop per learner), the kit links from `content/facilitator.yml`, black "Get the session kit" button.
8. **Quote** (optional): "I hope you continue to learn more about AI dev and build something meaningful." with no name, labelled "From the last lesson of the course". Module 10 isn't live yet, so check with Nick before shipping it.
9. **Footer (ink):** made-by line, Contact us, three link columns, then "CODE FOR ALL" in Archivo sized to exactly fill the content width.

## Lesson page

The full Cover look is for pages outside lessons. Lessons keep its colours, fonts and overall feel, but they are calm: learners are 13 to 16 and often new to AI, so a lesson must be as clear and structured as possible, and extra UI confuses them. (The lesson mocks in this folder show the earlier, louder lesson design; where they differ, this section wins.)

- **Top bar:** back to Contents, one segment per lesson (done = navy, current = marigold and blinking, then a Quiz chip), "Lesson N of M", Search when there's room, Help, theme toggle. Phone: back, segments and "N/M", Search from 600px, menu. No module name here: the header has it.
- **Header block (sky, full width, content in the 720px column):** the kicker "MODULE N · TITLE" (links to the module), then the lesson number as a modest Archivo numeral ("05", accent colour) beside the title, the same size as the title. The title is Archivo caps, about 40px on a phone and 64px on a laptop, stepping down for long titles so it never passes three lines (`.lesson-title-N`, `lessonTitleSize` in lib/format.ts). Then the summary in Newsreader (19 to 22px), then a plain line: a clock icon with "N minutes", and a "Hands-on task" chip when `requiresAccount`. No "Lesson" label, no odometer, no sticker, no load animations. The lesson's first words show on a phone's first screen.
- **Body:** one column at every width (720px). No rail, no side column, no "Fig. N", and no labels that repeat the block they sit on. Body text is Atkinson Hyperlegible Next at 18px / 1.55 on phones and 20px / 1.6 on laptops. Blocks get 32 to 40px around them; text that a heading introduces sits close under it.
- **Boxes** keep their colours and 2px borders so learners can tell them apart, but sit flat: no hard offset shadows (buttons keep theirs), no tilt. Box titles are Archivo 800 at 19 to 20px in the case they're written (`.t-box`), and icon tiles are small (32 to 36px).
- **Motion:** none that's decorative. Functional feedback stays: Copy, Mark done and its tick, the top-bar segments, the practice card's feedback.

Component by component:

| Existing | Lesson version |
|---|---|
| You'll need box | Marigold box, 2px border, small icon tiles; keep its rows and the device question |
| First paragraph | The same as the rest of the body text |
| `##` headings | Archivo 800, 75% wide, in the author's case: 28px phone, 38px laptop (a long word steps down to 24 to 32px: `headingSize`), with 48 to 64px above |
| `###` headings | Newsreader 600, 21 to 24px |
| Ordered lists (steps) | A navy number badge (36 to 40px, Archivo numeral) level with the step's first line, in the main column; light `--hairline` rules between steps; no minimum height |
| `Callout` tip | Sky box · `headsup` ink box with a marigold title and shield icon · `tryit` marigold box. Small icon tile beside a small title, then the text |
| `KeyTerm` | A flat card in the text, where the word is used |
| `Term` | Dotted underline; opens its meaning in the line, in a bordered box |
| Prompt block and the saved-prompt card | White index card: ruled lines, tomato margin line and header rule, Archivo kicker, COPY button. Flat and straight in lessons |
| `PromptLadder` / `StrongPrompt` | Flat cards. Part highlights from the `--part-*` tokens, shown at once (no swipe); the labels highlight their part on hover and focus |
| Code and `CommandBlock` | Keep the code colours and 2px border. On phones the file name has its own line, then the language and Copy |
| `Figure` | 2px border, Newsreader italic caption (17 to 18px), tap to enlarge |
| Diagrams | The sky frame with a 2px border, then the caption; reflow on phones as before |
| `VideoEmbed` | Navy card with halftone dots and a marigold play button; still loads nothing until pressed |
| `StuckBlock` | "Stuck?" at 22 to 24px, rows with 2px rules, square plus buttons (rotate the icon, not the box) |
| `CheckYourself` | "Check yourself" at 22 to 24px; Newsreader questions on flat bordered cards with small numerals |
| `Challenge` | Marigold box, CHALLENGE kicker, title at 22 to 24px |
| `PromptPractice` | White card with 2px border; keep the sample-feedback wording |
| `HandsOn` | Marigold chip with a laptop icon, above its section heading |
| Wrap-up | A normal `##`-style "Wrap-up" heading, then the recap (sky box, small Archivo numerals, rules between items), the "I'VE FINISHED THIS LESSON" checkbox (marigold; navy with a tick when done, and the current top-bar segment fills), then Next and Previous |
| Prev / next | Navy card with the next lesson's title at 26 to 32px and a marigold arrow circle; previous as a plain link |
| `Placeholder`, `Screenshot` | Dashed 2px boxes on `--paper2` |

## Other pages

Module quiz, Check your skills, module complete (celebration), glossary, run-it and kit pages, access, about, privacy and 404 all use the same system: an Archivo caps page title, colour blocks used sparingly, bordered cards with hard shadows, 2px rules. Quiz options are bordered buttons; show right and wrong with text and icons, not colour alone. Kit print pages keep their light print layout. Update the OG image to match.

## Motion

CSS only, no animation libraries. Base styles equal the end state, so nothing is hidden if animation doesn't run. Everything is off under `prefers-reduced-motion: reduce`. Entrance animations run once. None of the decorative ones run inside a lesson (see Lesson page); there only the segments' fill and blink and feedback after the learner acts move.

| Name | What | Timing |
|---|---|---|
| `cvUp` | Headline lines slide up out of a mask | .9s, staggered .15s |
| `cvFan` | Hero lesson cards fan out to their angles | .8s from 0.8s |
| `cvSpin` | Sticker spins in to 12° | 1s, slight overshoot |
| `cvTicker` | Ticker scrolls | 36s linear, infinite |
| `cvOdo` | Numbers roll to their digits (strip of 0–9 twice) | 1.6–1.9s |
| `cvRise` | Blocks rise in | .7–.8s |
| `cvGrow` / `cvBlink` | Top-bar segments fill in turn; current one blinks | .35s each; 1.6s loop |
| `cvSwipe` | Prompt part highlights draw in | .7s, staggered |
| `cvWipe` | Before/after comparison sweeps | 6s loop (only where a lesson has one) |

Hover: buttons lift 2px and the shadow grows; hero cards straighten and lift; What you'll make rows tint and their thumbnails straighten; contents rows underline.

## Accessibility

- Odometer numbers: the real number in `aria-label`, the digit strips `aria-hidden`.
- Visible focus on everything (3px outline, offset).
- Heading order stays h1 → h2 → h3.
- Decorative stickers, ticker and shapes are `aria-hidden`.
- Nothing relies on colour alone.

## Done means

1. `npm run build`, `npm run lint` and `npm run typecheck` pass.
2. Checked at 390, 768 and 1440 wide, light and dark: home, a normal lesson, lesson 1.4 (prompt ladder), lesson 1.6, a module quiz, Check your skills, a module complete page, glossary, run-it, a kit print preview, 404.
3. Reduced motion checked: nothing missing, nothing moving.
4. Progress, quiz results, checklists and theme still work across a reload.
5. PR opened from the new branch with a short summary and the Vercel preview link. Not merged.
