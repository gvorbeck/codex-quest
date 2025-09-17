import type { ReactNode } from "react";
import { Card, Typography } from "@/components/ui/core/display";
import InfoCardHeader from "./InfoCardHeader";

interface RequirementCardProps {
  title: string;
  message: string | ReactNode;
  icon: ReactNode;
  variant?: "info" | "success";
  className?: string;
}

export function RequirementCard({
  title,
  message,
  icon,
  variant = "info",
  className = "",
}: RequirementCardProps) {
  return (
    <Card variant={variant} className={className}>
      <InfoCardHeader
        icon={icon}
        title={title}
        iconSize="md"
        className="mb-3"
      />
      {typeof message === "string" ? (
        <Typography variant="description">
          {message}
        </Typography>
      ) : (
        message
      )}
    </Card>
  );
}