"use client";

import { Bell } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { SkillHourBadge } from "./ui";

export function MobileAppHeader() {
  const { t } = useI18n();

  return (
    <header className="mobile-app-header">
      <Logo />

      <div>
        <SkillHourBadge compact />
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
