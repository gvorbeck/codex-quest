import type { ReactNode } from "react";
import { Typography } from "@/components/ui/design-system";
import { cn } from "@/constants/styles";

interface TextHeaderProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "sm" | "md" | "lg";
  underlined?: boolean;
  className?: string;
  id?: string;
}

export const TextHeader = ({
  children,
  variant = "h4",
  size = "md",
  underlined = true,
  className,
  id,
}: TextHeaderProps) => {
  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const underlineClasses = underlined
    ? "border-b border-zinc-700 pb-2 mb-4"
    : "";

  const headerClasses = cn(
    "font-semibold",
    sizeClasses[size],
    underlineClasses,
    className
  );

  return (
    <Typography
      variant={variant}
      as={variant}
      className={headerClasses}
      id={id}
    >
      {children}
    </Typography>
  );
};

TextHeader.displayName = "TextHeader";
