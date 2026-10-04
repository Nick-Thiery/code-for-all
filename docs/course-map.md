# Code for All course map (v1)

How the 10 LaunchLab modules become lessons on the Code for All website.

Companion file: `curriculum-source.md` (everything the slides say, module by module). This file says how that content is split, ordered and adapted. The source file is the content; this file is the plan.

---

## Rules for turning slides into lessons

1. **Follow the slides.** Lesson order matches slide order. Headings, examples, prompts and wording stay close to the slides. Where a slide gives an exact prompt, the lesson uses that exact prompt in a copyable block.
2. **The slides are the source of truth for homework.** Where the Blueprint or Module Breakdown disagree, use the slide version. Each module ends with a **Challenge** block holding the slide homework.
3. **One module = one unit on the site.** The site's "Parts" become "Modules" (URL `/module-1/<slug>`). Modules are grouped on the Contents page into three phases, taken from the Module Breakdown:
   - **Build with AI:** Modules 1 to 5
   - **Developer fundamentals:** Modules 6 to 8
   - **Your final project:** Modules 9 and 10
4. **Lessons are short.** Each 90-minute class becomes 4 to 7 lessons of 3 to 15 minutes.
5. **Only change what can't work on a website.** Group work, breakout rooms, Slack posts, DMs to tutors and live demos get a solo version, marked **[solo version]** below. Everything else stays as taught.
6. **Fix only what's unsafe or wrong.** Changes from the slides are marked **[changed]** with the reason. There are only a few.
7. **Hands-on lessons are flagged.** A lesson needing a Lovable, Claude, GitHub, Vercel or Supabase account shows "Hands-on: needs access". The reading part always works without one.

8. **Additions are recorded.** Teaching text that isn't on the slides but helps (a plain-English gloss, a connecting line, safety advice, Stuck answers taken from the lesson) is marked **[added]** below. Anything stated as fact must come from the slides, this map, or an official page that was checked.
9. **British spelling throughout**, including slide text and prompt blocks (organise, colour, analyse, optimisation), except "practice", spelt the American way as noun and verb (practiced, practicing). Button and menu names stay exactly as the product shows them (Customize, Authorize).

Component names below match the site: KeyTerm, Tip, HeadsUp, TryIt, Stuck, PromptPractice, command block, Recap. Two new ones are needed: **CheckYourself** (short quiz, answers revealed on click) and **Challenge** (the module homework).

---

## Module 1: Intro to Lovable
*Vibe coding, and why the way you ask matters*
Source: LaunchLab 1

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 1.1 | how-this-course-works | How this course works | 6 | |
| 1.2 | what-is-vibe-coding | What is vibe coding? | 8 | |
| 1.3 | meet-lovable | Meet Lovable | 20 | yes |
| 1.4 | the-art-of-prompting | The art of prompting | 15 | |
| 1.5 | ethical-considerations | Ethical considerations | 8 | |
| 1.6 | build-about-me | Task: design an "About me" website | 30 | yes |

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

**Changes after review (27 Sep 2026):**

- [changed] 1.4: the Bad, Better and Strong prompt blocks and the "What each part does" list become the prompt ladder (design board "Prompt ladder · lesson 1.4"): Bad and Better side by side, then the strong prompt in its seven parts, where tapping a part's label shows what it does. The three prompts and the seven explanations are word for word as before; only the Strong prompt has a Copy button now. The ladder keeps the slides' "Bad" (the design board says "Weak").
- [added] 1.4 ladder: the strength meter (Bad has 1 of the 7 parts, its goal; Better has 2, adding pages), the "It leaves out" / "Still missing" chips, the chip 'Design style ("modern" is vague)', "Tap a label to see what that part does." and the line "The strong prompt has seven parts, each with one job." (from the recap).
- [added] 1.2: the "Vibe coding in three steps" diagram (design board "1.2 · Vibe coding in three steps") after the three steps. Its card lines and caption are shortened from the lesson and the slide steps ("You say what you want, in plain words."; "The AI writes the code, the database and the layout."; "You review it, tweak it and put it online."; "You define the rules; the AI writes the code."), not the board's wording. The pictures (speech bubble, code hexagon, a page with a LIVE badge) are illustrations only.

**Changes after review (28 Sep 2026):**

- [changed] 1.6: the slide's example About Me site (a tutor's full name) is replaced by an example built for the course: a plain "first draft" About Me page for a made-up teenager, Kai, with hobbies only and no contact details (source/about-me-example/first-draft.html, captured to public/lessons/module-1/about-me-first-draft.png). A better version from a stronger prompt (better.html, public/lessons/module-2/about-me-better.png) is for the Module 2 gallery lesson. Neither is a real Lovable build.
- [added] 1.6 the two lines around the example ("Here's the kind of site a short prompt gets you" and "Look at how much it had to guess").
- [added] 1.1: a line on what a module is, the "in plain words" gloss under Build to launch, the device guide link, "You'll need" box mention, the cost line ("Everything in this course is free. Nothing will ever ask you for a bank card.") and the Help page under Getting help; the phase links point at the course grid (/contents#module-1, /contents#module-6, /contents#module-9).
- [added] 1.2: "In plain words" gloss under the three steps; glosses of SEO and word of mouth; the Chrome extension Term.
- [added] 1.3: "Lovable runs in your browser... access comes through your Code for All session" (cost); the "I only have a phone" Stuck answer; the You'll need box.
- [added] 1.4: glosses of "responsive", "UI" and "call-to-action buttons" after the strong prompt; the line that the practice prompt is saved on this device.
- [added] 1.5: the opening line defining bias, the "for boys who like games" example under Input bias and the "in plain words" line under Representative.
- [added] 1.6: the You'll need box, the PublishSafely reminder (replacing the earlier HeadsUp with the same content), and the saved About Me prompt with a sample (Kai's, hobbies only) when nothing is saved.

**Changes after review (4 Oct 2026): detailed step-by-step lessons.** Each lesson is expanded so a learner working alone knows exactly what to do. Lovable facts come from Lovable's official docs (docs.lovable.dev), checked on 4 Oct 2026 via the research brief and web search; each step links to the page it comes from. Slide prompts, homework, slide order and every existing component stay as they were. Durations in the table above are updated to match.

