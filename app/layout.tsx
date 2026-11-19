import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const openSauce = localFont({
  src: [
    { path: "./fonts/open-sauce-one-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/open-sauce-one-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/open-sauce-one-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-open-sauce",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workseez - One Step Solution For Your Business",
  description:
    "Digital Marketing, Web & Software Dev, Video Editing, AI Automation, Content Creation and Social Media.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${openSauce.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* Frosted fade fixed to the bottom of the screen on every page. */}
        <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-18 backdrop-blur-sm mask-t-from-30%" />
      </body>
    </html>
  );
}
