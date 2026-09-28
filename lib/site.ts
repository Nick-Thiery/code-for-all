// Site-wide copy and links.

// The one place the contact address lives. Everything links to site.contactHref.
const CONTACT_EMAIL = "thiery774315@sas.edu.sg";

export const site = {
  name: "Code for All",
  tagline: "Build real things with AI.",
  description:
    "A free course for beginners. Learn how AI tools work, then use one to build your own website.",
  madeBy: "Made by students at Code for All, a service club at Singapore American School.",
  contactEmail: CONTACT_EMAIL,
  contactHref: `mailto:${CONTACT_EMAIL}`,
};

/**
 * The site's public address, for share links, the sitemap and robots.txt.
 * Set NEXT_PUBLIC_SITE_URL (e.g. https://codeforall.example) when you know the
 * domain. On Vercel it falls back to the production URL Vercel provides.
 */
export function siteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return new URL(configured);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

/**
 * Whether practice feedback really comes from AI. It doesn't yet: POST
 * /api/practice always uses the mock grader (lib/practice-mock.ts), so the
 * site calls it sample feedback. Set this to true when real grading goes
 * live and every mention below switches back to "written by AI".
 */
export const aiGrading = false;

export const practiceCopy = aiGrading
  ? {
      notice: "Your feedback is written by AI.",
      howItWorks: "Write a prompt and get kind, specific tips from AI. Try as many times as you like.",
      howItWorksShort: "Write a prompt and get tips from AI.",
      accessItem: "Practice with AI feedback",
    }
  : {
      notice: "For now this is sample feedback, while AI grading is being set up.",
      howItWorks:
        "Write a prompt and get kind, specific tips. For now it's sample feedback, while AI grading is being set up.",
      howItWorksShort: "Write a prompt and get kind, specific tips.",
      accessItem: "Practice with sample feedback (AI grading is being set up)",
    };

/**
 * True on the production site. Vercel sets VERCEL_ENV to "production" for
 * production builds and "preview" for pull request previews; locally it's
 * unset. Placeholders and screenshot slots render nothing when this is true.
 */
export const isProduction = process.env.VERCEL_ENV === "production";

/** Search engines may index the site only when NEXT_PUBLIC_ALLOW_INDEXING is "true". */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
