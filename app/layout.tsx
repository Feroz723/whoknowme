import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhoKnowsMe — the friendship quiz for your group chat",
  description:
    "Make a quiz about yourself, send one link, and find out who actually knows you.",
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
