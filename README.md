# Code for All

An open AI curriculum. Lessons are MDX files in `content/lessons/`, one file per lesson. The site finds and orders them for you.

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

1. **Copy the sample.** Duplicate `content/lessons/sample-lesson.mdx` and rename the copy. Use lowercase words joined by dashes, ending in `.mdx`, for example `content/lessons/writing-good-prompts.mdx`.

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
   | `slug` | The web address: the lesson will live at `/lessons/<slug>`. Lowercase letters, numbers and dashes only. Make it match the file name. |
   | `order` | Where the lesson sits in the course. Lower numbers come first. Only the order matters, so count in tens (10, 20, 30). That way you can slot a new lesson in at 15 without renumbering the rest. Every lesson needs its own number. |
   | `duration` | Estimated minutes, as a plain number: `25`, not `25 min`. |
   | `summary` | One sentence. Shown on the course page and under the lesson title. |
   | `requiresAccount` | `true` if learners need an account (for example on an AI tool) to do the lesson, otherwise `false`. Adds a notice to the lesson and a label on the course page. |
   | `recap` | Optional. Short points shown in the recap box at the end. Each point goes on its own line, starting with two spaces, a dash and a space. If you leave it out, the recap box shows the summary. |

3. **Write the lesson** below the second `---`, in Markdown:

   ```md
   ## A section heading

   A paragraph with **bold**, *italic* and a [link](https://example.com).

   - A list item
   - Another one
   ```

4. **Check it.** With `npm run dev` running, open http://localhost:3000. The lesson shows up on the course page in its place. Refresh the browser after each save to see changes.

5. **Commit and push** the new file (or open a pull request) the way your club normally does.

### Adding a lesson without installing anything

If the project is on GitHub, you can do all of this in the browser:

1. Open `content/lessons/sample-lesson.mdx` on GitHub and copy everything in it.
2. Go back to the `content/lessons` folder and choose **Add file → Create new file**.
3. Name it, for example `writing-good-prompts.mdx`, paste, and edit as in steps 2 and 3 above.
4. Choose **Commit changes** and propose it as a pull request so someone can check it.

### If something goes wrong

The site checks every lesson and tells you what to fix. In `npm run dev` the message appears in the terminal and the browser, and `npm run build` stops with it. For example:

```
There's a problem with content/lessons/writing-good-prompts.mdx:
  - "duration" must be the estimated minutes as a plain number, like: duration: 20. You wrote: "25 min"
```

Things that commonly trip people up:

- **`<` and `{` in your text.** MDX reads these as the start of code, so `Summarize {text}` or `if x <3` will break the page. Put them in backticks (`` `{text}` ``) or a code block, or escape them as `\{` and `\<`. This matters for prompt templates, which often use `{placeholders}`.
- **Comments.** HTML comments (`<!-- -->`) don't work. Use `{/* like this */}`.
- **File ends in `.md`.** It has to be `.mdx`.
- **Two lessons with the same `order` or `slug`.** Each lesson needs its own.

## Prompt practice

Any lesson can include a practice box where learners write a prompt and submit it:

```mdx
<PromptPractice taskId="first-prompt">
Ask for a two-sentence explanation of what a variable is, for a 10-year-old.
</PromptPractice>
```

The text between the tags is the task shown on the card. You can leave it out and write `<PromptPractice taskId="first-prompt" />`; the card then shows the task ID.

On submit, the box sends `POST /api/practice` with `{ "taskId": string, "prompt": string }` and displays whatever JSON comes back. The route in `app/api/practice/route.ts` is a stub that returns a hardcoded response. Real grading goes there. The request type and its validator are in `lib/practice.ts`.

To make another component available in lessons, add it to `components/mdx-components.tsx`.

## Where things are

```
content/lessons/            one .mdx file per lesson
app/page.tsx                course page (the track)
app/lessons/[slug]/page.tsx lesson template
app/run-it/page.tsx         facilitator materials (stub)
app/api/practice/route.ts   practice submissions (stub)
components/                 track, recap, prompt practice, header, MDX setup
lib/lessons.ts              reads, checks and orders lessons
lib/progress.ts             completion state in localStorage
lib/site.ts                 site name, tagline and description (placeholders)
app/globals.css             colours, type, lesson styles, the track
```

## Notes

- **Completion** is stored in the browser's localStorage under `cfa:completed-lessons`, as a list of slugs. It doesn't sync between devices. If you rename a slug, anyone who finished that lesson will see it as unfinished.
- **Dark mode** follows the system setting until someone uses the toggle. After that, their choice is remembered in `cfa:theme`.
- **Design**: one accent colour, highlighter yellow, used for anything "marked": links, finished lessons, the main button. Colour tokens are at the top of `app/globals.css`. Headings are set in Recursive, body text in Atkinson Hyperlegible Next.
- **Lessons can run code.** MDX files can contain JavaScript that runs when the site builds. Review lesson pull requests before merging them.
