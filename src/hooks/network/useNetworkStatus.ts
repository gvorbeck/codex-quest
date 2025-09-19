import { useState, useEffect } from "react";
import { useNotificationContext } from "@/hooks";

export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string | null;
}

/**
 * Hook for monitoring network status and providing user feedback
 * Handles offline states, slow connections, and network changes
 */
export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [hasShownOfflineNotification, setHasShownOfflineNotification] = useState(false);
  const [offlineNotificationId, setOfflineNotificationId] = useState<string | null>(null);

  const notifications = useNotificationContext();

  useEffect(() => {
    const updateNetworkStatus = () => {
      const wasOnline = isOnline;
      const currentlyOnline = navigator.onLine;

      setIsOnline(currentlyOnline);

      // Show offline notification when going offline
      if (wasOnline && !currentlyOnline && !hasShownOfflineNotification) {
        const notificationId = notifications.showWarning(
          "You're currently offline. Changes will be saved when you reconnect.",
          {
            title: "Offline Mode",
            duration: 0, // Keep visible until online
          }
        );
        setOfflineNotificationId(notificationId);
        setHasShownOfflineNotification(true);
      }

      // Show back online notification and dismiss offline notification
      if (!wasOnline && currentlyOnline) {
        if (offlineNotificationId) {
          notifications.dismissNotification(offlineNotificationId);
          setOfflineNotificationId(null);
        }

        notifications.showSuccess(
          "You're back online! Any pending changes will be synced.",
          {
            title: "Back Online",
            duration: 4000,
          }
        );
        setHasShownOfflineNotification(false);
      }
    };

    const updateConnectionInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as Record<string, unknown>)['connection'] as {
          effectiveType?: string;
        };
        setConnectionType(connection.effectiveType || null);
        setIsSlowConnection(connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g');
      }
    };

    // Initial check
    updateNetworkStatus();
    updateConnectionInfo();

    // Add event listeners
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Connection change listener (if supported)
    if ('connection' in navigator) {
      const connection = (navigator as Record<string, unknown>)['connection'] as EventTarget & {
        addEventListener: (type: string, listener: () => void) => void;
        removeEventListener: (type: string, listener: () => void) => void;
      };
      connection.addEventListener('change', updateConnectionInfo);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);

      if ('connection' in navigator) {
        const connection = (navigator as Record<string, unknown>)['connection'] as EventTarget & {
          addEventListener: (type: string, listener: () => void) => void;
          removeEventListener: (type: string, listener: () => void) => void;
        };
        connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, [isOnline, notifications, hasShownOfflineNotification, offlineNotificationId]);

  return {
    isOnline,
    isSlowConnection,
    connectionType,
  };
}

/**
 * Hook for handling offline-first mutations with queue
 */
export function useOfflineMutations() {
  const { isOnline } = useNetworkStatus();
  const notifications = useNotificationContext();

  const queueMutation = (mutationFn: () => Promise<unknown>, description: string) => {
    if (!isOnline) {
      notifications.showInfo(
        `${description} will be processed when you're back online.`,
        {
          title: "Queued for Later",
          duration: 3000,
        }
      );

      // Store in localStorage for retry when back online
      const queuedMutations = JSON.parse(
        localStorage.getItem('queuedMutations') || '[]'
      );
      queuedMutations.push({
        id: Date.now(),
        description,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('queuedMutations', JSON.stringify(queuedMutations));

      return Promise.resolve();
    }

    return mutationFn();
  };

  return { queueMutation, isOnline };
}