// Simple logger utility that can be configured for production
// type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface Logger {
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

const isDevelopment = import.meta.env.DEV;

const createLogger = (): Logger => {
  if (!isDevelopment) {
    // In production, only log errors
    return {
      error: (message: string, ...args: unknown[]) =>
        console.error(message, ...args),
      warn: () => {}, // Silent in production
      info: () => {}, // Silent in production
      debug: () => {}, // Silent in production
    };
  }

  // In development, log everything
  return {
    error: (message: string, ...args: unknown[]) =>
      console.error(message, ...args),
    warn: (message: string, ...args: unknown[]) =>
      console.warn(message, ...args),
    info: (message: string, ...args: unknown[]) =>
      console.log(message, ...args),
    debug: (message: string, ...args: unknown[]) =>
      console.debug(message, ...args),
  };
};

export const logger = createLogger();
