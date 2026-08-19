"use client";

import Link from "next/link";
import Image from "next/image";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";

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

export function AvatarStack() {
  const people = ["/people/anna.jpg", "/people/luca.jpg", "/people/sofia.jpg"];
  return (
    <div className="avatar-proof">
      <div className="avatar-stack" aria-hidden="true">
        {people.map((person) => <Image key={person} src={person} alt="" width={72} height={72} />)}
      </div>
      <p><strong>8,000+</strong> curious people already sharing</p>
    </div>
  );
}
