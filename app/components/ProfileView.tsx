"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Globe2,
  Languages,
  MapPin,
  Eye,
  Pencil,
  Star,
  Video,
} from "lucide-react";
import type { CurrentUserProfile } from "../data";
import { useI18n } from "../i18n/I18nProvider";
import {
  getCustomSkillLabel,
  isCustomSkillId,
} from "../lib/skills";
import { calculateProfileCompletion } from "../lib/profile";
import { EditProfileModal } from "./EditProfileModal";
import { PublicProfileView } from "./PublicProfileView";
import { SkillHourBadge, SkillTag } from "./ui";

type ProfileViewProps = {
  profile: CurrentUserProfile;
  onProfileChange: (profile: CurrentUserProfile) => void;
};

export function ProfileView({
  profile,
  onProfileChange,
}: ProfileViewProps) {
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const [publicPreview, setPublicPreview] = useState(false);
  const profileCompletion =
    calculateProfileCompletion(profile);

  function completionMessage() {
    if (
      !profile.image ||
      profile.image === "/people/anna.jpg"
    ) {
      return t("profile.completion.missingPhoto");
    }

    if (profile.bio.trim().length < 20) {
      return t("profile.completion.missingBio");
    }

    if (!profile.teaches.length) {
      return t("profile.completion.missingTeach");
    }

    if (!profile.learns.length) {
      return t("profile.completion.missingLearn");
    }

    if (!profile.languages.length) {
      return t("profile.completion.missingLanguage");
    }

    if (!profile.modes.length) {
      return t("profile.completion.missingMode");
    }

    if (!profile.availability.length) {
      return t("profile.completion.missingAvailability");
    }

    if (profileCompletion < 100) {
      return t("profile.completion.makeStronger");
    }

    return t("profile.completion.complete");
  }

  if (publicPreview) {
    return (
      <PublicProfileView
        profile={profile}
        onBack={() => setPublicPreview(false)}
      />
    );
  }

  function skillLabel(
    skill: CurrentUserProfile["teaches"][number],
  ) {
    return isCustomSkillId(skill)
      ? getCustomSkillLabel(skill)
      : t(`skills.${skill}`);
  }

  return (
    <section className="profile-view">
      <header className="profile-view__hero">
        <div className="profile-view__cover" />

        <div className="profile-view__identity">
          <div className="profile-view__avatar-wrap">
            <Image
              src={profile.image}
              alt={profile.name}
              width={180}
              height={180}
              className="profile-view__avatar"
              unoptimized={profile.image.startsWith("data:")}
            />

            <span className="profile-view__verified">
              <CheckCircle2 size={16} fill="currentColor" />
            </span>
          </div>

          <div className="profile-view__identity-copy">
            <span className="app-kicker">{t("profile.kicker")}</span>

            <h1>
              {profile.name}, {profile.age}
            </h1>

            <p className="profile-view__location">
              <MapPin size={15} />
              {profile.city}, {profile.country}
            </p>
          </div>

          <div className="profile-view__actions">
            <button
              className="profile-view__public"
              type="button"
              onClick={() => setPublicPreview(true)}
            >
              <Eye size={16} />
              {t("profile.public.action")}
            </button>

            <button
              className="profile-view__edit"
              type="button"
              onClick={() => setEditing(true)}
            >
              <Pencil size={16} />
              {t("profile.edit")}
            </button>
          </div>
        </div>
      </header>

      <div className="profile-view__content">
        <div className="profile-view__main">
          <section className="profile-panel">
            <div className="profile-panel__heading">
              <div>
                <span className="app-kicker">{t("profile.about.eyebrow")}</span>
                <h2>{t("profile.about.title")}</h2>
              </div>
            </div>

            <p className="profile-view__bio">{profile.bio}</p>
          </section>

          <section className="profile-panel">
            <div className="profile-panel__heading">
              <div>
                <span className="app-kicker">{t("profile.skills.eyebrow")}</span>
                <h2>{t("profile.skills.title")}</h2>
              </div>
            </div>

            <div className="profile-skill-section">
              <span className="profile-skill-section__label profile-skill-section__label--teach">
                {t("profile.skills.teach")}
              </span>

              <div className="profile-skill-section__tags">
                {profile.teaches.map((skill) => (
                  <SkillTag key={skill} kind="teach">
                    {skillLabel(skill)}
                  </SkillTag>
                ))}
              </div>
            </div>

            <div className="profile-skill-section">
              <span className="profile-skill-section__label profile-skill-section__label--learn">
                {t("profile.skills.learn")}
              </span>

              <div className="profile-skill-section__tags">
                {profile.learns.map((skill) => (
                  <SkillTag key={skill} kind="learn">
                    {skillLabel(skill)}
                  </SkillTag>
                ))}
              </div>
            </div>
          </section>

          <section className="profile-panel">
            <div className="profile-panel__heading">
              <div>
                <span className="app-kicker">{t("profile.preferences.eyebrow")}</span>
                <h2>{t("profile.preferences.title")}</h2>
              </div>
            </div>

            <div className="profile-preferences">
              <div className="profile-preference">
                <span className="profile-preference__icon">
                  <Languages size={18} />
                </span>
                <div>
                  <span>{t("profile.preferences.languages")}</span>
                  <strong>
                    {profile.languages
                      .map((language) =>
                        t(`discover.advancedFilters.languages.${language}`),
                      )
                      .join(", ")}
                  </strong>
                </div>
              </div>

              <div className="profile-preference">
                <span className="profile-preference__icon">
                  <Video size={18} />
                </span>
                <div>
                  <span>{t("profile.preferences.mode")}</span>
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
                </div>
              </div>

              <div className="profile-preference">
                <span className="profile-preference__icon">
                  <CalendarDays size={18} />
                </span>
                <div>
                  <span>{t("profile.preferences.availability")}</span>
                  <strong>
                    {profile.availability
                      .map((availability) =>
                        t(
                          `discover.advancedFilters.${availability}`,
                        ),
                      )
                      .join(" · ")}
                  </strong>
                </div>
              </div>

              <div className="profile-preference">
                <span className="profile-preference__icon">
                  <Globe2 size={18} />
                </span>
                <div>
                  <span>{t("profile.preferences.location")}</span>
                  <strong>
                    {profile.city}, {profile.country}
                  </strong>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="profile-view__side">
          <section className="profile-panel profile-panel--stats">
            <div className="profile-stat">
              <span>
                <Star size={18} fill="currentColor" />
              </span>
              <div>
                <strong>{profile.rating}</strong>
                <small>{t("profile.stats.rating")}</small>
              </div>
            </div>

            <div className="profile-stat">
              <span>
                <Clock3 size={18} />
              </span>
              <div>
                <strong>{profile.completedSessions}</strong>
                <small>{t("profile.stats.sessions")}</small>
              </div>
            </div>
          </section>

          <section className="profile-panel profile-panel--hours">
            <span className="app-kicker">{t("profile.hours.eyebrow")}</span>
            <h2>{t("profile.hours.title")}</h2>

            <SkillHourBadge balance={profile.skillHours.toFixed(1)} />

            <p>{t("profile.hours.copy")}</p>
          </section>

          <section className="profile-panel profile-panel--completion">
            <div className="profile-completion__top">
              <div>
                <span className="app-kicker">{t("profile.completion.eyebrow")}</span>
                <h2>{t("profile.completion.title")}</h2>
              </div>

              <strong>{profileCompletion}%</strong>
            </div>

            <div
              className="profile-completion__bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={profileCompletion}
            >
              <span
                style={{
                  width: `${profileCompletion}%`,
                }}
              />
            </div>

            <p>{completionMessage()}</p>
          </section>
        </aside>
      </div>
      {editing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={(updatedProfile) => {
            onProfileChange(updatedProfile);
          }}
        />
      )}
    </section>
  );
}
