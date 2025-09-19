import { QueryClient } from "@tanstack/react-query";

// Basic query client for initialization - will be enhanced with error handling in App.tsx
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (auth, permissions)
        if (
          error &&
          "status" in error &&
          typeof error.status === "number" &&
          error.status >= 400 &&
          error.status < 500
        )
          return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});
