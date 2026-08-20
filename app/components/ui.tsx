"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { modalContent, modalOverlay, toastMotion } from "../lib/motion";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight, Check, Clock3 } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  href?: string;
  icon?: boolean;
};

export function Button({ children, variant = "primary", href, icon = false, className = "", ...props }: ButtonProps) {
  const classes = `button button--${variant} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {icon && <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.25} />}
    </>
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}

export function SkillTag({ children, kind = "teach", selected = false }: { children: ReactNode; kind?: "teach" | "learn" | "neutral"; selected?: boolean }) {
  return <span className={`skill-tag skill-tag--${kind} ${selected ? "is-selected" : ""}`}>{children}</span>;
}

export function SectionEyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <span className={`section-eyebrow ${light ? "section-eyebrow--light" : ""}`}>{children}</span>;
}

export function SkillHourBadge({ balance = "4.5", compact = false }: { balance?: string; compact?: boolean }) {
  return (
    <div className={`skill-hour-badge ${compact ? "skill-hour-badge--compact" : ""}`}>
      <span className="skill-hour-badge__icon"><Clock3 size={compact ? 14 : 17} aria-hidden="true" /></span>
      <strong>{balance}</strong>
      <span>SH</span>
    </div>
  );
}


type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hideLabel?: boolean;
  leadingIcon?: ReactNode;
  trailingAction?: ReactNode;
  controlClassName?: string;
};

export function Input({
  label,
  hideLabel = false,
  leadingIcon,
  trailingAction,
  controlClassName = "",
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className={`ui-field ${className}`}>
      {label && (
        <span className={hideLabel ? "sr-only" : "ui-field__label"}>
          {label}
        </span>
      )}

      <span className={`ui-input ${controlClassName}`}>
        {leadingIcon && (
          <span className="ui-input__leading" aria-hidden="true">
            {leadingIcon}
          </span>
        )}

        <input id={inputId} {...props} />

        {trailingAction && (
          <span className="ui-input__trailing">
            {trailingAction}
          </span>
        )}
      </span>
    </label>
  );
}

type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
  className?: string;
};

export function Tooltip({
  children,
  content,
  className = "",
}: TooltipProps) {
  return (
    <span className={`ui-tooltip ${className}`}>
      {children}
      <span className="ui-tooltip__content" role="tooltip">
        {content}
      </span>
    </span>
  );
}

type ModalProps = {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
  overlayClassName?: string;
  reduceMotion?: boolean;
};

export function Modal({
  children,
  ariaLabel,
  className = "",
  overlayClassName = "",
  reduceMotion = false,
}: ModalProps) {
  return (
    <motion.div
      className={`ui-modal-overlay ${overlayClassName}`}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      variants={modalOverlay}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className={`ui-modal ${className}`}
        variants={reduceMotion ? undefined : modalContent}
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        exit={reduceMotion ? { opacity: 0 } : "exit"}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

type ToastProps = {
  children: ReactNode;
  className?: string;
};

export function Toast({ children, className = "" }: ToastProps) {
  return (
    <motion.div
      className={`app-toast ${className}`}
      variants={toastMotion}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="status"
      aria-live="polite"
    >
      <Check size={16} aria-hidden="true" />
      {children}
    </motion.div>
  );
}

type AvatarProps = {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
  className?: string;
};

export function Avatar({
  src,
  alt,
  size = "md",
  online = false,
  className = "",
}: AvatarProps) {
  const pixels = size === "sm" ? 32 : size === "lg" ? 64 : 44;

  return (
    <span className={`ui-avatar ui-avatar--${size} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={pixels}
        height={pixels}
      />
      {online && <span className="ui-avatar__status" aria-label="Online" />}
    </span>
  );
}

type SkeletonProps = {
  width?: string;
  height?: string;
  circle?: boolean;
  className?: string;
};

export function Skeleton({
  width = "100%",
  height = "16px",
  circle = false,
  className = "",
}: SkeletonProps) {
  return (
    <span
      className={`ui-skeleton ${circle ? "ui-skeleton--circle" : ""} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function AvatarStack() {
  const { t } = useI18n();
  const people = ["/people/anna.jpg", "/people/luca.jpg", "/people/sofia.jpg"];
  return (
    <div className="avatar-proof">
      <div className="avatar-stack" aria-hidden="true">
        {people.map((person) => <Image key={person} src={person} alt="" width={72} height={72} />)}
      </div>
      <p><strong>8,000+</strong> {t("homepage.hero.socialProof")}</p>
    </div>
  );
}
