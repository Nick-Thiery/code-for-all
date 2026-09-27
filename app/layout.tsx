import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Mono, Atkinson_Hyperlegible_Next, Recursive } from "next/font/google";
import { ModuleCelebration } from "@/components/module-celebration";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getOutline } from "@/lib/lessons";
import { getLogoFiles } from "@/lib/logo";
import { allowIndexing, site, siteUrl } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import "./globals.css";

// Body text: designed by the Braille Institute for legibility.
const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin"],
  style: ["normal", "italic"],
  // next/font has no fallback metrics for this family yet and warns on every compile.
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

// Prompts, code and commands.
const atkinsonMono = Atkinson_Hyperlegible_Mono({
  variable: "--font-atkinson-mono",
  subsets: ["latin"],
  adjustFontFallback: false,
  fallback: ["ui-monospace", "monospace"],
});

// Headings: Recursive with its "casual" axis turned halfway up.
const recursive = Recursive({
  variable: "--font-recursive",
  subsets: ["latin"],
  axes: ["CASL"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: `${site.name}: ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website", locale: "en_GB" },
  twitter: { card: "summary_large_image" },
  // Hidden from search engines unless NEXT_PUBLIC_ALLOW_INDEXING is "true".
  ...(allowIndexing ? {} : { robots: { index: false, follow: false } }),
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Titles and order of every lesson (no lesson text), for the header's
  // lesson progress and the continue bar.
  const outline = await getOutline();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${atkinson.variable} ${atkinsonMono.variable} ${recursive.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-bg text-fg antialiased">
        <a
          href="#main"
          className="sr-only rounded-xl bg-accent print:hidden px-4 py-2 font-bold text-on-accent focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10"
        >
          Skip to content
        </a>
        <SiteHeader outline={outline} logo={getLogoFiles()} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <ModuleCelebration />
      </body>
    </html>
  );
}
