import InfoPage from "../components/InfoPage";

export default function ContactPage() {
  return (
    <InfoPage
      eyebrowKey="infoPages.contact.eyebrow"
      titleKey="infoPages.contact.title"
      paragraphKeys={[
        "infoPages.contact.paragraph1",
        "infoPages.contact.paragraph2",
      ]}
    />
  );
}
