import type { Metadata } from "next";
import { OnboardingFlow } from "../components/OnboardingFlow";
import { translate } from "../i18n/config";
import { getRequestLocale } from "../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: {
      absolute: translate(
        locale,
        "metadata.onboarding.title",
      ),
    },
    description: translate(
      locale,
      "metadata.onboarding.description",
    ),
  };
}

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
