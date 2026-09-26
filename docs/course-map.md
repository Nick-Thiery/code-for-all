# Code for All course map (v1)

How the 10 LaunchLab modules become lessons on the Code for All website.

Companion file: `curriculum-source.md` (everything the slides say, module by module). This file says how that content is split, ordered and adapted. The source file is the content; this file is the plan.

---

## Rules for turning slides into lessons

1. **Follow the slides.** Lesson order matches slide order. Headings, examples, prompts and wording stay close to the slides. Where a slide gives an exact prompt, the lesson uses that exact prompt in a copyable block.
2. **The slides are the source of truth for homework.** Where the Blueprint or Module Breakdown disagree, use the slide version. Each module ends with a **Challenge** block holding the slide homework.
3. **One module = one unit on the site.** The site's "Parts" become "Modules" (URL `/module-1/<slug>`). Modules are grouped on the homepage into three phases, taken from the Module Breakdown:
   - **Build with AI:** Modules 1 to 5
   - **Developer fundamentals:** Modules 6 to 8
   - **Your final project:** Modules 9 and 10
4. **Lessons are short.** Each 90-minute class becomes 4 to 7 lessons of 3 to 15 minutes.
5. **Only change what can't work on a website.** Group work, breakout rooms, Slack posts, DMs to tutors and live demos get a solo version, marked **[solo version]** below. Everything else stays as taught.
6. **Fix only what's unsafe or wrong.** Changes from the slides are marked **[changed]** with the reason. There are only a few.
7. **Hands-on lessons are flagged.** A lesson needing a Lovable, Claude, GitHub, Vercel or Supabase account shows "Hands-on: needs access". The reading part always works without one.

8. **Additions are recorded.** Teaching text that isn't on the slides but helps (a plain-English gloss, a connecting line, safety advice, Stuck answers taken from the lesson) is marked **[added]** below. Anything stated as fact must come from the slides, this map, or an official page that was checked.
9. **British spelling throughout**, including slide text and prompt blocks (organise, colour, analyse, optimisation). Button and menu names stay exactly as the product shows them (Customize, Authorize).

Component names below match the site: KeyTerm, Tip, HeadsUp, TryIt, Stuck, PromptPractice, command block, Recap. Two new ones are needed: **CheckYourself** (short quiz, answers revealed on click) and **Challenge** (the module homework).

---

## Module 1: Intro to Lovable
*Vibe coding, and why the way you ask matters*
Source: LaunchLab 1

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 1.1 | how-this-course-works | How this course works | 4 | |
| 1.2 | what-is-vibe-coding | What is vibe coding? | 6 | |
| 1.3 | meet-lovable | Meet Lovable | 5 | yes |
| 1.4 | the-art-of-prompting | The art of prompting | 12 | |
| 1.5 | ethical-considerations | Ethical considerations | 5 | |
| 1.6 | build-about-me | Task: design an "About me" website | 10 | yes |

**1.1 How this course works.** Slide "How This Course Works": Hands-On First (short lessons, hands-on activities, homework to apply your learning, "It won't take long and it will be fun!") and Build to Launch (make a product, SEO, market it). Add: you'll need a laptop for hands-on lessons; reading works on a phone. **[solo version]** Replace the Slack join link with how to get help: Stuck blocks in each lesson, and joining a Code for All session.

**1.2 What is vibe coding?** KeyTerm: vibe coding. The three steps exactly as on the slide: 1. Describe, 2. Build, 3. Launch. Then "What can you build?": apps, Chrome extensions, websites, trading algorithms, with Snapiq (snapiq.tools) as the example. Then one short paragraph from the slides on getting users: SEO, Google Ads, social media marketing, word of mouth (full lesson in Module 9). Images needed: Lovable stats and website traffic example.

**1.3 Meet Lovable.** Slide "Lovable": open Lovable and experiment. TryIt: open Lovable and try any one-line idea. Image needed: Lovable screenshot.

**1.4 The art of prompting.** The core lesson of the module. Show the three levels from the slides, word for word:
- Bad: "Create a website for my course"
- Better: "Create a modern website for my coding course with a homepage and lessons."
- Strong: the full Role / Goal / Target audience / Core pages / Design style / Output required / Key features prompt.

Then walk through the strong prompt one part at a time, one line each on what that part does. End with **PromptPractice** task `about-me-prompt`: "Write a prompt for Lovable to build your own About Me website." Grading anchors come from the seven parts of the strong prompt (see Practice tasks below).

