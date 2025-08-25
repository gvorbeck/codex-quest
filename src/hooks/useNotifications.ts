import { useState, useCallback, useMemo } from "react";
import type { NotificationData } from "@/components/ui/feedback/NotificationContainer";
import type {
  NotificationPriority,
  NotificationPosition,
} from "@/components/ui/feedback/Notification";
import { useA11yAnnouncements } from "./useA11y";
import { NOTIFICATION_CONSTANTS } from "@/constants/notifications";

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
  showInfo: (
    message: string | React.ReactNode,
    options?: Omit<ShowNotificationOptions, "priority">
  ) => string;
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
  defaultDuration: number = 0
): NotificationSystem {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const { announce } = useA11yAnnouncements();

  // Validate notification options
  const validateNotificationOptions = useCallback(
    (options: ShowNotificationOptions): void => {
      if (options.duration !== undefined && options.duration < 0) {
        throw new Error("Notification duration must be non-negative");
      }
      
      if (options.title && typeof options.title !== "string") {
        throw new Error("Notification title must be a string");
      }
      
      if (options.priority && !["info", "success", "warning", "error"].includes(options.priority)) {
        throw new Error("Invalid notification priority");
      }
      
      if (options.position && !["top-right", "top-left", "bottom-right", "bottom-left", "top-center", "bottom-center"].includes(options.position)) {
        throw new Error("Invalid notification position");
      }
    },
    []
  );

  // Constants for ID generation
  const ID_RANDOM_OFFSET = 2;
  const ID_RANDOM_LENGTH = 9;

  // Generate unique ID for notifications
  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random()
      .toString(36)
      .substr(ID_RANDOM_OFFSET, ID_RANDOM_LENGTH)}`;
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
          : priority === "info"
          ? "Info: "
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
      // Validate options before processing
      try {
        validateNotificationOptions(options);
      } catch (error) {
        console.error("Invalid notification options:", error);
        // Fallback to safe defaults on validation error
        options = {
          ...options,
          priority: "info",
          duration: defaultDuration,
          position: defaultPosition,
        };
      }

      const id = generateId();
      const priority = options.priority || "info";

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

      setNotifications((prev) => {
        const newNotifications = [...prev, notification];
        // If we exceed the maximum, remove the oldest notifications
        if (newNotifications.length > NOTIFICATION_CONSTANTS.MAX_NOTIFICATIONS) {
          return newNotifications.slice(-NOTIFICATION_CONSTANTS.MAX_NOTIFICATIONS);
        }
        return newNotifications;
      });

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
      validateNotificationOptions,
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

  // Generic factory function for priority methods
  const createPriorityMethod = useCallback(
    (
      priority: NotificationPriority,
      defaultOverrides?: Partial<ShowNotificationOptions>
    ) =>
      (
        message: string | React.ReactNode,
        options: Omit<ShowNotificationOptions, "priority"> = {}
      ): string =>
        showNotification(message, {
          ...options,
          ...defaultOverrides,
          priority,
        }),
    [showNotification]
  );

  // Convenience methods for different priority levels
  const showInfo = useMemo(
    () => createPriorityMethod("info"),
    [createPriorityMethod]
  );

  const showSuccess = useMemo(
    () => createPriorityMethod("success"),
    [createPriorityMethod]
  );

  const showWarning = useMemo(
    () => createPriorityMethod("warning"),
    [createPriorityMethod]
  );

  const showError = useMemo(
    () => createPriorityMethod("error", { duration: 0 }), // Errors don't auto-dismiss by default
    [createPriorityMethod]
  );

  return {
    notifications,
    showNotification,
    dismissNotification,
    clearAll,
    showInfo,
    showSuccess,
    showWarning,
    showError,
  };
}
