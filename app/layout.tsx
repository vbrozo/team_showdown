import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Lagoda Team Showdown 2026",
  description: "Službeni rezultati i scoring za Lagoda Team Showdown 2026.",
  icons: { icon: "/lagoda-logo.jpg" },
  openGraph: { title: "Lagoda Team Showdown 2026", description: "Prati rezultate uživo.", images: ["/og.png"], type: "website" },
  twitter: { card: "summary_large_image", title: "Lagoda Team Showdown 2026", description: "Prati rezultate uživo.", images: ["/og.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="hr"><body className={`${inter.variable} ${oswald.variable}`}>{children}</body></html>;
}
