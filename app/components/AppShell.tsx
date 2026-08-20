"use client";

import type { ReactNode } from "react";
import type { AppNavId } from "../lib/app-navigation";
import { AppSidebar } from "./AppSidebar";
import { MobileAppHeader } from "./MobileAppHeader";
import { MobileBottomNav } from "./MobileBottomNav";

type AppShellProps = {
  activeNav: AppNavId;
  onNavigate: (id: AppNavId) => void;
  children: ReactNode;
  context?: ReactNode;
  overlays?: ReactNode;
};

export function AppShell({
  activeNav,
  onNavigate,
  children,
  context,
  overlays,
}: AppShellProps) {
  return (
    <main className="discover-app">
      <AppSidebar
        activeNav={activeNav}
        onNavigate={onNavigate}
      />

      <section className="discovery-main">
        <MobileAppHeader />
        {children}
      </section>

      {context}

      <MobileBottomNav
        activeNav={activeNav}
        onNavigate={onNavigate}
      />

      {overlays}
    </main>
  );
}
