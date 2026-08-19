import type { Metadata } from "next";
import { DiscoverApp } from "../components/DiscoverApp";
import { translate } from "../i18n/config";
import { getRequestLocale } from "../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: { absolute: translate(locale, "metadata.discover.title") },
    description: translate(locale, "metadata.discover.description"),
  };
}

export default function DiscoverPage() {
  return <DiscoverApp />;
}
