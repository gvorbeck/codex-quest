import { logger } from "./logger";

export interface ServiceErrorOptions {
  action: string;
  context?: Record<string, unknown>;
  fallbackMessage?: string;
}

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