**1.5 Ethical considerations.** The three slide points: Input bias, Representative, The amplification loop. **[changed]** "studies prove they actively learn to become more biased" becomes "research suggests people can pick up an AI tool's biases over time", unless the club can cite the study.

**1.6 Task: design an "About me" website.** The slide task. Paste the prompt from 1.4 into Lovable, look at the result, change one part of the prompt, and compare.

**Challenge (slide homework):** Watch "Get Started With Lovable". *Link needed.*

**Changes after review (26 Sep 2026):**

- [changed] 1.4: the strong prompt's "Output required" list is numbered 1 to 5 (slide 10's 4 to 8 is a numbering slip).
- [changed] 1.2: stats are given as approximate ("about 19,300 visitors"), and the analytics aren't said to be Snapiq's, because the cropped image doesn't show the site's name. The Google Ads crop does show the campaign name "Snapiq website".
- [changed] Slide images: slides 7 and 8 are cropped to leave out customer emails, an ad-account email and account IDs. Slide 5 is cropped to leave out profile photos. Slide 12's example site (a tutor's full name) is a Placeholder. The slide 13 homework video is embedded in the Challenge.
- [added] 1.4 "describe yourself through hobbies and what you've made, not personal details", and the 1.6 safety HeadsUp (child safety).
- [added] 1.3 link to lovable.dev (Lovable's homepage).
- [added] 1.3 and 1.6 Stuck answers ("you don't need to sign up for Lovable yourself", from the access page); 1.2 connecting line introducing the analytics image.

---

## Module 2: Applying Lovable
*Better prompts, real projects*
Source: LaunchLab 2

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 2.1 | todays-task | Today's task: pick your build | 3 | |
| 2.2 | solo-sprint | Solo sprint: build your first draft | 12 | yes |
| 2.3 | better-prompts-with-ai | Using AI to make better prompts | 8 | yes |
| 2.4 | using-refined-prompts | Using refined prompts | 8 | yes |
| 2.5 | gallery | Gallery | 4 | |

**2.1 Today's task.** The three briefs from the slide: Personality Quiz, News Website, Online Store. **[solo version]** Instead of being assigned a group, pick one.

**2.2 Solo sprint.** The three slide steps: draft a detailed prompt describing your site; paste it into Lovable; "Crucial: copy-paste and save your exact prompt text into a safe notes file for later edits" (as a HeadsUp). Remove "contact a class tutor right away" and point to the Stuck block.

**2.3 Using AI to make better prompts.** The three slide steps, with the slide's example request to Claude in a copyable block. **[changed]** Step 2, "Sign in with an account. You can use any email address… the free tier also works," is removed, because Claude accounts are 18+. It becomes "Open Claude using the access your Code for All session gives you." **PromptPractice** task `refine-request`: write the message you'd send Claude asking it to improve your prompt from 2.2.

**2.4 Using refined prompts.** The three slide points: be specific about layout, colours and audience; check the prompt has what you want; paste into Lovable starting with "This is a refined prompt, make the required changes: " (copyable).

**2.5 Gallery.** **[solo version]** Slides: post your link in #socials and browse everyone's builds. Website: put your first draft and refined version side by side, write down three things that changed, and show both to someone.

**Challenge (slide homework):** Build a Lovable site that predicts or forecasts something: a stock direction tool, a weather predictor, etc. Pick something real, pull data from somewhere if you can, and show your reasoning for the prediction logic. You can use Claude to refine your prompt. **[solo version]** Remove "DM your HW website to Yibo, Rishabh, or Nirvan".

**Changes after review (26 Sep 2026):**

- [changed] 2.2: the slide 3 video (a 20-minute countdown timer for the live class) is left out.
- [changed] 2.3: the heading "Example prompt to Claude" is removed so the label isn't repeated; the prompt block keeps it.
- [added] 2.1 opening line and "What happens next" list; 2.2 plain-English glosses of the slide steps, link to the Module 1 strong prompt, one-line reflection on the first draft; 2.3 "replace Original prompt here" instruction and the "What each part does" breakdown; 2.4 glosses of the two checks and a Tip to screenshot the first draft before refining (so the 2.5 comparison is possible); 2.5 intro and reflection lines, Challenge access line.
- [added] Stuck answers in 2.2 to 2.4, taken from the lessons and the access page (the Claude one keeps the 18+ reason from the 2.3 note).

---

## Module 3: Introduction to Claude Code
*Building on your own computer with an AI agent*
Source: LaunchLab 3

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 3.1 | what-is-claude-code | What is Claude Code? | 6 | |
| 3.2 | what-it-can-do | What it can do | 8 | |
| 3.3 | install-claude-code | Task: install Claude Code | 12 | yes |
| 3.4 | quick-business-lesson | Quick business lesson | 5 | |
| 3.5 | plan-your-extension | Plan your Chrome extension | 5 | |

**3.1 What is Claude Code?** The slide's "Agentic Coding System" and "For Product Designers" points, plus "Integrated Environments" (terminal, VS Code extension, desktop app). **[changed]** Plainer wording for 13 to 16 year olds (e.g. "It reads your whole project, runs commands and fixes its own mistakes, instead of just suggesting the next line"). Drop the "109K+ active developers" figure; it's unverified and will date. KeyTerm: agent.

**3.2 What it can do.** The slide's three columns, each with its example prompts and "Key idea" line kept exactly:
- Routines: "Check this folder for errors every hour." / "Run a multi-step process: clean the files, test the code, then generate a report."
- Refactoring: "Rename this variable everywhere it appears." / "Make this code easier to read while keeping the same functionality."
- Session context: what commands ran, what errors happened, what files changed, what you were trying to fix.

**3.3 Task: install Claude Code.** The slide instructions are image only, so use the current official steps: the desktop app as the main path, the terminal commands as the other option, then `claude --version` to check. Stuck block with common install errors. *Screenshots needed.*

**3.4 Quick business lesson.** Yibo's journey with Snapiq *(text needed; the slide is image only)*, then the slide text: "It's 30% the idea, 70% the execution", first-time vs second-time founders, "People will rarely steal your idea", "Most ideas are good because they already exist."

**3.5 Plan your Chrome extension.** From the task slide: you're building a Chrome extension. Pick a problem you actually have. Examples from the homework: screenshot tool, tab organizer, YouTube speed controller, word highlighter.

**Challenge (slide homework):** Build a Chrome extension with Claude Code. It must install in your browser and work. Bonus points if it solves a problem you genuinely have.

**Changes after review (26 Sep 2026):**

- [changed] 3.1 and 3.3: the VS Code extension follows the current official docs (code.claude.com/docs/en/vs-code, checked 26 Sep 2026). The extension bundles its own copy of Claude Code for its chat panel; the terminal version is only needed to type `claude` in VS Code's terminal. The slide says the extension requires the command-line version.
- [changed] 3.3: install steps come from the official desktop quickstart and setup pages (the slide only links to them).
- [changed] Slide 5 (Claude Design) and its video are moved to 5.1: Module 3 has no lesson for them.
- [changed] British spelling in slide text: "reorganise" (3.2 Key idea), "tab organiser" (3.5).
- [added] 3.1 Agent KeyTerm (from Module 5's wording), glosses for terminal, VS Code and autocomplete, link back to vibe coding; 3.2 glosses for refactoring, packages and session; 3.3 "a new, empty folder is fine", "ask in your Code for All session" (for the slide's "reach out to your tutors"), Stuck answers from the official troubleshooting page and the access page; 3.4 founders gloss and a closing line linking to the homework; 3.5 Chrome extension gloss and a TryIt (write one sentence on what your extension will do).

---

## Module 4: Claude Skills + Claude in Excel
*Making Claude work your way*
Source: LaunchLab 4

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 4.1 | homework-review | Review your extension | 4 | |
| 4.2 | what-are-skills | What are Claude Skills? | 6 | |
| 4.3 | set-up-a-skill | How to set up a skill | 10 | yes |
| 4.4 | claude-in-excel | Claude in Microsoft Excel | 8 | yes |
| 4.5 | claude-in-chrome | Download the Claude extension | 4 | yes |

**4.1 Review your extension.** **[solo version]** The slide's "Active Homework Review" questions become a self-review: Does it install cleanly and run? What problem does it solve? What was the hardest part to get working? If it worked perfectly, what exactly should it do?

**4.2 What are Claude Skills?** The three slide points kept as is: Reusable Instructions, On-Demand Loading, Consistent Standardized Outputs. KeyTerm: skill.

**4.3 How to set up a skill.** The four slide steps: Settings on Claude.ai, Add Skill under Customize, upload your SKILL.md, attach it to a project. Plus a short "Plugins" section *(slide is image only, content needed)*. **[changed]** Menu names must be checked against the current Claude app before publishing, since they change often. *Screenshots needed.*

**4.4 Claude in Microsoft Excel.** The slide's "Advanced Data Operations": Formula Assistance, Data Analysis, Audit & Validation. TryIt with a sample spreadsheet included on the site. **[changed]** The class activity (decide whether a stock is worth buying, using data from Slack) becomes "explain what these numbers say about a company", with the dataset hosted on the site instead of Slack.

**4.5 Download the Claude extension.** Claude in Chrome video and download link *(links needed)*.

**Challenge (slide homework):** Experiment with Claude in Excel and build a Claude skill. **[solo version]** Remove "DM your skill to Yibo, Rishabh, or Nirvan on Slack".

**Changes after review (26 Sep 2026):**

- [changed] 4.3: the invented "upload a ZIP file" claim and its Stuck answer are removed; step 3 follows slide 4 ("Upload your SKILL.md file"). Steps 1 and 2 follow the slide 5 screenshot (Customize > Skills; + > Create skill > Upload a skill), where slide 4's text says Settings and Add Skill. The live-app check of all four steps is still to do.
- [changed] 4.4: the activity is explaining 90 days of real Singapore weather data, hosted at public/lessons/module-4/singapore-weather.csv (daily, 28 June to 25 September 2026, from the Open-Meteo historical weather API, CC BY 4.0, credited on the page). This replaces the class's stock decision on Slack data and this map's earlier company-numbers version. The slide 8 screenshots of Claude answering about a company's model stay as illustrations of the feature.
- [changed] Module 4 Challenge: use Claude in Excel to find and explain what the weather data shows, in your own words, and build a Claude skill (slide homework, DM removed).
- [changed] British spelling in slide text: Standardised, analyse, Summarise ("Customize" kept as a menu name).
- [added] 4.1 "write your answers in your notes" and "not working yet? go back to the Module 3 challenge"; 4.2 a plain-English line under each slide point, skill KeyTerm, context window gloss; 4.3 HeadsUp that Claude's menus change often (from this map's 4.3 reason), descriptions read from the slide 5 screenshot; 4.4 glosses (formulas, anomalies, business rules), a gloss of the slide 8 question, the four TryIt steps and an example prompt in our own words; 4.5 intro line.

