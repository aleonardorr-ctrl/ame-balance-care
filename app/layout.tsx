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
  title: "BalanceCare | Balance hídrico de enfermería",
  description: "Plantilla Excel, análisis automático y reporte visual de balance hídrico para enfermería.",
  openGraph: {
    title: "BalanceCare | Menos cálculo. Más tiempo para cuidar.",
    description: "Balance hídrico de enfermería con plantilla Excel, análisis automático y reporte terminado.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "BalanceCare, balance hídrico de enfermería" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BalanceCare | Balance hídrico de enfermería",
    description: "Menos cálculo. Más tiempo para cuidar.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
