import { createPortal } from "react-dom";
import { useMemo } from "react";
import { cn } from "@/utils";
import Notification from "./Notification";
import type { NotificationProps, NotificationPosition } from "./Notification";
import { NOTIFICATION_CONSTANTS } from "@/constants";

export interface NotificationData
  extends Omit<NotificationProps, "onDismiss" | "isVisible"> {
  id: string;
}

interface NotificationContainerProps {
  notifications: NotificationData[];
  position?: NotificationPosition;
  onDismiss: (id: string) => void;
  className?: string;
}

// Extract position styles outside component to prevent re-creation
const POSITION_STYLES: Record<NotificationPosition, string> = {
  "top-right": "top-4 right-4 flex flex-col items-end",
  "top-left": "top-4 left-4 flex flex-col items-start",
  "bottom-right": "bottom-4 right-4 flex flex-col-reverse items-end",
  "bottom-left": "bottom-4 left-4 flex flex-col-reverse items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 flex flex-col items-center",
  "bottom-center":
    "bottom-4 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center",
} as const;

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  position = "top-right",
  onDismiss,
  className,
}) => {
  // Memoize container classes to prevent unnecessary re-renders
  const containerClasses = useMemo(
    () =>
      cn(
        "fixed z-50 gap-3 max-h-screen overflow-hidden pointer-events-none",
        POSITION_STYLES[position],
        className
      ),
    [position, className]
  );

  if (notifications.length === 0) {
    return null;
  }

  const container = (
    <div className={containerClasses}>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="pointer-events-auto"
          style={{
            // Stagger animation delay for multiple notifications
            animationDelay: `${index * NOTIFICATION_CONSTANTS.STAGGER_DELAY}ms`,
          }}
        >
          <Notification
            {...notification}
            position={position}
            onDismiss={onDismiss}
            isVisible={true}
          />
        </div>
      ))}
    </div>
  );

  // Render into portal to ensure proper z-index stacking
  return createPortal(container, document.body);
};

export default NotificationContainer;
