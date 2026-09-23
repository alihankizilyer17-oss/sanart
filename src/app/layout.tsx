import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SanArt | Original Art Marketplace",
  description:
    "SanArt, özgün tabloları ve sanat eserlerini keşfedebileceğiniz online sanat marketplace platformudur.",
  keywords: [
    "SanArt",
    "sanat",
    "tablolar",
    "özgün tablolar",
    "sanat eserleri",
    "online sanat",
    "art marketplace",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