- [changed] 1.2: "about 19,300 visitors" becomes "about 19,300 visits", with a line that the picture is from an older Lovable that labelled the number "Visitors". Lovable's analytics now counts visits: "A visit is one browsing session, not one person." Alt text and caption say the same. Source: https://docs.lovable.dev/features/analytics
- [changed] 1.3: the projects screenshot's alt text and caption say it's from an older version of Lovable, and that projects are now under **Recents** and **Projects** in the sidebar (cards were redesigned on 18 Sep 2026). A `<Screenshot>` slot asks for a recapture. Sources: https://docs.lovable.dev/changelog, https://docs.lovable.dev/introduction/dashboard-overview
- [changed] 1.6: "Run the new prompt in Lovable" now says where: start a new project from the dashboard, not a follow-up in the first project's chat, so the first build stays for comparison (a whole new prompt as a follow-up would change the first site, and goes against Lovable's "one change per prompt"). It says each build uses credits. Sources: https://docs.lovable.dev/tips-tricks/from-idea-to-app, https://docs.lovable.dev/introduction/credits-and-usage
- [changed] 1.6 Challenge: after the video (kept, word for word homework), a line that it was made in August 2025 and that Agent mode is now Build mode and Visual edits is now the preview toolbar; where they differ, follow the module. Sources: https://docs.lovable.dev/features/agent-mode, https://docs.lovable.dev/features/preview-toolbar
- [added] 1.1: "How a lesson works" (You'll need box, steps, Stuck box, What you learned and the I've finished this lesson tick, progress saved on this device and Move my progress), the chapter-and-page comparison and a CheckYourself. Source: the site itself.
- [added] 1.2: an everyday comparison (ordering at a restaurant), a worked example of describe, build, launch for a small site, the "visits" Term, and a CheckYourself.
- [added] 1.3: numbered steps to start a first project: log in with session access, check the mode picker says **Build** (Chat and Plan don't build; Lovable remembers the last mode), send, pick one of three design directions or answer design questions and click **Submit** (no extra credits; skipped when the prompt describes the look), wait a few minutes, check the editor shows chat left and preview right. Example one-line ideas, labelled as examples. "Find your way around": the chat, the preview and its **Desktop view** / **Tablet view** / **Mobile view** switch, the preview toolbar (**Select elements**, **Edit text inline**, **Draw annotation**, **Add a comment**; it replaced Visual edits), the three modes. "Try the editor" (Mobile view, one small change, **Undo latest edit**, check it worked). "Undo a change" (**Undo latest edit**, **Revert to this version**, **History** with **Back to latest** and **Revert**; reverting doesn't refund credits). "Credits" (Free plan: 5 a day, up to 30 a month, no rollover, new credits at 00:00 UTC = 8am Singapore time; Lovable's illustrative costs; **More options** → **Credits used**; what's free; Plan mode 1 credit per message; access may differ from the Free plan). "Find your project again" (**Recents**, **Projects**, Ctrl+K / Cmd+K, rename via **⋯** → **Edit** → **Name**). Terms: mode picker, preview, credits. Sources: https://docs.lovable.dev/introduction/getting-started, https://docs.lovable.dev/introduction/dashboard-overview, https://docs.lovable.dev/features/design-guidance, https://docs.lovable.dev/features/projects/chat, https://docs.lovable.dev/features/projects/preview, https://docs.lovable.dev/features/preview-toolbar, https://docs.lovable.dev/features/agent-mode, https://docs.lovable.dev/features/chat-mode, https://docs.lovable.dev/features/projects/history, https://docs.lovable.dev/introduction/credits-and-usage, https://docs.lovable.dev/introduction/project-search-and-find
- [added] 1.3 Stuck answers: it started chatting (switch to Build, or **Start building**), three designs or design questions (normal; pick and **Submit**), a change made it worse (undo or revert), blank or stuck preview (**Refresh**, Shift + **Refresh**, Ctrl+Shift+R / Cmd+Shift+R, "The preview is white, investigate and fix it.", **Still building?** → **Keep building**), an error (**Try to fix** once or twice, then describe the bug, not "Nothing works, fix it!", then go back a version), out of credits (wait for 8am Singapore time; never upgrade or pay; Chat mode while its allowance lasts), can't find a project. Sources: https://docs.lovable.dev/features/projects/preview, https://docs.lovable.dev/prompting/prompting-debugging, https://docs.lovable.dev/introduction/credits-and-usage
- [added] 1.4: the birthday-cake comparison; "Before you write: four questions" and "More tips from Lovable's guide" (style words, real words not placeholder text, "Ask me any questions you need in order to fully understand what I want."); a worked example mapping the four questions onto the strong prompt's parts for a made-up teenager's About me site; a CheckYourself. Source: https://docs.lovable.dev/prompting/prompting-one
- [added] 1.5: a worked example of a biased prompt and the same prompt fixed (both labelled examples), a line on checking who a site shows, the music-app comparison for the amplification loop, and a CheckYourself.
- [added] 1.6: numbered steps for both builds with "You should now see…" lines and a "Check it worked" step; three example changed lines (design style, target audience, core pages), labelled as examples; how to compare (Recents, Mobile view); "Make small fixes" (one change per prompt, say what must stay the same, **Edit text inline**, **Undo latest edit**); an optional "Put it online" section (**Publish** next to **Share**, **Website URL** ending in lovable.app, security check, **Your website is live**, no credits from the dialog, Edit with Lovable badge, the live site is a snapshot so **Publish changes**, **⋮** → **Unpublish**, anyone with the link can visit on Free). You'll need now says credits for two builds and points back to lesson 3. Sources: https://docs.lovable.dev/tips-tricks/from-idea-to-app, https://docs.lovable.dev/prompting/prompting-one, https://docs.lovable.dev/features/publish, https://docs.lovable.dev/introduction/faq
- [added] 1.6 Stuck answers: it started chatting, pasted the changed prompt into the first project (undo, then a new project), ran out of credits before the second build, can't find the first build (Recents, search, rename), blank preview or error (points to lesson 3's Stuck box), publish blocked by build errors (**Try to fix**), live link shows the old version (**Publish changes**). Sources as above.
- Left unverified, so worded not to depend on it: the exact dashboard tab names and card look; how long a first build takes ("a few minutes"); the exact number of free inline text edits and **Try to fix** uses ("a limited number", "a few"); whether the Free monthly cap counts credits granted or used; the size of the daily Chat allowance; whether Code for All access (for example imagi Edu accounts) has the same credits and screens as the Free plan (1.3 says access "may come with a different allowance"). Lovable's illustrative credit costs differ between its pricing page and docs; the lesson calls them examples.

---

## Module 2: Applying Lovable
*Better prompts, real projects*
Source: LaunchLab 2

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 2.1 | todays-task | Today's task: pick your build | 8 | |
| 2.2 | solo-sprint | Solo sprint: build your first draft | 30 | yes |
| 2.3 | better-prompts-with-ai | Using AI to make better prompts | 20 | yes |
| 2.4 | using-refined-prompts | Using refined prompts | 25 | yes |
| 2.5 | gallery | Gallery | 15 | yes |

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

**Changes after review (28 Sep 2026):**

