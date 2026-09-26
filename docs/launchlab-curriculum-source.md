# LaunchLab curriculum: source content by module

Extracted 25 Sep 2026 from the lesson decks linked in "LaunchLab CFA 2026-2027", the "CFA LaunchLab Blueprint" doc and the "LaunchLab Module Breakdown" doc.

This is raw material for the Code for All website. It is not website copy yet. Each module lists what the slides actually say, then flags anything that conflicts between sources, doesn't work self-paced, or needs checking before it goes public.

Slides that were image-only (screenshots, stats, videos) are marked **[image only]**. Their content didn't come through as text, so someone needs to screenshot or describe them.

---

## Sources

| # | Module | Deck | Status in sheet |
|---|---|---|---|
| 1 | Intro to Lovable | LaunchLab 1 | Completed, not approved |
| 2 | Applying Lovable | LaunchLab 2 | Completed, not approved |
| 3 | Introduction to Claude Code | LaunchLab 3 | Completed, not approved |
| 4 | Claude skills + Claude in Excel | LaunchLab 4 | Completed, not approved |
| 5 | Claude Design | LaunchLab 5 | Completed, not approved |
| 6 | Introduction to GitHub and Vercel | LaunchLab 6 | Completed, not approved |
| 7 | GitHub Branching and Collaboration | LaunchLab 7 | Completed, not approved |
| 8 | Authentication and APIs | LaunchLab 8 | Completed, not approved |
| 9 | Project ideas and drafting (+ mini-demo) | LaunchLab 9 | Under review |
| 10 | Publishing + final showcase | LaunchLab 10 | Under review |

Not extracted: the "Old" deck (Branching + n8n), and the extra decks for Project sharing and feedback, SEO and Marketing, and DNS/deployment work day. The sheet marks the 10 modules above as the current plan, and the Module Breakdown doc already summarizes those three extras.

Program facts from the Blueprint: free, 10 weeks, 1.5 hours per session, online on Zoom, tutors Yibo Yang, Nirvan Anand and Rishabh Modi, mixed skill levels, needs a laptop ("tablets and phones will not work for most sessions"), and "No AI subscriptions are needed. Claude Code will be provided by CFA."

---

## Module 1: Intro to Lovable

**Big idea:** vibe coding means building software by telling an AI what you want. The skill is asking well.

**How the course works**
- Hands-on first: short lessons, hands-on activities, homework to apply it.
- Build to launch: make a product, use SEO, market it.

**Vibe coding in three steps**
1. Describe: turn your product requirements into clear, conversational prompts. You define the rules; AI defines the architecture.
2. Build: AI interprets the requirements and generates the code, database and layout.
3. Launch: review the prototype, tweak features, sync with production tools, push to hosting.

**Lovable:** open it and experiment. **[image only: Lovable screenshots, "Lovable Stats", website traffic example]**

**What can you build:** apps, Chrome extensions, websites, trading algorithms. Example: Snapiq Chrome extension (snapiq.tools), built by tutor Yibo.

**Getting users:** SEO, Google Ads, social media marketing, word of mouth.

**The art of prompting** (the strongest teaching content in the whole course)
- Bad: "Create a website for my course"
- Better: "Create a modern website for my coding course with a homepage and lessons."
- Strong, broken into parts:
  - Role: You are an expert educational web designer and full-stack developer.
  - Goal: Create a responsive website for a 15-lesson course called "Vibe Coding: Build Apps with Lovable & GitHub."
  - Target audience: high-school and early-college students with little to no coding experience.
  - Core pages: landing page, curriculum page, lesson page template, about page, resources page.
  - Design style: modern, playful and approachable; light background, bold headings; friendly typography, not corporate.
  - Output required: folder structure, core page code, reusable lesson template, brief explanation of design decisions, easy to expand with more lessons.
  - Key features: clean student-friendly UI, clear call-to-action buttons, mobile-first, easy navigation between lessons.

**Ethical considerations**
- Input bias: don't let your prompt reflect your own bias.
- Representative: a tool like ChatGPT should represent a wide range of human perspectives.
- The amplification loop: people who repeatedly use biased AI tools become more biased themselves.

**Activity:** design an "About me" website in Lovable.
**Homework:** watch "Get Started With Lovable".

