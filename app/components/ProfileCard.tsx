"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { Bookmark, Heart, MapPin, RotateCcw, Sparkles, X } from "lucide-react";
import type { YunoProfile } from "../data";
import { profileCardEnter } from "../lib/motion";
import { useI18n } from "../i18n/I18nProvider";
import { SkillTag } from "./ui";

type ProfileCardProps = {
  profile: YunoProfile;
  mode?: "preview" | "discover" | "hero";
  draggable?: boolean;
  saved?: boolean;
  onSkip?: () => void;
  onSave?: () => void;
  onConnect?: () => void;
};

export function ProfileCard({
  profile,
  mode = "preview",
  draggable = false,
  saved = false,
  onSkip,
  onSave,
  onConnect,
}: ProfileCardProps) {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const city = t(`profiles.${profile.key}.city`);
  const country = t(`profiles.${profile.key}.country`);

  return (
    <motion.article
      className={`profile-card profile-card--${mode}`}
      drag={draggable && !reduceMotion ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.16}
      whileDrag={{ rotate: 2.4, scale: 1.015, cursor: "grabbing" }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 110) onConnect?.();
        if (info.offset.x < -110) onSkip?.();
      }}
      variants={reduceMotion ? undefined : profileCardEnter}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "visible"}
    >
      <div className="profile-card__image-wrap">
        <Image className="profile-card__image" src={profile.image} alt={t("profileCard.imageAlt", { name: profile.name, city })} fill sizes={mode === "discover" ? "(max-width: 760px) 100vw, 440px" : "(max-width: 760px) 86vw, 420px"} priority={mode === "hero"} />
        <div className="profile-card__shade" />
        <span className="profile-card__match"><Sparkles size={14} fill="currentColor" /> {profile.match}% {t("profileCard.skillMatch")}</span>
        <div className="profile-card__identity profile-card__identity--photo">
          <div>
            <h3>{profile.name}, {profile.age}</h3>
            <p><MapPin size={15} /> {city}, {country}</p>
          </div>
          <span className="online-dot" aria-label={t("profileCard.online")} />
        </div>
      </div>

      <div className="profile-card__content">
        {mode === "discover" && <p className="profile-card__bio">{t(`profiles.${profile.key}.bio`)}</p>}
        <div className="skill-group">
          <span className="skill-group__label skill-group__label--teach"><span /> {t("profileCard.teaches")}</span>
          <div className="skill-list">
            {profile.teaches.map((skill) => <SkillTag key={skill} kind="teach">{t(`skills.${skill}`)}</SkillTag>)}
          </div>
        </div>
        <div className="skill-group">
          <span className="skill-group__label skill-group__label--learn"><span /> {t("profileCard.learns")}</span>
          <div className="skill-list">
            {profile.learns.map((skill) => <SkillTag key={skill} kind="learn">{t(`skills.${skill}`)}</SkillTag>)}
          </div>
        </div>

        {mode !== "hero" && (
          <div className="profile-actions">
            <button className="profile-action profile-action--skip" type="button" onClick={onSkip} aria-label={t("profileCard.skipAria", { name: profile.name })}>
              {mode === "discover" ? <X /> : <RotateCcw />}
              <span>{t("profileCard.skip")}</span>
            </button>
            <button className={`profile-action profile-action--save ${saved ? "is-active" : ""}`} type="button" onClick={onSave} aria-label={t("profileCard.saveAria", { name: profile.name })}>
              <Bookmark fill={saved ? "currentColor" : "none"} />
              <span>{saved ? t("profileCard.saved") : t("profileCard.save")}</span>
            </button>
            <button className="profile-action profile-action--connect" type="button" onClick={onConnect} aria-label={t("profileCard.connectAria", { name: profile.name })}>
              <Heart fill="currentColor" />
              <span>{t("profileCard.connect")}</span>
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
