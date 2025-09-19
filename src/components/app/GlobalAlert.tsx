import { Typography } from "@/components/ui/core/display";
import { Icon } from "@/components/ui/core/display/Icon";
import { Button } from "@/components/ui";
import type { AlertConfig } from "@/constants";

interface GlobalAlertProps {
  alert: AlertConfig;
  onClose?: () => void;
  className?: string;
}

export function GlobalAlert({
  alert,
  onClose,
  className = "",
}: GlobalAlertProps) {
  if (!alert.message) {
    return null;
  }

  // Style mapping for different alert types
  const alertStyles = {
    info: "bg-blue-50 border-blue-400 text-blue-800",
    warning: "bg-amber-50 border-amber-400 text-amber-800",
    error: "bg-red-50 border-red-400 text-red-800",
    success: "bg-green-50 border-green-400 text-green-800",
  };

  const buttonStyles = {
    info: "hover:bg-blue-100 text-blue-700",
    warning: "hover:bg-amber-100 text-amber-700",
    error: "hover:bg-red-100 text-red-700",
    success: "hover:bg-green-100 text-green-700",
  };

  const currentAlertStyle = alertStyles[alert.type] || alertStyles.info;
  const currentButtonStyle = buttonStyles[alert.type] || buttonStyles.info;

  return (
    <div
      className={`${currentAlertStyle} border-l-4 p-4 shadow-sm ${className}`}
      role="alert"
      aria-live={alert.type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <div className="flex items-center justify-between">
        <Typography variant="bodySmall" color="primary" className="flex-1">
          {alert.message}
        </Typography>
        {alert.dismissible && onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label={`Close ${alert.type} alert`}
            className={`p-1 ml-4 ${currentButtonStyle}`}
          >
            <Icon name="close" size="sm" aria-hidden={true} />
          </Button>
        )}
      </div>
    </div>
  );
}
