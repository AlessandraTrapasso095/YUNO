import { cookies, headers } from "next/headers";
import { browserLocaleFromHeader, isLocale, localeCookieName, type Locale } from "./config";

export async function getRequestLocale(): Promise<Locale> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const persistedLocale = cookieStore.get(localeCookieName)?.value;

  return isLocale(persistedLocale)
    ? persistedLocale
    : browserLocaleFromHeader(headerStore.get("accept-language"));
}
