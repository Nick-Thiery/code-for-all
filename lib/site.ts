// Site-wide copy and links.
export const site = {
  name: "Code for All",
  tagline: "Build real things with AI.",
  description:
    "A free course for beginners. Learn how AI tools work, then use one to build your own website.",
  madeBy: "Made by students at Code for All, a service club at Singapore American School.",

  // TODO(contact): where "Contact" and "Email the Code for All team" go, for
  // example "mailto:team@example.org". Until then they render without a link.
  contactHref: null as string | null,

  // TODO(kit): links for the session kit on /run-it. Each null renders its
  // Open or Download button without a link.
  kit: [
    {
      format: "Slides",
      title: "Slide deck",
      description: "What you'll show, from the opening hook to show and tell.",
      openHref: null as string | null,
      downloadHref: null as string | null,
    },
    {
      format: "PDF",
      title: "Facilitator script",
      description: "What to say and do at each step, with timings.",
      openHref: null as string | null,
      downloadHref: null as string | null,
    },
    {
      format: "PDF",
      title: "Student handout",
      description: "A one-page take-home with the key ideas and the course link.",
      openHref: null as string | null,
      downloadHref: null as string | null,
    },
    {
      format: "PDF",
      title: "Pre-session checklist",
      description: "Laptops, accounts and room setup, sorted the day before.",
      openHref: null as string | null,
      downloadHref: null as string | null,
    },
  ],
};
