import InfoPage from "../components/InfoPage";

export default function CookiePolicyPage() {
  return (
    <InfoPage
      eyebrowKey="infoPages.legalEyebrow"
      titleKey="infoPages.cookies.title"
      paragraphKeys={["infoPages.cookies.paragraph1"]}
      notice
    />
  );
}
