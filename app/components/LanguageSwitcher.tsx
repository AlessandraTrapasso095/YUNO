"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { localeOptions, type Locale } from "../i18n/config";
import { useI18n } from "../i18n/I18nProvider";

type LanguageSwitcherProps = {
  variant?: "compact" | "menu" | "flag";
};

export function LanguageSwitcher({ variant = "compact" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeOption = localeOptions.find((option) => option.value === locale) ?? localeOptions[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function focusOption(index: number) {
    optionRefs.current[index]?.focus();
  }

  function handleOptionKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>(".language-switcher__trigger")?.focus();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption((index + 1) % localeOptions.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption((index - 1 + localeOptions.length) % localeOptions.length);
    }
    if (event.key === "Home") {
      event.preventDefault();
      focusOption(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      focusOption(localeOptions.length - 1);
    }
  }

  function openMenu() {
    setOpen((current) => {
      const next = !current;
      if (next) {
        window.requestAnimationFrame(() => {
          const activeIndex = localeOptions.findIndex((option) => option.value === locale);
          focusOption(activeIndex);
        });
      }
      return next;
    });
  }

  function chooseLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    setOpen(false);
  }

  return (
    <div className={`language-switcher language-switcher--${variant}`} ref={rootRef}>
      <button
        className="language-switcher__trigger"
        type="button"
        aria-label={t("language.selectorLabel")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={openMenu}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !open) {
            event.preventDefault();
            openMenu();
          }
        }}
      >
        {variant === "menu" && <span className="language-switcher__menu-label">{t("language.label")}</span>}
        <span className="language-switcher__flag" aria-hidden="true">{activeOption.flag}</span>
        {variant !== "flag" && <span className="language-switcher__short">{activeOption.short}</span>}
        {variant === "flag" && <span className="sr-only">{t(activeOption.labelKey)}</span>}
        <ChevronDown className="language-switcher__chevron" size={14} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="language-switcher__dropdown"
            role="menu"
            aria-label={t("language.selectorLabel")}
            initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.985 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {localeOptions.map((option, index) => {
              const selected = option.value === locale;
              return (
                <button
                  key={option.value}
                  ref={(node) => { optionRefs.current[index] = node; }}
                  className={selected ? "is-selected" : ""}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => chooseLocale(option.value)}
                  onKeyDown={(event) => handleOptionKeyDown(event, index)}
                >
                  <span aria-hidden="true">{option.flag}</span>
                  <span>{t(option.labelKey)}</span>
                  {selected && <Check size={15} aria-label={t("language.active")} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
