"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { Bookmark, Heart, MapPin, RotateCcw, Sparkles, X } from "lucide-react";
import type { YunoProfile } from "../data";
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
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 210, damping: 24 }}
    >
      <div className="profile-card__image-wrap">
        <Image className="profile-card__image" src={profile.image} alt={`${profile.name}, YUNO member in ${profile.city}`} fill sizes={mode === "discover" ? "(max-width: 760px) 100vw, 440px" : "(max-width: 760px) 86vw, 420px"} priority={mode === "hero"} />
        <div className="profile-card__shade" />
        <span className="profile-card__match"><Sparkles size={14} fill="currentColor" /> {profile.match}% Skill Match</span>
        <div className="profile-card__identity profile-card__identity--photo">
          <div>
            <h3>{profile.name}, {profile.age}</h3>
            <p><MapPin size={15} /> {profile.city}, {profile.country}</p>
          </div>
          <span className="online-dot" aria-label="Online now" />
        </div>
      </div>

      <div className="profile-card__content">
        {mode === "discover" && <p className="profile-card__bio">{profile.bio}</p>}
        <div className="skill-group">
          <span className="skill-group__label skill-group__label--teach"><span /> I teach</span>
          <div className="skill-list">
            {profile.teaches.map((skill) => <SkillTag key={skill} kind="teach">{skill}</SkillTag>)}
          </div>
        </div>
        <div className="skill-group">
          <span className="skill-group__label skill-group__label--learn"><span /> I want to learn</span>
          <div className="skill-list">
            {profile.learns.map((skill) => <SkillTag key={skill} kind="learn">{skill}</SkillTag>)}
          </div>
        </div>

        {mode !== "hero" && (
          <div className="profile-actions">
            <button className="profile-action profile-action--skip" type="button" onClick={onSkip} aria-label={`Skip ${profile.name}`}>
              {mode === "discover" ? <X /> : <RotateCcw />}
              <span>Skip</span>
            </button>
            <button className={`profile-action profile-action--save ${saved ? "is-active" : ""}`} type="button" onClick={onSave} aria-label={`Save ${profile.name}`}>
              <Bookmark fill={saved ? "currentColor" : "none"} />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
            <button className="profile-action profile-action--connect" type="button" onClick={onConnect} aria-label={`Connect with ${profile.name}`}>
              <Heart fill="currentColor" />
              <span>Connect</span>
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
