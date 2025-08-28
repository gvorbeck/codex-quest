import type { ReactNode } from "react";
import { Typography } from "@/components/ui/design-system";
import { Icon } from "@/components/ui/display/Icon";
import { Button } from "@/components/ui";

type AlertPriority = "info" | "warning" | "error";

interface AlertProps {
  message?: string | ReactNode;
  onClose?: () => void;
  priority?: AlertPriority;
  className?: string;
}

export function Alert({ message, onClose, priority = "info", className = "" }: AlertProps) {
  if (!message) {
    return null;
  }

  return (
    <div 
      className={`bg-amber-100 border-l-4 border-amber-500 p-4 shadow-sm ${className}`}
      role="alert"
      aria-live={priority === "error" ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <div className="flex items-center justify-between">
        <Typography 
          variant="bodySmall" 
          color="primary"
          className="text-amber-800 flex-1"
        >
          {message}
        </Typography>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label={`Close ${priority} alert`}
            className="p-1 ml-4 hover:bg-amber-200"
          >
            <Icon 
              name="close" 
              size="sm" 
              className="text-amber-700"
              aria-hidden={true}
            />
          </Button>
        )}
      </div>
    </div>
  );
}