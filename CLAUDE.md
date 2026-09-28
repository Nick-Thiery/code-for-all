# Code for All

A free, self-paced AI course for 13 to 16 year olds, built with Next.js 15 (App Router), TypeScript, Tailwind CSS 4 and MDX. No accounts and no database: progress lives in the learner's browser. README.md has the full author guide.

## Commands

- `npm run dev`: dev server at http://localhost:3000
- `npm run build`: production build. It checks every lesson and stops with a plain-English error naming the file.
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript check (`tsc --noEmit`)

## Content

- `content/course.yml` lists all 10 modules in three phases. A module is released when `content/module-N/` exists with lessons in it; until then it shows as Coming soon, and its `/module-N` page shows the module's optional `planned` lesson titles and `waiting` line from course.yml.
- One lesson = one `.mdx` file in `content/module-N/`, served at `/module-N/<slug>`. Frontmatter: `title`, `slug` (matches the file name; not `complete`), `order` (10, 20, 30…), `duration` (minutes), `summary`, `requiresAccount`, optional `recap` list. Quote any YAML value containing ": ".
- To add one: copy a lesson in the same module, change the frontmatter, write the body in Markdown. No code changes needed.
- MDX reads `<` and `{` as code: put them in backticks or a code block.
- Images go in `public/lessons/module-N/`.
- Quizzes: `content/module-N/quiz.yml`, 6 to 8 multiple-choice questions, each with `question`, `options` (3 or 4), `answer` (the exact text of the right option), `explanation` and `lesson` (the slug in that module that teaches it). The build validates them. Shown at `/module-N/quiz` by the `ModuleQuiz` component (components/module-quiz.tsx), after the last lesson. Each answer moves the tested lesson's mastery level (Khan Academy-style; rules in `lib/mastery.ts`, shown on the course grid's lesson rows and module panel via components/mastery.tsx): module quizzes go up to Proficient, only Check your skills reaches Mastered. Questions come from that module's lessons only; prefer situations over definitions; no trivia or "all of the above".
- `content/check-your-skills.yml`: the Check your skills pages (after Modules 5 and 8): a mixed quiz from earlier modules' quiz files (8 spread over Modules 1 to N, or a page's own `draw` list), plus an unscored build checklist from the final-project rubric. Reserved lesson slugs: `complete`, `quiz`, `check-your-skills`.

## Lesson components (registered in components/mdx-components.tsx)

