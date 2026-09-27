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

/** Search engines may index the site only when NEXT_PUBLIC_ALLOW_INDEXING is "true". */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