**Flags**
- The amplification-loop slide says "studies prove". Soften that or cite the study before publishing.
- The strong prompt is excellent. It's a ready-made practice exercise and grading anchor.

---

## Module 2: Applying Lovable

**Big idea:** build with a purpose, and use Claude to sharpen a prompt before giving it to Lovable.

**Group builds:** Group 1 personality quiz, Group 2 news website, Group 3 online store.

**Solo sprint**
1. Draft a detailed prompt describing the site.
2. Paste it into Lovable.
3. Save your exact prompt in a notes file for later edits.

**Using AI to make better prompts**
1. Open Claude (website or desktop app).
2. Sign in. The slide says "You can use any email address to sign in because the free tier subscription also works for this."
3. Ask it to revise your prompt. Example given: "Help me revise my prompt for Lovable to create a website for my vibe coding academy. The site should include module info, exercises, and walkthroughs. I am tutoring high school students — it should look clean, not too AI-generated. Include working sign in and sign out. Help with design too. [Original prompt here]"

**Using refined prompts**
- Be specific about layout, colours and audience.
- Check the prompt has the elements you want.
- Paste into Lovable, starting with: "This is a refined prompt, make the required changes: "

**Activity:** 30 minutes in breakout rooms, post the link in #socials on Slack, then browse the gallery.

**Homework (conflict)**
- Slides: build a Lovable site that predicts or forecasts something real (stock direction, weather predictor), pull real data if possible, show your prediction reasoning.
- Blueprint and Breakdown: build a site that does something useful for one specific group (a school sports score tracker, a "where to eat in Singapore" tool).

**Flags**
- **Under-18 accounts.** "Sign in with any email, the free tier works" tells students to make their own Claude account. Claude accounts are 18+. This slide needs to change before the course runs with under-18 students, and it must not go on the public site as written.

---

## Module 3: Introduction to Claude Code

**Big idea:** move from building in a browser to building on your own machine with an AI agent.

**What Claude Code is:** an agentic, terminal-based coding tool. It reads whole codebases, runs shell commands and debugs failures, rather than just autocompleting.

**Where it runs:** the terminal, the VS Code extension, the desktop app. (The slide says the VS Code extension needs the command-line version installed.)

**What it can do**
- Routines: repeated background tasks. "Check this folder for errors every hour." "Clean the files, test the code, then generate a report."
- Refactoring: "Rename this variable everywhere it appears." "Make this code easier to read while keeping the same functionality."
- Session context: it keeps track of what commands ran, what errors happened, what files changed and what you were trying to fix.

**Claude Design** **[image only]**

**Activity:** install Claude Code on your computer and pick a Chrome extension idea.

**Yibo's journey with Snapiq** **[image only]**

**Quick business lesson:** it's 30% idea, 70% execution. First-time founders hide their ideas; second-time founders tell everyone. People rarely steal ideas, and most good ideas already exist.

**Homework:** build a Chrome extension with Claude Code (screenshot tool, tab organizer, YouTube speed controller, word highlighter). It must install and work. Bonus if it solves a problem you actually have. (Consistent across all sources.)

**Flags**
- "109K+ active developers" for the VS Code extension and "Integrated Environments" wording are unverified and will date quickly. Drop the number.
- The "What is Claude Code" copy is dense ("proactively debugging failures", "absolute syntax integrity"). Rewrite in plain language for the site.
- Install steps aren't in the deck ("Instructions" is image only). Use the current official install commands.

---

## Module 4: Claude Skills + Claude in Excel

**Homework review:** demo your Chrome extension. Does it install cleanly? What problem does it solve? What was the hardest part to get working?

**What Claude Skills are**
1. Reusable instructions: teach Claude your workflows, guidelines or preferences once.
2. On-demand loading: Claude loads the relevant skill only when it's needed.
3. Consistent outputs: the same format and quality every time without re-prompting.

**How to set up a skill (per the slides)**
1. Go to Settings on Claude.ai.
2. Click "Add Skill" under Customize.
3. Upload your SKILL.md file.
4. Attach it to a project so it loads automatically.

**Plugins** **[image only]**

**Claude in Excel:** write, fix and explain formulas in plain English; summarize trends and flag anomalies; trace logic errors.

**Claude in Chrome:** extension download and video **[image only / links]**

