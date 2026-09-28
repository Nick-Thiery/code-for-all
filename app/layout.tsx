import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Mono } from "next/font/google";
import { ModuleCelebration } from "@/components/module-celebration";
import { OfflineNotice } from "@/components/offline-notice";
import { ServiceWorker } from "@/components/service-worker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getOutline } from "@/lib/lessons";
import { getLogoFiles } from "@/lib/logo";
import { allowIndexing, site, siteUrl } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import { lightTokens } from "@/lib/tokens";
import "./globals.css";

// Body text: Atkinson Hyperlegible Next, designed by the Braille Institute
// for legibility. Self-hosted from public/fonts (the same files Google Fonts
// serves), with @font-face rules in globals.css, so the italic and latin-ext
// files only download on pages that use them. The upright latin file is
// preloaded below.
const ATKINSON_LATIN = "/fonts/atkinson-next-latin.v1.woff2";

// Prompts, code and commands.
const atkinsonMono = Atkinson_Hyperlegible_Mono({
  variable: "--font-atkinson-mono",
  subsets: ["latin"],
  adjustFontFallback: false,
  fallback: ["ui-monospace", "monospace"],
});

// Headings: Recursive with its "casual" axis turned halfway up. Self-hosted
// from public/fonts, cut down to the weights (600 to 800) and casual range
// (0 to 0.6) the site uses: 65 KB instead of 109 KB. Same arrangement as
// Atkinson above.
const RECURSIVE_LATIN = "/fonts/recursive-casual-latin.v1.woff2";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: `${site.name}: ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website", locale: "en_GB" },
  twitter: { card: "summary_large_image" },
  icons: { apple: "/icons/apple-touch-icon.png" },
  // Hidden from search engines unless NEXT_PUBLIC_ALLOW_INDEXING is "true".
  ...(allowIndexing ? {} : { robots: { index: false, follow: false } }),
};

// The browser's own bars match the page background in each theme (the
// --bg tokens in globals.css).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: lightTokens().bg },
    { media: "(prefers-color-scheme: dark)", color: "#0E1116" },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Titles and order of every lesson (no lesson text), for the header's
  // lesson progress and the continue bar.
  const outline = await getOutline();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={atkinsonMono.variable}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preload" href={ATKINSON_LATIN} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={RECURSIVE_LATIN} as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-dvh flex-col bg-bg text-fg antialiased">
        <a
          href="#main"
          className="sr-only rounded-xl bg-accent print:hidden px-4 py-2 font-bold text-on-accent focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10"
        >
          Skip to content
        </a>
        <SiteHeader outline={outline} logo={getLogoFiles()} />
        <OfflineNotice />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter logo={getLogoFiles()} />
        <ModuleCelebration />
        <ServiceWorker />
      </body>
    </html>
  );
}
