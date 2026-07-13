import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "WhoKnowsMe — the friendship quiz for your group chat",
  description:
    "Make a quiz about yourself, send one link, and find out who actually knows you.",
  // Strip query params from Referer headers site-wide.
  // Prevents the manage page's ?token= from leaking to external services.
  referrer: "origin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
