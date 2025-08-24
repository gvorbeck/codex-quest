import type { ReactNode } from "react";
import { Card, Typography } from "@/components/ui/design-system";
import { ICON_STYLES } from "@/constants";

interface DetailSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  variant?: "nested" | "standard";
  className?: string;
}

export function DetailSection({
  icon,
  title,
  children,
  variant = "nested",
  className = "",
}: DetailSectionProps) {
  return (
    <Card variant={variant} className={className}>
      <Typography variant="subHeadingSpaced">
        <div className={ICON_STYLES.sm}>
          {icon}
        </div>
        {title}
      </Typography>
      {children}
    </Card>
  );
}