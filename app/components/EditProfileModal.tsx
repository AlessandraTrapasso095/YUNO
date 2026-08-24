"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import type {
  AvailabilityTimeRange,
  WeekdayId,
  CurrentUserProfile,
  LanguageId,
  LearningMode,
} from "../data";
import {
  createCustomSkillId,
  getCustomSkillLabel,
  isCustomSkillId,
  normalizeSkillName,
  skillOptions,
} from "../lib/skills";
import { useI18n } from "../i18n/I18nProvider";
import { Input, Modal } from "./ui";
import { ProfilePhotoCropper } from "./ProfilePhotoCropper";

type EditProfileModalProps = {
  profile: CurrentUserProfile;
  onClose: () => void;
  onSave: (profile: CurrentUserProfile) => void;
};



const languageOptions: LanguageId[] = [
  "italian",
  "english",
  "spanish",
  "portuguese",
  "german",
];

const modeOptions: LearningMode[] = [
  "online",
  "inPerson",
];

const weekdayOptions: WeekdayId[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function toggleItem<T extends string>(
  values: T[],
  value: T,
) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function EditProfileModal({
  profile,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const { t } = useI18n();
  const [customTeach, setCustomTeach] = useState("");
  const [customLearn, setCustomLearn] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [cropSource, setCropSource] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState<CurrentUserProfile>({
    ...profile,
    teaches: [...profile.teaches],
    learns: [...profile.learns],
    modes: [...profile.modes],
    languages: [...profile.languages],
    availability: [...profile.availability],
    weeklyAvailability: Object.fromEntries(
      Object.entries(profile.weeklyAvailability).map(
        ([day, ranges]) => [
          day,
          ranges.map((range) => ({ ...range })),
        ],
      ),
    ) as CurrentUserProfile["weeklyAvailability"],
  });

  function getSkillLabel(skill: CurrentUserProfile["teaches"][number]) {
    return isCustomSkillId(skill)
      ? getCustomSkillLabel(skill)
      : t(`skills.${skill}`);
  }

  function resolveSkill(value: string) {
    const normalized = normalizeSkillName(value);

    if (!normalized) return null;

    const catalogSkill = skillOptions.find((skill) => {
      return (
        normalizeSkillName(skill) === normalized ||
        normalizeSkillName(t(`skills.${skill}`)) === normalized
      );
    });

    if (catalogSkill) return catalogSkill;

    return createCustomSkillId(value);
  }

  function addCustomSkill(
    type: "teach" | "learn",
    value: string,
  ) {
    const skill = resolveSkill(value);

    if (!skill) return;

    setDraft((current) => {
      if (type === "teach") {
        if (current.teaches.includes(skill)) return current;

        return {
          ...current,
          teaches: [...current.teaches, skill],
        };
      }

      if (current.learns.includes(skill)) return current;

      return {
        ...current,
        learns: [...current.learns, skill],
      };
    });

    if (type === "teach") {
      setCustomTeach("");
    } else {
      setCustomLearn("");
    }
  }

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setPhotoError(t("profile.editModal.photoTypeError"));
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError(t("profile.editModal.photoSizeError"));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      setCropSource(reader.result);
      setPhotoError("");
    };

    reader.onerror = () => {
      setPhotoError(t("profile.editModal.photoReadError"));
    };

    reader.readAsDataURL(file);
  }

  function addAvailabilityRange(day: WeekdayId) {
    setDraft((current) => ({
      ...current,
      weeklyAvailability: {
        ...current.weeklyAvailability,
        [day]: [
          ...current.weeklyAvailability[day],
          { start: "09:00", end: "10:00" },
        ],
      },
    }));
  }

  function updateAvailabilityRange(
    day: WeekdayId,
    index: number,
    field: keyof AvailabilityTimeRange,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      weeklyAvailability: {
        ...current.weeklyAvailability,
        [day]: current.weeklyAvailability[day].map(
          (range, rangeIndex) =>
            rangeIndex === index
              ? { ...range, [field]: value }
              : range,
        ),
      },
    }));
  }

  function removeAvailabilityRange(
    day: WeekdayId,
    index: number,
  ) {
    setDraft((current) => ({
      ...current,
      weeklyAvailability: {
        ...current.weeklyAvailability,
        [day]: current.weeklyAvailability[day].filter(
          (_, rangeIndex) => rangeIndex !== index,
        ),
      },
    }));
  }

  function saveProfile() {
    onSave(draft);
    onClose();
  }

  return (
    <Modal
      ariaLabel={t("profile.editModal.ariaLabel")}
      className="profile-edit-modal"
      overlayClassName="profile-edit-modal__overlay"
    >
      <header className="profile-edit-modal__header">
        <div>
          <span className="app-kicker">
            {t("profile.editModal.eyebrow")}
          </span>
          <h2>{t("profile.editModal.title")}</h2>
          <p>{t("profile.editModal.copy")}</p>
        </div>

        <button
          className="profile-edit-modal__close"
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          <X size={18} />
        </button>
      </header>

      <div className="profile-edit-modal__body">
        <section className="profile-edit-section">
          <h3>{t("profile.editModal.personal")}</h3>

          <div className="profile-edit-photo">
            <div className="profile-edit-photo__preview">
              <Image
                src={draft.image}
                alt={draft.name}
                width={172}
                height={172}
                unoptimized={draft.image.startsWith("data:")}
              />

              <span aria-hidden="true">
                <Camera size={17} />
              </span>
            </div>

            <div className="profile-edit-photo__copy">
              <strong>{t("profile.editModal.photo")}</strong>
              <p>{t("profile.editModal.photoCopy")}</p>

              <input
                ref={photoInputRef}
                className="profile-edit-photo__input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
              />

              <button
                type="button"
                className="profile-edit-photo__button"
                onClick={() => photoInputRef.current?.click()}
              >
                <Camera size={15} />
                {t("profile.editModal.changePhoto")}
              </button>

              {photoError && (
                <span
                  className="profile-edit-photo__error"
                  role="alert"
                >
                  {photoError}
                </span>
              )}
            </div>
          </div>

          {cropSource && (
            <ProfilePhotoCropper
              src={cropSource}
              onCancel={() => {
                setCropSource(null);

                if (photoInputRef.current) {
                  photoInputRef.current.value = "";
                }
              }}
              onApply={(image) => {
                setDraft((current) => ({
                  ...current,
                  image,
                }));

                setCropSource(null);

                if (photoInputRef.current) {
                  photoInputRef.current.value = "";
                }
              }}
            />
          )}

          <div className="profile-edit-grid">
            <Input
              label={t("profile.editModal.name")}
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />

            <Input
              label={t("profile.editModal.age")}
              type="number"
              min={18}
              max={120}
              value={draft.age}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  age: Number(event.target.value),
                }))
              }
            />

            <Input
              label={t("profile.editModal.city")}
              value={draft.city}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  city: event.target.value,
                }))
              }
            />

            <Input
              label={t("profile.editModal.country")}
              value={draft.country}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  country: event.target.value,
                }))
              }
            />
          </div>

          <label className="profile-edit-textarea">
            <span>{t("profile.editModal.bio")}</span>
            <textarea
              rows={4}
              maxLength={240}
              value={draft.bio}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  bio: event.target.value,
                }))
              }
            />
            <small>{draft.bio.length}/240</small>
          </label>
        </section>

        <section className="profile-edit-section">
          <h3>{t("profile.editModal.teach")}</h3>

          <div className="profile-edit-options">
            {skillOptions.map((skill) => (
              <button
                key={`teach-${skill}`}
                type="button"
                className={
                  draft.teaches.includes(skill)
                    ? "is-active is-teach"
                    : ""
                }
                aria-pressed={draft.teaches.includes(skill)}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    teaches: toggleItem(
                      current.teaches,
                      skill,
                    ),
                  }))
                }
              >
                {t(`skills.${skill}`)}
              </button>
            ))}

            {draft.teaches
              .filter(isCustomSkillId)
              .map((skill) => (
                <button
                  key={`teach-${skill}`}
                  type="button"
                  className="is-active is-teach"
                  aria-pressed="true"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      teaches: current.teaches.filter(
                        (item) => item !== skill,
                      ),
                    }))
                  }
                >
                  {getSkillLabel(skill)}
                  <span aria-hidden="true"> ×</span>
                </button>
              ))}
          </div>

          <div className="profile-custom-skill">
            <input
              value={customTeach}
              onChange={(event) =>
                setCustomTeach(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addCustomSkill("teach", customTeach);
                }
              }}
              placeholder={t("profile.editModal.addTeachPlaceholder")}
              aria-label={t("profile.editModal.addTeachPlaceholder")}
            />

            <button
              type="button"
              onClick={() =>
                addCustomSkill("teach", customTeach)
              }
              disabled={!customTeach.trim()}
            >
              <span aria-hidden="true">+</span>
              {t("profile.editModal.addSkill")}
            </button>
          </div>
        </section>

        <section className="profile-edit-section">
          <h3>{t("profile.editModal.learn")}</h3>

          <div className="profile-edit-options">
            {skillOptions.map((skill) => (
              <button
                key={`learn-${skill}`}
                type="button"
                className={
                  draft.learns.includes(skill)
                    ? "is-active is-learn"
                    : ""
                }
                aria-pressed={draft.learns.includes(skill)}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    learns: toggleItem(
                      current.learns,
                      skill,
                    ),
                  }))
                }
              >
                {t(`skills.${skill}`)}
              </button>
            ))}

            {draft.learns
              .filter(isCustomSkillId)
              .map((skill) => (
                <button
                  key={`learn-${skill}`}
                  type="button"
                  className="is-active is-learn"
                  aria-pressed="true"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      learns: current.learns.filter(
                        (item) => item !== skill,
                      ),
                    }))
                  }
                >
                  {getSkillLabel(skill)}
                  <span aria-hidden="true"> ×</span>
                </button>
              ))}
          </div>

          <div className="profile-custom-skill">
            <input
              value={customLearn}
              onChange={(event) =>
                setCustomLearn(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addCustomSkill("learn", customLearn);
                }
              }}
              placeholder={t("profile.editModal.addLearnPlaceholder")}
              aria-label={t("profile.editModal.addLearnPlaceholder")}
            />

            <button
              type="button"
              onClick={() =>
                addCustomSkill("learn", customLearn)
              }
              disabled={!customLearn.trim()}
            >
              <span aria-hidden="true">+</span>
              {t("profile.editModal.addSkill")}
            </button>
          </div>
        </section>

        <section className="profile-edit-section">
          <h3>{t("profile.preferences.languages")}</h3>

          <div className="profile-edit-options">
            {languageOptions.map((language) => (
              <button
                key={language}
                type="button"
                className={
                  draft.languages.includes(language)
                    ? "is-active"
                    : ""
                }
                aria-pressed={draft.languages.includes(language)}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    languages: toggleItem(
                      current.languages,
                      language,
                    ),
                  }))
                }
              >
                {t(
                  `discover.advancedFilters.languages.${language}`,
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="profile-edit-section">
          <h3>{t("profile.preferences.mode")}</h3>

          <div className="profile-edit-options">
            {modeOptions.map((mode) => (
              <button
                key={mode}
                type="button"
                className={
                  draft.modes.includes(mode)
                    ? "is-active"
                    : ""
                }
                aria-pressed={draft.modes.includes(mode)}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    modes: toggleItem(
                      current.modes,
                      mode,
                    ),
                  }))
                }
              >
                {t(
                  mode === "online"
                    ? "discover.advancedFilters.online"
                    : "discover.advancedFilters.inPerson",
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="profile-edit-section">
          <div className="profile-edit-availability__heading">
            <div>
              <h3>{t("profile.preferences.availability")}</h3>
              <p>{t("profile.availabilityEditor.copy")}</p>
            </div>
          </div>

          <div className="profile-edit-availability">
            {weekdayOptions.map((day) => (
              <div
                className="profile-edit-availability__day"
                key={day}
              >
                <div className="profile-edit-availability__day-head">
                  <strong>
                    {t(`profile.availabilityEditor.days.${day}`)}
                  </strong>

                  <button
                    type="button"
                    onClick={() => addAvailabilityRange(day)}
                  >
                    {t("profile.availabilityEditor.add")}
                  </button>
                </div>

                {draft.weeklyAvailability[day].length ? (
                  <div className="profile-edit-availability__ranges">
                    {draft.weeklyAvailability[day].map(
                      (range, index) => (
                        <div
                          className="profile-edit-availability__range"
                          key={`${day}-${index}`}
                        >
                          <input
                            type="time"
                            value={range.start}
                            onChange={(event) =>
                              updateAvailabilityRange(
                                day,
                                index,
                                "start",
                                event.target.value,
                              )
                            }
                            aria-label={t(
                              "profile.availabilityEditor.start",
                            )}
                          />

                          <span>—</span>

                          <input
                            type="time"
                            value={range.end}
                            onChange={(event) =>
                              updateAvailabilityRange(
                                day,
                                index,
                                "end",
                                event.target.value,
                              )
                            }
                            aria-label={t(
                              "profile.availabilityEditor.end",
                            )}
                          />

                          <button
                            type="button"
                            className="profile-edit-availability__remove"
                            onClick={() =>
                              removeAvailabilityRange(
                                day,
                                index,
                              )
                            }
                            aria-label={t(
                              "profile.availabilityEditor.remove",
                            )}
                          >
                            ×
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <span className="profile-edit-availability__empty">
                    {t("profile.availabilityEditor.unavailable")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="profile-edit-modal__footer">
        <button
          className="profile-edit-modal__cancel"
          type="button"
          onClick={onClose}
        >
          {t("profile.editModal.cancel")}
        </button>

        <button
          className="profile-edit-modal__save"
          type="button"
          onClick={saveProfile}
          disabled={
            !draft.name.trim() ||
            !draft.city.trim() ||
            !draft.country.trim()
          }
        >
          {t("profile.editModal.save")}
        </button>
      </footer>
    </Modal>
  );
}
