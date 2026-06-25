import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DriveAZ — Rent-A-Car Platforması",
  description: "Azərbaycanda premium avtomobil icarəsi. Geniş park, sürətli rezervasiya, 24/7 dəstək.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className={`${dmSans.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
