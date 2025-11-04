import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* 
These calls for google fonts happen once per build time, 
not per request 
*/
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//define page title and description for browser metadata and SEO
export const metadata: Metadata = {
  title: "Property Aggregator",
  description: "Look through Florida property records.",
};

//wrap pages into shared HTML
//applies all the global fonts and styling
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
