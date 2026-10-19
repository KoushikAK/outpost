import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Geist,
  Geist_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import AppShell from "@/components/AppShell";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Headings only; the optical-size axis gives large headings a tighter, more characterful cut.
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Outpost: Agentic Workspace",
  description:
    "An AI agent that draws and writes alongside you and your team, live.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  // Link previews (Slack, X, iMessage...). On Vercel, Next fills in the site URL for these paths.
  openGraph: {
    title: "Outpost: Agentic Workspace",
    description:
      "An AI agent that draws and writes alongside you and your team, live.",
    images: [
      { url: "/social/og-image.png", width: 1200, height: 630, alt: "Outpost" },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/social/og-image.png"] },
};

// Dark-only app: tell the browser so scrollbars, form controls and overscroll match
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0f0e0d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "oklch(0.74 0.16 55)" },
      }}
    >
      <html
        lang="en"
        className={`dark ${geistSans.variable} ${geistMono.variable} ${display.variable} ${bricolage.variable} h-full antialiased`}
      >
        <body className="grain flex min-h-full flex-col">
          <TooltipProvider>
            <AppShell>{children}</AppShell>
          </TooltipProvider>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
