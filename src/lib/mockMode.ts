/**
 * Mock mode detection and configuration
 * Automatically enables mock Firebase services when credentials aren't available
 */

/**
 * Determines if the app should run in mock mode
 * Mock mode is enabled when:
 * 1. VITE_MOCK_FIREBASE is explicitly set to "true", OR
 * 2. Firebase API key is not configured (for contributor onboarding)
 */
export const isMockMode = (): boolean => {
  // Allow explicit override
  if (import.meta.env["VITE_MOCK_FIREBASE"] === "true") {
    return true;
  }

  // Auto-detect missing Firebase configuration
  if (!import.meta.env["VITE_FIREBASE_API_KEY"]) {
    return true;
  }

  return false;
};

/**
 * Get the current mode for logging and debugging
 */
export const getCurrentMode = (): 'mock' | 'firebase' => {
  return isMockMode() ? 'mock' : 'firebase';
};

/**
 * Log the current mode for debugging
 */
export const logCurrentMode = (): void => {
  const mode = getCurrentMode();

  if (typeof window !== 'undefined') {
    import("@/utils").then(({ logger }) => {
      logger.info(`🔧 Running in ${mode} mode`);

      if (mode === 'mock') {
        logger.info('📝 Mock mode active - using localStorage for data persistence');
        logger.info('🚀 Perfect for development and contributor onboarding!');
      }
    });
  }
};