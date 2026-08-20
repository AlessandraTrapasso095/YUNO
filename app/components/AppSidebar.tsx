"use client";

import Image from "next/image";
import { HelpCircle, UsersRound } from "lucide-react";
import { appNavItems, type AppNavId } from "../lib/app-navigation";
import { useI18n } from "../i18n/I18nProvider";
import { Logo } from "./Logo";

type AppSidebarProps = {
  activeNav: AppNavId;
  onNavigate: (id: AppNavId) => void;
  matchCount?: number;
};

export function AppSidebar({
  activeNav,
  onNavigate,
  matchCount = 0,
}: AppSidebarProps) {
  const { t } = useI18n();

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__brand">
        <Logo />
      </div>

      <nav className="app-sidebar__nav" aria-label={t("navigation.appLabel")}>
        {appNavItems.map(({ id, labelKey, icon: Icon, badge }) => (
          <button
            className={activeNav === id ? "is-active" : ""}
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
          >
            <Icon size={20} />
            <span>{t(labelKey)}</span>
            {id === "matches" && matchCount > 0 ? (
              <em>{matchCount}</em>
            ) : (
              badge && <em>{badge}</em>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-invite">
        <span><UsersRound /></span>
        <strong>{t("discover.sidebar.title")}</strong>
        <p>{t("discover.sidebar.copy")}</p>
        <button type="button">{t("discover.sidebar.invite")}</button>
      </div>

      <button className="sidebar-help" type="button">
        <HelpCircle size={19} /> {t("navigation.help")}
      </button>

      <div className="sidebar-profile">
        <Image
          src="/people/anna.jpg"
          alt="Alessandra"
          width={72}
          height={72}
        />
        <div>
          <strong>Alessandra</strong>
          <span>{t("navigation.viewProfile")}</span>
        </div>
        <span className="sidebar-profile__more">•••</span>
      </div>
    </aside>
  );
}
