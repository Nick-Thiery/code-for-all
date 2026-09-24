import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Recursive } from "next/font/google";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import "./globals.css";

// Body text: designed by the Braille Institute for legibility.
const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin"],
  style: ["normal", "italic"],
  // next/font has no fallback metrics for this family yet and warns on every compile.
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

// Headings: Recursive with its "casual" axis turned halfway up.
const recursive = Recursive({
  variable: "--font-recursive",
  subsets: ["latin"],
  axes: ["CASL"],
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${atkinson.variable} ${recursive.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only rounded-full bg-accent px-4 py-2 font-bold text-on-accent focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10"
        >
          Skip to content
        </a>
        <div className="mx-auto flex min-h-dvh max-w-[46rem] flex-col px-5 sm:px-8">
          <SiteHeader />
          <main id="main" className="flex-1 pt-6 pb-24 sm:pt-10">
            {children}
          </main>
          <footer className="border-t-2 border-rule py-8 text-base text-muted">
            Running a session?{" "}
            <Link href="/run-it" className="link text-ink">
              Facilitator materials
            </Link>{" "}
            are on the Run it page.
          </footer>
        </div>
      </body>
    </html>
  );
}
