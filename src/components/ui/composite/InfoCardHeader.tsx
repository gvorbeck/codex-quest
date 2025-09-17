import type { ReactNode } from "react";
import { Badge, Typography } from "@/components/ui/core/display";
import { DESIGN_TOKENS, LAYOUT_STYLES } from "@/constants";

interface InfoCardHeaderProps {
  icon: ReactNode;
  title: string;
  badge?: {
    text: string;
    variant?: "supplemental" | "status" | "warning";
  };
  iconSize?: "sm" | "md" | "lg";
  textColor?: string;
  className?: string;
}

export default function InfoCardHeader({
  icon,
  title,
  badge,
  iconSize = "md",
  textColor = "text-amber-100",
  className = "",
}: InfoCardHeaderProps) {
  const iconSizeClass = {
    sm: DESIGN_TOKENS.icons.sm,
    md: DESIGN_TOKENS.icons.md,
    lg: DESIGN_TOKENS.icons.lg,
  }[iconSize];

  return (
    <div className={`${LAYOUT_STYLES.iconTextLarge} ${className}`}>
      <div className={`${iconSizeClass} flex-shrink-0 text-amber-400`}>
        {icon}
      </div>
      <Typography variant="h5" weight="semibold" className={`${textColor} m-0`}>
        {title}
      </Typography>
      {badge && (
        <Badge variant={badge.variant || "supplemental"}>{badge.text}</Badge>
      )}
    </div>
  );
}
