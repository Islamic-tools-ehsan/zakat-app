import type { Metadata } from "next";
import "./globals.css";

// 1. Export the Metadata object at the top
export const metadata: Metadata = {
  title: "Islamic Zakat Calculator",
  description: "The world's most authentic and beautiful Zakat app.",
  manifest: "/manifest.json",
  appleWebApp: {
    title: "ZakatApp",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icon-192x192.png",
  },
};

// 2. Your structural Layout function follows
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* You don't need to manually add <title> or <meta> here anymore! 
            Next.js handles it using the metadata object above. */}
        <meta name="theme-color" content="#047857" />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
