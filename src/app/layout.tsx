import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeVolt - Secure File & Text Sharing",
  description: "Secure your files and text with unique access codes. Made by Suman.",
  keywords: ["CodeVolt", "file sharing", "text sharing", "secure", "access codes", "Suman"],
  authors: [{ name: "Suman" }],
  icons: {
    icon: [
      { url: '/icon.png', sizes: 'any' }
    ],
  },
  openGraph: {
    title: "CodeVolt - Secure File & Text Sharing",
    description: "Secure your files and text with unique access codes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeVolt - Secure File & Text Sharing",
    description: "Secure your files and text with unique access codes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
