import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OfflineBanner } from "@/components/offline-banner";
import { QueryProvider } from "@/components/providers/query-provider";
import { PwaProvider } from "@/components/providers/pwa-provider";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reading Hub",
  description:
    "Progressive Web App that lets you discover and save articles for offline reading.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-base antialiased`}
      >
        <NuqsAdapter>
          <QueryProvider>
            <PwaProvider />
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <OfflineBanner />
              <main className="flex-1 bg-muted/20">
                <div className="mx-auto w-full max-w-5xl px-4 py-8">
                  {children}
                </div>
              </main>
              <SiteFooter />
            </div>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
