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
        <footer className="mt-auto px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-[12px] text-text-muted">
            <span>WhoKnowsMe</span>
            <span aria-hidden="true">·</span>
            <a href="/privacy" className="hover:text-text transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-text transition-colors">
              Terms
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
