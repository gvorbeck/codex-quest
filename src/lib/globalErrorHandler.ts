import { QueryClient } from "@tanstack/react-query";
import type { NotificationSystem } from "@/types";
import { logger } from "@/utils";

/**
 * Global error handler for TanStack Query and application errors
 * Provides consistent error handling, user feedback, and retry mechanisms
 */
export class GlobalErrorHandler {
  private notifications: NotificationSystem;

  constructor(notifications: NotificationSystem) {
    this.notifications = notifications;
  }

  /**
   * Handle query errors with user-friendly messages
   */
  handleQueryError = (error: Error, context?: { entityType?: string }) => {
    logger.error("Query error:", error);

    // Determine appropriate error message based on error type
    let userMessage = "Something went wrong. Please try again.";
    let title = "Error";

    if (this.isNetworkError(error)) {
      userMessage = "Network connection problem. Please check your internet connection.";
      title = "Connection Error";
    } else if (this.isAuthError(error)) {
      userMessage = "Authentication failed. Please sign in again.";
      title = "Authentication Error";
    } else if (this.isPermissionError(error)) {
      userMessage = "You don't have permission to perform this action.";
      title = "Permission Denied";
    } else if (context?.entityType) {
      userMessage = `Failed to load ${context.entityType}. Please try again.`;
      title = `${context.entityType} Error`;
    }

    this.notifications.showError(userMessage, { title });
  };

  /**
   * Handle mutation errors with context-aware messages
   */
  handleMutationError = (
    error: Error,
    context: {
      operation: string;
      entityType?: string;
      entityName?: string;
    }
  ) => {
    logger.error(`${context.operation} error:`, error);

    let userMessage = `Failed to ${context.operation.toLowerCase()}. Please try again.`;
    let title = `${context.operation} Failed`;

    if (context.entityType && context.entityName) {
      userMessage = `Failed to ${context.operation.toLowerCase()} ${context.entityType} "${context.entityName}".`;
      title = `${context.operation} ${context.entityType} Failed`;
    } else if (context.entityType) {
      userMessage = `Failed to ${context.operation.toLowerCase()} ${context.entityType}.`;
      title = `${context.operation} ${context.entityType} Failed`;
    }

    // Add specific handling for common errors
    if (this.isNetworkError(error)) {
      userMessage += " Please check your internet connection.";
    } else if (this.isValidationError(error)) {
      userMessage = "Please check your input and try again.";
      title = "Validation Error";
    }

    this.notifications.showError(userMessage, { title, duration: 0 }); // Errors don't auto-dismiss
  };

  /**
   * Handle mutation success with appropriate feedback
   */
  handleMutationSuccess = (
    context: {
      operation: string;
      entityType?: string;
      entityName?: string;
    }
  ) => {
    let message = `${context.operation} completed successfully.`;

    if (context.entityType && context.entityName) {
      message = `${context.entityType} "${context.entityName}" ${context.operation.toLowerCase()}d successfully.`;
    } else if (context.entityType) {
      message = `${context.entityType} ${context.operation.toLowerCase()}d successfully.`;
    }

    this.notifications.showSuccess(message, { duration: 4000 });
  };

  /**
   * Handle offline state and retry mechanisms
   */
  handleOfflineError = () => {
    this.notifications.showWarning(
      "You're currently offline. Changes will be saved when you reconnect.",
      {
        title: "Offline Mode",
        duration: 0 // Keep visible until online
      }
    );
  };

  /**
   * Handle retry attempts
   */
  handleRetryAttempt = (attempt: number, maxRetries: number) => {
    if (attempt === 1) {
      this.notifications.showInfo(
        `Retrying... (${attempt}/${maxRetries})`,
        { duration: 2000 }
      );
    }
  };

  /**
   * Clear all error notifications (useful for successful operations)
   */
  clearErrorNotifications = () => {
    // This would require tracking error notification IDs
    // For now, we rely on success messages to indicate resolution
  };

  /**
   * Error type detection helpers
   */
  private isNetworkError(error: Error): boolean {
    return (
      error.message.includes('NetworkError') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('ERR_NETWORK') ||
      error.name === 'NetworkError'
    );
  }

  private isAuthError(error: Error): boolean {
    const errorObj = error as unknown as Record<string, unknown>;
    return (
      error.message.includes('auth/') ||
      error.message.includes('unauthorized') ||
      error.message.includes('Authentication') ||
      (errorObj['code']?.toString().startsWith('auth/') ?? false)
    );
  }

  private isPermissionError(error: Error): boolean {
    const errorObj = error as unknown as Record<string, unknown>;
    return (
      error.message.includes('permission') ||
      error.message.includes('forbidden') ||
      error.message.includes('access denied') ||
      errorObj['status'] === 403
    );
  }

  private isValidationError(error: Error): boolean {
    const errorObj = error as unknown as Record<string, unknown>;
    return (
      error.message.includes('validation') ||
      error.message.includes('invalid') ||
      error.message.includes('required') ||
      errorObj['status'] === 400
    );
  }
}

/**
 * Enhanced query client with global error handling
 */
export function createEnhancedQueryClient(notifications: NotificationSystem): QueryClient {
  const errorHandler = new GlobalErrorHandler(notifications);

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
          // Don't retry on auth/permission errors
          if (errorHandler['isAuthError'](error) || errorHandler['isPermissionError'](error)) {
            return false;
          }

          // Don't retry on validation errors
          if (errorHandler['isValidationError'](error)) {
            return false;
          }

          // Retry network errors up to 3 times
          if (errorHandler['isNetworkError'](error)) {
            if (failureCount < 3) {
              errorHandler.handleRetryAttempt(failureCount + 1, 3);
              return true;
            }
          }

          return failureCount < 2; // Default retry once
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      },
      mutations: {
        retry: (failureCount, error) => {
          // Only retry network errors for mutations
          if (errorHandler['isNetworkError'](error)) {
            return failureCount < 1;
          }
          return false;
        },
      },
    },
  });
}

/**
 * Hook factory for creating mutation handlers with consistent error handling
 */
export function createMutationHandlers(notifications: NotificationSystem) {
  const errorHandler = new GlobalErrorHandler(notifications);

  return {
    onError: errorHandler.handleMutationError,
    onSuccess: errorHandler.handleMutationSuccess,
    queryError: errorHandler.handleQueryError,
    offlineError: errorHandler.handleOfflineError,
  };
}