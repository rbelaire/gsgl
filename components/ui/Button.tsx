import Link from "next/link";
import { cn } from "@/lib/helpers/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-gsgl-gold text-gsgl-navy hover:bg-[#b8995d] disabled:opacity-50 disabled:cursor-not-allowed",
  secondary: "border border-gsgl-navy/20 bg-white text-gsgl-navy hover:bg-gsgl-sand disabled:opacity-50 disabled:cursor-not-allowed",
  ghost: "text-gsgl-navy hover:bg-gsgl-navy/5 disabled:opacity-50 disabled:cursor-not-allowed",
};

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  children,
  variant = "primary",
  href,
  className,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition-colors",
    variantStyles[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
