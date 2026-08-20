import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
  CalendarDays,
  Compass,
  Heart,
  MessageCircle,
  UserRound,
  WalletCards,
} from "lucide-react";

export type AppNavId =
  | "discover"
  | "matches"
  | "messages"
  | "sessions"
  | "skillHours"
  | "profile";

type AppNavItem = {
  id: AppNavId;
  labelKey: string;
  icon: ComponentType<LucideProps>;
  badge?: string;
};

type MobileAppNavItem = {
  id: Exclude<AppNavId, "skillHours">;
  labelKey: string;
  icon: ComponentType<LucideProps>;
  badge?: boolean;
};

export const appNavItems: readonly AppNavItem[] = [
  { id: "discover", labelKey: "navigation.discover", icon: Compass },
  { id: "matches", labelKey: "navigation.matches", icon: Heart },
  { id: "messages", labelKey: "navigation.messages", icon: MessageCircle, badge: "2" },
  { id: "sessions", labelKey: "navigation.sessions", icon: CalendarDays },
  { id: "skillHours", labelKey: "navigation.skillHours", icon: WalletCards },
  { id: "profile", labelKey: "navigation.profile", icon: UserRound },
];

export const mobileAppNavItems: readonly MobileAppNavItem[] = [
  { id: "discover", labelKey: "navigation.discover", icon: Compass },
  { id: "matches", labelKey: "navigation.matches", icon: Heart },
  { id: "sessions", labelKey: "navigation.sessions", icon: CalendarDays },
  { id: "messages", labelKey: "navigation.chat", icon: MessageCircle, badge: true },
  { id: "profile", labelKey: "navigation.profile", icon: UserRound },
];
