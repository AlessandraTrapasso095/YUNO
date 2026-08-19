"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "../i18n/I18nProvider";

type LogoProps = {
  compact?: boolean;
  className?: string;
  href?: string;
};

export function Logo({
  compact = false,
  className = "",
  href = "/",
}: LogoProps) {
  const { t } = useI18n();

  return (
    <Link
      className={`brand-logo ${compact ? "brand-logo--compact" : ""} ${className}`}
      href={href}
      aria-label={t("common.home")}
    >
      <Image
        src={compact ? "/img/favicon.png" : "/img/logo.png"}
        alt="YUNO"
        width={compact ? 1254 : 5994}
        height={compact ? 1254 : 2563}
        priority
        unoptimized
      />
    </Link>
  );
}
