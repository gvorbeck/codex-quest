import { useState } from "react";

/**
 * Custom hook to manage loading state for list components during initial mount and data fetching
 *
 * This hook ensures that loading skeletons are shown:
 * 1. On initial component mount (prevents flash of empty state)
 * 2. During initial data loading
 * 3. When fetching data and no cached data is available
 *
 * @param isLoading - Whether the query is in initial loading state
 * @param isFetching - Whether the query is currently fetching (includes background refetch)
 * @param hasData - Whether any data is currently available
 * @returns boolean indicating whether loading skeleton should be shown
 */
export function useInitialLoadingState(
  isLoading: boolean,
  isFetching: boolean,
  hasData: boolean
): boolean {
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [prevIsLoading, setPrevIsLoading] = useState(isLoading);
  const [prevIsFetching, setPrevIsFetching] = useState(isFetching);

  // Adjust state during render when loading state changes
  // This is the React-recommended pattern for derived state
  if (isLoading !== prevIsLoading || isFetching !== prevIsFetching) {
    setPrevIsLoading(isLoading);
    setPrevIsFetching(isFetching);
    if (!isLoading && !isFetching && isInitialMount) {
      setIsInitialMount(false);
    }
  }

  return isInitialMount || isLoading || (isFetching && !hasData);
}
