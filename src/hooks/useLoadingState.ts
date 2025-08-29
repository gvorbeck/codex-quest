import { useState, useCallback } from "react";

export interface UseLoadingStateOptions {
  initialState?: boolean;
}

export interface LoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

/**
 * Standardized hook for managing loading states across the application.
 * Provides consistent naming and utility methods for common loading patterns.
 */
export function useLoadingState(options: UseLoadingStateOptions = {}): LoadingState {
  const { initialState = false } = options;
  const [loading, setLoading] = useState<boolean>(initialState);

  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}