import { useEffect, useRef } from "react";

/**
 * Hook for monitoring component render performance in development
 * Logs render times and re-render counts to help identify performance bottlenecks
 */
export function usePerformanceMonitor(
  componentName: string,
  enabled = process.env.NODE_ENV === "development"
) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    renderCountRef.current += 1;
    const currentTime = performance.now();
    const renderTime = currentTime - lastRenderTimeRef.current;

    // Log performance metrics
    if (renderCountRef.current > 1) {
      console.log(
        `🔍 ${componentName} render #${
          renderCountRef.current
        } took ${renderTime.toFixed(2)}ms`
      );
    }

    lastRenderTimeRef.current = currentTime;
  });

  useEffect(() => {
    if (!enabled) return;

    return () => {
      console.log(
        `📊 ${componentName} rendered ${renderCountRef.current} times total`
      );
    };
  }, [componentName, enabled]);

  return {
    renderCount: renderCountRef.current,
  };
}
