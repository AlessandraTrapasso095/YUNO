import InfoPage from "../components/InfoPage";

export default function TermsPage() {
  return (
    <InfoPage
      eyebrowKey="infoPages.legalEyebrow"
      titleKey="infoPages.terms.title"
      paragraphKeys={["infoPages.terms.paragraph1"]}
      notice
    />
  );
}
