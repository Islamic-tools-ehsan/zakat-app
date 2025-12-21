import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Islamic Zakat Calculator",
  description: "The world's most authentic and beautiful Zakat app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* This link makes the PWA installable */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#047857" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
