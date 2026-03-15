import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Room } from "./Room";
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
  title: "Figma New",
  description: "实时简化Figma在线工具，使用Fabris.js和Liveblocks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-primary-grey-200`}
      >
        <Room>
          {children}
        </Room>
        
      </body>
    </html>
  );
}
