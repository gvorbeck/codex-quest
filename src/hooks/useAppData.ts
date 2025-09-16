import { useEffect } from "react";
import { preloadCriticalData } from "@/services";
import { logger } from "@/utils";

export function useAppData() {
  useEffect(() => {
    preloadCriticalData().catch((error) => {
      logger.warn("Failed to preload critical data:", error);
    });
  }, []);
}
