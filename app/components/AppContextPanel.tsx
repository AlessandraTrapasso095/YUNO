"use client";

import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  Sparkles,
} from "lucide-react";
import type {
  ProfileSkillId,
  YunoProfile,
} from "../data";
import type { AppNavId } from "../lib/app-navigation";
import { useI18n } from "../i18n/I18nProvider";
import { SkillTag } from "./ui";

type NextSession = {
  profile: YunoProfile;
  skill: ProfileSkillId;
  date: string;
  time: string;
};

type NearbyPopularSkill = {
  skill: ProfileSkillId;
  count: number;
};

type AppContextPanelProps = {
  skillHours: number;
  nextSession: NextSession | null;
  popularNearby: NearbyPopularSkill[];
  onNavigate: (id: AppNavId) => void;
  onDiscover: () => void;
};

export function AppContextPanel({
  skillHours,
  nextSession,
  popularNearby,
  onNavigate,
  onDiscover,
}: AppContextPanelProps) {
  const { t } = useI18n();

  function formatSessionDate(date: string) {
    const target = new Date(`${date}T12:00:00`);
    const today = new Date();

    const todayKey = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (date === todayKey) {
      return t("discover.context.today");
    }

    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
    }).format(target);
  }

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
          <strong>{skillHours.toFixed(1)}</strong>
          <span>SH</span>
        </div>

        <div className="balance-card__meter">
          <span />
        </div>

        <p>{t("discover.context.balanceCopy")}</p>

        <button
          type="button"
          onClick={() => onNavigate("skillHours")}
        >
          {t("discover.context.viewActivity")} <span>→</span>
        </button>
      </section>

      {nextSession ? (
        <section className="next-session-card">
          <div className="context-card-heading">
            <span>{t("discover.context.nextSession")}</span>

            <button
              type="button"
              onClick={() => onNavigate("sessions")}
            >
              {t("discover.context.viewAll")}
            </button>
          </div>

          <div className="session-person">
            <Image
              src={nextSession.profile.image}
              alt={nextSession.profile.name}
              width={84}
              height={84}
            />

            <div>
              <strong>
                {t(`skills.${nextSession.skill}`)} ·{" "}
                {nextSession.profile.name}
              </strong>

              <span>
                <span className="online-dot" />
                {t("discover.context.confirmed")}
              </span>
            </div>
          </div>

          <div className="session-time">
            <span>
              <CalendarDays size={17} />
              {formatSessionDate(nextSession.date)}
            </span>

            <span>
              <Clock3 size={17} />
              {nextSession.time}
            </span>
          </div>

          <button
            className="session-join"
            type="button"
            onClick={() => onNavigate("sessions")}
          >
            {t("discover.context.viewSession")}
          </button>
        </section>
      ) : (
        <section className="next-session-card next-session-card--empty">
          <div className="context-card-heading">
            <span>{t("discover.context.nextSession")}</span>
          </div>

          <div className="context-session-empty">
            <span>
              <CalendarDays size={20} />
            </span>

            <div>
              <strong>
                {t("discover.context.noSessionTitle")}
              </strong>

              <p>
                {t("discover.context.noSessionCopy")}
              </p>
            </div>
          </div>

          <button
            className="session-join"
            type="button"
            onClick={onDiscover}
          >
            {t("discover.context.findSomeone")}
          </button>
        </section>
      )}

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

        {popularNearby.length ? (
          popularNearby.map((item, index) => (
            <div key={item.skill}>
              <SkillTag
                kind={
                  index === 0
                    ? "teach"
                    : index === 1
                      ? "learn"
                      : "neutral"
                }
              >
                {t(`skills.${item.skill}`)}
              </SkillTag>

              <small>
                {t("discover.context.people", {
                  count: item.count,
                })}
              </small>
            </div>
          ))
        ) : (
          <p className="popular-now__empty">
            {t("discover.context.noPopularNearby")}
          </p>
        )}
      </section>
    </aside>
  );
}