- `<Callout kind="tip|headsup|tryit">`: asides. `<KeyTerm term="…">` for a defined term; `<Term def="…">word</Term>` inline, or `<Term>word</Term>` for a word the glossary already defines (components/term-lookup.tsx fills in the definition; the build fails if it can't). The glossary collects both KeyTerms and inline defs.
- ```` ```prompt title="…" ````: a copyable prompt. Use it for every exact prompt from the slides.
- `<CommandBlock>…</CommandBlock>`: terminal commands only (shows "$", has Copy).
- ```` ```html title="index.html" ````: code with line numbers and Copy; ```` ```console ```` for error messages.
- `<HandsOn />` above a hands-on section's heading, in lessons with `requiresAccount: true`, plus the line "This part needs access; see [how hands-on access works](/access)."
- `<StuckBlock><StuckItem question="…">`: common fixes. Answers must come from the lesson, the slides or /access. Every hands-on lesson has one; each box ends with a link to /help.
- `<SaveHere id label placeholder />`: a box that saves what the learner types on this device; `<SavedWork id what from fromLabel sample />` shows it back in a later lesson with Copy, or links back and offers the sample. Practice cards save their draft under their `taskId`, so `<SavedWork id="about-me-prompt">` shows the 1.4 practice prompt.
- `<PublishSafely />` (`testEmail` for Supabase): the safety reminder on every lesson where learners put something online.
- Hands-on lessons set `needs` in the frontmatter (`device`, `access` list, `before` list, with `[text](/link)` allowed) for the "You'll need" box (components/you-need.tsx), which replaces the plain access notice.
- `<CheckYourself><Question q="…">answer</Question>`: a short quiz.
- `<Challenge title="…">`: the module homework, at the end of the module's last lesson.
- `<PromptPractice taskId="…" hint="…">task</PromptPractice>`: the practice card.
- `<PromptLadder><LadderPrompt …/></PromptLadder>` and `<StrongPrompt parts={[…]} />`: the prompt ladder in lesson 1.4 (components/prompt-ladder.tsx). It replaces that lesson's prompt blocks; the strong prompt's parts, joined by line breaks, must stay the exact slide prompt. Part colours are `--part-*` tokens in globals.css.
- `<VibeCodingDiagram />` (1.2), `<ThreeFilesDiagram />` (5.6), `<BranchLanesDiagram />` (7.1), `<ApiDoorDiagram />` (8.2), `<LoginDiagram />` (8.4): lesson diagrams in components/diagrams/, drawn in HTML and inline SVG with tokens only, inside `Diagram` (components/diagram.tsx), which needs a caption and a full-sentence `alt`. On phones they reflow rather than shrink; `enlargeWidth` adds an Enlarge button for one that can't.
- `<Figure src alt width height caption />`: an image (width/height = file pixels; tap to enlarge is built in).
- `<VideoEmbed id="…" title="…" />`: a YouTube video from the slides (youtube-nocookie).
- `<Placeholder>` for content a human still has to supply; `<Screenshot>` for a screenshot still to be taken. Both render nothing in production (`isProduction` in lib/site.ts: `VERCEL_ENV` is "production"), so the text around them must read without them. `npm run content-needed` regenerates docs/content-needed.md, the list of every one; keep the "elsewhere" list in scripts/content-needed.mjs current.

## Rules for course content (docs/course-map.md)

- The map is the plan; the slides are the source of truth for wording, prompts and homework. Slide PDFs are in `source/slides/`; `docs/launchlab-curriculum-source.md` summarises them.
- Keep slide order. Copy slide prompts word for word into prompt blocks.
- Don't invent facts, steps, statistics or UI details. Missing content becomes a `<Placeholder>` saying what's needed.
- Record every departure from the slides in the map as **[changed]** (with the reason), and every kept teaching addition as **[added]**, under that module's "Changes after review".
- British spelling throughout, including slide text and prompts. Button and menu names stay as the product shows them (Customize, Authorize).
- Never tell learners to create their own Claude account (18+). Hands-on access comes through a Code for All session; see app/access/page.tsx. No tutor names without their permission.

## Design

- All colours and sizes are tokens at the top of `app/globals.css`, pasted from the spec sheet in `design/Code for All Website.dc.html`. Use them as Tailwind classes (`bg-tint`, `text-accent`) or `var(--accent)`. Tailwind's default palette is switched off. Never hardcode a colour.
- Dark mode is `[data-theme="dark"]`, set before first paint by the script in `lib/theme.ts`.
- Logo: `public/cfa-logo-light.png` and `public/cfa-logo-dark.png`, the original with only colours changed. Adding `public/cfa-logo.svg` (and `cfa-logo-dark.svg`) switches the header and footer to SVG (`lib/logo.ts`). Don't redraw it.
- Print: hide controls with `print:hidden` (buttons, practice, Stuck?, navigation); keep images and prompt blocks. Pages print in light colours.
- No dead buttons: every button or link must do something. Don't add disabled placeholders; leave the control out until it works.

## Site pages

- `lib/site.ts`: site copy and the contact address (`site.contactHref`, one value). Link to it as "Contact us", never print the address.
- Home page course section: `components/course-grid.tsx` (`CourseGrid`), built from the outline, `lib/progress.ts` and `lib/quiz-results.ts`. Module cards are buttons (aria-pressed) that show one module's lessons; on phones each module opens in place (aria-expanded). It opens on the learner's current module; `/#module-N` picks another. Hands-on lessons get a labelled laptop icon, explained once per module. Lesson rows show their mastery level and the chosen module its mastery %; the honeycombs mean lessons finished, not levels.
- Lesson completion: the recap tick and the "Next" card at the end of a lesson (`MarkDoneLink`) both call `markLessonDone` in `lib/celebration.ts`; unticking the recap un-marks. Finishing a module's last unfinished lesson shows `ModuleCelebration` (in the root layout): the module's honeycomb filling in, kept in memory only, still under reduced motion.
- `/glossary` is built from every `<KeyTerm>` and inline `<Term def>` in the lessons (`lib/glossary.ts`); nothing to edit by hand.
- `/help`: short answers for learners (no laptop, blocked installs, can't sign up, limited data, lost progress, something broke, what a word means, who to ask). Linked from the footer and every Stuck box. `/access#devices` is the device guide.
- `/run-it` and its printable kit pages come from `content/facilitator.yml` (`lib/facilitator.ts`). Never link or publish the PDFs in `source/slides/`.
- `/privacy` states what the site stores and sends. Change it whenever that changes.
- Hidden from search engines unless `NEXT_PUBLIC_ALLOW_INDEXING` is `"true"` (`allowIndexing` in `lib/site.ts`): `app/robots.ts` disallows everything and the root layout adds `noindex`.
- Every page needs a `title` and `description` in its metadata. `NEXT_PUBLIC_SITE_URL` sets the address used in share links and `sitemap.xml`.

## Practice grading

- `POST /api/practice` (`app/api/practice/route.ts`) always uses the mock grader in `lib/practice-mock.ts`. There's no real grading and no API key yet. Response shapes are in `lib/practice.ts`.
- Each `taskId` needs a mock in `TASKS` in `lib/practice-mock.ts`.
- The site calls it sample feedback, not AI feedback, while `aiGrading` in `lib/site.ts` is `false`. Flip it to `true` when real grading goes live; the wording (`practiceCopy`) follows.
- Force a state by adding `?mock=<name>` to a lesson URL: empty, near, loading, weak, middling, strong, offtopic, error, hourly or daily.

## Privacy

- Never log, store or send learner prompt text anywhere except the practice request itself. localStorage holds only lesson progress (`cfa:completed-lessons`), quiz results (`cfa:quiz-results`: score and lessons to review, never answer text), mastery levels (`cfa:mastery`: lesson id to level), checklist ticks (`cfa:checklists`), saved work (`cfa:saved-work`: id to the text a learner saved in a `<SaveHere>` box or a practice card's draft, on this device only, shown back by `<SavedWork>`; lib/saved-work.ts) and the theme (`cfa:theme`).
- No personal data in images: no emails, account IDs, API keys, faces, full names, usernames or avatars. Crop it out or use a `<Placeholder>` saying why.

## Git

- Work on a branch and open a pull request. Never commit to `main` directly.
