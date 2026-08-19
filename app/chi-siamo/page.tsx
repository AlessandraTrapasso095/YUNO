import InfoPage from "../components/InfoPage";

export default function AboutPage() {
  return (
    <InfoPage
      eyebrowKey="infoPages.about.eyebrow"
      titleKey="infoPages.about.title"
      paragraphKeys={[
        "infoPages.about.paragraph1",
        "infoPages.about.paragraph2",
        "infoPages.about.paragraph3",
      ]}
    />
  );
}
