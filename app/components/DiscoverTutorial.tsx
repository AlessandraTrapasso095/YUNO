"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  motionDuration,
  motionEase,
  motionSpring,
} from "../lib/motion";
import { useI18n } from "../i18n/I18nProvider";

type DiscoverTutorialProps = {
  onComplete: () => void;
};

const steps = [
  {
    id: "skip",
    translationKey: "skip",
    icon: ArrowLeft,
    direction: "left",
  },
  {
    id: "connect",
    translationKey: "connect",
    icon: ArrowRight,
    direction: "right",
  },
  {
    id: "save",
    translationKey: "save",
    icon: Bookmark,
    direction: "save",
  },
  {
    id: "ready",
    translationKey: "ready",
    icon: Sparkles,
    direction: "ready",
  },
] as const;

export function DiscoverTutorial({
  onComplete,
}: DiscoverTutorialProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const step = steps[stepIndex];
  const Icon = step.icon;
  const isLast = stepIndex === steps.length - 1;

  function finish() {
    onComplete();
  }

  return (
    <div className="discover-tutorial" aria-live="polite">
      <div className="discover-tutorial__backdrop" />

      <AnimatePresence mode="wait">
        <motion.div
          className={`discover-tutorial__gesture discover-tutorial__gesture--${step.direction}`}
          key={step.id}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : motionSpring.responsive
          }
          aria-hidden="true"
        >
          <Icon />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          className="discover-tutorial__panel"
          key={`panel-${step.id}`}
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 12, scale: 0.98 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.985 }}
          transition={{
            duration: reduceMotion ? 0.01 : motionDuration.normal,
            ease: motionEase.emphasized,
          }}
        >
          <div className="discover-tutorial__top">
            <span>{t(`discover.tutorial.${step.translationKey}.eyebrow`)}</span>

            <button
              type="button"
              onClick={finish}
              className="discover-tutorial__skip"
            >
              {t("discover.tutorial.skipTutorial")}
            </button>
          </div>

          <h3>{t(`discover.tutorial.${step.translationKey}.title`)}</h3>
          <p>{t(`discover.tutorial.${step.translationKey}.copy`)}</p>

          <div className="discover-tutorial__footer">
            <div className="discover-tutorial__dots">
              {steps.map((item, index) => (
                <span
                  key={item.id}
                  className={index === stepIndex ? "is-active" : ""}
                />
              ))}
            </div>

            <button
              type="button"
              className="discover-tutorial__next"
              onClick={() => {
                if (isLast) {
                  finish();
                  return;
                }

                setStepIndex((index) => index + 1);
              }}
            >
              {isLast ? (
                <>
                  <Check size={16} />
                  {t("discover.tutorial.start")}
                </>
              ) : (
                <>
                  {t("discover.tutorial.next")}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
