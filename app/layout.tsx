import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { I18nProvider } from "./i18n/I18nProvider";
import { getRequestLocale } from "./i18n/server";
import "./globals.css";
import "./styles/skill-hours-view.css";
import "./styles/sessions.css";
import "./styles/booking.css";
import "./styles/onboarding.css";

const geist = Geist({
  variable: "--font-yuno",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "YUNO — Teach what you know. Learn what you want.",
    template: "%s | YUNO",
  },
  description: "A social skill-sharing platform powered by people, curiosity, and Skill Hours.",
  icons: {
    icon: "/img/favicon.png",
    shortcut: "/img/favicon.png",
    apple: "/img/favicon.png",
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const initialLocale = await getRequestLocale();

  return (
    <html lang={initialLocale}>
      <body className={`${geist.variable}`}>
        <I18nProvider initialLocale={initialLocale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
