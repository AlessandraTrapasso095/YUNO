import type { Metadata } from "next";
import { HomePage } from "./components/HomePage";
import { translate } from "./i18n/config";
import { getRequestLocale } from "./i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: { absolute: translate(locale, "metadata.home.title") },
    description: translate(locale, "metadata.home.description"),
  };
}

export default function Home() {
  return <HomePage />;
}
