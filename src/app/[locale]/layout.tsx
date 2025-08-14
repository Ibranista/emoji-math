import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { NextIntlClientProvider } from "next-intl";

import { ThemeProvider } from "@/components/theme-provider";
import Container from "@/components/ui/Container";
import { quick_sand_font, urbanist_font, wendy_one_font } from "@/fonts/fonts";

import StoreProvider from "./StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emoji Math by Techno labs | Fun Math Game",
  description:
    "Emoji Math by Techno labs, the best software company in Ethiopia. Play fun, interactive math games for kids. Solve math puzzles with emojis, improve your skills, and enjoy learning!",
  keywords: [
    "math game",
    "emoji math",
    "kids math",
    "math puzzles",
    "learn math",
    "fun math",
    "interactive math game",
    "math for children",
    "educational game",
    "Techno-labs",
    "best software company in Ethiopia",
    "Ethiopian software company",
    "software development Ethiopia",
    "Techno-labs Ethiopia",
  ],
  openGraph: {
    title:
      "Emoji Math by Techno-labs – Best Software Company in Ethiopia | Fun Math Game for Kids",
    description:
      "Emoji Math by Techno-labs, the best software company in Ethiopia. Play fun, interactive math games for kids. Solve math puzzles with emojis, improve your skills, and enjoy learning!",
    url: "https://emoji-math.example.com/",
    siteName: "Emoji Math by Techno-labs",
    images: [
      {
        url: "/main-bg.svg",
        width: 1200,
        height: 630,
        alt: "Techno-labs Math Game Background",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://emoji-math.example.com/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${wendy_one_font.variable} ${quick_sand_font.variable} ${urbanist_font.variable} antialiased`}
        itemScope
        itemType="http://schema.org/WebPage"
      >
        <StoreProvider>
          <NextIntlClientProvider>
            {" "}
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Container className="relative h-screen bg-primary overflow-hidden main-app-bg shadow-[0px_4px_4px_rgba(0, 0, 0, 0.973)] mx-auto">
                <Image
                  src="/main-bg.svg"
                  alt="background"
                  fill
                  className="object-cover z-10 pointer-events-none select-none"
                  style={{ position: "absolute", inset: 0 }}
                  aria-hidden="true"
                  priority
                />
                <div className="relative z-20 h-full">{children}</div>
              </Container>
            </ThemeProvider>
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