---

## Module 5: Claude Design
*Design it, then let Claude Code build it*
Source: LaunchLab 5 (the best-written deck; stays almost word for word)

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 5.1 | design-your-front-end-first | Design your front end first | 5 | yes |
| 5.2 | export-your-design | Export your design | 5 | yes |
| 5.3 | what-claude-code-actually-does | What Claude Code actually does | 6 | |
| 5.4 | after-hand-off | What to do after hand off | 8 | yes |
| 5.5 | when-it-breaks | When it breaks (and it will) | 10 | |
| 5.6 | the-three-files | The three files | 6 | |
| 5.7 | the-whole-workflow | The whole workflow | 6 | yes |

**5.1** Slide text as is. **5.2** Slide text as is, including "Locate this button before you start building". **[changed]** Check the menu path: you found Handoff under Export, the slide says Share. *Screenshot needed.*

**5.3** Four slide points as is: agent not chatbot; splits into index.html, styles.css, script.js; works on its own; errors are normal, type "continue".

**5.4** The four slide steps with both prompts copyable: "Reconstruct this design into a working website. Split it into index.html, styles.css and script.js, and make sure it actually runs." and "Make the sign-up form really save what people type."

**5.5** The four slide steps: Read the red; press F12, open Console; give Claude the whole story; reload and check. **PromptPractice** task `bug-report`: given a broken sign-up button and a console error, write the message you'd send Claude. Anchors: pastes the exact error, says what was clicked, says what was expected.