**Activity (from Breakdown):** set up Claude in Excel, pull data from the Slack Announcements channel, and write up whether a given stock is worth buying.

**Homework (three-way conflict)**
- Slides: experiment with Claude in Excel and build a Claude skill. DM it to a tutor.
- Blueprint: use real-world data to surface a pattern people don't know about (one-hit wonders by genre, happiness vs freedom, NBA upsets by time of day). Output a chart and a one-paragraph finding in your own voice.
- Breakdown: build a tool that automates something annoying about school.

**Flags**
- Skill setup menu paths change often. Verify against the current Claude help center before publishing.
- Claude in Excel and Claude in Chrome availability depends on plan. Confirm what CFA-provided accounts include.
- "Is this stock worth buying" for minors: I'd reframe as "explain what these metrics say about the company", not a buy decision.
- The Blueprint homework (surprising pattern + chart + your own paragraph) is the strongest of the three.

---

## Module 5: Claude Design

**Big idea:** design the front end without code, then hand it to Claude Code to make it real.

**Design first:** Claude Design builds the visual shell. Describe how you want it to look.

**Export your design:** open Share (top right), find "Handoff to Claude Code…". It sends the design into Claude Code, which builds a real site. Find this button before you start; it's easy to miss.

**What Claude Code actually does**
- It's an agent, not a chatbot: it works directly on the files on your computer.
- It splits your design into index.html, styles.css and script.js.
- It works on its own: runs commands, reads files, decides next steps.
- Errors are normal. If you hit an API limit error, type "continue".

**After handoff**
1. It waits for you to give an instruction.
2. Tell it to build: "Reconstruct this design into a working website. Split it into index.html, styles.css and script.js, and make sure it actually runs."
3. Watch it work. Hit an error? Type continue.
4. Make it actually work: "Make the sign-up form really save what people type."

**When it breaks (and it will)**
1. Read the red. Don't panic. An error names the file and line.
2. Press F12, open Console. Red text is your real error. This is the first thing engineers look at.
3. Give Claude the whole story: paste the exact error, say what you clicked and what you expected.
4. Reload and test the exact thing that broke. Still broken? Say so and go again.

**The three files**
- index.html: the words and structure.
- styles.css: the look, and how it changes on phone vs laptop.
- script.js: the behaviour, what happens on click, type or submit.

Check questions: Which file changes the text on your main button? Which makes it orange? Which makes it do something when clicked? Point at one line you didn't write and say what it does.

**The whole workflow:** Design (Claude Design) → Build (Claude Code) → Deploy (localhost or tiiny.host). For tiiny.host: "Put all my website files into one folder and zip it, with index.html at the top level, so I can upload it to tiiny.host."

**Homework:** finish your website. Optional: build a tool that automates something annoying in your school life. DM your link or a screen recording to a tutor.

**Flags**
- Best-written deck in the set. The "When it breaks" and "three files" slides can go on the site almost as is.
- The sheet calls this module "Claude Design"; the Breakdown calls it "Project Day with Claude (+ First Mini-Demo)" with a Slack-wrapper worked example. Pick one.
- Handoff menu location ("Share menu") may differ from the current UI. You found it under Export. Verify the path.

---

## Module 6: Introduction to GitHub and Vercel

**What GitHub is:** store (your files and history live in a repository), share (make work public), collaborate (work together without overwriting each other).

**Key terms**
- Fork: your own copy of someone else's repo on your account.
- Clone: copy a repo onto your computer.
- Commit: save a snapshot with a short note. Saves locally, not on GitHub.
- Push: send your commits up to GitHub.
- Pull request (PR): propose changes and ask teammates to review.
- Merge: approve a PR and combine it into the main project.

**Push vs pull request**
- Push: uploads straight to the repo, no review. Use when solo or on your own branch.
- Pull request: asks others to review first. Use on a team or someone else's project.

**Vercel:** connect your GitHub repo once; every push redeploys the live site; every PR gets a preview link. GitHub stores code; Vercel turns it into a live website.

**Step 1, get your code into GitHub**
1. github.com → New repository → name it, keep it Public, Create.
2. Give Claude Code the repo URL: "Push this project to Github. Initialise a git repo, commit everything with a clear message, and push it to [your repo URL]."
3. Refresh the repo page to check.
- Using Lovable? Settings → GitHub → Connect does it for you.

