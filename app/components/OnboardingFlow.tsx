"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Clock3,
  GraduationCap,
  Heart,
  Gift,
  MapPin,
  Monitor,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  useRef,
  useState,
} from "react";
import { useI18n } from "../i18n/I18nProvider";
import type {
  AvailabilityId,
  AvailabilityTimeRange,
  CurrentUserProfile,
  LanguageId,
  LearningMode,
  ProfileSkillId,
  WeekdayId,
  WeeklyAvailability,
} from "../data";
import {
  markOnboardingCompleted,
  writeCurrentUserProfile,
} from "../lib/profile-storage";
import { resetMessagesStore } from "../lib/messages-store";
import { resetSessionsStore } from "../lib/sessions-store";
import {
  createCustomSkillId,
  getCustomSkillLabel,
  isCustomSkillId,
  normalizeSkillName,
  skillOptions,
} from "../lib/skills";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { ProfilePhotoCropper } from "./ProfilePhotoCropper";
import { Input, Modal } from "./ui";

const TOTAL_STEPS = 10;

const onboardingLanguageOptions: LanguageId[] = [
  "italian",
  "english",
  "spanish",
  "portuguese",
  "german",
];

const onboardingModeOptions: LearningMode[] = [
  "online",
  "inPerson",
];

const onboardingWeekdayOptions: WeekdayId[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const emptyWeeklyAvailability: WeeklyAvailability = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

const languageCodes: Record<LanguageId, string> = {
  italian: "IT",
  english: "EN",
  spanish: "ES",
  portuguese: "PT",
  german: "DE",
};

type OnboardingDraft = {
  image: string;
  name: string;
  age: number;
  city: string;
  country: string;
  teaches: ProfileSkillId[];
  learns: ProfileSkillId[];
  languages: LanguageId[];
  customLanguages: string[];
  modes: LearningMode[];
  weeklyAvailability: WeeklyAvailability;
};

export function OnboardingFlow() {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [cropSource, setCropSource] =
    useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [teachSearch, setTeachSearch] = useState("");
  const [customTeach, setCustomTeach] = useState("");
  const [learnSearch, setLearnSearch] = useState("");
  const [customLearn, setCustomLearn] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState<OnboardingDraft>({
    image: "",
    name: "",
    age: 18,
    city: "",
    country: "",
    teaches: [],
    learns: [],
    languages: [],
    customLanguages: [],
    modes: [],
    weeklyAvailability: emptyWeeklyAvailability,
  });

  const progress = (step / TOTAL_STEPS) * 100;

  const basicProfileValid =
    Boolean(draft.image) &&
    draft.name.trim().length >= 2 &&
    draft.age >= 18 &&
    draft.age <= 120 &&
    draft.city.trim().length >= 2 &&
    draft.country.trim().length >= 2;

  function skillLabel(skill: ProfileSkillId) {
    return isCustomSkillId(skill)
      ? getCustomSkillLabel(skill)
      : t(`skills.${skill}`);
  }

  const filteredTeachSkills = skillOptions.filter(
    (skill) => {
      const query = normalizeSkillName(teachSearch);

      if (!query) return true;

      return (
        normalizeSkillName(skill).includes(query) ||
        normalizeSkillName(
          t(`skills.${skill}`),
        ).includes(query)
      );
    },
  );

  function toggleTeachSkill(skill: ProfileSkillId) {
    setDraft((current) => ({
      ...current,
      teaches: current.teaches.includes(skill)
        ? current.teaches.filter(
            (item) => item !== skill,
          )
        : [...current.teaches, skill],
    }));
  }

  function addCustomTeachSkill() {
    const value = customTeach.trim();

    if (!value) return;

    const normalized = normalizeSkillName(value);

    const catalogSkill = skillOptions.find(
      (skill) =>
        normalizeSkillName(skill) === normalized ||
        normalizeSkillName(
          t(`skills.${skill}`),
        ) === normalized,
    );

    const skill =
      catalogSkill ?? createCustomSkillId(value);

    if (!skill) return;

    setDraft((current) => {
      if (current.teaches.includes(skill)) {
        return current;
      }

      return {
        ...current,
        teaches: [...current.teaches, skill],
      };
    });

    setCustomTeach("");
  }

  const filteredLearnSkills = skillOptions.filter(
    (skill) => {
      const query = normalizeSkillName(learnSearch);

      if (!query) return true;

      return (
        normalizeSkillName(skill).includes(query) ||
        normalizeSkillName(
          t(`skills.${skill}`),
        ).includes(query)
      );
    },
  );

  function toggleLearnSkill(skill: ProfileSkillId) {
    setDraft((current) => ({
      ...current,
      learns: current.learns.includes(skill)
        ? current.learns.filter(
            (item) => item !== skill,
          )
        : [...current.learns, skill],
    }));
  }

  function addCustomLearnSkill() {
    const value = customLearn.trim();

    if (!value) return;

    const normalized = normalizeSkillName(value);

    const catalogSkill = skillOptions.find(
      (skill) =>
        normalizeSkillName(skill) === normalized ||
        normalizeSkillName(
          t(`skills.${skill}`),
        ) === normalized,
    );

    const skill =
      catalogSkill ?? createCustomSkillId(value);

    if (!skill) return;

    setDraft((current) => {
      if (current.learns.includes(skill)) {
        return current;
      }

      return {
        ...current,
        learns: [...current.learns, skill],
      };
    });

    setCustomLearn("");
  }

  function toggleLanguage(language: LanguageId) {
    setDraft((current) => ({
      ...current,
      languages: current.languages.includes(language)
        ? current.languages.filter(
            (item) => item !== language,
          )
        : [...current.languages, language],
    }));
  }

  function addCustomLanguage() {
    const value = customLanguage.trim();

    if (!value) return;

    const normalized = value.toLocaleLowerCase();

    const predefinedAlreadyExists =
      onboardingLanguageOptions.some(
        (language) =>
          t(
            `discover.advancedFilters.languages.${language}`,
          )
            .toLocaleLowerCase()
            .trim() === normalized,
      );

    const customAlreadyExists =
      draft.customLanguages.some(
        (language) =>
          language.toLocaleLowerCase().trim() === normalized,
      );

    if (
      predefinedAlreadyExists ||
      customAlreadyExists
    ) {
      setCustomLanguage("");
      return;
    }

    setDraft((current) => ({
      ...current,
      customLanguages: [
        ...current.customLanguages,
        value,
      ],
    }));

    setCustomLanguage("");
  }

  function removeCustomLanguage(language: string) {
    setDraft((current) => ({
      ...current,
      customLanguages:
        current.customLanguages.filter(
          (item) => item !== language,
        ),
    }));
  }

  function toggleMode(mode: LearningMode) {
    setDraft((current) => ({
      ...current,
      modes: current.modes.includes(mode)
        ? current.modes.filter(
            (item) => item !== mode,
          )
        : [...current.modes, mode],
    }));
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
        [day]:
          current.weeklyAvailability[day].map(
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
        [day]:
          current.weeklyAvailability[day].filter(
            (_, rangeIndex) =>
              rangeIndex !== index,
          ),
      },
    }));
  }

  const validAvailabilityRanges =
    onboardingWeekdayOptions.flatMap((day) =>
      draft.weeklyAvailability[day].filter(
        (range) =>
          range.start &&
          range.end &&
          range.start < range.end,
      ),
    );

  function deriveLegacyAvailability(): AvailabilityId[] {
    const availability: AvailabilityId[] = [];

    const weekdayIds: WeekdayId[] = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ];

    const hasWeekdays = weekdayIds.some(
      (day) =>
        draft.weeklyAvailability[day].length > 0,
    );

    const hasWeekends =
      draft.weeklyAvailability.saturday.length > 0 ||
      draft.weeklyAvailability.sunday.length > 0;

    const hasEvenings =
      onboardingWeekdayOptions.some((day) =>
        draft.weeklyAvailability[day].some(
          (range) => range.start >= "17:00",
        ),
      );

    if (hasWeekdays) {
      availability.push("weekdays");
    }

    if (hasEvenings) {
      availability.push("evenings");
    }

    if (hasWeekends) {
      availability.push("weekends");
    }

    return availability;
  }

  function completeOnboarding() {
    const profile: CurrentUserProfile = {
      name: draft.name.trim(),
      age: draft.age,
      image: draft.image,
      city: draft.city.trim(),
      country: draft.country.trim(),
      bio: "",
      teaches: [...draft.teaches],
      learns: [...draft.learns],
      modes: [...draft.modes],
      languages: [...draft.languages],
      customLanguages: [...draft.customLanguages],
      availability: deriveLegacyAvailability(),
      weeklyAvailability: Object.fromEntries(
        Object.entries(
          draft.weeklyAvailability,
        ).map(([day, ranges]) => [
          day,
          ranges
            .filter(
              (range) =>
                range.start &&
                range.end &&
                range.start < range.end,
            )
            .map((range) => ({ ...range })),
        ]),
      ) as WeeklyAvailability,
      rating: 0,
      completedSessions: 0,
      skillHours: 1,
      profileCompletion: 100,
    };

    try {
      resetSessionsStore();
      resetMessagesStore();
      writeCurrentUserProfile(profile);
      markOnboardingCompleted();
      router.push("/discover");
    } catch {
      router.push("/discover");
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
      setPhotoError(
        t("onboarding.basicProfile.photoTypeError"),
      );
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError(
        t("onboarding.basicProfile.photoSizeError"),
      );
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
      setPhotoError(
        t("onboarding.basicProfile.photoReadError"),
      );
    };

    reader.readAsDataURL(file);
  }

  return (
    <main className="onboarding">
      <header className="onboarding__header">
        <Logo />

        <LanguageSwitcher variant="compact" />
      </header>

      <div className="onboarding__progress-wrap">
        <div className="onboarding__progress-copy">
          <span>
            {t("onboarding.progress", {
              current: step,
              total: TOTAL_STEPS,
            })}
          </span>

          <strong>{Math.round(progress)}%</strong>
        </div>

        <div
          className="onboarding__progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={step}
        >
          <span
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <section className="onboarding__stage">
        {step === 1 ? (
          <div className="onboarding-welcome">
            <div className="onboarding-welcome__visual">
              <span className="onboarding-welcome__orb onboarding-welcome__orb--one">
                <GraduationCap size={25} />
              </span>

              <span className="onboarding-welcome__orb onboarding-welcome__orb--two">
                <Heart size={23} fill="currentColor" />
              </span>

              <span className="onboarding-welcome__orb onboarding-welcome__orb--three">
                <Clock3 size={24} />
              </span>

              <div className="onboarding-welcome__mark">
                <Sparkles size={24} />
                <strong>YUNO</strong>
              </div>
            </div>

            <span className="app-kicker">
              {t("onboarding.welcome.kicker")}
            </span>

            <h1>{t("onboarding.welcome.title")}</h1>

            <p className="onboarding-welcome__copy">
              {t("onboarding.welcome.copy")}
            </p>

            <div className="onboarding-welcome__promise">
              <span>
                <GraduationCap size={17} />
                {t("onboarding.welcome.teach")}
              </span>

              <span>
                <Clock3 size={17} />
                {t("onboarding.welcome.earn")}
              </span>

              <span>
                <Heart size={17} />
                {t("onboarding.welcome.learn")}
              </span>
            </div>

            <button
              className="onboarding__primary"
              type="button"
              onClick={() => setStep(2)}
            >
              {t("onboarding.welcome.action")}
              <ArrowRight size={17} />
            </button>

            <small className="onboarding-welcome__note">
              {t("onboarding.welcome.note")}
            </small>
          </div>
        ) : step === 2 ? (
          <div className="onboarding-profile">
            <div className="onboarding-profile__heading">
              <span className="app-kicker">
                {t("onboarding.basicProfile.kicker")}
              </span>

              <h1>{t("onboarding.basicProfile.title")}</h1>

              <p>{t("onboarding.basicProfile.copy")}</p>
            </div>

            <div className="onboarding-profile__card">
              <div className="onboarding-profile__photo">
                <div className="onboarding-profile__avatar">
                  {draft.image ? (
                    <Image
                      src={draft.image}
                      alt={draft.name || t("onboarding.basicProfile.photo")}
                      width={120}
                      height={120}
                      unoptimized={draft.image.startsWith("data:")}
                    />
                  ) : (
                    <UserRound size={38} />
                  )}

                  <span>
                    <Camera size={15} />
                  </span>
                </div>

                <div className="onboarding-profile__photo-copy">
                  <strong>
                    {t("onboarding.basicProfile.photo")}
                  </strong>

                  <p>
                    {t("onboarding.basicProfile.photoCopy")}
                  </p>

                  <input
                    ref={photoInputRef}
                    className="onboarding-profile__file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                  />

                  <button
                    type="button"
                    className="onboarding-profile__photo-button"
                    onClick={() =>
                      photoInputRef.current?.click()
                    }
                  >
                    <Camera size={15} />

                    {draft.image
                      ? t("onboarding.basicProfile.changePhoto")
                      : t("onboarding.basicProfile.addPhoto")}
                  </button>

                  {photoError && (
                    <span
                      className="onboarding-profile__error"
                      role="alert"
                    >
                      {photoError}
                    </span>
                  )}
                </div>
              </div>

              <div className="onboarding-profile__fields">
                <Input
                  label={t("onboarding.basicProfile.name")}
                  placeholder={t(
                    "onboarding.basicProfile.namePlaceholder",
                  )}
                  leadingIcon={<UserRound size={16} />}
                  value={draft.name}
                  autoComplete="name"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />

                <Input
                  label={t("onboarding.basicProfile.age")}
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
                  label={t("onboarding.basicProfile.city")}
                  placeholder={t(
                    "onboarding.basicProfile.cityPlaceholder",
                  )}
                  leadingIcon={<MapPin size={16} />}
                  value={draft.city}
                  autoComplete="address-level2"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      city: event.target.value,
                    }))
                  }
                />

                <Input
                  label={t("onboarding.basicProfile.country")}
                  placeholder={t(
                    "onboarding.basicProfile.countryPlaceholder",
                  )}
                  leadingIcon={<MapPin size={16} />}
                  value={draft.country}
                  autoComplete="country-name"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      country: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="onboarding-profile__actions">
              <button
                className="onboarding__secondary"
                type="button"
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={16} />
                {t("onboarding.back")}
              </button>

              <button
                className="onboarding__primary"
                type="button"
                disabled={!basicProfileValid}
                onClick={() => setStep(3)}
              >
                {t("onboarding.continue")}
                <ArrowRight size={17} />
              </button>
            </div>

            {cropSource && (
              <Modal
                ariaLabel={t("profile.editModal.cropTitle")}
                className="onboarding-cropper__modal"
                overlayClassName="onboarding-cropper__overlay"
              >
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
                    setPhotoError("");

                    if (photoInputRef.current) {
                      photoInputRef.current.value = "";
                    }
                  }}
                />
              </Modal>
            )}
          </div>
        ) : step === 3 ? (
          <div className="onboarding-skills">
            <div className="onboarding-skills__heading">
              <span className="app-kicker">
                {t("onboarding.teach.kicker")}
              </span>

              <h1>{t("onboarding.teach.title")}</h1>

              <p>{t("onboarding.teach.copy")}</p>
            </div>

            <div className="onboarding-skills__card">
              <Input
                label={t("onboarding.teach.search")}
                hideLabel
                placeholder={t(
                  "onboarding.teach.searchPlaceholder",
                )}
                value={teachSearch}
                onChange={(event) =>
                  setTeachSearch(event.target.value)
                }
              />

              {draft.teaches.length > 0 && (
                <div className="onboarding-skills__selected">
                  <span>
                    {t("onboarding.teach.selected")}
                  </span>

                  <div>
                    {draft.teaches.map((skill) => (
                      <button
                        type="button"
                        key={skill}
                        onClick={() =>
                          toggleTeachSkill(skill)
                        }
                      >
                        {skillLabel(skill)}
                        <span aria-hidden="true">×</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="onboarding-skills__catalog">
                {filteredTeachSkills.map((skill) => {
                  const selected =
                    draft.teaches.includes(skill);

                  return (
                    <button
                      key={skill}
                      type="button"
                      className={
                        selected ? "is-active" : ""
                      }
                      aria-pressed={selected}
                      onClick={() =>
                        toggleTeachSkill(skill)
                      }
                    >
                      <GraduationCap size={15} />
                      {t(`skills.${skill}`)}

                      {selected && (
                        <span aria-hidden="true">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {filteredTeachSkills.length === 0 && (
                <div className="onboarding-skills__no-results">
                  {t("onboarding.teach.noResults")}
                </div>
              )}

              <div className="onboarding-skills__custom">
                <div>
                  <strong>
                    {t("onboarding.teach.customTitle")}
                  </strong>

                  <span>
                    {t("onboarding.teach.customCopy")}
                  </span>
                </div>

                <div className="onboarding-skills__custom-form">
                  <Input
                    label={t(
                      "onboarding.teach.customLabel",
                    )}
                    hideLabel
                    placeholder={t(
                      "onboarding.teach.customPlaceholder",
                    )}
                    value={customTeach}
                    onChange={(event) =>
                      setCustomTeach(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCustomTeachSkill();
                      }
                    }}
                  />

                  <button
                    type="button"
                    disabled={!customTeach.trim()}
                    onClick={addCustomTeachSkill}
                  >
                    {t("onboarding.teach.add")}
                  </button>
                </div>
              </div>
            </div>

            <div className="onboarding-profile__actions">
              <button
                className="onboarding__secondary"
                type="button"
                onClick={() => setStep(2)}
              >
                <ArrowLeft size={16} />
                {t("onboarding.back")}
              </button>

              <button
                className="onboarding__primary"
                type="button"
                disabled={!draft.teaches.length}
                onClick={() => setStep(4)}
              >
                {t("onboarding.continue")}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        ) : step === 4 ? (
          <div className="onboarding-skills">
            <div className="onboarding-skills__heading">
              <span className="app-kicker">
                {t("onboarding.learn.kicker")}
              </span>

              <h1>{t("onboarding.learn.title")}</h1>

              <p>{t("onboarding.learn.copy")}</p>
            </div>

            <div className="onboarding-skills__card">
              <Input
                label={t("onboarding.learn.search")}
                hideLabel
                placeholder={t(
                  "onboarding.learn.searchPlaceholder",
                )}
                value={learnSearch}
                onChange={(event) =>
                  setLearnSearch(event.target.value)
                }
              />

              {draft.learns.length > 0 && (
                <div className="onboarding-skills__selected">
                  <span>
                    {t("onboarding.learn.selected")}
                  </span>

                  <div>
                    {draft.learns.map((skill) => (
                      <button
                        type="button"
                        key={skill}
                        onClick={() =>
                          toggleLearnSkill(skill)
                        }
                      >
                        {skillLabel(skill)}
                        <span aria-hidden="true">×</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="onboarding-skills__catalog">
                {filteredLearnSkills.map((skill) => {
                  const selected =
                    draft.learns.includes(skill);

                  return (
                    <button
                      key={skill}
                      type="button"
                      className={
                        selected ? "is-active" : ""
                      }
                      aria-pressed={selected}
                      onClick={() =>
                        toggleLearnSkill(skill)
                      }
                    >
                      <Heart size={15} />
                      {t(`skills.${skill}`)}

                      {selected && (
                        <span aria-hidden="true">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {filteredLearnSkills.length === 0 && (
                <div className="onboarding-skills__no-results">
                  {t("onboarding.learn.noResults")}
                </div>
              )}

              <div className="onboarding-skills__custom">
                <div>
                  <strong>
                    {t("onboarding.learn.customTitle")}
                  </strong>

                  <span>
                    {t("onboarding.learn.customCopy")}
                  </span>
                </div>

                <div className="onboarding-skills__custom-form">
                  <Input
                    label={t(
                      "onboarding.learn.customLabel",
                    )}
                    hideLabel
                    placeholder={t(
                      "onboarding.learn.customPlaceholder",
                    )}
                    value={customLearn}
                    onChange={(event) =>
                      setCustomLearn(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCustomLearnSkill();
                      }
                    }}
                  />

                  <button
                    type="button"
                    disabled={!customLearn.trim()}
                    onClick={addCustomLearnSkill}
                  >
                    {t("onboarding.learn.add")}
                  </button>
                </div>
              </div>
            </div>

            <div className="onboarding-profile__actions">
              <button
                className="onboarding__secondary"
                type="button"
                onClick={() => setStep(3)}
              >
                <ArrowLeft size={16} />
                {t("onboarding.back")}
              </button>

              <button
                className="onboarding__primary"
                type="button"
                disabled={!draft.learns.length}
                onClick={() => setStep(5)}
              >
                {t("onboarding.continue")}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        ) : step === 5 ? (
          <div className="onboarding-languages">
            <div className="onboarding-languages__heading">
              <span className="app-kicker">
                {t("onboarding.languages.kicker")}
              </span>

              <h1>{t("onboarding.languages.title")}</h1>

              <p>{t("onboarding.languages.copy")}</p>
            </div>

            <div className="onboarding-languages__card">
              <div className="onboarding-languages__intro">
                <strong>
                  {t("onboarding.languages.selectTitle")}
                </strong>

                <span>
                  {t("onboarding.languages.selectCopy")}
                </span>
              </div>

              <div className="onboarding-languages__options">
                {onboardingLanguageOptions.map(
                  (language) => {
                    const selected =
                      draft.languages.includes(language);

                    return (
                      <button
                        key={language}
                        type="button"
                        className={
                          selected ? "is-active" : ""
                        }
                        aria-pressed={selected}
                        onClick={() =>
                          toggleLanguage(language)
                        }
                      >
                        <span className="onboarding-languages__code">
                          {languageCodes[language]}
                        </span>

                        <span className="onboarding-languages__name">
                          {t(
                            `discover.advancedFilters.languages.${language}`,
                          )}
                        </span>

                        <span
                          className="onboarding-languages__check"
                          aria-hidden="true"
                        >
                          {selected ? "✓" : "+"}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>

              <div className="onboarding-languages__custom">
                <div className="onboarding-languages__custom-heading">
                  <strong>
                    {t("onboarding.languages.customTitle")}
                  </strong>

                  <span>
                    {t("onboarding.languages.customCopy")}
                  </span>
                </div>

                {draft.customLanguages.length > 0 && (
                  <div className="onboarding-languages__custom-selected">
                    {draft.customLanguages.map(
                      (language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() =>
                            removeCustomLanguage(language)
                          }
                        >
                          {language}
                          <span aria-hidden="true">×</span>
                        </button>
                      ),
                    )}
                  </div>
                )}

                <div className="onboarding-languages__custom-form">
                  <Input
                    label={t(
                      "onboarding.languages.customLabel",
                    )}
                    hideLabel
                    placeholder={t(
                      "onboarding.languages.customPlaceholder",
                    )}
                    value={customLanguage}
                    onChange={(event) =>
                      setCustomLanguage(
                        event.target.value,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCustomLanguage();
                      }
                    }}
                  />

                  <button
                    type="button"
                    disabled={!customLanguage.trim()}
                    onClick={addCustomLanguage}
                  >
                    {t("onboarding.languages.add")}
                  </button>
                </div>
              </div>

              <div className="onboarding-languages__hint">
                <Sparkles size={15} />

                <span>
                  {t("onboarding.languages.hint")}
                </span>
              </div>
            </div>

            <div className="onboarding-profile__actions">
              <button
                className="onboarding__secondary"
                type="button"
                onClick={() => setStep(4)}
              >
                <ArrowLeft size={16} />
                {t("onboarding.back")}
              </button>

              <button
                className="onboarding__primary"
                type="button"
                disabled={
                  !draft.languages.length &&
                  !draft.customLanguages.length
                }
                onClick={() => setStep(6)}
              >
                {t("onboarding.continue")}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        ) : step === 6 ? (
          <div className="onboarding-mode">
            <div className="onboarding-mode__heading">
              <span className="app-kicker">
                {t("onboarding.mode.kicker")}
              </span>

              <h1>{t("onboarding.mode.title")}</h1>

              <p>{t("onboarding.mode.copy")}</p>
            </div>

            <div className="onboarding-mode__options">
              {onboardingModeOptions.map((mode) => {
                const selected =
                  draft.modes.includes(mode);

                const isOnline = mode === "online";

                return (
                  <button
                    key={mode}
                    type="button"
                    className={
                      selected ? "is-active" : ""
                    }
                    aria-pressed={selected}
                    onClick={() => toggleMode(mode)}
                  >
                    <span className="onboarding-mode__icon">
                      {isOnline ? (
                        <Monitor size={27} />
                      ) : (
                        <UsersRound size={27} />
                      )}
                    </span>

                    <span className="onboarding-mode__content">
                      <strong>
                        {t(
                          `onboarding.mode.options.${mode}.title`,
                        )}
                      </strong>

                      <span>
                        {t(
                          `onboarding.mode.options.${mode}.copy`,
                        )}
                      </span>
                    </span>

                    <span
                      className="onboarding-mode__check"
                      aria-hidden="true"
                    >
                      {selected ? "✓" : "+"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="onboarding-mode__both">
              <Sparkles size={15} />

              <span>
                {t("onboarding.mode.bothHint")}
              </span>
            </div>

            <div className="onboarding-profile__actions">
              <button
                className="onboarding__secondary"
                type="button"
                onClick={() => setStep(5)}
              >
                <ArrowLeft size={16} />
                {t("onboarding.back")}
              </button>

              <button
                className="onboarding__primary"
                type="button"
                disabled={!draft.modes.length}
                onClick={() => setStep(7)}
              >
                {t("onboarding.continue")}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        ) : step === 7 ? (
          <div className="onboarding-availability">
            <div className="onboarding-availability__heading">
              <span className="app-kicker">
                {t("onboarding.availability.kicker")}
              </span>

              <h1>
                {t("onboarding.availability.title")}
              </h1>

              <p>
                {t("onboarding.availability.copy")}
              </p>
            </div>

            <div className="onboarding-availability__card">
              {onboardingWeekdayOptions.map((day) => (
                <div
                  className="onboarding-availability__day"
                  key={day}
                >
                  <div className="onboarding-availability__day-head">
                    <strong>
                      {t(
                        `profile.availabilityEditor.days.${day}`,
                      )}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        addAvailabilityRange(day)
                      }
                    >
                      {t(
                        "profile.availabilityEditor.add",
                      )}
                    </button>
                  </div>

                  {draft.weeklyAvailability[day].length ? (
                    <div className="onboarding-availability__ranges">
                      {draft.weeklyAvailability[day].map(
                        (range, index) => {
                          const invalid =
                            Boolean(
                              range.start &&
                                range.end &&
                                range.start >= range.end,
                            );

                          return (
                            <div
                              className={
                                invalid
                                  ? "onboarding-availability__range is-invalid"
                                  : "onboarding-availability__range"
                              }
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
                                className="onboarding-availability__remove"
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
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <span className="onboarding-availability__empty">
                      {t(
                        "profile.availabilityEditor.unavailable",
                      )}
                    </span>
                  )}
                </div>
              ))}

              <div className="onboarding-availability__hint">
                <Clock3 size={15} />

                <span>
                  {t("onboarding.availability.hint")}
                </span>
              </div>
            </div>

            <div className="onboarding-profile__actions">
              <button
                className="onboarding__secondary"
                type="button"
                onClick={() => setStep(6)}
              >
                <ArrowLeft size={16} />
                {t("onboarding.back")}
              </button>

              <button
                className="onboarding__primary"
                type="button"
                disabled={!validAvailabilityRanges.length}
                onClick={() => setStep(8)}
              >
                {t("onboarding.continue")}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        ) : step === 8 ? (
          <div className="onboarding-gift">
            <div className="onboarding-gift__visual">
              <span className="onboarding-gift__spark onboarding-gift__spark--one">
                <Sparkles size={17} />
              </span>

              <span className="onboarding-gift__spark onboarding-gift__spark--two">
                <Sparkles size={13} />
              </span>

              <div className="onboarding-gift__coin">
                <span>+1</span>
                <strong>SH</strong>
              </div>

              <div className="onboarding-gift__badge">
                <Gift size={16} />
                {t("onboarding.gift.badge")}
              </div>
            </div>

            <span className="app-kicker">
              {t("onboarding.gift.kicker")}
            </span>

            <h1>{t("onboarding.gift.title")}</h1>

            <p className="onboarding-gift__copy">
              {t("onboarding.gift.copy")}
            </p>

            <div className="onboarding-gift__explanation">
              <div>
                <Clock3 size={20} />

                <span>
                  <strong>
                    {t("onboarding.gift.hourTitle")}
                  </strong>

                  {t("onboarding.gift.hourCopy")}
                </span>
              </div>

              <div>
                <GraduationCap size={20} />

                <span>
                  <strong>
                    {t("onboarding.gift.earnTitle")}
                  </strong>

                  {t("onboarding.gift.earnCopy")}
                </span>
              </div>
            </div>

            <div className="onboarding-profile__actions onboarding-gift__actions">
              <button
                className="onboarding__secondary"
                type="button"
                onClick={() => setStep(7)}
              >
                <ArrowLeft size={16} />
                {t("onboarding.back")}
              </button>

              <button
                className="onboarding__primary"
                type="button"
                onClick={() => setStep(9)}
              >
                {t("onboarding.continue")}
                <ArrowRight size={17} />
              </button>
            </div>

            <small className="onboarding-gift__note">
              {t("onboarding.gift.note")}
            </small>
          </div>
        ) : step === 9 ? (
          <div className="onboarding-loop">
            <div className="onboarding-loop__heading">
              <span className="app-kicker">
                {t("onboarding.howItWorks.kicker")}
              </span>

              <h1>{t("onboarding.howItWorks.title")}</h1>

              <p>{t("onboarding.howItWorks.copy")}</p>
            </div>

            <div className="onboarding-loop__flow">
              <div className="onboarding-loop__step onboarding-loop__step--teach">
                <span className="onboarding-loop__number">
                  01
                </span>

                <span className="onboarding-loop__icon">
                  <GraduationCap size={24} />
                </span>

                <strong>
                  {t("onboarding.howItWorks.teach.title")}
                </strong>

                <p>
                  {t("onboarding.howItWorks.teach.copy")}
                </p>
              </div>

              <span
                className="onboarding-loop__arrow"
                aria-hidden="true"
              >
                →
              </span>

              <div className="onboarding-loop__step onboarding-loop__step--earn">
                <span className="onboarding-loop__number">
                  02
                </span>

                <span className="onboarding-loop__icon">
                  <Clock3 size={24} />
                </span>

                <strong>
                  {t("onboarding.howItWorks.earn.title")}
                </strong>

                <p>
                  {t("onboarding.howItWorks.earn.copy")}
                </p>
              </div>

              <span
                className="onboarding-loop__arrow"
                aria-hidden="true"
              >
                →
              </span>

              <div className="onboarding-loop__step onboarding-loop__step--learn">
                <span className="onboarding-loop__number">
                  03
                </span>

                <span className="onboarding-loop__icon">
                  <Heart size={24} />
                </span>

                <strong>
                  {t("onboarding.howItWorks.learn.title")}
                </strong>

                <p>
                  {t("onboarding.howItWorks.learn.copy")}
                </p>
              </div>
            </div>

            <div className="onboarding-loop__repeat">
              <Sparkles size={16} />

              <span>
                <strong>
                  {t("onboarding.howItWorks.repeat.title")}
                </strong>

                {t("onboarding.howItWorks.repeat.copy")}
              </span>
            </div>

            <div className="onboarding-profile__actions">
              <button
                className="onboarding__secondary"
                type="button"
                onClick={() => setStep(8)}
              >
                <ArrowLeft size={16} />
                {t("onboarding.back")}
              </button>

              <button
                className="onboarding__primary"
                type="button"
                onClick={() => setStep(10)}
              >
                {t("onboarding.continue")}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        ) : (
          <div className="onboarding-ready">
            <div className="onboarding-ready__celebration">
              <span className="onboarding-ready__spark onboarding-ready__spark--one">
                <Sparkles size={16} />
              </span>

              <span className="onboarding-ready__spark onboarding-ready__spark--two">
                <Heart size={15} fill="currentColor" />
              </span>

              <div className="onboarding-ready__check">
                ✓
              </div>
            </div>

            <span className="app-kicker">
              {t("onboarding.ready.kicker")}
            </span>

            <h1>{t("onboarding.ready.title")}</h1>

            <p className="onboarding-ready__copy">
              {t("onboarding.ready.copy")}
            </p>

            <div className="onboarding-ready__summary">
              <div className="onboarding-ready__person">
                <div className="onboarding-ready__avatar">
                  {draft.image ? (
                    <Image
                      src={draft.image}
                      alt={draft.name}
                      width={80}
                      height={80}
                      unoptimized={draft.image.startsWith("data:")}
                    />
                  ) : (
                    <UserRound size={31} />
                  )}
                </div>

                <div>
                  <strong>{draft.name}</strong>

                  <span>
                    {draft.city}, {draft.country}
                  </span>
                </div>
              </div>

              <div className="onboarding-ready__stats">
                <div>
                  <strong>{draft.teaches.length}</strong>
                  <span>
                    {t("onboarding.ready.teachCount")}
                  </span>
                </div>

                <div>
                  <strong>{draft.learns.length}</strong>
                  <span>
                    {t("onboarding.ready.learnCount")}
                  </span>
                </div>

                <div>
                  <strong>
                    {draft.languages.length +
                      draft.customLanguages.length}
                  </strong>
                  <span>
                    {t("onboarding.ready.languageCount")}
                  </span>
                </div>
              </div>

              <div className="onboarding-ready__skills">
                <div>
                  <span>
                    {t("onboarding.ready.teachLabel")}
                  </span>

                  <div>
                    {draft.teaches
                      .slice(0, 4)
                      .map((skill) => (
                        <span key={skill}>
                          {skillLabel(skill)}
                        </span>
                      ))}
                  </div>
                </div>

                <div>
                  <span>
                    {t("onboarding.ready.learnLabel")}
                  </span>

                  <div>
                    {draft.learns
                      .slice(0, 4)
                      .map((skill) => (
                        <span key={skill}>
                          {skillLabel(skill)}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="onboarding-ready__gift">
                <Gift size={17} />

                <span>
                  <strong>+1 Skill Hour</strong>
                  {t("onboarding.ready.gift")}
                </span>
              </div>
            </div>

            <div className="onboarding-profile__actions onboarding-ready__actions">
              <button
                className="onboarding__secondary"
                type="button"
                onClick={() => setStep(9)}
              >
                <ArrowLeft size={16} />
                {t("onboarding.back")}
              </button>

              <button
                className="onboarding__primary"
                type="button"
                onClick={completeOnboarding}
              >
                {t("onboarding.ready.action")}
                <ArrowRight size={17} />
              </button>
            </div>

            <small className="onboarding-ready__note">
              {t("onboarding.ready.note")}
            </small>
          </div>
        )}
      </section>

      <footer className="onboarding__footer">
        <span>{t("common.taglineFirst")}</span>
        <strong>{t("common.taglineSecond")}</strong>
      </footer>
    </main>
  );
}
