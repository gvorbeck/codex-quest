/**
 * Data utilities - consolidated from currency.ts, sanitization.ts, logger.ts, serviceErrorHandler.ts, and gmBinderUtils.ts
 * Contains currency conversion, data sanitization, logging, error handling, and GMBinder utilities
 */
import {
  SPELL_CATEGORIES,
  SPELL_LEVEL_THRESHOLDS,
  MONSTER_CATEGORIES,
  MONSTER_NAME_PATTERNS,
} from "@/constants";
import type { Monster, Spell, ServiceErrorOptions } from "@/types";

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Generate a unique ID for mock mode
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

// ============================================================================
// LOGGING
// ============================================================================

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
        // eslint-disable-next-line no-console
        console.error(message, ...args),
      warn: () => {}, // Silent in production
      info: () => {}, // Silent in production
      debug: () => {}, // Silent in production
    };
  }

  // In development, log everything
  return {
    error: (message: string, ...args: unknown[]) =>
      // eslint-disable-next-line no-console
      console.error(message, ...args),
    warn: (message: string, ...args: unknown[]) =>
      // eslint-disable-next-line no-console
      console.warn(message, ...args),
    info: (message: string, ...args: unknown[]) =>
      // eslint-disable-next-line no-console
      console.log(message, ...args),
    debug: (message: string, ...args: unknown[]) =>
      // eslint-disable-next-line no-console
      console.debug(message, ...args),
  };
};

export const logger = createLogger();

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class ServiceError extends Error {
  public readonly action: string;
  public readonly context: Record<string, unknown> | undefined;
  public readonly originalError: unknown;

  constructor(
    action: string,
    originalError: unknown,
    context?: Record<string, unknown>,
    fallbackMessage?: string
  ) {
    const message = fallbackMessage || `Failed to ${action}`;
    super(message);
    this.name = "ServiceError";
    this.action = action;
    this.originalError = originalError;
    this.context = context;
  }
}

export function handleServiceError(
  error: unknown,
  options: ServiceErrorOptions
): never {
  const { action, context, fallbackMessage } = options;

  logger.error(`Error ${action}:`, error);

  throw new ServiceError(action, error, context, fallbackMessage);
}

export function handleServiceErrorAsync<T>(
  asyncFn: () => Promise<T>,
  options: ServiceErrorOptions
): Promise<T> {
  return asyncFn().catch((error) => {
    handleServiceError(error, options);
  });
}

/**
 * Extracts error message from unknown error type
 * Always returns a string for consistent error handling across components
 */
export function getErrorMessage(
  error: unknown,
  fallbackMessage: string = "An unexpected error occurred"
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallbackMessage;
}

// ============================================================================
// DATA SANITIZATION
// ============================================================================

function stripHtml(html: string): string {
  // Remove HTML tags using regex (safer than innerHTML)
  return html.replace(/<[^>]*>/g, "");
}

export function sanitizeCharacterName(name: string): string {
  // Remove any HTML tags first
  const plainText = stripHtml(name);

  // Allow only letters, spaces, hyphens, apostrophes, and periods
  // This matches the validation schema pattern
  return plainText.replace(/[^a-zA-Z\s\-'.]/g, "").trim();
}

// ============================================================================
// GMBINDER UTILITIES
// ============================================================================

export function categorizeSpell(spell: Spell): string {
  const levels = Object.values(spell.level).filter((level) => level !== null);
  const maxLevel = Math.max(...(levels as number[]));

  if (maxLevel <= SPELL_LEVEL_THRESHOLDS.LOW_MAX) {
    return SPELL_CATEGORIES.LOW_LEVEL;
  }

  if (maxLevel <= SPELL_LEVEL_THRESHOLDS.MID_MAX) {
    return SPELL_CATEGORIES.MID_LEVEL;
  }

  if (maxLevel <= SPELL_LEVEL_THRESHOLDS.HIGH_5_6_MAX) {
    return SPELL_CATEGORIES.HIGH_LEVEL_5_6;
  }

  return SPELL_CATEGORIES.HIGH_LEVEL_7_9;
}

export function categorizeMonster(monster: Monster): string {
  const name = monster.name.toLowerCase();

  // Check each category's patterns
  for (const [category, patterns] of Object.entries(MONSTER_NAME_PATTERNS)) {
    if (patterns.some((pattern) => name.includes(pattern))) {
      return category;
    }
  }

  // Default category if no patterns match
  return MONSTER_CATEGORIES.MISCELLANEOUS;
}

export function createSearchableText(monster: Monster): string {
  return [
    monster.name,
    ...(monster.variants || [])
      .map(([variantName]) => variantName)
      .filter(Boolean),
  ]
    .join(" ")
    .toLowerCase();
}
