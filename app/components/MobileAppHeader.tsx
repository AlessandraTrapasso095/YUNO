"use client";

import { Bell } from "lucide-react";
import type { AppNavId } from "../lib/app-navigation";
import { useI18n } from "../i18n/I18nProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { SkillHourBadge } from "./ui";

type MobileAppHeaderProps = {
  skillHours: number;
  onNavigate: (id: AppNavId) => void;
};

export function MobileAppHeader({
  skillHours,
  onNavigate,
}: MobileAppHeaderProps) {
  const { t } = useI18n();

  return (
    <header className="mobile-app-header">
      <Logo />

      <div>
        <button
          className="mobile-skill-hours-link"
          type="button"
          onClick={() => onNavigate("skillHours")}
          aria-label={t("navigation.skillHours")}
        >
          <SkillHourBadge
            balance={skillHours.toFixed(1)}
            compact
          />
        </button>

        <LanguageSwitcher variant="flag" />

        <button
          type="button"
          aria-label={t("navigation.notifications")}
        >
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}
