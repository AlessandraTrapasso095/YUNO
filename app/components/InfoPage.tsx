"use client";

import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { useI18n } from "../i18n/I18nProvider";

type InfoPageProps = {
  eyebrowKey: string;
  titleKey: string;
  paragraphKeys: string[];
  notice?: boolean;
};

export default function InfoPage({
  eyebrowKey,
  titleKey,
  paragraphKeys,
  notice = false,
}: InfoPageProps) {
  const { t } = useI18n();

  return (
    <main className="info-page">
      <header className="info-page__header">
        <Logo />

        <div className="info-page__actions">
          <LanguageSwitcher />
          <Link href="/" className="info-page__back">
            ← {t("infoPages.backHome")}
          </Link>
        </div>
      </header>

      <article className="info-page__content">
        <span className="app-kicker">{t(eyebrowKey)}</span>
        <h1>{t(titleKey)}</h1>

        {notice && (
          <p className="info-page__notice">
            {t("infoPages.notice")}
          </p>
        )}

        <div className="info-page__body">
          {paragraphKeys.map((key) => (
            <p key={key}>{t(key)}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
