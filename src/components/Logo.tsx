import { Code2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import clsx from "clsx";

type LogoSize = "sm" | "md" | "lg" | "xl" | "2xl";

interface LogoProps {
  href?: string;
  size?: LogoSize;
}

const sizeConfig: Record<
  LogoSize,
  {
    icon: string;
    text: string;
  }
> = {
  sm: {
    icon: "h-4 w-4",
    text: "text-sm",
  },
  md: {
    icon: "h-6 w-6",
    text: "text-xl",
  },
  lg: {
    icon: "h-8 w-8",
    text: "text-2xl",
  },
  xl: {
    icon: "h-10 w-10",
    text: "text-3xl",
  },
  "2xl": {
    icon: "h-12 w-12",
    text: "text-4xl",
  },
};

function Logo({ href = "/", size = "md" }: LogoProps) {
  const styles = sizeConfig[size];

  return (
    <Link
      href={href}
      className="flex items-center gap-2 transition-smooth hover:opacity-80"
    >
      <Code2 className={clsx(styles.icon, "text-primary")} />
      <span className={clsx(styles.text, "font-bold tracking-tight")}>
        Code2DSA
      </span>
    </Link>
  );
}

export default Logo;

