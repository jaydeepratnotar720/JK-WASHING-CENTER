import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PwaManager } from "@/components/pwa/pwa-manager";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0a0e17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "JK WASHING CENTER — Car & Bike Wash Management System",
  description: "Your Car. Your Bike. Our Shine. Premium automobile detailing, ceramic coating, steam sanitization, and washing booking management system.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/logo.svg",
    apple: "/icons/icon-192x192.png",
  },
  keywords: ["car wash", "bike wash", "car detailing", "JK washing center", "mumbai detailing", "PWA wash booking"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icons/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col antialiased`}>
        <PwaManager />
        {children}
      </body>
    </html>
  );
}
