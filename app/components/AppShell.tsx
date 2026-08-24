"use client";

import type { ReactNode } from "react";
import type { CurrentUserProfile } from "../data";
import type { AppNavId } from "../lib/app-navigation";
import { AppSidebar } from "./AppSidebar";
import { MobileAppHeader } from "./MobileAppHeader";
import { MobileBottomNav } from "./MobileBottomNav";

type AppShellProps = {
  activeNav: AppNavId;
  onNavigate: (id: AppNavId) => void;
  matchCount?: number;
  unreadMessageCount?: number;
  userProfile: CurrentUserProfile;
  children: ReactNode;
  context?: ReactNode;
  overlays?: ReactNode;
};

export function AppShell({
  activeNav,
  onNavigate,
  matchCount = 0,
  unreadMessageCount = 0,
  userProfile,
  children,
  context,
  overlays,
}: AppShellProps) {
  return (
    <main
      className={`discover-app ${
        activeNav === "skillHours" ? "discover-app--skill-hours" : ""
      }`}
    >
      <AppSidebar
        activeNav={activeNav}
        onNavigate={onNavigate}
        matchCount={matchCount}
        unreadMessageCount={unreadMessageCount}
        userProfile={userProfile}
      />

      <section className="discovery-main">
        <MobileAppHeader
          skillHours={userProfile.skillHours}
          onNavigate={onNavigate}
        />
        {children}
      </section>

      {context}

      <MobileBottomNav
        activeNav={activeNav}
        onNavigate={onNavigate}
        matchCount={matchCount}
        unreadMessageCount={unreadMessageCount}
      />

      {overlays}
    </main>
  );
}