- [added] 2.1: "Pick the one you'd enjoy most", and the cost line (Lovable and Claude through Code for All access, nothing to install or pay).
- [added] 2.2: a gloss of "sprint" (the class's 20 minutes), the "Save it here" box for the exact prompt (on this device), You'll need box.
- [added] 2.3: a line on what Claude is; the saved solo-sprint prompt shown back (with a sample personality-quiz prompt when nothing is saved); the "Save it here" box for the refined prompt; You'll need box.
- [added] 2.4: the refined prompt shown back (with a sample); You'll need box.
- [added] 2.5: a HeadsUp that a shared link is public (no full name, school, address, phone number or photos), and an "in plain words" line under the Challenge.

**Changes after review (4 Oct 2026): detailed step-by-step lessons.** The lessons are expanded so a learner working alone knows exactly what to do. Lovable facts come from the research brief checked against docs.lovable.dev on 4 Oct 2026 (the docs site was blocked from the editing environment, so they weren't re-fetched); Claude facts were checked on support.claude.com the same day. Each step links the page it comes from.

- [changed] 2.3: the slide's example request to Claude says "Include working sign in and sign out." It now says "No login or database yet.", and its line in "What each part does" says it keeps the site simple and safe for now. Reason: in Lovable, asking for sign in switches on its built-in backend (Lovable Cloud) and creates a database of users, which would collect sign-ups' email addresses on a public site; Lovable's quick start advises "No login or database yet" ([Lovable Cloud](https://docs.lovable.dev/features/cloud), [Getting started](https://docs.lovable.dev/introduction/getting-started)). A HeadsUp explains the change to learners and points to Module 8. The rest of the slide prompt is word for word.
- [changed] 2.4: the slide's one way (paste the refined prompt into the first project with "This is a refined prompt, make the required changes: " in front, kept word for word) becomes "way 2: change your first draft", beside "way 1: a fresh project" (the refined prompt on its own, so the first draft stays as its own project). Reason: pasting a whole refined prompt as a follow-up goes against Lovable's "one change per prompt" advice, because a big prompt can make changes you didn't ask for ([From idea to app](https://docs.lovable.dev/tips-tricks/from-idea-to-app)). Way 2 says what to do when that happens (Undo latest edit, then one change per message). The screenshot Tip stays, as a backup, since History keeps the first draft ([Version history](https://docs.lovable.dev/features/projects/history)).
- [changed] 2.4 quiz question: "What goes in front of it?" now says the refined prompt is going into the chat of the first draft, because in a fresh project nothing goes in front.
- [changed] 2.5: now hands-on (`requiresAccount: true`, with a You'll need box), because it shows how to publish and share. The HeadsUp about public links becomes the PublishSafely reminder (same content) plus the line that on the Free plan anyone with the link can visit and the site can't be made private ([Publish](https://docs.lovable.dev/features/publish)).
- [changed] Durations: 2.1 8 min, 2.2 30, 2.3 20, 2.4 25, 2.5 15, to match the added steps.
- [added] 2.1: "What each site is" (what a personality quiz, news website and online store usually have, and who might enjoy each; make the shop up and leave out real payments), the essay-draft comparison under the loop diagram, a worked example of the module for the noodle quiz, and a CheckYourself.
- [added] 2.2: the seven strong-prompt parts as a checklist for step 1; Lovable's prompting tips (style words, "bold, saturated colours" over "colourful", real words not placeholder text, "No login or database yet", no personal details) from [Prompting 1.1](https://docs.lovable.dev/prompting/prompting-one) and [Getting started](https://docs.lovable.dev/introduction/getting-started); three example prompts built from the seven parts (personality quiz "Which noodle are you?", news website "The Weekly Byte" with "Example story" labels so made-up news doesn't look real, online store "Inkwell" with no real payments); numbered Lovable steps (dashboard prompt box, mode picker on Build, paste and send, design directions and Submit, the first build, editor with chat and preview, no save button, Mobile view, Check it worked) from [Getting started](https://docs.lovable.dev/introduction/getting-started), [Dashboard](https://docs.lovable.dev/introduction/dashboard-overview), [Design guidance](https://docs.lovable.dev/features/design-guidance), [Chat](https://docs.lovable.dev/features/projects/chat) and [Preview](https://docs.lovable.dev/features/projects/preview); the credits note (5 a day on Free, keep enough for one more build in 2.4) from [Credits](https://docs.lovable.dev/introduction/credits-and-usage); saving steps (notes file, the box, the first chat message, renaming the project from its card's ⋯ menu); "Look at your first draft"; a Screenshot slot for the design directions; Stuck answers for Chat mode, design directions, a blank preview, Try to fix, credits and finding the project ([Debugging](https://docs.lovable.dev/prompting/prompting-debugging)).
- [added] 2.3: "Why ask another AI?" (the friend reading your essay) and the "refined prompt" Term; three example messages to Claude, one per site, in the slide's pattern; numbered steps to send it (claude.ai or the desktop app, a new conversation, paste, replace "Original prompt here", submit, read the reply) from [Get started with Claude](https://support.claude.com/en/articles/8114491), with a note that Claude's design is changing ([What's changing](https://support.claude.com/en/articles/16761823)); asking for changes in the same conversation, with three example follow-ups ([Claude help centre](https://support.claude.com/en/articles/7996857)); attaching a screenshot of the first draft (**+** → **Add files or photos** → **Open**; JPEG, PNG, GIF, WebP) from [Uploading files](https://support.claude.com/en/articles/8241126); copying the refined prompt back by selecting it (no copy button is named, as none is documented); Check it worked; a Screenshot slot for Claude's start screen; Stuck answers for a long reply, added sign in or payments, a different-looking screen and a screenshot that won't upload.
- [added] 2.4: "How to check it" (layout, colours, audience, what you want, what you don't want including login and payments, personal details) and a before-and-after example line; numbered steps for both ways; example one-change messages that say what must stay the same ([From idea to app](https://docs.lovable.dev/tips-tricks/from-idea-to-app)); "Compare with History" (History, Bookmarks, a version's More actions → Open preview in new tab, Back to latest, don't Revert by mistake; credits not refunded) from [Version history](https://docs.lovable.dev/features/projects/history); Stuck answers for Chat mode, unwanted changes, a lost first draft, Try to fix and credits; a Screenshot slot for the History panel. 2.4 still has no diagram of its own (it stays one of the lesson-visuals test's exceptions): its new parts are steps, and a Screenshot slot renders nothing in production.
- [added] 2.5: a reading of change 2 in the example diagram and the spot-the-difference comparison; how to put the two versions side by side for each way; what to look at (pages, look, words, Mobile view) and a box to save the three changes (`gallery-changes`, on this device); a CheckYourself; "Show both to someone" (show your screen, or publish: Publish, Website URL ending lovable.app, security check, Your website is live, no credits, Edit with Lovable badge, Publish changes, Unpublish) from [Publish](https://docs.lovable.dev/features/publish); the optional preview link (Share → Share preview → Create new preview link, 7 days on Free) from [Share a project](https://docs.lovable.dev/features/share-project); a Stuck box (finding the first draft, spotting changes, build errors on publish, an out-of-date live link, unpublishing).

---

## Module 3: Introduction to Claude Code
*Building on your own computer with an AI agent*
Source: LaunchLab 3

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 3.1 | what-is-claude-code | What is Claude Code? | 8 | |
| 3.2 | what-it-can-do | What it can do | 12 | |
| 3.3 | install-claude-code | Task: install Claude Code | 30 | yes |
| 3.4 | quick-business-lesson | Quick business lesson | 7 | |
| 3.5 | plan-your-extension | Plan your Chrome extension | 20 | yes |

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

**Changes after review (28 Sep 2026):**

- [changed] 3.3: the three screenshot slots (download page, the desktop app's Code tab, a terminal after `claude --version`) become simplified drawings (components/diagrams/install-claude-code.tsx), labelled as drawings, not screenshots, so they never show an account and work in dark mode. The version string in the terminal drawing, 2.1.283, is what `claude --version` printed on 28 Sep 2026; the caption says yours will be newer.
- [changed] 3.4: "Snapiq: one tutor's journey" becomes "What Snapiq does": what the extension does (screenshots of lecture slides and web pages, merging several into one image to get round AI tutors' upload limits), that it's on the Chrome Web Store with a free weekly allowance and a paid Pro plan, and its rating (4.8 stars from more than 13 reviews, as of September 2026). All from snapiq.tools and its Chrome Web Store listing, checked 27 Sep 2026. The tutor's own story stays a hidden placeholder until he provides it and OKs it; the tutor isn't named.
- [added] 3.4 "You don't need Snapiq for this course, and nothing in this course asks you to pay for anything."
- [added] 3.1: cost line (Claude Code through Code for All access), "a prototype is a first working version", and the Claude Code on the web line with the device guide link.
- [added] 3.2: "a routine is a job that repeats", "in plain words" under the Routines key idea, and "So you don't have to repeat yourself" under Session context.
- [added] 3.3: the "Can't install apps on your device?" HeadsUp (Claude Code on the web at claude.ai/code or the Code tab of the Claude app, runs in the cloud, needs a GitHub repository and Code for All access; from code.claude.com/docs/en/claude-code-on-the-web, checked 27 Sep 2026), the terminal gloss moved above the steps, the "My device won't let me install the app" Stuck answer, "if it asks you to upgrade or for a card, stop", and the You'll need box.
- [added] 3.4: "in plain words" gloss of first-time and second-time founders.
- [added] 3.5: the "Save it here" box for the one-sentence extension idea (shown back in 4.1) and the device line in the Challenge.

**Changes after review (4 Oct 2026): detailed step-by-step lessons.** So a learner working alone, with no tutor, knows exactly what to do. Sources are the official pages named, checked 4 Oct 2026 (code.claude.com/docs/en/…, developer.chrome.com/docs/extensions/…, support.google.com/chrome_webstore/answer/2664769).

- [changed] 3.2 Routines: typing "Check this folder for errors every hour" isn't a reliable way to make a job repeat, and repeating jobs only run while something is switched on. The slide prompts and Key idea stay word for word; a new "How to make a job actually repeat" section says to start the prompt with `/loop` in the terminal (runs only while that session is open, expires after seven days; scheduled-tasks) or use the desktop app's **Routines** → **New routine** → **Local** (runs only while the app is open and the computer awake; desktop-scheduled-tasks), and "if Claude Code doesn't confirm a schedule, assume it did the job once". A HeadsUp notes that the docs also use "routines" for cloud jobs that can't see your files (routines). The recap line no longer says it runs "in the background, again and again" without a schedule.
- [changed] 3.2 Session context: it lasts one session. A new session or `/clear` starts fresh, `claude --continue` resumes the last one (quickstart), CLAUDE.md is what carries instructions over and `/init` writes a first one (memory, best-practices), and undo can't reverse files deleted or moved by commands (checkpointing). Quiz question 4's explanation adds that a new session starts fresh.
- [changed] 3.1: "You don't have to check every line of code yourself" now adds "always test what it made", quoting "If you can't verify it, don't ship it" (best-practices). Recap updated to match.
- [changed] 3.3: the terminal route now explains `cd` and has learners make and enter a project folder (`mkdir my-extension`, `cd my-extension`), mentions the trust dialog and not starting in the home folder (security), and has learners press Shift+Tab once to leave auto mode for `⏸ manual mode on` before their first request, because terminal sessions now start in auto mode (v2.1.283+; quickstart, permission-modes). The desktop route adds choosing a model and choosing **Manual** (desktop#choose-a-permission-mode). Requirements added: macOS 13+, Windows 10 1809+, a separate Windows ARM64 installer, Linux app in beta (desktop-quickstart, terminal-guide).
- [changed] 3.3 HeadsUp and 3.5: Claude Code on the web has no Manual mode (Plan, then Accept edits), keeps the files on GitHub (download with **Code** → **Download ZIP**, unzip, then Load unpacked), and school Chromebooks may block Developer mode, so the Challenge may need a session laptop (web-quickstart; Chrome Enterprise policy ExtensionDeveloperModeSettings).
- [changed] 3.5 "Your extension needs those three parts too" was wrong: `manifest.json` is the only required file, and a tab organiser changes tabs, not pages (developer.chrome.com get-started). The text now says so, and ExtensionPartsDiagram adds manifest.json as part 1 (a folder card above the browser window), notes the icon is optional and that not every extension changes pages. Caption and alt text updated; the drawing's style is unchanged.
- [changed] 3.5 becomes hands-on (`requiresAccount: true`, You'll need box, laptop icon), because the Challenge's build steps now live in it. Durations: 3.1 8, 3.2 12, 3.3 30, 3.4 7, 3.5 20 minutes.
- [added] 3.1: an everyday comparison (a friend on the phone vs a friend who comes round to fix your bike), a worked example walking through the ChatVsAgent drawing's steps, which environment to pick, the web caveat, and a CheckYourself.
- [added] 3.2: an alarm-clock comparison for schedules, a bedroom-tidying comparison and a worked rename example (labelled example prompt) for refactoring, three labelled example session-context prompts, "what it forgets", a `variable` gloss and a CheckYourself.
- [added] 3.3 "Your first session": numbered steps for both the desktop app and the terminal, with "You should now see…" after key steps and a "Check it worked" line: a first request (the terminal guide's hello-world example), the permission prompt and what each choice does ("Do you want to proceed?": **Yes**, **Yes, and don't ask again for: …**, **Yes, and switch to auto mode**, **No**, Tab for a note, Esc to cancel; permissions) and **Accept**/**Reject** in the desktop app (desktop-quickstart), seeing changes (the `+12 -1` counter; `/diff` once the folder is a Git repository; desktop, interactive-mode), opening the page, undoing ("Undo that", `/rewind`, Esc twice, **Restore code and conversation**, **Never mind**; checkpointing, best-practices), stopping with Esc or the stop button, plan mode (Shift+Tab to `⏸ plan mode on` or `/plan`, **Plan** in the desktop app; **Yes, manually approve edits**, **No, keep planning**; permission-modes) and exiting (`/exit`, Ctrl+D twice). Also "Handy commands" (commands) and "Prompts that work" (best-practices, quickstart) with a labelled example error prompt. No Screenshot slot: lesson 3.3 deliberately uses drawings, not screenshot slots (tests/e2e/fill-blanks.spec.ts).
- [added] 3.3 Stuck answers (troubleshoot-install, desktop#troubleshooting): the PATH folders, the `fsSL` error, EACCES (don't use sudo), `claude` opening the desktop app on Windows, the login link when the browser doesn't open (press `c`), the login reset (`/logout`, close, `claude`), 403 or upgrade in the Code tab, "Failed to load session", the wrong folder (`/cd` or exit and `cd`; commands), the trust question every time (security), and changes made without asking (switch to manual).
- [added] 3.4: a pancake comparison for execution, a clearly made-up worked example (two friends with the same tab organiser idea), "What this means for you" and a CheckYourself. The Snapiq placeholder is unchanged.
- [added] 3.5: what's in an extension (a folder; `manifest.json` "the only required file", in the top level; popup.html and popup.js, with no inline JavaScript in popups; icons optional; a jar-label comparison; developer.chrome.com get-started, popup-tabs-manager, hello-world), permissions for a tab organiser and Chrome's descriptions of them (tabs, tabGroups, permissions-list), "start small", and "Build it, step by step": plan mode, the Tab Tidy example prompt and a fill-in-the-gaps version (both labelled examples, written by us and not run in Chrome), why to ask for `chrome.*` (browser-namespace), approving files, the expected files and manifest, opening `chrome://extensions`, Developer mode, **Load unpacked**, pinning (Chrome Web Store help), testing, a labelled Ungroup follow-up prompt (from Google's tab-manager tutorial), reloading with the card's refresh icon, **Errors**, **Clear all** and the popup's **Inspect** → **Console** (debug tutorial), and a "Check it worked" line. A HeadsUp covers the Claude Code on the web route. A new Stuck box covers no Developer mode, a missing manifest, "Could not load manifest.", nothing happening on click, missing tab titles, changes not showing, `browser.` in the code and output that isn't what you wanted. The Challenge keeps the slide text and adds one line pointing to the steps.

---

## Module 4: Claude Skills + Claude in Excel
*Making Claude work your way*
Source: LaunchLab 4

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 4.1 | homework-review | Review your extension | 15 | yes |
| 4.2 | what-are-skills | What are Claude Skills? | 10 | |
| 4.3 | set-up-a-skill | How to set up a skill | 25 | yes |
| 4.4 | claude-in-excel | Claude in Microsoft Excel | 25 | yes |
| 4.5 | claude-in-chrome | Download the Claude extension | 15 | yes |

**4.1 Review your extension.** **[solo version]** The slide's "Active Homework Review" questions become a self-review: Does it install cleanly and run? What problem does it solve? What was the hardest part to get working? If it worked perfectly, what exactly should it do?

**4.2 What are Claude Skills?** The three slide points kept as is: Reusable Instructions, On-Demand Loading, Consistent Standardized Outputs. KeyTerm: skill.

**4.3 How to set up a skill.** The four slide steps: Settings on Claude.ai, Add Skill under Customize, upload your SKILL.md, attach it to a project. Plus a short "Plugins" section *(slide is image only, content needed)*. **[changed]** Menu names must be checked against the current Claude app before publishing, since they change often. *Screenshots needed.*

**4.4 Claude in Microsoft Excel.** The slide's "Advanced Data Operations": Formula Assistance, Data Analysis, Audit & Validation. TryIt with a sample spreadsheet included on the site. **[changed]** The class activity (decide whether a stock is worth buying, using data from Slack) becomes "explain what these numbers say about a company", with the dataset hosted on the site instead of Slack.

**4.5 Download the Claude extension.** Claude in Chrome video and download link *(links needed)*.

**Challenge (slide homework):** Experiment with Claude in Excel and build a Claude skill. **[solo version]** Remove "DM your skill to Yibo, Rishabh, or Nirvan on Slack".

**Changes after review (26 Sep 2026):**

- [changed] 4.3: the invented "upload a ZIP file" claim and its Stuck answer are removed; step 3 follows slide 4 ("Upload your SKILL.md file"). **Corrected 4 Oct 2026:** this note was wrong. The ZIP upload isn't invented: the official docs (claude.com/docs/skills/how-to) say you upload a skill as a ZIP of its folder. Step 3 now says so; see "Changes after review (4 Oct 2026)" below. Steps 1 and 2 follow the slide 5 screenshot (Customize > Skills; + > Create skill > Upload a skill), where slide 4's text says Settings and Add Skill. The live-app check of all four steps is still to do.
- [changed] 4.4: the activity is explaining 90 days of real Singapore weather data, hosted at public/lessons/module-4/singapore-weather.csv (daily, 28 June to 25 September 2026, from the Open-Meteo historical weather API, CC BY 4.0, credited on the page). This replaces the class's stock decision on Slack data and this map's earlier company-numbers version. The slide 8 screenshots of Claude answering about a company's model stay as illustrations of the feature.
- [changed] Module 4 Challenge: use Claude in Excel to find and explain what the weather data shows, in your own words, and build a Claude skill (slide homework, DM removed).
- [changed] British spelling in slide text: Standardised, analyse, Summarise ("Customize" kept as a menu name).
- [added] 4.1 "write your answers in your notes" and "not working yet? go back to the Module 3 challenge"; 4.2 a plain-English line under each slide point, skill KeyTerm, context window gloss; 4.3 HeadsUp that Claude's menus change often (from this map's 4.3 reason), descriptions read from the slide 5 screenshot; 4.4 glosses (formulas, anomalies, business rules), a gloss of the slide 8 question, the four TryIt steps and an example prompt in our own words; 4.5 intro line.

**Changes after review (28 Sep 2026):**

- [added] 4.3 "Plugins": the section slide 6 only shows as a screenshot. Text from the official plugins overview (claude.com/docs/plugins/overview) and the Help Centre's Directory article, checked 27 Sep 2026: a skill is instructions Claude uses when they fit; a connector lets Claude reach another app (Gmail, Google Drive, Canva); a plugin bundles skills, connectors, slash commands and sub-agents so they install together. Plus the "Directory tabs" drawing (components/diagrams/directory-tabs.tsx) and "You don't need any plugins for this course." The slash command and sub-agent glosses are ours.
- [added] 4.4 "Open Claude in Excel": from the official Claude for Excel docs (claude.com/docs/office-agents/excel, checked 27 Sep 2026). Claude for Excel is an add-in for Pro, Max, Team and Enterprise plans; it runs in Excel on the web, Excel on Windows with Microsoft 365 and Excel on Mac 16.46 or later, not on iPad or Android. Install: the Claude for Microsoft 365 listing on Microsoft AppSource, Get it now, then Home > Add-ins (Windows and web) or Tools > Add-ins (Mac), then sign in. Excel on the web is free with a Microsoft account, which the lesson says so learners without Office can join in; sign-in uses the access from their Code for All session. Three Stuck answers follow from the same page.
- [added] 4.1: the saved extension idea from 3.5 shown back (with a sample).
- [added] 4.2: "a workflow is the way you like to get a job done, step by step".
- [added] 4.3: what a SKILL.md is and how to write one in any text editor, the "I don't know what to put in my SKILL.md" Stuck answer (start small; or Create with Claude, from the lesson's own screenshot), You'll need box.
- [added] 4.4: "in plain words" under the three operations, "a CSV is a simple spreadsheet file", the device guide link, You'll need box.
- [added] 4.5: "the extension is free", "on limited data, save it for Wi-Fi", the "My school device won't let me add extensions" Stuck answer, You'll need box.

**Changes after review (4 Oct 2026): detailed step-by-step lessons.** Every lesson expanded so a learner working alone knows exactly what to do. Facts checked against the official pages named below on 4 Oct 2026. Slide prompts, slide order, components, diagrams, figures and the video are kept.

- [changed] 4.1 is now hands-on (`requiresAccount: true`, You'll need box: a laptop with Chrome, Claude Code, the Module 3 extension folder), 15 minutes, because it now walks through testing and fixing the extension. It still has no diagram of its own (one Screenshot slot, which renders nothing in production).
- [added] 4.1 "Check it installs and runs": Load unpacked (chrome://extensions, Developer mode, choose the folder with manifest.json), pin, try it on two pages, the Errors button, Inspect and Console on the popup; "Fix it with Claude Code" with two example prompts (with an error, and with no error using the self-review's last answer), reload with the refresh icon, Clear all, one fix at a time, and "Check it worked". manifest.json and popup glosses. Stuck answers: no Developer mode (managed device), manifest missing or unreadable (extra folder after Download ZIP), "Could not load manifest.", nothing happens on click, missing "tabs" permission, changes not showing. Source: developer.chrome.com Hello World and Debug extensions tutorials; matches the Module 3 Challenge lesson.
- [added] 4.2 "What a skill is, in plain words" (a folder with SKILL.md: a label, then instructions; Claude sees only names and descriptions until a request matches), the recipe-card comparison (the diagram already drew it), why the description matters (quote from the Help Centre's "How to create custom skills"), a worked example (our revision-notes skill in the official format, and which requests open it), "Skills or projects?" (Help Centre "What are skills?"), and a three-question Check yourself. 10 minutes. Sources: claude.com/docs/skills/overview, support.claude.com articles 12512176 and 12512198.
- [changed] 4.3 step 3: you upload a ZIP of the skill folder, not a bare SKILL.md. The official docs (claude.com/docs/skills/how-to) say a SKILL.md sitting at the root of the ZIP isn't recognised as a skill. Recap changed to match.
- [changed] 4.3 step 4 and quiz question 5: "Attach. Link the skill to a project" has no official basis. Skills work across Claude once they're turned on (support.claude.com 12512176, 12512180), so step 4 is now "Turn on and test" and question 5 asks for that step.
- [added] 4.3 "Before you start": Code execution and file creation in Settings > Capabilities, which skills need (support.claude.com 12512180). The label rules for `name` (lowercase letters, numbers and hyphens, up to 64 characters, no leading, trailing or double hyphens, no "anthropic" or "claude", matches the folder; platform.claude.com Agent Skills overview and agentskills.io) and `description` (what it does and when; under 200 characters, the Help Centre's limit, since the specification allows 1,024); instructions under 500 lines; a fill-in-the-gaps SKILL.md; "download as plain text gives a .txt, rename it SKILL.md"; zipping on Windows, Mac and Chromebook (Microsoft, Apple and Google help pages); the upload steps with "You should now see"; turning it on, testing with an example prompt, checking Claude's thinking, picking it with `/` or by name (support.claude.com 12512180, 12512198); "Check it worked"; "Other ways to get a skill" (Create with Claude and the skill-creator route from the Anthropic Academy tutorial, Browse skills > Add from support.claude.com 14328846, the built-in Excel, Word, PowerPoint and PDF skills, and our example prompt). Stuck answers: Skills missing or greyed out, upload fails (the Help Centre's four causes, plus zipping the file instead of the folder), SKILL.md.txt, Claude not using the skill. You'll need box: the SKILL.md is now written in the lesson, so "before" is just an idea for a skill. 25 minutes.
- [changed] 4.3: Write skill instructions is still named (it's in the lesson's screenshot), but the lesson says no official page describes it yet.
- [changed] 4.4: Claude for Excel needs a paid plan (Pro, Max, Team or Enterprise), so the lesson and the You'll need box say the session's access covers it, not that it's free; Excel 2016 and 2019 aren't supported; AppSource is now Microsoft Marketplace. Source: claude.com/docs/office-agents/excel.
- [changed] 4.4: the Stuck box listed its three answers twice; each now appears once.
- [changed] Quiz question 7: the wettest day is 11 September 2026 (28.5 mm, cell E77), not 14 August, which had 0.3 mm. Computed from public/lessons/module-4/singapore-weather.csv.
- [added] 4.4: cell-level citations and the sheet jobs Claude can do (sort, filter, conditional formatting, charts); "What you need" (versions, plan); install steps with the Marketplace link and Excel on the web's Home > Add-ins > More Add-ins > Store route (Microsoft's "Insert Office add-ins into Excel for the web"); "You should now see" lines; a table of the weather file's eight columns; the TryIt steps renumbered into the walkthrough (same four actions); six example prompts, read-only first, then two that change the file; "Stay safe" (confirmations and overwrite warnings, trusted spreadsheets only, from the Excel docs' prompt injection section); "Check it worked" with a Check yourself holding the answer key (wettest 11 Sep, 28.5 mm, then 22 Sep, 17.2 mm; hottest 5 Aug, 34.1 °C; coolest night 20 Aug, 23.7 °C; rainy days average 30.5 °C against 32.8 °C on dry days, and 30.47 from the example formula; 233.1 mm in total, 7 dry days, average mean 28.9 °C; all computed from the CSV). Stuck answers: plan, unsupported versions, school account blocking add-ins (ask IT), Excel freezing ("Wait. Do not click repeatedly", from claude.com/docs/office-agents/performance). 25 minutes.
- [changed] 4.5: "The extension is free" becomes "free to add, but it needs a paid Claude plan; your session's access covers it" (support.claude.com 12012173).
- [added] 4.5 "What it does" (quote, side panel, beta, Google Chrome only on a computer; the friend-with-your-mouse comparison is ours); the six install steps (Add to Chrome, Add extension, sign in, pin, permissions, open the side panel; support.claude.com 12012173); "Make it ask before every action": the three modes, the newer panel's Automatically approve default, switching to Manually approve, Allow this time only or Deny, what it always asks about (support.claude.com 12902446); a safe first task with two example prompts (ours); "Check it worked"; "Stay safe": what it won't do and what to avoid, screenshots and saved history, approved sites in Extension settings (support.claude.com 12902428, 12902446). One Screenshot slot for the permission drop-down. Stuck answers: won't install or sign in, other browsers and phones, can't see the page, the panel looks different (Switch back to classic), from support.claude.com 12902405. 15 minutes.
- Not verified, so worded to avoid depending on it: the exact labels in Customize > Skills (sources differ: "+" and Create skill in the lesson's screenshot, "Add" on one Help Centre page); whether Upload a skill takes anything but a ZIP; what Write skill instructions does; whether a CSV opens editable in Excel on the web (the lesson gives a fallback); whether Claude for Excel or Claude in Chrome work on Chromebooks (Anthropic doesn't say; the Excel lesson keeps Excel on the web as the route); the exact place of the permission drop-down in the classic side panel.

---

## Module 5: Claude Design
*Design it, then let Claude Code build it*
Source: LaunchLab 5 (the best-written deck; stays almost word for word)

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 5.1 | design-your-front-end-first | Design your front end first | 20 | yes |
| 5.2 | export-your-design | Export your design | 15 | yes |
| 5.3 | what-claude-code-actually-does | What Claude Code actually does | 8 | |
| 5.4 | after-hand-off | What to do after hand off | 20 | yes |
| 5.5 | when-it-breaks | When it breaks (and it will) | 15 | |
| 5.6 | the-three-files | The three files | 10 | |
| 5.7 | the-whole-workflow | The whole workflow | 15 | yes |

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

**Changes after review (27 Sep 2026):**

- [added] 5.6: "The three files" diagram (design board "5.6 · The three files") under the opening paragraph: a small "Join the club" page with a Sign up button, and a numbered label for each file pointing at the part it controls. The three descriptions are the lesson's own. The caption "One button, three files: change the words in index.html, the colour in styles.css and the click in script.js." is from the board. The example page is invented and has no real names.

**Changes after review (28 Sep 2026):**

- [changed] 5.2: the menu path is confirmed. The handoff is under **Export** ("Hand off to Claude Code"; official tutorial claude.com/resources/tutorials/using-claude-design-for-prototypes-and-ux, checked 27 Sep 2026), so the placeholder asking to check it is removed. The Stuck answer keeps the Share menu as a fallback, dated.
- [added] 5.1: cost line, "a visual shell is the look of the site before it does anything", the "I don't know what to design" Stuck answer, You'll need box.
- [added] 5.2 and 5.4: You'll need boxes; 5.4 gets the PublishSafely reminder (its site can have a sign-up form).
- [added] 5.3: "An API limit error means Claude Code has used up its allowance for now. It's not a bill, and you never pay anything."
- [added] 5.5: a gloss of DevTools and the Console, the Mac shortcut (Option, Command and I; from Chrome's DevTools docs), and a Stuck box (no red text, Claude's fix broke something else, nothing is red).
- [added] 5.7: "a workflow is the order you do things in", what deploy and tiiny.host mean and that tiiny.host has a free option, "then upload the zip file on tiiny.host", PublishSafely, a Stuck box (tiiny.host asks to pay, can't find index.html, what's localhost, sign-in), You'll need box. tiiny.host's free option: from its home page, checked 28 Sep 2026; if the club can't confirm it, keep the Stuck answer's fallback (screen-record on localhost, which the Challenge already accepts).

**Changes after review (4 Oct 2026): detailed step-by-step lessons.** Each lesson is expanded so a learner working alone knows exactly what to do. Facts come from the research brief checked on 4 Oct 2026 and from the official pages linked in each lesson, rechecked where they could be reached: [GS] Get started with Claude Design (support.claude.com/en/articles/14604416-get-started-with-claude-design), [ART] What are artifacts (support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them), [TUT] Using Claude Design for prototypes and UX (claude.com/resources/tutorials/using-claude-design-for-prototypes-and-ux), the Claude Code docs (code.claude.com/docs/en/errors, /interactive-mode, /commands, /permission-modes, /desktop, /best-practices), Chrome's DevTools docs (developer.chrome.com/docs/devtools) and MDN. Slide prompts, homework, slide order and every existing component, figure and video stay. Durations in the table above are updated to match.

- [changed] 5.1: says where Claude Design opens now. It moved inside Claude in September 2026: **Output** → **Design** in a chat's message box, a **Design** template from the **Artifacts** tab, or claude.ai/design ("The standalone experience keeps working"). A line under the video says it's from the April 2026 launch, when Claude Design was its own website, so the screen looks different now. Sources: [GS], [ART].
- [changed] 5.2: the export path is **Export** (top right) → **Handoff to Claude Code**, with the choices **Send to local coding agent** and **Send to Claude Code Web**, opening the **Hand off to Claude Code** window (tabs **Local agent** and **Web session**, **Add instructions (optional)**, **Copy prompt**, from the course's own screenshot handoff-dialog.png). The trailing "…" is dropped from the button name. Source: [GS].
- [changed] 5.2 Stuck "Claude Code says it can't reach the design": the `/design-login` fix and the **Project archive** ("Every project file, zipped") option are removed. The docs describe `/design-login` only as "Authorize design-system access for /design-sync" (code.claude.com/docs/en/commands), and Project archive isn't in the official docs. The answer now says to copy the whole prompt again, or use **Download as .zip** or **Export as standalone HTML** and put the file in the folder. Source: [GS].
- [changed] 5.3: "It splits your design into index.html, styles.css and script.js" (slide) now says the handoff itself brings in design files, the chat and a README [TUT], and the split happens because the 5.4 build prompt asks for it. The slide line stays, followed by the correction; the recap says "Ask it to split…". It notes Claude Code sometimes splits a page unasked, as in the lesson's own screenshot.
- [changed] 5.3 and 5.4: "If you hit an API limit error, just type continue" (slide) is wrong for usage limits. Claude Code "blocks further requests until the reset time shown in the message"; from v2.1.234 it waits in the open session and "continues the task on its own after the limit resets" (on by default), showing `Continuing automatically at 3:45pm · esc to cancel`; typing `continue` works after the reset. The wait can be hours, or days for a weekly limit. Lessons now say: leave it open, wait for the time, let it carry on, type continue only after the reset, and never run `/usage-credits` or pick an option that adds usage credits or upgrades (it buys extra usage). 5.4's slide step 3 "Hit an error? Just type continue." becomes "Hit a usage limit? Leave it open and wait for the reset time: it carries on by itself." The 5.3 screenshot caption no longer says "you type continue"; it says typing continue only works after the reset time. Sources: https://code.claude.com/docs/en/errors, https://code.claude.com/docs/en/interactive-mode#wait-for-a-usage-limit-to-reset, https://code.claude.com/docs/en/commands
- [changed] 5.4: after "Make the sign-up form really save what people type", the lesson explains that on a site that's only files Claude Code will probably use localStorage, which keeps what someone types in their own browser, so the owner never sees sign-ups; that names and emails are personal information, so test with made-up details; and that a real sign-up list comes in Module 8. Source: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- [changed] 5.5: slide step 2 "Press F12" becomes "Open the Console": Ctrl+Shift+J (Windows, ChromeOS) or Cmd+Option+J (Mac), which open the Console directly. F12 opens DevTools on the last panel used, is Fn+F12 on a Mac and missing on many Chromebooks; the lesson says so and keeps F12 as an option. The earlier Mac line (Option, Command and I) is replaced. The practice scenario says "You open the Console" instead of "You press F12". Source: https://developer.chrome.com/docs/devtools/open, https://support.google.com/chromebook/answer/183101
- [changed] 5.5 diagram (ConsoleDrawing): step 1 is "Open the Console: Ctrl+Shift+J, or Cmd+Option+J on a Mac" instead of "Press F12", step 2 is "Check the tab" (still "Not Elements: Console."), and the alt text and caption match. Style unchanged.
- [changed] 5.5 quiz question: "You press F12 and see red text in the Console" becomes "You open the Console and see red text".
- [changed] 5.7: the localhost gloss is now "your own computer acting as a web server, so you can open your site at an address like localhost:8000. Only you can see it." Opening index.html directly is file://, not localhost; localhost needs a local server. The Stuck answer says the same. Source: https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/set_up_a_local_testing_server
- [added] 5.1: the canvas Term; the architect's-drawing comparison; numbered steps (log in, three ways to open Claude Design, skip the design system, optional picture of a site you like with no personal details, describe goal, layout, content and audience, answer Claude's questions, "You should now see your design appear on the canvas", Check it worked); an example description (a made-up chess club, labelled as an example) with a sign-up form for lessons 4 and 5; "Improve your design" (Chat with the official "Show me 2–3 alternative layouts for this page.", inline comments, edit directly, sliders [claude.com/product/design], two more example changes); "Save what we have and try a completely different approach." because there's no version history; designs start private until **Share**; find it again in the **Artifacts** tab; a CheckYourself; Stuck answers (can't find Output, on a phone: view only, inline comment ignored: paste it into the chat, a change made it worse); a `<Screenshot>` slot for Output → Design. You'll need says the phone app can't edit. Sources: [GS], [ART].
- [added] 5.2: "What the handoff sends" (design files, chat, README, a prompt with the bundle's link [TUT]) with a builder comparison; step 1 makes a website folder named in lowercase with no spaces (MDN: Dealing with files); numbered export steps with "You should now see" for the window and what to do if the menu looks different; the instructions box with an example ("Use plain HTML, CSS and JavaScript."); opening Claude Code in the folder (desktop app or terminal, as in Module 3); permission prompts ("stops and asks you before most actions that edit files, run shell commands, or reach the network", code.claude.com/docs/en/permission-modes) and the permission mode Term; Check it worked with an example prompt; "If the handoff doesn't work: download it instead" (**Download as .zip**, **Export as standalone HTML**, example prompt); Stuck answers (nothing pasted, wrong folder, Chromebook or no install: Claude Code on the web needs a GitHub repository from Module 6, as Module 3 says); a `<Screenshot>` slot for the Export menu. You'll need adds the empty folder.
- [added] 5.3: the bike/mechanic comparison; "What that looks like" (a typical build, based on the slide and the lesson's two screenshots); permission prompts in **Manual** mode; the usage limit Term and example message (`You've hit your session limit · resets 3:45pm`); the desktop app's **Auto-continue when limits reset** box; a CheckYourself.
- [added] 5.4: step-by-step sections under the four slide steps; an example "build it, and keep the design" prompt (the research brief's learner version of Anthropic's best-practice example "implement this design… compare it to the original. list differences and fix them", code.claude.com/docs/en/best-practices); Check it worked (the three files in the folder); "Open your site in your browser" (double-click, drag into Chrome or Ctrl+O / Cmd+O with a file:// address; the desktop app's **Browser** pane by clicking the HTML file path; a local server with `python3 -m http.server` and localhost:8000 when "Cross-origin request blocked" appears), sources MDN set_up_a_local_testing_server, code.claude.com/docs/en/desktop#preview-your-app; "Compare it with your design" with an example prompt; Check it worked for the form with made-up details and an example prompt; the local server and localStorage Terms; Stuck answers (usage limit, permission prompts, blank page, no styles, images, doesn't match the design), from the brief's common problems (MDN). You'll need adds Chrome.
- [added] 5.5: the homework-marking comparison; the DevTools Term; "Open the Console" (shortcuts, F12, **⋮** → **More Tools** → **Developer Tools**); "Read the error" (do it again with the Console open, **Log Levels** → **Errors**, the file:line link opens the line, the expand icon); ignore **Understand this error** (Gemini, 18 and over); "Copy the error for Claude" (**Copy console**, or select and copy); a worked example with a different error (`Cannot set properties of null (setting 'textContent')`, MDN: What went wrong) and an example message; "Reload and check" with hard reload (Ctrl+Shift+R / Cmd+Shift+R); "When it looks wrong but nothing is red" (**Inspect**, **Elements**, **Styles**, **Toggle device toolbar** from **Mobile S** 320px to **Laptop L** 1440px); a CheckYourself; Stuck answers (Log Levels, DevTools blocked on school devices, blank page, no styles with capitals mattering, images with forward slashes). Sources: developer.chrome.com/docs/devtools/console/log, /console/reference, /console/understand-messages, /css, /device-mode; MDN What went wrong and Dealing with files.
- [added] 5.6: "Three languages, three jobs" quoting MDN's definitions of HTML, CSS and JavaScript (MDN: What is JavaScript?); the house comparison; a worked example of one Sign up button in the three files (made-up code), showing how index.html links the other two; "Look inside your own files" (the desktop app's file pane and Browser pane, a code editor, an example prompt); a fifth CheckYourself question (renaming styles.css). Source for the desktop app: code.claude.com/docs/en/desktop.
- [added] 5.7: the school-play comparison; "The whole workflow, step by step" with a link to each lesson; "Run it on localhost" (example prompt, `python3 -m http.server`, localhost:8000, Check it worked); numbered tiiny.host steps from the lesson's own screenshot (link name ending in .tiiny.site, "Drag & drop zip or single file here", **Upload file**), a public-link warning, stop if it asks for an account, email or payment, Check it worked on another device; a CheckYourself; Stuck answers (asks for an account or email, python3 not found, broken on tiiny.host but not on localhost).
- Left unverified, so worded not to depend on it: the exact Export menu wording in the live app and how **Send to local coding agent** / **Send to Claude Code Web** map to the window's **Local agent** / **Web session** tabs (5.2 says "pick the one for your own computer" and "look for the option that mentions Claude Code and your computer"); the copied prompt's exact words and whether Claude Code starts building straight after the paste (5.4 step 1 says to let it finish if it has started); whether `/design-login` fixes "can't reach the design" (removed); what's inside the .zip; whether **Send to Claude Code Web** needs a GitHub repo (5.2 only repeats Module 3's line that Claude Code on the web works on a GitHub repository); Chrome's exact wording for a missing local file (the Stuck answers say "a red error naming it"); tiiny.host's free plan, account and age terms (5.7 tells learners to stop if asked for an account, email or card, and keeps the screen-record fallback). Plan facts (Claude Design is in beta on Pro, Max, Team and Enterprise; artifacts need code execution turned on in Settings > Capabilities; Claude Design counts toward the same usage limits) are not in the lessons: access comes through Code for All sessions.

---

## Module 6: Introduction to GitHub and Vercel
*Storing, sharing and publishing your code*
Source: LaunchLab 6

| # | Slug | Title | Min | Hands-on |
|---|---|---|---|---|
| 6.1 | what-is-github | What is GitHub? | 8 | |
| 6.2 | key-terms | Key terms | 10 | |
| 6.3 | push-vs-pull-request | Push vs pull request | 7 | |
| 6.4 | intro-to-vercel | Intro to Vercel | 8 | |
| 6.5 | get-your-code-into-github | Step 1: get your code into GitHub | 30 | yes |
| 6.6 | connect-to-vercel | Step 2: connect to Vercel | 20 | yes |

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
- [changed] 6.5: the slide prompt says "Push this project to Github"; the lesson's prompt block says "GitHub", the product's own spelling and the form used everywhere else on the site (content check, 27 Sep 2026).
- [changed] 6.1: the slide 5 repository screenshot (a tutor's username, photo and private repos) isn't used; a screenshot slot asks for one from a neutral account.
- [added] 6.1 glosses (codebase, repo, history) and the "How it works" lead-in; 6.2 "locally" gloss, "a commit on its own isn't on GitHub yet", six scenario CheckYourself questions; 6.3 branch gloss (from Module 7's slide) and a closing line; 6.4 the tiiny.host comparison line; 6.5 "a public repo can be seen by anyone"; 6.6 open source gloss ("a project whose code is shared publicly for others to use") and a Challenge reminder about secrets.

**Changes after review (28 Sep 2026):**

- [added] 6.1: "A GitHub account is free", and "Git is the tool that keeps track of the versions. GitHub is the website that stores them online."
- [added] 6.3, 6.4, 6.5, 6.6: inline Terms (push, pull request, commit, repo, fork) that show the Module 6 key terms' definitions in place.
- [added] 6.4: "Vercel has a free plan for personal projects" (cost) and the limited-data note on the video.
- [added] 6.5: PublishSafely, "GitHub accounts are free", the "Where do I find my repo's URL?" Stuck answer, You'll need box.
- [added] 6.6: PublishSafely, "Vercel's plan for personal projects is free: if it asks for a card... stop and ask", the "Vercel asks me to pay" Stuck answer, You'll need box.

**Changes after review (4 Oct 2026): detailed step-by-step lessons.** So a learner working alone, with no tutor, knows exactly what to do. Sources are the official pages named, checked 4 Oct 2026: docs.github.com (creating-a-new-repository, adding-locally-hosted-code-to-github, about-remote-repositories, caching-your-github-credentials-in-git, setting-your-commit-email-address, dealing-with-non-fast-forward-errors, adding-a-file-to-a-repository, editing-files, about-repositories, github-glossary), cli.github.com/manual/gh_auth_login, git-scm.com/docs/git-init, code.claude.com/docs/en/… (desktop, interactive-mode, quickstart, web-quickstart), docs.lovable.dev/integrations/github, and vercel.com/docs/… (git, projects/managing-projects, builds/configure-a-build, deployments/environments, deployment-protection, deployments/logs, deployments/troubleshoot-project-collaboration, plans/hobby) with vercel.com/kb/guide/unable-to-find-github-repository and why-is-my-deployed-project-giving-404. Slide prompts and homework stay word for word.

- [changed] 6.5 step 1: "click the green New repository button… click Create" becomes **+** → **New repository**, **Owner**, **Repository name** (letters, numbers, `-`, `_`, `.`), **Private**, "Leave **Add README** off" (GitHub: don't initialise a repo you'll push existing code to with a README, licence or .gitignore, "to avoid errors"), then **Create repository**. The green button's exact label on the repositories page is unverified, so 6.1 no longer names it in the text (the Screenshot slot is kept as it was).
- [changed] 6.5 step 2: the slide prompt stays word for word; a second prompt block, "Add this to the end", adds "Use a branch called main.", because `git init` with no option still names the first branch master. A table explains the five commands Claude Code runs (GitHub's documented steps), with "it may run them in a slightly different way".
- [changed] 6.5 "follow its instructions in the terminal" skipped what Git needs. A new "Before you start: set up Git" section, before the slide steps: check `git --version`, install Git (Git for Windows on Windows; git-scm.com/downloads), the desktop app's "Git is required", its built-in terminal (**Views** menu or Ctrl+`) and the `!` shell-mode prefix; password sign-in has been removed, so Windows uses Git Credential Manager (comes with Git for Windows, opens a browser window at the first push) and Mac/Linux use GitHub CLI (`gh auth login`, **HTTPS**, **Y** to authenticate Git, browser sign-in, `gh auth status` to check); and the GitHub noreply commit email (**Settings** → **Emails** → **Keep my email addresses private**, `git config --global user.email`, the username rather than a full name for `user.name`), with why it matters on Vercel's Hobby plan.
- [changed] 6.5 Lovable box and Stuck answer: "Settings → GitHub → Connect" becomes **Project settings** → **Git** → **GitHub**, then the button to connect the project (the docs call it Connect Project; worded so it doesn't depend on the label, since Lovable's menus change often). Added: the workspace needs a GitHub connection that only a workspace owner or admin can add; the repo is private by default; sync is two-way on the default branch.
- [changed] 6.4 and 6.6: "every pull request gets its own preview link, so your team can see the changes" becomes "so you can see the changes", with a HeadsUp: new projects have Vercel Authentication on by default, so only people logged in to Vercel with access can open a preview, and the Hobby plan allows only one external user. Learners share the production address instead.
- [changed] 6.6 step 2: "New Project → Import Git Repository" becomes **Add New…** → **Project** (or vercel.com/new) → **Import**, with **Configure GitHub App** when a repo isn't listed.
- [changed] 6.6 step 3 "Vercel auto-detects your setup" becomes a "Check the settings" step: Project Name, **Framework Preset** **Other** for plain HTML (leave Lovable projects as detected), **Root Directory**, and **Override** on with an empty **Build Command**; Vercel publishes `public` if it exists, otherwise the repo's top level.
- [changed] 6.2: "This will save locally and NOT on GitHub" was only true for Git on your computer: the Commit KeyTerm now says "When you commit on your computer…", and a tip says GitHub's **Commit changes** button on the website commits straight to GitHub. The CheckYourself answer, recap and quiz question 2's explanation follow.
- [changed] Quiz: question 7's explanation adds **Configure GitHub App**; question 8's says "every time you push to main".
- [changed] Durations: 6.1 8, 6.2 10, 6.3 7, 6.4 8, 6.5 30, 6.6 20 minutes. 6.5 and 6.6 You'll need boxes updated (Git or permission to install it, the Chromebook route; Vercel needs nothing installed; files on main).
- [added] 6.1: a video-game save-point comparison, a worked example (a football site's history), Git vs GitHub in two bullets, "Public or private?" (about-repositories), and a CheckYourself.
- [added] 6.2: an everyday comparison for each group, a worked commit-then-push example, "pull" (without "request") from the GitHub glossary, an inline `main` Term, "All six in one story", and a seventh CheckYourself question about committing on the website.
- [added] 6.3: a school-magazine comparison, the same change made with a push and with a pull request, a "Which one should I use?" table and a CheckYourself.
- [added] 6.4: a Deploy KeyTerm, "Live site and previews" (production vs preview; environments), a band comparison, a worked example (a spelling fix going live), "What it costs" (Hobby: free, personal, non-commercial; plans/hobby) and a CheckYourself.
- [added] 6.5: "Which way is yours?", "Check what it's adding" (HeadsUp), sign-in during the push, a numbered "Check it worked" (files, commit note, branch says main), a labelled example prompt for later pushes ("Commit my changes with a descriptive message and push them to GitHub", after the quickstart's plain-request style), "On a Chromebook" (empty repo first, connect GitHub, the **Claude GitHub App** on a private repo, a branch per task, **Create PR**, merge in Module 7; web-quickstart), uploading files on GitHub (**Add file** → **Upload files**, **Commit message**, 25 MiB per file, 100 files at a time), and a Screenshot slot for the new repository form. New Stuck answers: Git not found / "Git is required", password or authentication failed, rejected (non-fast-forward), branch called master, Claude Code on the web can't see the repo, a file won't upload, changes on the wrong branch; "files aren't on my repo page" adds reading the error.
- [added] 6.6: numbered sign-in steps (**Continue with GitHub**, authorise, the Hobby plan), "You should now see…" after key steps, "Find your live address" (project **Overview** and **Deployments**; usually `project-name.vercel.app`), a "Check it worked" step that opens the site on another device and pushes a labelled example change, "Only pushes to main update your live site", "If something goes wrong" (**Build Logs**, errors in red, a labelled example fix prompt; **Deployments** → **…** → **Redeploy**), a Screenshot slot for the configure page, and in the Challenge **Fork** → **Create fork** and **Configure GitHub App** for the fork. New Stuck answers: repo not in the import list (and only the owner can import), 404 (Framework Preset, output directory, where index.html must be), index.html in a folder (**Settings** → **Build and Deployment** → **Root Directory** → **Save**, next deployment), failed deployment, live site unchanged (main only, Deployments, Build Logs, Hobby commit author and `git config user.email`, Redeploy), a friend sees a Vercel login, can't find the live address.
- Unverified (worded so the steps don't depend on them): how local Claude Code handles a GitHub login during a push (test before class); the repositories page's green button label; Vercel's screens after **Continue with GitHub**, the exact form of the production address, what the screen shows when the first deployment finishes, and where on the Overview page the address sits; the Lovable button's exact label; the `gh auth login` questions other than protocol and "authenticate Git"; where the noreply address appears on the Emails page; the upload page's commit button label. Vercel and Lovable pages were checked through search results, as their sites couldn't be opened directly from the build machine.

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

**Changes after review (27 Sep 2026):**

- [changed] 7.1: the slide's "How branching works" image is replaced by the "Branches as lanes" diagram (design board "7.1 · Branches as lanes"), which shows the same thing and works in dark mode and on phones. The PNG stays in public/lessons/module-7/ but is no longer used.
- [added] 7.1 diagram: a second, unfinished branch (sam-board, "Still working…"), the step labels "Branch off", "Your commits", "Main keeps moving" and "Pull request merges it back", the "Vercel: live" tag on main (from the lesson's "the branch that Vercel puts live"), and the caption "Every branch is its own lane, and main never sees your work until your pull request is merged." (from the lesson's bold line).

**Changes after review (28 Sep 2026):**

- [added] 7.1: "a lane on a road"; 7.2: "The difference is where the copy lives"; 7.3: "A track here means a route. Pick one." and "Use your first name and the part you're working on, not your full name" (child safety); 7.5: "An escape hatch is the easy way out" and the limited-data note on the videos; 7.6: what Wordle and a clone are, PublishSafely, and the "Save it here" box for the one-line final project idea (for Module 9). Inline Terms for branch, main, pull request, commit, fork and merge conflict. You'll need boxes on 7.3, 7.4 and 7.6.

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

**Changes after review (27 Sep 2026):**

- [added] 8.2: the "An API is a door" diagram (design board "8.2 · An API is a door") after the door analogy, alongside the existing "Where the API sits" image, which shows something different. Its example (a site showing Singapore's temperature, the request "What's the temperature in Singapore?", the answer `{ "temperature_2m": 31.2 }` and a weather service behind the door) matches the Open-Meteo request in 8.3. The numbers are examples. Caption from the lesson's analogy.
- [added] 8.4: the "How logging in works" diagram (design board "8.4 · How logging in works") after the Token KeyTerm: sign up (a new row in the user table), log in (a token saying "this is James") and log out (the token thrown away). Lines are from the lesson; "Email and password match" is from the board. james@example.com is an example address.

**Changes after review (28 Sep 2026):**

- [added] 8.1 and 8.4: inline Terms for API and authentication; 8.2: glosses of server and database, "No account needed, and it works on a phone", the limited-data note on the video; 8.3: "The weather API is free and needs no account or key", the "The box shows nothing, or an error" Stuck answer (pointing at 5.5), You'll need box; 8.4: glosses of the user table and "scrambled"; 8.5: what Supabase is and that its free plan is enough, "a key is a long code that proves to Supabase which project is asking", PublishSafely with the test-email line, the "Supabase asks me to pay" Stuck answer, You'll need box (including a test email).

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

## Facilitator kit and site pages [added]

Not in the slides. Added 26 Sep 2026 for adults running sessions, and for parents and schools.

- **/run-it and the kit pages** (script, handout and checklist, per module): run sheets in `content/facilitator.yml`. From the Blueprint: ages 13 to 16, 10 weekly 90-minute sessions, a laptop each, free, weekly deliverables and their marks, the final-project rubric. Written for the kit, not from a source: every timing (labelled as suggestions, 90 minutes per module; only Module 2's 20-minute sprint comes from the class), every "do" line, the group versions' extra suggestions ("If your group has its own place for questions, share it now", "You can collect the links/skills/recordings instead", Module 3's "in a session, that's you"), Module 3's "Ask learners why execution matters more than the idea", the `prepare` items inferred from the lessons (Modules 3 to 8), the checklist's "Work through the hands-on lessons yourself" and "Access to X for every learner", and on /run-it "one per module", "Each session covers one module, and the module's Challenge is the homework" and "In LaunchLab, Code for All provided Claude Code. In your sessions, your school, club or programme provides access." The slide deck card says Coming soon; the PDFs in `source/slides/` are not linked.
- **/about**: a marked draft from the Blueprint, no tutor names. "The club's live course" and "LaunchLab is planned like this" are our wording; confirm both.
- **/privacy**: checked against the code. The line about the host keeping standard request logs is ours; when real grading replaces the mock, name the service that receives prompts.
- **/glossary**: built from the lessons' `<KeyTerm>`s; nothing written for it.
- **Placeholders (28 Sep 2026)**: `<Placeholder>` and `<Screenshot>` render nothing on the production site (VERCEL_ENV is "production") and still show locally and on previews. Every remaining one is listed in docs/content-needed.md (`npm run content-needed`). The Run a session page's "Slide deck: Coming soon" card is removed until a deck exists.
- **Coming soon pages (28 Sep 2026)**: /module-9 and /module-10 list the module's planned lessons (from this map, as `planned` in content/course.yml) and a "While you wait" section pointing back at the previous module's Challenge, quiz and Check your skills page, with a `waiting` line per module in course.yml.
- **Learner help (28 Sep 2026)**: a /help page (no laptop, blocked installs, can't sign up, limited data, lost progress, something broke with a copyable "here's the error" prompt, what a word means, who to ask), linked from the footer and the end of every Stuck box. /access gets "Which device do you have?" (Windows or Mac laptop: everything; Chromebook or a device that blocks installs: every browser tool, Claude Code on the web or a session laptop; iPad or phone: reading, practice and quizzes) and "What does it cost?" (nothing; nothing ever asks for a card). Every hands-on lesson opens with a "You'll need" box (device, access, things from earlier lessons, time) from a `needs` block in its frontmatter. Work a learner needs later is saved on the device and shown back where it's used (`<SaveHere>`, `<SavedWork>`, and the practice card's draft), with a sample to start from; nothing is sent anywhere, and /privacy lists it. Inline `<Term>`s can look their definition up in the glossary, and the glossary now includes every inline definition. Cost lines say which tools are free and which come through Code for All access. `<PublishSafely>` is the safety reminder on every lesson that puts something online.
- **Lesson visuals (28 Sep 2026)**: every lesson except the quizzes now has at least one visual. New diagrams, all HTML and inline SVG with the design tokens in the `Diagram` frame, readable at 360px, in both themes, each with a full alt text: 1.1 the course path and the read, practice, build loop; 1.5 do and don't cards; 2.1 first prompt, first draft, refine, better site; 2.2 the sprint steps on a timeline (the minutes are suggestions); 2.3 a rough prompt into Claude and a sharper one out (the example prompts are ours); 2.5 the two About Me pages from 1.6 side by side with three changes labelled; 3.1 chat answers, Claude Code does the work in your files (the "Add a Sign up button" example is ours); 3.2 an icon for each of the four example prompts; 3.5 the parts of a Chrome extension (icon, popup, what happens on the page, using the lesson's "highlights words" idea); 4.2 a skill as a recipe card Claude picks up when it fits (the newsletter skill is invented); 5.5 a simplified drawing of DevTools with the Console tab and the lesson's error; 6.2 and 6.5 your computer, GitHub, Vercel with commit, push, clone, fork, pull request, merge and deploy on the arrows; 6.3 push vs pull request lanes; 6.6 the change, push, rebuild, live loop; 7.2 branch vs fork; 7.4 the pull request journey; 8.1 a page that can't fetch live data or remember users next to one that can (31.2°C and James match 8.3 and 8.4). Three lessons reuse the diagram from earlier in their module where it's exactly the picture they need: 7.3 shows 7.1's lanes again ("this lesson is steps 1 and 2"), 8.3 shows 8.2's door ("this time your own page does the knocking") and 8.5 shows 8.4's login diagram (the three actions Supabase adds). Lessons that deliberately have no diagram, because a picture wouldn't help: 1.4 (the prompt ladder is its visual), 2.4 (a two-item checklist; 2.1's loop, one lesson earlier, covers it), 4.1 (four self-review questions) and 7.6 (the task's instructions; 7.1's lanes and 7.4's journey are its pictures). The lesson-visuals test lists those four as the only exceptions.
- **Plain-English pass (28 Sep 2026)**: every lesson in Modules 1 to 8 was read for a 13-year-old whose home language may not be English: shorter sentences, one idea per sentence, jargon explained the first time it appears (as an inline Term or a one-line gloss), active voice. Slide wording, prompts and homework are unchanged; the glosses sit after them and are marked [added] per module below. British spelling kept.

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
