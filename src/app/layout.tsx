import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResearchAI — Turn Research Questions into Real Insights",
  description:
    "Discover papers, understand methods, identify gaps, and build what's next with your AI research partner.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
