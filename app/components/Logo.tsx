import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  compact?: boolean;
  className?: string;
  href?: string;
};

export function Logo({ compact = false, className = "", href = "/" }: LogoProps) {
  return (
    <Link className={`brand-logo ${compact ? "brand-logo--compact" : ""} ${className}`} href={href} aria-label="YUNO home">
      <Image src={compact ? "/favicon.png" : "/logo.png"} alt="YUNO" width={compact ? 1254 : 2166} height={compact ? 1254 : 726} priority />
    </Link>
  );
}