**5.6** The three file descriptions as on the slide, then **CheckYourself** with the four slide questions: which file for the button text, which to make it orange, which to make it do something, and point at one line you didn't write and explain it.

**5.7** Design, Build, Deploy as on the slide, with the tiiny.host prompt copyable. "Your Turn!" becomes a TryIt.

**Challenge (slide homework):** Finish your website. Optional: build a tool that automates something annoying in your school life (school portal grade alerts, study plan from a test schedule, free classroom finder). **[solo version]** Remove the DM instruction; keep "publish with tiiny.host or screen-record it working on localhost."

**Changes after review (26 Sep 2026):**

- [changed] 5.1: gets the Claude Design video from Module 3's slide 5. The slide image isn't used (a low-resolution video thumbnail showing a sample name).
- [changed] 5.2: the old Share-menu screenshot is replaced with a new screenshot of the Hand off to Claude Code window (handoff-dialog.png). A Placeholder keeps the note to check the menu path in the live app.
- [changed] 5.2: the slide says the handoff "sends your finished design straight into Claude Code". The current Hand off to Claude Code window (screenshot: public/lessons/module-5/handoff-dialog.png) gives you a prompt to copy instead ("Open Claude Code and paste in this prompt."). The lesson now says: open Claude Code in your project folder, paste the prompt, and Claude Code fetches the design; it keeps the slide's point that the handoff is the bridge between the two tools. 5.4's opening line follows from this.
- [added] 5.2 Stuck answer "Claude Code says it can't reach the design": connect Claude Code to Claude Design once (the command Claude Code suggests, then /design-login, then restart), or use the menu's **Project archive** option ("Every project file, zipped"; called Download project as .zip on slide 3 and in older versions) and put the files in the project folder. The name follows the live app. "In the top right" is dropped until the live app is checked. The Share menu stays only as a Stuck fallback.
- [changed] 5.5: the invented Tip "Claude can't see your screen" is removed (also from the bug-report mock's feedback). The console error is shown in a copyable console block.
- [changed] 5.6: "answer these out loud" becomes "answer these", to match the quiz's "answer in your head first".
- [changed] 5.1: a Tip claiming Module 1's prompting advice carries over to Claude Design is removed.
- [added] 5.1 "front end" gloss and video lead-in; 5.2 opening line ("Claude Design makes your site look right. Claude Code makes it work."); 5.3 "A chatbot tells you what to change. An agent makes the change."; 5.4 "Don't skip step 4" and a caption noting the pictured prompt is shorter; 5.5 the practice scenario (a sign-up button that does nothing and one console error), which the bug-report task needs; 5.6 the open-ended answer to question 4; 5.7 localhost gloss ("your own computer, running your website") and access line for tiiny.host.

---

## Module 6: Introduction to GitHub and Vercel
*Storing, sharing and publishing your code*
Source: LaunchLab 6

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 6.1 | what-is-github | What is GitHub? | 5 | |
| 6.2 | key-terms | Key terms | 8 | |
| 6.3 | push-vs-pull-request | Push vs pull request | 5 | |
| 6.4 | intro-to-vercel | Intro to Vercel | 5 | |
| 6.5 | get-your-code-into-github | Step 1: get your code into GitHub | 10 | yes |
| 6.6 | connect-to-vercel | Step 2: connect to Vercel | 8 | yes |

**6.1** Store, Share, Collaborate as on the slide. KeyTerm: repository. *Image needed: "How It Works" and "How a Repository Looks".*

**6.2** The six terms grouped as on the slide (grab an existing project: fork, clone; save and upload: commit, push; combine work: pull request, merge), each as a KeyTerm. **CheckYourself**: match each term to its meaning. (The slide homework says to review these terms; "VERY IMPORTANT!")

**6.3** The slide's two-column comparison as is.

**6.4** Connect, Deploy, Preview, and "What's the difference between GitHub and Vercel?" as on the slide, including "This is similar to tiiny.host!"

**6.5** The three slide steps with the Claude Code prompt copyable: "Push this project to Github. Initialise a git repo, commit everything with a clear message, and push it to [paste your repo URL]." Keep the "Using Lovable instead?" box. **[changed]** Add a HeadsUp: never put passwords, API keys or personal details in a public repo. Recommend private repos for under-18s (the slide says "keep it Public").

**6.6** The three slide steps, including "sign up using your GitHub account, not email", and the "From now on, you never upload anything again" box.

**Challenge (slide homework):** Find an open source project on GitHub that interests you. Fork it and deploy it to Vercel. Review today's key terms.

**Changes after review (26 Sep 2026):**

- [changed] 6.5: repos are Private (the slide says keep it Public), because learners are under 18. Step 1, the HeadsUp and the recap all say so.
- [added] Module 6 Challenge: a fork of a public project stays public, which is fine because it's someone else's open code; the Private rule is for your own projects.
- [changed] 6.5 and 6.6: signing in to GitHub and Vercel (with a GitHub account) is done in a session, with the teacher's go-ahead, matching the access page.
- [changed] 6.5: the Task slide's text opens the lesson, and the "Using Lovable instead?" box sits before step 1 (with its own access line).
- [changed] 6.3: small grammar fixes to the slide text.
- [changed] 6.1: the slide 5 repository screenshot (a tutor's username, photo and private repos) isn't used; a screenshot slot asks for one from a neutral account.
- [added] 6.1 glosses (codebase, repo, history) and the "How it works" lead-in; 6.2 "locally" gloss, "a commit on its own isn't on GitHub yet", six scenario CheckYourself questions; 6.3 branch gloss (from Module 7's slide) and a closing line; 6.4 the tiiny.host comparison line; 6.5 "a public repo can be seen by anyone"; 6.6 open source gloss ("a project whose code is shared publicly for others to use") and a Challenge reminder about secrets.

---

## Module 7: GitHub Branching and Collaboration
*Working on one project without overwriting each other*
Source: LaunchLab 7

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 7.1 | key-terms | Key terms | 6 | |
| 7.2 | branch-vs-fork | Branch vs fork | 4 | |
| 7.3 | make-your-own-branch | Step 1: make your own branch | 8 | yes |
| 7.4 | pull-request-and-merging | Step 2: pull request and merging | 8 | yes |
| 7.5 | merge-conflicts | Merge conflicts: you will hit one | 8 | |
| 7.6 | recreate-wordle | Task: recreate Wordle | 15 | yes |

**7.1** Branch, Main, Switch, Merge conflict, grouped as on the slide ("Your own lane", "Moving between lanes", "Joining lanes back together"). *Image needed: "How Branching Works" diagram.*

**7.2** The slide's two-column comparison, including "You've done this: last week's homework".

**7.3** Both tracks from the slide: GitHub steps, and the Claude Code prompts ("Create a branch called [your branch name] and switch to it." / "Commit all the changes in this session to the branch and push it to GitHub.").

**7.4** The three slide steps, keeping "step two can only be done by you, not Claude."

**7.5** Why it happens, what it looks like (the Wordle `<h1>` conflict example as a code block), how to fix it, and the escape-hatch prompt copyable. **CheckYourself**: shown a conflict, which version is main and which is your branch? Slide videos *(links needed)*.

**7.6** **[solo version]** The slide task is teams of three in breakout rooms. Website version: "Be your own team." Make three branches (board, keyboard, game logic), connect Vercel at the start, and keep the slide's must-haves adjusted for one person: never push straight to main; push each branch at least twice; merge at least two pull requests. Change the page title on two branches on purpose so you hit (and fix) a merge conflict. Add a box: "Doing this with friends? Follow the original team rules": repo owner adds collaborators under Settings → Collaborators; one person each on board, keyboard and logic.

**Challenge (slide homework):** Finish your Wordle. Then write a one-line idea for your final project. **[solo version]** Remove the DMs; the idea goes into your own notes and carries into Module 9.

**Changes after review (26 Sep 2026):**

- [added] 7.6: where the solo conflict appears (GitHub shows "This branch has conflicts that must be resolved" on the second pull request) and two ways to fix it: GitHub's **Resolve conflicts** button for simple conflicts in the browser (steps checked against GitHub's docs, "Resolving a merge conflict on GitHub"), or the slide's escape-hatch prompt in Claude Code.
- [changed] 7.5: adds slide 7's editor screenshot of a real conflict (another project, with a branch called develop) under "What it looks like". The marker-order bullets apply to the Wordle example only.
- [changed] 7.4: "It's that easy." sits inside the callout with the rest of the slide sentence.
- [added] 7.4 a line saying "step two" means this whole lesson; 7.5 the lead-in to the conflict example, the worked fix ("those five lines become one") and the CheckYourself answers; 7.3 a pointer from the GitHub track to the Claude Code push prompt; 7.6 "the conflict shows up on the second pull request"; sign-in Stuck answers matched to the access page.

---

## Module 8: Authentication and APIs
*Live data, and remembering who's there*
Source: LaunchLab 8

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 8.1 | what-your-site-cant-do | Two things your site still can't do | 5 | |
| 8.2 | what-an-api-is | What an API actually is | 5 | |
| 8.3 | put-live-data-on-your-page | Task 1: put live data on your page | 10 | yes |
| 8.4 | how-logging-in-works | How logging in works | 8 | |
| 8.5 | creating-login-with-supabase | Creating login with Supabase | 15 | yes |

**8.1** The two points and "Today you fix both" as on the slide. Supabase sign-up moves to 8.5 so it happens right before it's used.

**8.2** The door analogy. KeyTerm: API. Slide video *(link needed)*. **TryIt, no account needed:** open the open-meteo URL in your browser and see the raw data Singapore's weather comes back as.

**8.3** The three slide steps with the exact open-meteo prompt copyable, plus the slide's note about linking the right repo and pushing.

**8.4** Sign Up, Log In, Log Out, "What a token is" ("a temporary sticker that says 'this is James'") and "Logging in is just an API call!" as on the slide. KeyTerms: token, authentication. **CheckYourself**: what happens to your token when you log out?

**8.5** Supabase sign-up (from 8.1), then the eight setup steps and the login prompt copyable, and the "This will add" list. **[changed]** Add a HeadsUp: turning off "Confirm Email" is fine for practice but not for a real app, and use a test email.

**Challenge (slide homework):** Work on your final project. **[changed]** Self-paced learners haven't reached Module 9 yet, so this becomes: build a very simple site with working sign-up, log-in and log-out using Supabase (the Blueprint version), then carry on to Module 9. *Confirm with the team.*

**Changes after review (26 Sep 2026):**

- [changed] 8.3: "fork the team wordle project" becomes "Open your Wordle project, or any project": learners own their Wordle on this site, and GitHub can't fork your own repo into your account. Slide typos fixed ("update your site", "Singapore"); the URL is joined onto one line.
- [changed] 8.5: the Supabase sign-up (with GitHub) is done in a session, with the teacher's go-ahead, matching the access page. "Ask your tutor" becomes "In a Code for All session, ask your tutor".
- [added] 8.1 opening and closing lines; 8.2 API KeyTerm (from slides 2 and 3), "the API is the messenger" gloss, "DB is short for database", diagram caption; 8.3 Stuck answers from the slide note and the access page; 8.4 Authentication KeyTerm (from slides 2 and 6) and two more CheckYourself questions answered from the lesson; 8.5 "keep the key and ID handy", the instruction to swap in your own values, and a pointer to the Task 1 project.

---

## Module 9: Project ideas and drafting
*The start of your final project*
Source: LaunchLab 9

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 9.1 | what-is-dns | What is DNS? | 5 | |
| 9.2 | domains-and-deployment | Domains and deployment | 6 | |
| 9.3 | search-engine-optimization | Search engine optimization | 8 | |
| 9.4 | getting-users | Getting users | 8 | |
| 9.5 | choosing-your-project | Choosing your project | 6 | |
| 9.6 | project-requirements | Requirements | 5 | |
| 9.7 | plan-and-get-to-work | Plan it and get to work | 6 | |

**9.1** "The phonebook of the internet" definition as on the slide. KeyTerm: DNS. Video *(link needed)*.

**9.2** Buying a domain through Lovable or GoDaddy, when .com vs .org or .edu; deployment options. Videos *(links needed)*. HeadsUp: a free Vercel subdomain is fine; buying a domain costs money, so ask a parent first.

**9.3** SEO definition and the four key components (on-page, off-page, technical, content quality) as on the slide. Video *(link needed)*.

**9.4** Google Ads, email automation, affiliate marketing, social media marketing and SMMA, one short section each, as on the slides. Link back to "What can you build" in 1.2 instead of repeating it.

**9.5** "You have a few choices": business-forward product vs social impact product, and "Challenge yourself. Don't pick low hanging fruit". **[solo version]** "Split up into groups of 3" becomes "work alone or with friends". **[changed]** "you may actually use this to start your own business and make money" becomes an optional note, not the main pitch.

**9.6** The six requirements as on the slide. **CheckYourself**: three example ideas; which meet the requirements?

**9.7** Miro board to clarify ideas, then a shared Google Drive with a master doc and task sheets.

**Challenge (slide homework, word for word):** Write your project brief, then build a working prototype that proves the hardest part of your idea works. Don't build the easy stuff yet…

---

## Module 10: Publishing + final showcase
*Ship it and show it*
Source: LaunchLab 10 (image-only slides), plus the Blueprint rubric and schedule

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 10.1 | ship-it | Ship it | 8 | yes |
| 10.2 | what-a-finished-project-looks-like | What a finished project looks like | 8 | |
| 10.3 | show-your-work | Show your work | 6 | |
| 10.4 | next-steps | Next steps | 3 | |

**10.1** Deploy live (Blueprint Week 10). Checklist from rubric criterion 1: live at a working URL, loads on phone and laptop, no broken pages or links.

**10.2** The Blueprint's five final-project criteria as a self-check: it ships; it solves something real; it works end to end; AI-assisted workflow; craft and version control. Worded as questions ("Can you show a prompt that failed and how you fixed it?"), with no points or score bands.

**10.3** **[solo version]** The class pitch becomes: record a 5-minute demo of your project (Blueprint Week 10 length) and show it to someone. *The pitch slides are image only; content needed.*

**10.4** Yibo's closing line from the last slide ("I hope you continue to learn more about AI dev and build something meaningful.") and the Blueprint homework: try to get more users.

**Module 10 needs the most new content**: the deck is almost entirely images.

---

## Quizzes and Check your skills [added]

Not in the slides. Added 26 Sep 2026 so learners can check what they've understood.

- **Module quizzes** (Modules 1 to 8): `content/module-N/quiz.yml`, 8 questions each, drawn only from that module's lessons, each linked to the lesson that teaches it. Mostly situations, not definitions; one clearly correct answer; wrong options are real beginner mistakes. Each quiz was written by one agent and checked by another against its lessons. Shown after the module's last lesson, before Module complete. No locking, points or grades.
- **Check your skills** (after Module 5 and after Module 8): a mixed quiz of 8 questions, drawn fresh each attempt: after Module 5, spread over Modules 1 to 5; after Module 8, 5 from Modules 6 to 8 and 3 from Modules 1 to 5, plus an unscored build checklist from the final-project rubric in the Blueprint (the source file's "Assessment": it ships; it solves something real; it works end to end; AI-assisted workflow; craft and version control), using 10.1's checklist for "it ships" and 10.2's "Can you show a prompt that failed and how you fixed it?". Minimal wording beyond the rubric: "Can you say who, and how?", "Can you explain how you used AI to build it?", "Have you taken care over the details, so it looks and works the way you meant?", "like a GitHub repository". The page after Module 5 says version control comes later.

## Practice tasks (PromptPractice)

Each task's grading anchors come straight from the slides.

| Task ID | Lesson | Task | Specificity | Context | Scope |
|---|---|---|---|---|---|
| about-me-prompt | 1.4 | Write a Lovable prompt for your own About Me site | Names the pages and features it needs | Says who it's for (Target audience) and the design style | Asks for one site, with a clear output |
| refine-request | 2.3 | Ask Claude to improve your prompt from 2.2 | Says what the site should include | Says who it's for and how it should look ("clean, not too AI-generated") | Pastes the original prompt and asks for a revision, not a new idea |
| bug-report | 5.5 | Tell Claude about a broken sign-up button | Pastes the exact error | Says what was clicked | Says what was expected to happen |

Common misses for about-me-prompt come from the slide's bad and better examples: no audience, no pages listed, vague style words like "modern" or "nice".

---

## What's needed from the team

1. **Slides as PDFs.** In each deck: File → Download → PDF. Put all 10 in `source/slides/` in the repo. That gives Claude Code the image-only slides (Lovable stats, diagrams, screenshots) and the video links that didn't come through as text.
2. **Video links.** Get Started With Lovable; Claude in Chrome; the Module 7 Git videos; the Module 8 API video; the Module 9 DNS, domain, deployment and SEO videos. The PDFs may carry these; if not, send them.
3. **Snapiq story.** A paragraph from Yibo on his Snapiq journey (Module 3), and his OK to feature it.
4. **Permission to name tutors.** The slides name Yibo, Rishabh and Nirvan. On a public site, get their OK first or leave names out.
5. **Module 10 content.** What the pitching, feedback and next-steps slides actually say.
6. **Approval.** Rishabh is reviewing; every module is marked "Not approved" in the sheet. Build now, but get sign-off before the site goes public.
7. **Access decision.** How under-18 learners get hands-on access (affects 2.3, all Claude Code lessons, and the Access page).

---

## Build order

One module at a time: write the lessons, check them on the site, commit, then the next module.

1. Restructure the site: Parts become Modules, three phases on the homepage, and the two new components (CheckYourself, Challenge).
2. Module 1, including the about-me-prompt practice task.
3. Modules 2 to 5 (Phase 1). Module 5 is nearly word for word from its slides, so it's quick.
4. Modules 6 to 8.
5. Modules 9 and 10, once the missing content arrives.