**Step 2, connect to Vercel**
1. Sign up at vercel.com with your GitHub account, not email.
2. New Project → Import Git Repository → pick the repo.
3. Deploy. You get a public link.

**Task:** push your latest Claude or Lovable project to GitHub, then deploy on Vercel.

**Homework (three-way conflict)**
- Slides: fork an open source project, deploy it to Vercel, review today's terms.
- Blueprint: open a real, thoughtful GitHub issue on an open source project.
- Breakdown: copy an open source project, deploy it, add two members, watch a backend-on-Vercel video.

**Flags**
- **"Keep it Public"** for students: a public repo shows their GitHub username and anything they commit, including accidentally committed keys or personal details. Add a line on never committing passwords or keys, and consider private repos for under-18s.
- Check GitHub's and Vercel's own age requirements for the student group.

---

## Module 7: GitHub Branching and Collaboration

**Key terms**
- Branch: your own parallel copy of the code inside the same repo.
- Main: the default branch Vercel puts live.
- Switch: jump between branches (older tutorials say checkout).
- Merge conflict: two branches changed the same line and Git needs a human to choose. Totally normal.

**Branch vs fork**
- Fork: lives on your account, separate from the original. For projects you're not part of.
- Branch: lives inside the shared repo. For working with your team.

**Step 1, make your branch**
- GitHub: branch dropdown (says main) → type a name like alex-keyboard → Create branch.
- Or with Claude Code: "Create a branch called [name] and switch to it." Build as normal. Then: "Commit all the changes in this session to the branch and push it to GitHub."
- After pushing, a yellow "Compare & pull request" banner appears.

**Step 2, pull request and merge**
1. Click the banner, write one line about your change, Create pull request.
2. A teammate checks Files changed (green added, red removed) and comments or approves.
3. Teammate clicks Merge pull request → Confirm. Vercel redeploys.
- Reviewing is a human job, but Claude can help you review a teammate's changes.

**Merge conflicts**
- Example conflict markers shown with two versions of an `<h1>`.
- Fix: keep one version or combine, delete the `<<<` `===` `>>>` lines, commit again.
- Escape hatch: "I have a merge conflict in [file]. Please help me resolve it and keep all features working."

**Videos** **[links only]**

**Task: recreate Wordle in teams of three**
- Repo owner adds teammates under Settings → Collaborators.
- Split: board, keyboard, game logic. Any tools allowed.
- Connect to Vercel at the start.
- Requirements: everyone works on their own branch, 2+ pushes per person, 2+ merged PRs per team.

**Homework (three-way conflict)**
- Slides: finish Wordle; owner sends Vercel and repo links (tutors check branch and PR history). Send a one-line final project idea.
- Blueprint: play with OpenClaw and Zapier, build one Zapier automation.
- Breakdown: explore n8n, build one working automation.

**Flags**
- Automation (n8n / Zapier) appears in two docs but not in the current slides. Decide whether it's in or out.
- The Wordle task is inherently a team exercise. Self-paced learners need a solo version, e.g. two branches of their own that conflict on purpose.

---

## Module 8: Authentication and APIs

**Two things your site still can't do**
1. It forgets everyone: no users, scores or saved games.
2. It only knows its own files: nothing live, like weather.
- An API lets your site borrow data from someone else. Authentication lets it remember who's there.

**Setup:** supabase.com → Start your project → Continue with GitHub. Set a database password (not your login password) and pick the recommended region.

**What an API is:** like a door. You knock with a request, it answers with data. You never see inside.

**Video** **[link only]**

**Task 1, live data**
- Open any project (e.g. fork your Wordle).
- Prompt: "When my page loads, fetch this URL: https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&current=temperature_2m and show the current temperature in a small box at the top of the page."
- Shows Singapore's live temperature on every reload.

**How logging in works**
- Sign up: creates a row in a user table with your email and a scrambled (hashed) password.
- Log in: checks email and password match, then hands your browser a token.
- Log out: throws the token away.
- A token is a temporary sticker that says "this is James". Your browser shows it on every request so you don't retype your password. It expires on its own.
- All three are just API calls.

**Supabase login steps**
1. Project Settings → API Keys → copy the Publishable Key.
2. General → copy the Project ID.
3. Authentication → disable "Confirm Email" → Save.
4. Prompt: "Add email signup, login and logout to this page using Supabase. Load supabase-js from https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2. Project URL: https://[your project id].supabase.co. Publishable key: [paste yours]. When someone is logged in, show their email and a log out button."

