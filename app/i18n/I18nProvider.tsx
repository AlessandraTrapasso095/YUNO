"use client";

import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  isLocale,
  localeCookieName,
  localeStorageKey,
  translate,
  type Locale,
} from "./config";

type I18nContextValue = {
  locale: Locale;
  isChanging: boolean;
  setLocale: (locale: Locale) => void;
  t: (key: string, parameters?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale: Locale }) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [isChanging, setIsChanging] = useState(false);
  const reduceMotion = useReducedMotion();
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistLocale = useCallback((nextLocale: Locale) => {
    document.documentElement.lang = nextLocale;
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    try {
      window.localStorage.setItem(localeStorageKey, nextLocale);
    } catch {
      // The cookie remains the server-readable source of truth when storage is unavailable.
    }
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    if (!isLocale(nextLocale) || nextLocale === locale) return;
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);

    setIsChanging(!reduceMotion);
    transitionTimer.current = window.setTimeout(() => {
      persistLocale(nextLocale);
      startTransition(() => setLocaleState(nextLocale));
      setIsChanging(false);
      transitionTimer.current = null;
    }, reduceMotion ? 0 : 110);
  }, [locale, persistLocale, reduceMotion]);

  useEffect(() => {
    document.documentElement.lang = locale;
    return () => {
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    };
  }, [locale]);

  const t = useCallback(
    (key: string, parameters?: Record<string, string | number>) => translate(locale, key, parameters),
    [locale],
  );

  const value = useMemo(() => ({ locale, isChanging, setLocale, t }), [isChanging, locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
