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
   | `slug` | The web address: the lesson will live at `/module-2/<slug>`. Lowercase letters, numbers and dashes only, and not `complete`. Make it match the file name. It only has to be unique within its module. |
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
| `<CheckYourself><Question q="…">answer</Question></CheckYourself>` | A short quiz. Each answer shows when the learner asks for it. |
| `<Challenge title="…">…</Challenge>` | The module's homework (from the slides). Goes at the end of the module's last lesson. |
| `<Figure src="/lessons/module-6/x.jpg" alt="…" width={1600} height={770} caption="…" />` | An image, usually cropped from a slide into `public/lessons/module-N/`. `width` and `height` are the file's size in pixels. Readers can tap it to see it full size; images narrower than the column show at their own size. |
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

**Mock fixtures.** Add `?mock=<name>` to a lesson URL to open every practice card on the page in one state: `empty`, `near`, `loading`, `weak`, `middling`, `strong`, `offtopic`, `error`, `hourly` or `daily`. For example http://localhost:3000/module-1/the-art-of-prompting?mock=strong. Each task has its own fixture prompts in `lib/practice-mock.ts`.

To make another component available in lessons, add it to `components/mdx-components.tsx`.

## Where things are

```
content/course.yml              every module, grouped into phases
content/module-N/               one .mdx file per lesson
app/page.tsx                    home: hero, the phases and their modules, how it works
app/[module]/[lesson]/page.tsx  lesson template (/module-1/<slug>)
app/[module]/complete/page.tsx  Module complete (/module-1/complete)
app/[module]/page.tsx           /module-N: Coming soon for a module that isn't out
app/run-it/page.tsx           Run a session, for adults
app/access/page.tsx           how hands-on access works
app/about/page.tsx            about
app/not-found.tsx             404
app/api/practice/route.ts     practice submissions (mock grading)
components/                   one file per piece of the design (header, footer, track, callouts, ...)
lib/lessons.ts                reads, checks and orders modules and lessons
lib/outline.ts                the course outline the browser gets (no lesson text)
lib/progress.ts               completion state in localStorage
lib/practice*.ts              practice types, mock grading and ?mock= fixtures
lib/site.ts                   site copy, plus the Contact and session kit links (TODO)
app/globals.css               design tokens, type, buttons, lesson styles
design/                       the Claude Design export this site is built from
```

## Notes

- **Completion** is stored in the browser's localStorage under `cfa:completed-lessons`, as a list of lesson ids like `module-1/meet-lovable`. It doesn't sync between devices. If you rename a slug or move a lesson to another module, anyone who finished that lesson will see it as unfinished. Returning learners get a "Continue" button on the home page and a "Pick up where you left off" bar on other pages, pointing at their first unfinished lesson.
- **Dark mode** follows the device setting until someone uses the toggle. After that, their choice is remembered in `cfa:theme`.
- **Design**: the source is `design/Code for All Website.dc.html`, exported from Claude Design; open it in a browser to see every page and the spec sheet. The colour and size tokens at the top of `app/globals.css` are pasted from that spec sheet. Use the tokens (as Tailwind classes like `bg-tint` or `text-accent`, or `var(--accent)`); Tailwind's default colour palette is switched off. Headings are set in Recursive, body text in Atkinson Hyperlegible Next, code in Atkinson Hyperlegible Mono.
- **TODO links**: Contact and the session kit links are empty in `lib/site.ts`. Until they're filled in, those links show as disabled buttons or plain text, with a dashed outline in development.
- **Lessons can run code.** MDX files can contain JavaScript that runs when the site builds. Review lesson pull requests before merging them.
