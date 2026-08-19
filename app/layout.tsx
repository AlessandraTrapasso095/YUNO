import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-yuno",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yuno.example"),
  title: {
    default: "YUNO — Teach what you know. Learn what you want.",
    template: "%s | YUNO",
  },
  description: "A social skill-sharing platform powered by people, curiosity, and Skill Hours.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    title: "YUNO — Teach what you know. Learn what you want.",
    description: "Meet people through skills, earn Skill Hours, and keep curiosity moving.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "YUNO — Teach what you know. Learn what you want." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "YUNO — Teach what you know. Learn what you want.",
    description: "Meet people through skills, earn Skill Hours, and keep curiosity moving.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FAFBFF",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable}`}>{children}</body>
    </html>
  );
}
