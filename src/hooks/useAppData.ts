import { useEffect } from "react";
import { preloadCriticalData } from "@/services/dataLoader";
import { logger } from "@/utils/logger";

export function useAppData() {
  useEffect(() => {
    preloadCriticalData().catch((error) => {
      logger.warn("Failed to preload critical data:", error);
    });
  }, []);
}