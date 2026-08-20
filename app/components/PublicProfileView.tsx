"use client";

import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Globe2,
  Languages,
  MapPin,
  Star,
  Video,
} from "lucide-react";
import type { CurrentUserProfile } from "../data";
import { useI18n } from "../i18n/I18nProvider";
import {
  getCustomSkillLabel,
  isCustomSkillId,
} from "../lib/skills";
import { SkillTag } from "./ui";

type PublicProfileViewProps = {
  profile: CurrentUserProfile;
  onBack: () => void;
};

export function PublicProfileView({
  profile,
  onBack,
}: PublicProfileViewProps) {
  const { t } = useI18n();

  function skillLabel(
    skill: CurrentUserProfile["teaches"][number],
  ) {
    return isCustomSkillId(skill)
      ? getCustomSkillLabel(skill)
      : t(`skills.${skill}`);
  }

  return (
    <section className="public-profile">
      <div className="public-profile__topbar">
        <button
          type="button"
          className="public-profile__back"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          {t("profile.public.back")}
        </button>

        <span>{t("profile.public.previewNotice")}</span>
      </div>

      <article className="public-profile__card">
        <div className="public-profile__photo">
          <Image
            src={profile.image}
            alt={profile.name}
            fill
            sizes="(max-width: 760px) 100vw, 760px"
            unoptimized={profile.image.startsWith("data:")}
            priority
          />

          <div className="public-profile__shade" />

          <div className="public-profile__identity">
            <span className="app-kicker">
              {t("profile.public.kicker")}
            </span>

            <h1>
              {profile.name}, {profile.age}
            </h1>

            <p>
              <MapPin size={16} />
              {profile.city}, {profile.country}
            </p>
          </div>
        </div>

        <div className="public-profile__body">
          <div className="public-profile__main">
            <section className="public-profile__section">
              <span className="app-kicker">
                {t("profile.about.eyebrow")}
              </span>
              <h2>{t("profile.about.title")}</h2>
              <p className="public-profile__bio">
                {profile.bio}
              </p>
            </section>

            <section className="public-profile__section">
              <span className="app-kicker">
                {t("profile.skills.eyebrow")}
              </span>
              <h2>{t("profile.skills.title")}</h2>

              <div className="public-profile__skill-group">
                <strong className="public-profile__skill-label public-profile__skill-label--teach">
                  {t("profile.skills.teach")}
                </strong>

                <div>
                  {profile.teaches.map((skill) => (
                    <SkillTag key={skill} kind="teach">
                      {skillLabel(skill)}
                    </SkillTag>
                  ))}
                </div>
              </div>

              <div className="public-profile__skill-group">
                <strong className="public-profile__skill-label public-profile__skill-label--learn">
                  {t("profile.skills.learn")}
                </strong>

                <div>
                  {profile.learns.map((skill) => (
                    <SkillTag key={skill} kind="learn">
                      {skillLabel(skill)}
                    </SkillTag>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <aside className="public-profile__side">
            <section className="public-profile__panel public-profile__stats">
              <div>
                <span className="public-profile__stat-icon">
                  <Star size={18} fill="currentColor" />
                </span>

                <div>
                  <strong>{profile.rating}</strong>
                  <small>{t("profile.stats.rating")}</small>
                </div>
              </div>

              <div>
                <span className="public-profile__stat-icon">
                  <Clock3 size={18} />
                </span>

                <div>
                  <strong>{profile.completedSessions}</strong>
                  <small>{t("profile.stats.sessions")}</small>
                </div>
              </div>
            </section>

            <section className="public-profile__panel">
              <span className="app-kicker">
                {t("profile.preferences.eyebrow")}
              </span>
              <h2>{t("profile.preferences.title")}</h2>

              <div className="public-profile__preferences">
                <div>
                  <span>
                    <Languages size={17} />
                  </span>

                  <p>
                    <small>
                      {t("profile.preferences.languages")}
                    </small>
                    <strong>
                      {profile.languages
                        .map((language) =>
                          t(
                            `discover.advancedFilters.languages.${language}`,
                          ),
                        )
                        .join(", ")}
                    </strong>
                  </p>
                </div>

                <div>
                  <span>
                    <Video size={17} />
                  </span>

                  <p>
                    <small>
                      {t("profile.preferences.mode")}
                    </small>
                    <strong>
                      {profile.modes
                        .map((mode) =>
                          t(
                            mode === "online"
                              ? "discover.advancedFilters.online"
                              : "discover.advancedFilters.inPerson",
                          ),
                        )
                        .join(" · ")}
                    </strong>
                  </p>
                </div>

                <div>
                  <span>
                    <CalendarDays size={17} />
                  </span>

                  <p>
                    <small>
                      {t("profile.preferences.availability")}
                    </small>
                    <strong>
                      {profile.availability
                        .map((availability) =>
                          t(
                            `discover.advancedFilters.${availability}`,
                          ),
                        )
                        .join(" · ")}
                    </strong>
                  </p>
                </div>

                <div>
                  <span>
                    <Globe2 size={17} />
                  </span>

                  <p>
                    <small>
                      {t("profile.preferences.location")}
                    </small>
                    <strong>
                      {profile.city}, {profile.country}
                    </strong>
                  </p>
                </div>
              </div>
            </section>

            <p className="public-profile__privacy">
              {t("profile.public.privateInfo")}
            </p>
          </aside>
        </div>
      </article>
    </section>
  );
}
