import { useState, useCallback } from "react";
import type { NotificationSystem, ShowNotificationOptions } from "@/types";

/**
 * Hook for managing notifications state and actions
 * Provides the core notification system implementation
 */
export function useNotifications(): NotificationSystem {
  const [notifications, setNotifications] = useState<
    NotificationSystem["notifications"]
  >([]);

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 11)}`;
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const showNotification = useCallback(
    (
      message: string | React.ReactNode,
      options: ShowNotificationOptions = {}
    ) => {
      const id = generateId();
      const notification = {
        id,
        message,
        ...(options.title !== undefined && { title: options.title }),
        priority: options.priority || "info",
        position: options.position || "top-right",
        duration: options.duration ?? 5000,
        dismissible: options.dismissible ?? true,
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-dismiss if duration is set
      if (notification.duration > 0) {
        setTimeout(() => {
          dismissNotification(id);
        }, notification.duration);
      }

      return id;
    },
    [generateId, dismissNotification]
  );

  const showInfo = useCallback(
    (
      message: string | React.ReactNode,
      options: Omit<ShowNotificationOptions, "priority"> = {}
    ) => {
      return showNotification(message, { ...options, priority: "info" });
    },
    [showNotification]
  );

  const showSuccess = useCallback(
    (
      message: string | React.ReactNode,
      options: Omit<ShowNotificationOptions, "priority"> = {}
    ) => {
      return showNotification(message, { ...options, priority: "success" });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (
      message: string | React.ReactNode,
      options: Omit<ShowNotificationOptions, "priority"> = {}
    ) => {
      return showNotification(message, { ...options, priority: "warning" });
    },
    [showNotification]
  );

  const showError = useCallback(
    (
      message: string | React.ReactNode,
      options: Omit<ShowNotificationOptions, "priority"> = {}
    ) => {
      return showNotification(message, {
        ...options,
        priority: "error",
        duration: options.duration ?? 8000,
      });
    },
    [showNotification]
  );

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const pauseAll = useCallback(() => {
    // Implementation for pausing notifications if needed
    // For now, this is a no-op
  }, []);

  const resumeAll = useCallback(() => {
    // Implementation for resuming notifications if needed
    // For now, this is a no-op
  }, []);

  return {
    notifications,
    showNotification,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    dismissNotification,
    clearAll,
    pauseAll,
    resumeAll,
  };
}
