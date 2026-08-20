"use client";

import { X } from "lucide-react";
import type {
  AvailabilityId,
  LanguageId,
  LearningMode,
} from "../data";
import { useI18n } from "../i18n/I18nProvider";
import { Button, Modal } from "./ui";

export type DiscoverFilters = {
  modes: LearningMode[];
  languages: LanguageId[];
  availability: AvailabilityId[];
  nearby: boolean;
};

export const emptyDiscoverFilters: DiscoverFilters = {
  modes: [],
  languages: [],
  availability: [],
  nearby: false,
};

type DiscoverFiltersModalProps = {
  value: DiscoverFilters;
  reduceMotion: boolean;
  onChange: (filters: DiscoverFilters) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
};

const modes: { id: LearningMode; labelKey: string }[] = [
  { id: "online", labelKey: "discover.advancedFilters.online" },
  { id: "inPerson", labelKey: "discover.advancedFilters.inPerson" },
];

const languages: { id: LanguageId; labelKey: string }[] = [
  { id: "italian", labelKey: "discover.advancedFilters.languages.italian" },
  { id: "english", labelKey: "discover.advancedFilters.languages.english" },
  { id: "spanish", labelKey: "discover.advancedFilters.languages.spanish" },
  { id: "portuguese", labelKey: "discover.advancedFilters.languages.portuguese" },
  { id: "german", labelKey: "discover.advancedFilters.languages.german" },
];

const availability: { id: AvailabilityId; labelKey: string }[] = [
  { id: "weekdays", labelKey: "discover.advancedFilters.weekdays" },
  { id: "evenings", labelKey: "discover.advancedFilters.evenings" },
  { id: "weekends", labelKey: "discover.advancedFilters.weekends" },
];

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function DiscoverFiltersModal({
  value,
  reduceMotion,
  onChange,
  onApply,
  onReset,
  onClose,
}: DiscoverFiltersModalProps) {
  const { t } = useI18n();

  return (
    <Modal
      ariaLabel={t("discover.advancedFilters.dialogLabel")}
      className="discover-filters-modal"
      reduceMotion={reduceMotion}
    >
      <div className="discover-filters-modal__header">
        <div>
          <span>{t("discover.advancedFilters.eyebrow")}</span>
          <h2>{t("discover.advancedFilters.title")}</h2>
        </div>

        <button
          className="discover-filters-modal__close"
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          <X size={20} />
        </button>
      </div>

      <div className="discover-filter-section">
        <strong>{t("discover.advancedFilters.mode")}</strong>
        <div className="discover-filter-options">
          {modes.map((option) => (
            <button
              key={option.id}
              type="button"
              className={value.modes.includes(option.id) ? "is-active" : ""}
              aria-pressed={value.modes.includes(option.id)}
              onClick={() =>
                onChange({
                  ...value,
                  modes: toggleValue(value.modes, option.id),
                })
              }
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="discover-filter-section">
        <strong>{t("discover.advancedFilters.distance")}</strong>
        <div className="discover-filter-options">
          <button
            type="button"
            className={value.nearby ? "is-active" : ""}
            aria-pressed={value.nearby}
            onClick={() =>
              onChange({
                ...value,
                nearby: !value.nearby,
              })
            }
          >
            {t("discover.advancedFilters.nearby")}
          </button>
        </div>
      </div>

      <div className="discover-filter-section">
        <strong>{t("discover.advancedFilters.language")}</strong>
        <div className="discover-filter-options">
          {languages.map((option) => (
            <button
              key={option.id}
              type="button"
              className={value.languages.includes(option.id) ? "is-active" : ""}
              aria-pressed={value.languages.includes(option.id)}
              onClick={() =>
                onChange({
                  ...value,
                  languages: toggleValue(value.languages, option.id),
                })
              }
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="discover-filter-section">
        <strong>{t("discover.advancedFilters.availability")}</strong>
        <div className="discover-filter-options">
          {availability.map((option) => (
            <button
              key={option.id}
              type="button"
              className={
                value.availability.includes(option.id) ? "is-active" : ""
              }
              aria-pressed={value.availability.includes(option.id)}
              onClick={() =>
                onChange({
                  ...value,
                  availability: toggleValue(value.availability, option.id),
                })
              }
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="discover-filters-modal__footer">
        <button
          className="discover-filters-modal__reset"
          type="button"
          onClick={onReset}
        >
          {t("discover.advancedFilters.reset")}
        </button>

        <Button onClick={onApply}>
          {t("discover.advancedFilters.apply")}
        </Button>
      </div>
    </Modal>
  );
}
