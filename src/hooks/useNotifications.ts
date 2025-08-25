import { useState, useCallback } from "react";
import type { NotificationData } from "@/components/ui/feedback/NotificationContainer";
import type {
  NotificationPriority,
  NotificationPosition,
} from "@/components/ui/feedback/Notification";
import { useA11yAnnouncements } from "./useA11y";

export interface ShowNotificationOptions {
  title?: string;
  priority?: NotificationPriority;
  position?: NotificationPosition;
  duration?: number;
  dismissible?: boolean;
}

export interface NotificationSystem {
  notifications: NotificationData[];
  showNotification: (
    message: string | React.ReactNode,
    options?: ShowNotificationOptions
  ) => string;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  showSuccess: (
    message: string | React.ReactNode,
    options?: Omit<ShowNotificationOptions, "priority">
  ) => string;
  showWarning: (
    message: string | React.ReactNode,
    options?: Omit<ShowNotificationOptions, "priority">
  ) => string;
  showError: (
    message: string | React.ReactNode,
    options?: Omit<ShowNotificationOptions, "priority">
  ) => string;
}

/**
 * Hook for managing notification state and providing notification methods
 *
 * @param defaultPosition - Default position for notifications
 * @param defaultDuration - Default duration in milliseconds (0 = no auto-dismiss)
 * @returns Object with notifications array and control methods
 */
export function useNotifications(
  defaultPosition: NotificationPosition = "top-right",
  defaultDuration: number = 15000
): NotificationSystem {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { announce } = useA11yAnnouncements();

  // Generate unique ID for notifications
  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }, []);

  // Helper to create announcement text
  const createAnnouncementText = useCallback(
    (
      message: string | React.ReactNode,
      priority: NotificationPriority,
      title?: string
    ): string => {
      const messageText =
        typeof message === "string" ? message : "Notification received";
      const priorityPrefix =
        priority === "error"
          ? "Error: "
          : priority === "success"
          ? "Success: "
          : priority === "warning"
          ? "Warning: "
          : "";

      return title
        ? `${priorityPrefix}${title}. ${messageText}`
        : `${priorityPrefix}${messageText}`;
    },
    []
  );

  // Add a new notification
  const showNotification = useCallback(
    (
      message: string | React.ReactNode,
      options: ShowNotificationOptions = {}
    ): string => {
      const id = generateId();
      const priority = options.priority || "default";

      const notification: NotificationData = {
        id,
        message,
        ...(options.title && { title: options.title }),
        priority,
        position: options.position || defaultPosition,
        duration:
          options.duration !== undefined ? options.duration : defaultDuration,
        dismissible:
          options.dismissible !== undefined ? options.dismissible : true,
      };

      setNotifications((prev) => [...prev, notification]);

      // Announce to screen readers
      const announcementText = createAnnouncementText(
        message,
        priority,
        options.title
      );
      const announcementPriority =
        priority === "error" ? "assertive" : "polite";
      announce(announcementText, announcementPriority);

      return id;
    },
    [
      generateId,
      defaultPosition,
      defaultDuration,
      createAnnouncementText,
      announce,
    ]
  );

  // Remove a notification by ID
  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for different priority levels
  const showSuccess = useCallback(
    (
      message: string | React.ReactNode,
      options: Omit<ShowNotificationOptions, "priority"> = {}
    ): string => {
      return showNotification(message, { ...options, priority: "success" });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (
      message: string | React.ReactNode,
      options: Omit<ShowNotificationOptions, "priority"> = {}
    ): string => {
      return showNotification(message, { ...options, priority: "warning" });
    },
    [showNotification]
  );

  const showError = useCallback(
    (
      message: string | React.ReactNode,
      options: Omit<ShowNotificationOptions, "priority"> = {}
    ): string => {
      return showNotification(message, {
        ...options,
        priority: "error",
        duration: 0,
      }); // Errors don't auto-dismiss by default
    },
    [showNotification]
  );

  return {
    notifications,
    showNotification,
    dismissNotification,
    clearAll,
    showSuccess,
    showWarning,
    showError,
  };
}