**Homework (conflict)**
- Slides: work on your final project.
- Blueprint and Breakdown: build a simple site with working Supabase login and logout.

**Flags**
- The open-meteo task is perfect for the site: no account, no key, instant result.
- The Breakdown lists REST, SOAP, GraphQL and API keys vs OAuth, which aren't in the slides. Good extension material for an advanced track.
- Disabling email confirmation is fine for a class demo but worth a "don't do this for a real app" note.
- Supabase and the site signup flow collect real emails. For under-18s, keep this to test accounts.

---

## Module 9: Project ideas and drafting

**DNS:** the phonebook of the internet, turning names like example.com into IP addresses. **[video link]**

**Domains:** buy through Lovable or a registrar like GoDaddy. ".com" usually works; .org or .edu for other reasons.

**Deployment:** Lovable's method, or the standard route. **[video: deploying to AWS]**

**SEO:** improving a site to rank in unpaid search results.
- On-page: keywords in titles, meta descriptions, headings, content.
- Off-page: authority and backlinks.
- Technical: crawlability, speed, mobile-friendliness.
- Content quality: genuinely useful content.

**Marketing channels:** Google Ads, email automation, affiliate marketing, social media marketing and SMMAs. (Repeats Module 1's "what can you build" and "Lovable stats" slides.)

**Choosing a project**
- Business-forward: Chrome extension, automation, SaaS, services.
- Social impact: help businesses, raise awareness.
- "Challenge yourself. Don't pick low hanging fruit."
- Groups of 3.

**Requirements:** clear goal and deliverables; legal and reasonable; needs fewer than 15 employees; real data behind any claims (publish code for predictions), no fake statistics; something you're interested in; real value, not just an information site.

**Organizing:** Miro board for ideas; shared Google Drive with a master doc and task sheets.

**Homework:** write your project brief, then build a prototype proving the hardest part works. Build the risky part first (AI feature, tricky algorithm). Skip styling and polish. (Consistent across sources.)

**Flags**
- This deck absorbs content the Breakdown splits into Lessons 11 (SEO and marketing) and 12 (DNS). Fine for a 10-week version, but it's a lot for one session.
- "This could become a real business" framing is motivating but should be optional for a free course aimed at younger learners.

---

## Module 10: Publishing + final showcase

Pitching order, general feedback, congratulations, next steps **[all image only]**. Closing: "Thank you all. I hope you continue to learn more about AI dev and build something meaningful." — Yibo

**Homework:** try to get more users (Blueprint).

**Assessment (from Blueprint):** weekly deliverables marked Not yet / Done / Done and shared. Final project out of 20: it ships, it solves something real, it works end to end, AI-assisted workflow, craft and version control (4 points each). Bands: 17–20 standout, 12–16 solid, 8–11 getting there, below 8 incomplete with a two-week extension.

**Flags**
- Almost no text content. The rubric is the real substance and would make a great "what a finished project looks like" page.

---

## Cross-cutting issues to resolve before publishing

1. **Under-18 access.** Claude accounts are 18+. Module 2 tells students to sign up themselves on the free tier, and the Blueprint promises "Claude Code will be provided by CFA." Both need an approved, compliant arrangement before the course runs with under-18s. Also check Lovable, Supabase, GitHub and Vercel age terms.
2. **Three homework versions.** Slides, Blueprint and Breakdown disagree on homework for Modules 2, 4, 6, 7 and 8. Pick one source of truth.
3. **Two course lengths.** The Blueprint and sheet say 10 weeks; the Breakdown says 13.
4. **Slack vs Discord.** The Blueprint says deliverables go on Discord in one place and Slack in another.
5. **"Practical exposure to machine learning"** is promised in the Blueprint but no module covers it.
6. **Laptop requirement.** The Blueprint says phones won't work. The site can be read on a phone, but builds need a laptop. Say so clearly.
7. **Tutor-dependent content.** Breakout rooms, group builds, Slack DMs to tutors, demos and pitching don't exist for a solo learner on the website.
8. **Approval.** Every module is marked "Not approved" in the sheet, and 9 and 10 are still under review.
