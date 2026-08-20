"use client";

import Image from "next/image";
import { Heart, MessageCircle, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { YunoProfile } from "../data";
import { useI18n } from "../i18n/I18nProvider";
import { Modal, SkillTag } from "./ui";

type MatchesViewProps = {
  matches: YunoProfile[];
  onDiscover: () => void;
  onMessage: (profile: YunoProfile) => void;
  onRemove: (profileId: number) => void;
};

export function MatchesView({
  matches,
  onDiscover,
  onMessage,
  onRemove,
}: MatchesViewProps) {
  const { t } = useI18n();
  const [removeProfile, setRemoveProfile] =
    useState<YunoProfile | null>(null);

  return (
    <section className="matches-view">
      <header className="matches-view__header">
        <div>
          <span className="app-kicker">{t("matches.kicker")}</span>
          <h1>{t("matches.title")}</h1>
          <p>{t("matches.copy")}</p>
        </div>

        {matches.length > 0 && (
          <div className="matches-view__count">
            <Heart size={15} fill="currentColor" />
            <strong>{matches.length}</strong>
            <span>
              {matches.length === 1
                ? t("matches.countSingle")
                : t("matches.countMultiple")}
            </span>
          </div>
        )}
      </header>

      {matches.length === 0 ? (
        <div className="matches-empty">
          <span className="matches-empty__icon">
            <Heart size={26} />
          </span>

          <span className="app-kicker">{t("matches.empty.eyebrow")}</span>
          <h2>{t("matches.empty.title")}</h2>
          <p>{t("matches.empty.copy")}</p>

          <button type="button" onClick={onDiscover}>
            <Search size={17} />
            {t("matches.empty.action")}
          </button>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((profile) => (
            <article className="match-card" key={profile.id}>
              <div className="match-card__image">
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={520}
                  height={620}
                />

                <span className="match-card__score">
                  <Sparkles size={13} />
                  {profile.match}%
                </span>
              </div>

              <div className="match-card__body">
                <div className="match-card__identity">
                  <div>
                    <h2>
                      {profile.name}, {profile.age}
                    </h2>
                    <p>
                      {t(`profiles.${profile.key}.city`)},{" "}
                      {t(`profiles.${profile.key}.country`)}
                    </p>
                  </div>

                  <span className="match-card__heart">
                    <Heart size={17} fill="currentColor" />
                  </span>
                </div>

                <div className="match-card__skills">
                  <span>{t("matches.teaches")}</span>
                  <div>
                    {profile.teaches.slice(0, 2).map((skill) => (
                      <SkillTag key={skill}>
                        {t(`skills.${skill}`)}
                      </SkillTag>
                    ))}
                  </div>
                </div>

                <div className="match-card__actions">
                  <button
                    className="match-card__message"
                    type="button"
                    onClick={() => onMessage(profile)}
                  >
                    <MessageCircle size={17} />
                    {t("matches.message")}
                  </button>

                  <button
                    className="match-card__remove"
                    type="button"
                    onClick={() => setRemoveProfile(profile)}
                  >
                    {t("matches.remove")}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {removeProfile && (
        <Modal
          ariaLabel={t("matches.removeModal.ariaLabel", {
            name: removeProfile.name,
          })}
          className="match-remove-modal"
          overlayClassName="match-remove-modal__overlay"
        >
          <button
            className="match-remove-modal__close"
            type="button"
            onClick={() => setRemoveProfile(null)}
            aria-label={t("common.close")}
          >
            <X size={18} />
          </button>

          <span className="match-remove-modal__icon">
            <Heart size={24} fill="currentColor" />
          </span>

          <span className="app-kicker">
            {t("matches.removeModal.eyebrow")}
          </span>

          <h2>
            {t("matches.removeModal.title", {
              name: removeProfile.name,
            })}
          </h2>

          <p>
            {t("matches.removeModal.copy", {
              name: removeProfile.name,
            })}
          </p>

          <div className="match-remove-modal__actions">
            <button
              className="match-remove-modal__keep"
              type="button"
              onClick={() => setRemoveProfile(null)}
            >
              {t("matches.removeModal.keep")}
            </button>

            <button
              className="match-remove-modal__confirm"
              type="button"
              onClick={() => {
                onRemove(removeProfile.id);
                setRemoveProfile(null);
              }}
            >
              {t("matches.removeModal.confirm")}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
