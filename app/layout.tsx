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
  title: "AME Balance Care | Nursing fluid balance",
  description: "Four-language nursing fluid balance app with bibliography, clinical disclaimer, workbook export and cumulative history.",
  openGraph: {
    title: "AME Balance Care | Less calculation. More time to care.",
    description: "Nursing fluid balance with workbook import, automatic analysis, bibliography and cumulative hospitalization history.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "AME Balance Care, balance hídrico de enfermería" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AME Balance Care | Nursing fluid balance",
    description: "Four-language nursing fluid balance with bibliography and cumulative history.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/app-icon-192.png",
  },
  manifest: "/manifest.webmanifest",
};

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
