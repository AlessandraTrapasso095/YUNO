"use client";

import {
  mobileAppNavItems,
  type AppNavId,
} from "../lib/app-navigation";
import { useI18n } from "../i18n/I18nProvider";

type MobileBottomNavProps = {
  activeNav: AppNavId;
  onNavigate: (id: AppNavId) => void;
};

export function MobileBottomNav({
  activeNav,
  onNavigate,
}: MobileBottomNavProps) {
  const { t } = useI18n();

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label={t("navigation.mobileAppLabel")}
    >
      {mobileAppNavItems.map(({ id, labelKey, icon: Icon, badge }) => (
        <button
          className={activeNav === id ? "is-active" : ""}
          type="button"
          key={id}
          onClick={() => onNavigate(id)}
        >
          <span>
            <Icon size={22} />
            {badge && <em />}
          </span>
          <small>{t(labelKey)}</small>
        </button>
      ))}
    </nav>
  );
}
