import Link from "next/link";
import { cn } from "@/lib/helpers/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gb-green text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "border border-gb-line bg-transparent text-gb-text hover:bg-gb-panel disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "text-gb-muted hover:text-gb-text hover:bg-gb-panel/50 disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "bg-gb-cta text-white hover:bg-gb-cta-hover disabled:opacity-50 disabled:cursor-not-allowed",
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
