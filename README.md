# Code for All

An open AI curriculum, adapted from the LaunchLab course. It has 10 modules in three phases. Each module is a folder, `content/module-1/`, `content/module-2/` and so on, with one MDX file per lesson. The site finds and orders them for you.

The plan for turning the LaunchLab slides into lessons is `docs/course-map.md`; the slide content is `docs/launchlab-curriculum-source.md`, and the slide PDFs are in `source/slides/`.

Built with Next.js 15 (App Router), TypeScript and Tailwind CSS 4. There are no accounts and no database. Lesson completion is saved in each learner's browser.

## Run it

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install        # once, after cloning
npm run dev        # start the site at http://localhost:3000
```

Other commands:

```bash
npm run build      # production build; fails if any lesson has a mistake
npm run start      # serve the production build (run build first)
npm run lint       # check the code
npm run typecheck  # check the TypeScript types
```

## Add a lesson

A lesson is one file. You don't need to touch any code.

1. **Copy a lesson.** Duplicate a lesson in the module's folder, for example `content/module-1/meet-lovable.mdx`, and rename the copy. Use lowercase words joined by dashes, ending in `.mdx`, for example `content/module-2/solo-sprint.mdx`.

2. **Fill in the frontmatter**, the block between the two `---` lines at the top:

   ```yaml
   ---
   title: Writing good prompts
   slug: writing-good-prompts
   order: 20
   duration: 25
   summary: How to ask for what you actually want.
   requiresAccount: false
   recap:
     - First thing to remember.
     - Second thing to remember.
   ---
   ```

   | Field | What to write |
   | --- | --- |
   | `title` | The lesson's name. If it contains a colon, wrap it in quotes: `title: "Prompts: the basics"` |
   | `slug` | The web address: the lesson will live at `/module-2/<slug>`. Lowercase letters, numbers and dashes only, and not `complete`, `quiz` or `check-your-skills` (the module uses those). Make it match the file name. It only has to be unique within its module. |
   | `order` | Where the lesson sits in its module. Lower numbers come first. Only the order matters, so count in tens (10, 20, 30). That way you can slot a new lesson in at 15 without renumbering the rest. Every lesson in a module needs its own number. |
   | `duration` | Estimated minutes, as a plain number: `25`, not `25 min`. |
   | `summary` | One sentence. Shown under the lesson title. If it contains a colon, wrap it in quotes. |
   | `requiresAccount` | `true` if the lesson has a hands-on part that needs an account (Lovable, Claude, GitHub, Vercel or Supabase), otherwise `false`. Adds a notice at the top of the lesson, linking to `/access`, and a label on the course page. Mark the hands-on sections themselves with `<HandsOn />` (see below). |
   | `recap` | Optional. Short points shown in the recap box at the end. Each point goes on its own line, starting with two spaces, a dash and a space. A point with a colon in it needs quotes: `- "Input bias: check your prompt."`. If you leave `recap` out, the recap box shows the summary. |

3. **Write the lesson** below the second `---`, in Markdown:

   ```md
   ## A section heading

   A paragraph with **bold**, *italic* and a [link](https://example.com).

   - A list item
   - Another one
   ```

4. **Check it.** With `npm run dev` running, open http://localhost:3000. The lesson shows up on the course page in its place, numbered by its position in the module. Refresh the browser after each save to see changes.

5. **Commit and push** the new file (or open a pull request) the way your club normally does.

### Adding a lesson without installing anything

If the project is on GitHub, you can do all of this in the browser:

1. Open a lesson in `content/module-1/` on GitHub and copy everything in it.
2. Go to the module's folder and choose **Add file → Create new file**.
3. Name it, for example `writing-good-prompts.mdx`, paste, and edit as in steps 2 and 3 above.
4. Choose **Commit changes** and propose it as a pull request so someone can check it.

### If something goes wrong

The site checks every lesson and tells you what to fix. In `npm run dev` the message appears in the terminal and the browser, and `npm run build` stops with it. For example:

```
There's a problem with content/module-2/solo-sprint.mdx:
  - "duration" must be the estimated minutes as a plain number, like: duration: 20. You wrote: "25 min"
```

Things that commonly trip people up:

- **`<` and `{` in your text.** MDX reads these as the start of code, so `Summarize {text}` or `if x <3` will break the page. Put them in backticks (`` `{text}` ``) or a code block, or escape them as `\{` and `\<`. This matters for prompt templates, which often use `{placeholders}`.
- **Comments.** HTML comments (`<!-- -->`) don't work. Use `{/* like this */}`.
- **File ends in `.md`.** It has to be `.mdx`.
- **Colons in the frontmatter.** `summary: Three things: bias, ...` breaks. Wrap the value in quotes.
- **Two lessons in a module with the same `order` or `slug`.** Each lesson needs its own.

## Add a module quiz

A module's quiz is one file, `content/module-N/quiz.yml`. It appears at `/module-N/quiz`, on the course page as a row after the module's last lesson, and as the "Next" link at the end of that lesson. A module without the file simply has no quiz. The quiz isn't a lesson: it doesn't count towards progress and is never locked.

```yaml
questions:
  - question: "You've connected your repo to Vercel and just pushed a change to GitHub. How does your live site get it?"
    options:
      - "You upload the new files to Vercel"
      - "Vercel rebuilds and updates it automatically"
      - "You delete the project and import it again"
    answer: "Vercel rebuilds and updates it automatically"
    explanation: "Once they're connected, every push to GitHub makes Vercel rebuild and update your live site. You never upload anything again."
    lesson: connect-to-vercel
```

| Field | What to write |
| --- | --- |
| `question` | The question. Situations work better than definitions. Wrap it in double quotes (write `\"` for a quote mark inside). |
| `options` | 3 or 4 answers, each on its own line starting with `  - `, all different. No "all of the above": the order is shuffled when learners try again. |
| `answer` | The correct option, copied exactly (capitals and punctuation too). |
| `explanation` | Why that answer is right, in a sentence or two. Shown after every answer. |
| `lesson` | The slug of the lesson in this module that teaches it. A wrong answer links there ("Review: ..."). |

Learners answer one question at a time, see the explanation after each, and get a summary at the end ("You got 5 of 7.") with the lessons to look at again. There are no points, grades or pass marks. The first try uses the order you wrote the options in; "Try again" shuffles them, so vary where the correct answer sits. The build checks every quiz file and says what to fix, like it does for lessons.

### Check your skills

`content/check-your-skills.yml` adds a Check your skills page after a module, at `/module-N/check-your-skills`, with a link on the course page and on that module's Module complete page. Each page has a mixed quiz picked from earlier modules' quizzes (a fresh mix each try), then the final-project build checklist, which is unscored. By default the quiz is 8 questions spread over Modules 1 to N; a page's optional `draw` list sets how many come from which modules, for example 5 from `modules: 6-8` and 3 from `modules: 1-5`.

```yaml
pages:
  - after: 5
    intro: "Optional line shown above this page's checklist."
  - after: 8

checklist:
  - criterion: It ships
    items:
      - "Is your project live at a working URL that anyone can open?"
```

To add a page, add another `- after: N`. The checklist is shared by every page; each criterion is a heading with its questions as tick-boxes.

## Modules and phases

`content/course.yml` lists every module, released or not, grouped into the three phases on the course page (Build with AI, Developer fundamentals, Your final project), with each module's title and one-line summary.

To release a module, make its folder, for example `content/module-2/`, and add lessons. Nothing else: the course page, the lesson URLs (`/module-2/<slug>`), the header's lesson counter and the Module complete page (`/module-2/complete`) all follow. Until then the module shows as "Coming soon" on the course page, and `/module-2` is its Coming soon page.

## Lesson components

These work in any lesson without an import. Module 1 uses most of them.

| Component | What it is |
| --- | --- |
| `<Callout kind="tip">…</Callout>` | A boxed aside. `kind` is `tip`, `headsup` or `tryit`. |
| `<KeyTerm term="Token">…</KeyTerm>` | A term and its definition, in a box. |
| `<Term def="…">model</Term>` | An inline term. Tapping it shows the definition. |
| ```` ```html title="index.html" ```` | A code block with line numbers and a Copy button. HTML is coloured; other languages are shown plain. Use ```` ```console ```` for error messages. Long lines scroll sideways, with a hint. |
| `<CommandBlock>claude --version</CommandBlock>` | A terminal command with a Copy button. |
| `<HandsOn />` | Put above the heading of a section that needs an account. |
| `<Screenshot caption="…">what goes here</Screenshot>` | A placeholder for a screenshot you haven't taken yet. |
| `<StuckBlock><StuckItem question="…">…</StuckItem></StuckBlock>` | Common fixes, folded away. |
| ```` ```prompt title="Strong" ```` | A prompt to paste into an AI tool, exactly as written, with a Copy button. Use it for every exact prompt from the slides. |
| `<PromptPractice taskId="…" hint="…">…</PromptPractice>` | The practice card. See below. |
| `<PromptLadder>` `<LadderPrompt level="Bad" prompt="…" leavesOut={[…]}>…</LadderPrompt>` `</PromptLadder>` and `<StrongPrompt parts={[{ name, text, does }, …]} />` | The prompt ladder (lesson 1.4): weaker prompts side by side with a 7-hexagon strength meter and "leaves out" chips, then the strong prompt split into its parts, each with a colour-coded label that shows what that part does. Part names must be one of the seven (Role, Goal, Target audience, Core pages, Design style, Output required, Key features); their colours are the `--part-*` tokens. Copy copies the parts' text joined by line breaks. |
| `<CheckYourself><Question q="…">answer</Question></CheckYourself>` | A short quiz. Each answer shows when the learner asks for it. |
| `<Challenge title="…">…</Challenge>` | The module's homework (from the slides). Goes at the end of the module's last lesson. |
| `<Figure src="/lessons/module-6/x.jpg" alt="…" width={1600} height={770} caption="…" />` | An image, usually cropped from a slide into `public/lessons/module-N/`. `width` and `height` are the file's size in pixels. Readers can tap it to see it full size; images narrower than the column show at their own size. |
| `<VibeCodingDiagram />` `<ThreeFilesDiagram />` `<BranchLanesDiagram />` `<ApiDoorDiagram />` `<LoginDiagram />` | The lesson diagrams (1.2, 5.6, 7.1, 8.2, 8.4), one file each in `components/diagrams/`. They are HTML and inline SVG drawn with the design tokens, so they work in dark mode, and each sits in the `Diagram` frame (`components/diagram.tsx`) with a caption and a full text alternative. On phones they reflow (cards stack, arrows turn downwards) instead of shrinking. A diagram that can't reflow can pass `enlargeWidth` to get an Enlarge button on phones. |
| `<VideoEmbed id="hwP7WQkmECE" title="…" />` | A YouTube video from the slides (youtube-nocookie.com, loads when scrolled near), with a plain link underneath. |
| `<Placeholder>What's missing</Placeholder>` | Marks content that's still needed, like a video link. Find them all with `grep -rn "<Placeholder\|<Screenshot" content`. |

## Prompt practice

Any lesson can include a practice box where learners write a prompt and submit it:

```mdx
<PromptPractice taskId="first-prompt">
Ask for a two-sentence explanation of what a variable is, for a 10-year-old.
</PromptPractice>
```

The text between the tags is the task shown on the card. You can leave it out and write `<PromptPractice taskId="first-prompt" />`; the card then shows the task ID. Add `hint="…"` for a "Need a hint?" button.

On submit, the card sends `POST /api/practice` with `{ "taskId": string, "prompt": string }`. The answer is scores on three skills (Specificity, Context, Scope), one thing to try and an improved prompt, or an off-topic, rate-limited or error answer. The shapes are `PracticeResponse` in `lib/practice.ts`.

Grading is mocked for now, in `lib/practice-mock.ts`: each task has canned feedback at three levels and simple rules, built from its grading anchors in `docs/course-map.md`, to pick one. Tasks without a mock get an error saying so. Real grading goes in `app/api/practice/route.ts` and should answer with the same shapes.

While grading is mocked, the site calls it sample feedback, not AI feedback (the practice card, the homepage "How it works" card and /access). That wording comes from one setting, `aiGrading` in `lib/site.ts`. Set it to `true` when real grading goes live.

**Mock fixtures.** Add `?mock=<name>` to a lesson URL to open every practice card on the page in one state: `empty`, `near`, `loading`, `weak`, `middling`, `strong`, `offtopic`, `error`, `hourly` or `daily`. For example http://localhost:3000/module-1/the-art-of-prompting?mock=strong. Each task has its own fixture prompts in `lib/practice-mock.ts`.

To make another component available in lessons, add it to `components/mdx-components.tsx`.

## Where things are

```
content/course.yml              every module, grouped into phases
content/module-N/               one .mdx file per lesson
app/page.tsx                    home: hero, how it works, the course grid
components/course-grid.tsx      the home page course: continue card, module grid (phone: module list), lessons
app/[module]/[lesson]/page.tsx  lesson template (/module-1/<slug>)
app/[module]/complete/page.tsx  Module complete (/module-1/complete)
app/[module]/quiz/page.tsx      module quiz (/module-1/quiz)
app/[module]/check-your-skills/page.tsx  Check your skills (/module-5/check-your-skills)
app/[module]/page.tsx           /module-N: Coming soon for a module that isn't out
app/run-it/page.tsx           Run a session: the facilitator kit, for adults
app/run-it/[kit]/             printable kit pages (/run-it/script/module-3)
content/facilitator.yml       run sheets for the kit (read by lib/facilitator.ts)
app/glossary/page.tsx         glossary, built from every <KeyTerm> (lib/glossary.ts)
app/privacy/page.tsx          privacy, for parents and schools
app/access/page.tsx           how hands-on access works
app/about/page.tsx            about (a draft to rewrite)
app/sitemap.ts, app/robots.ts sitemap.xml and robots.txt
app/opengraph-image.tsx       the share image
app/not-found.tsx             404
app/api/practice/route.ts     practice submissions (mock grading)
components/                   one file per piece of the design (header, footer, track, callouts, ...)
components/diagrams/          the lesson diagrams, each in the Diagram frame (components/diagram.tsx)
lib/lessons.ts                reads, checks and orders modules and lessons
lib/outline.ts                the course outline the browser gets (no lesson text)
lib/progress.ts               completion state in localStorage
lib/celebration.ts            marking a lesson done, and the Module complete card it can start
lib/quizzes.ts                reads and checks quiz.yml and check-your-skills.yml
lib/quiz.ts                   quiz types, shuffling and the mixed-quiz draw
lib/quiz-results.ts           quiz results and checklist ticks in localStorage
components/module-quiz.tsx    the quiz card (ModuleQuiz)
lib/practice*.ts              practice types, mock grading and ?mock= fixtures
lib/site.ts                   site copy, the contact address and the site URL
lib/logo.ts                   which logo files the header uses
app/globals.css               design tokens, type, buttons, lesson styles
design/                       the Claude Design export this site is built from
```

## Notes

- **Completion** is stored in the browser's localStorage under `cfa:completed-lessons`, as a list of lesson ids like `module-1/meet-lovable`. It doesn't sync between devices. If you rename a slug or move a lesson to another module, anyone who finished that lesson will see it as unfinished. Returning learners get a "Continue" button in the home page hero, a "Pick up where you left off" card above the course grid and bar on other pages, pointing at their first unfinished lesson. The course grid opens on that lesson's module (Module 1 for a new visitor); `/#module-N` opens another, which is where lesson, quiz and Check your skills pages link back to. A lesson is marked done when the learner ticks its recap box or follows the "Next" card at the end of it (`components/mark-done-link.tsx`); unticking the recap box un-marks it. When that finishes a module's last unfinished lesson, a small card shows the module's honeycomb filling in (`components/module-celebration.tsx`, started by `lib/celebration.ts`). It lives in memory only, so nothing extra is stored, and with reduced motion on the honeycomb is simply full.
- **Quiz results** are stored under `cfa:quiz-results`: for each quiz (`module-1/quiz`, `module-5/check-your-skills`), the last result only (how many right, out of how many, the ids of the lessons to review, and the date). Check your skills ticks are stored under `cfa:checklists`, per page. Neither holds anything the learner typed.
- **Dark mode** follows the device setting until someone uses the toggle. After that, their choice is remembered in `cfa:theme`.
- **Design**: the source is `design/Code for All Website.dc.html`, exported from Claude Design; open it in a browser to see every page and the spec sheet. The colour and size tokens at the top of `app/globals.css` are pasted from that spec sheet. Use the tokens (as Tailwind classes like `bg-tint` or `text-accent`, or `var(--accent)`); Tailwind's default colour palette is switched off. Headings are set in Recursive, body text in Atkinson Hyperlegible Next, code in Atkinson Hyperlegible Mono.
- **Contact**: the address is one value in `lib/site.ts`. Every "Contact us" button links to `site.contactHref`.
- **Logo**: `public/cfa-logo-light.png` (transparent background) and `public/cfa-logo-dark.png` (the same pixels with only the colours changed for dark mode). If `public/cfa-logo.svg` exists, the header uses it instead, with `public/cfa-logo-dark.svg` for dark mode if that exists too.
- **Search engines**: the site is hidden from them by default (`robots.txt` disallows everything and every page has a `noindex` meta tag). Set `NEXT_PUBLIC_ALLOW_INDEXING=true` at build time to let them in.
- **Site URL**: share links and `sitemap.xml` use `NEXT_PUBLIC_SITE_URL` (for example `https://codeforall.example`). On Vercel it falls back to the project's production address; locally, to http://localhost:3000.
- **Printing**: lessons and kit pages print in light colours without the header, navigation, buttons or practice box. Give any new control `print:hidden`.
- **Lessons can run code.** MDX files can contain JavaScript that runs when the site builds. Review lesson pull requests before merging them.
