import InfoPage from "../components/InfoPage";

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrowKey="infoPages.legalEyebrow"
      titleKey="infoPages.privacy.title"
      paragraphKeys={["infoPages.privacy.paragraph1"]}
      notice
    />
  );
}
