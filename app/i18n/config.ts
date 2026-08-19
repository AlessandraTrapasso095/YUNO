import { en, type TranslationDictionary } from "../locales/en";
import { it } from "../locales/it";

export const supportedLocales = ["en", "it"] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = "en";
export const localeCookieName = "yuno_locale";
export const localeStorageKey = "yuno.locale";
export const routeMetadata = [
  { matches: (pathname: string) => pathname.startsWith("/discover"), titleKey: "metadata.discover.title" },
  { matches: (pathname: string) => pathname === "/", titleKey: "metadata.home.title" },
] as const;

interface StringDictionary {
  [key: string]: string | StringDictionary;
}

export const dictionaries: Record<Locale, StringDictionary> = {
  en: en as unknown as StringDictionary,
  it: it as unknown as StringDictionary,
};

export const localeOptions = [
  { value: "en", short: "EN", flag: "🇬🇧", labelKey: "language.english" },
  { value: "it", short: "IT", flag: "🇮🇹", labelKey: "language.italian" },
] as const satisfies ReadonlyArray<{ value: Locale; short: string; flag: string; labelKey: string }>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && supportedLocales.includes(value as Locale);
}

export function browserLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const requested = acceptLanguage
    .split(",")
    .map((entry) => entry.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);

  return requested.some((locale) => locale === "it" || locale?.startsWith("it-")) ? "it" : defaultLocale;
}

export function translate(locale: Locale, key: string, parameters?: Record<string, string | number>): string {
  const value = key.split(".").reduce<string | StringDictionary | undefined>((current, segment) => {
    if (!current || typeof current === "string") return undefined;
    return current[segment];
  }, dictionaries[locale]);

  const fallback = key.split(".").reduce<string | StringDictionary | undefined>((current, segment) => {
    if (!current || typeof current === "string") return undefined;
    return current[segment];
  }, dictionaries[defaultLocale]);

  const message = typeof value === "string" ? value : typeof fallback === "string" ? fallback : key;
  if (!parameters) return message;

  return Object.entries(parameters).reduce(
    (result, [name, replacement]) => result.replaceAll(`{${name}}`, String(replacement)),
    message,
  );
}

export type { TranslationDictionary };
