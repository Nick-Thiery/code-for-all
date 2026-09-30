import type { Metadata, Viewport } from "next";
import { Archivo, Atkinson_Hyperlegible_Mono, Newsreader } from "next/font/google";
import { ModuleCelebration } from "@/components/module-celebration";
import { OfflineNotice } from "@/components/offline-notice";
import { ServiceWorker } from "@/components/service-worker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getOutline } from "@/lib/lessons";
import { getLogoFiles } from "@/lib/logo";
import { allowIndexing, site, siteUrl } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import { darkTokens, lightTokens } from "@/lib/tokens";
import "./globals.css";

// Body text: Atkinson Hyperlegible Next, designed by the Braille Institute
// for legibility. Self-hosted from public/fonts (the same files Google Fonts
// serves), with @font-face rules in globals.css, so the italic and latin-ext
// files only download on pages that use them. The upright latin file is
// preloaded below.
const ATKINSON_LATIN = "/fonts/atkinson-next-latin.v1.woff2";

// Display: Archivo with its width axis, for the condensed headlines, numerals,
// kickers and buttons (font-stretch 62% to 88%). Always set in capitals.
// next/font downloads it at build time and serves it from this site.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  // The fallback is set much wider than condensed Archivo, so don't pretend to match it.
  adjustFontFallback: false,
});

// Serif: Newsreader, upright and italic, with its optical-size axis. Card
// titles, questions, the lede and dek, captions and pull quotes.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

// Prompts, code and commands.
const atkinsonMono = Atkinson_Hyperlegible_Mono({
  variable: "--font-atkinson-mono",
  subsets: ["latin"],
  adjustFontFallback: false,
  fallback: ["ui-monospace", "monospace"],
  preload: false,
});

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
// --paper tokens in globals.css).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: lightTokens().paper },
    { media: "(prefers-color-scheme: dark)", color: darkTokens().paper },
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
      className={`${archivo.variable} ${newsreader.variable} ${atkinsonMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preload" href={ATKINSON_LATIN} as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-dvh flex-col bg-bg text-fg antialiased">
        <a
          href="#main"
          className="stamp sr-only px-4 py-2.5 text-[15px] print:hidden focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
        >
          Skip to content
        </a>
        <SiteHeader outline={outline} logo={getLogoFiles()} />
        <OfflineNotice />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter firstLesson={outline.modules[0]?.lessons[0]?.href ?? null} />
        <ModuleCelebration />
        <ServiceWorker />
      </body>
    </html>
  );
}
