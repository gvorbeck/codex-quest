import { useState, useCallback, useMemo } from "react";
import type { NotificationData } from "@/components/ui/core/feedback/NotificationContainer";
import type {
  NotificationPriority,
  NotificationPosition,
} from "@/components/ui/core/feedback/Notification";
import type { ShowNotificationOptions, NotificationSystem } from "@/types";
import { useA11yAnnouncements } from "./useA11y";
import { NOTIFICATION_CONSTANTS } from "@/constants";
import { logger } from "@/utils";

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

      if (
        options.priority &&
        !["info", "success", "warning", "error"].includes(options.priority)
      ) {
        throw new Error("Invalid notification priority");
      }

      if (
        options.position &&
        ![
          "top-right",
          "top-left",
          "bottom-right",
          "bottom-left",
          "top-center",
          "bottom-center",
        ].includes(options.position)
      ) {
        throw new Error("Invalid notification position");
      }
    },
    []
  );

  // Generate unique ID for notifications
  const generateId = useCallback(() => {
    // Use crypto.randomUUID if available, fallback to Date + random string
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return `notification-${crypto.randomUUID()}`;
    }
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
          : priority === "info"
          ? "Info: "
          : "";

      return title
        ? `${priorityPrefix}${title}. ${messageText}`
        : `${priorityPrefix}${messageText}`;
    },
    []
  );

  // Remove a notification by ID
  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

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
        logger.error("Invalid notification options:", error);
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
        // Add the new notification
        const newNotifications = [...prev, notification];

        // If we exceed the maximum, trigger dismissal of the oldest notification
        if (
          newNotifications.length > NOTIFICATION_CONSTANTS.MAX_NOTIFICATIONS
        ) {
          const oldestNotification = newNotifications[0];

          // Use the existing dismiss mechanism for smooth animation
          setTimeout(() => {
            dismissNotification(oldestNotification!.id);
          }, 0); // Trigger immediately but asynchronously

          return newNotifications;
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
      dismissNotification,
    ]
  );

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

  // Placeholder methods for future functionality
  const pauseAll = useCallback(() => {
    // TODO: Implement pause functionality
  }, []);

  const resumeAll = useCallback(() => {
    // TODO: Implement resume functionality
  }, []);

  return {
    notifications,
    showNotification,
    dismissNotification,
    clearAll,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    pauseAll,
    resumeAll,
  };
}
