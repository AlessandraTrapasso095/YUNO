"use client";

import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  Sparkles,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { SkillTag } from "./ui";

export function AppContextPanel() {
  const { t } = useI18n();

  return (
    <aside className="context-panel">
      <div className="context-panel__top">
        <span>{t("discover.context.yourDay")}</span>
        <button
          type="button"
          aria-label={t("discover.context.panelSettings")}
        >
          •••
        </button>
      </div>

      <section className="balance-card">
        <div className="balance-card__header">
          <span>
            <Clock3 size={17} />
            {t("discover.context.yourSkillHours")}
          </span>
          <Sparkles size={16} />
        </div>

        <div className="balance-card__amount">
          <strong>4.5</strong>
          <span>SH</span>
        </div>

        <div className="balance-card__meter">
          <span />
        </div>

        <p>{t("discover.context.balanceCopy")}</p>

        <button type="button">
          {t("discover.context.viewActivity")} <span>→</span>
        </button>
      </section>

      <section className="next-session-card">
        <div className="context-card-heading">
          <span>{t("discover.context.nextSession")}</span>
          <button type="button">
            {t("discover.context.viewAll")}
          </button>
        </div>

        <div className="session-person">
          <Image
            src="/people/sofia.jpg"
            alt="Sofia"
            width={84}
            height={84}
          />
          <div>
            <strong>{t("discover.context.spanishWithSofia")}</strong>
            <span>
              <span className="online-dot" />
              {t("discover.context.confirmed")}
            </span>
          </div>
        </div>

        <div className="session-time">
          <span>
            <CalendarDays size={17} />
            {t("discover.context.today")}
          </span>
          <span>
            <Clock3 size={17} />
            18:30
          </span>
        </div>

        <button className="session-join" type="button">
          {t("discover.context.viewSession")}
        </button>
      </section>

      <section className="weekly-card">
        <div className="weekly-card__icon">
          <Sparkles />
        </div>
        <div>
          <strong>{t("discover.context.streakTitle")}</strong>
          <p>{t("discover.context.streakCopy")}</p>
        </div>
      </section>

      <section className="popular-now">
        <div className="context-card-heading">
          <span>{t("discover.context.popular")}</span>
        </div>

        <div>
          <SkillTag kind="teach">{t("skills.italian")}</SkillTag>
          <small>{t("discover.context.people", { count: 42 })}</small>
        </div>

        <div>
          <SkillTag kind="learn">{t("skills.piano")}</SkillTag>
          <small>{t("discover.context.people", { count: 28 })}</small>
        </div>

        <div>
          <SkillTag kind="neutral">{t("skills.marketing")}</SkillTag>
          <small>{t("discover.context.people", { count: 21 })}</small>
        </div>
      </section>
    </aside>
  );
}
