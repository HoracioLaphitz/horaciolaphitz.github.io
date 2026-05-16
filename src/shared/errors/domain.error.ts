/**
 * Domain Error Types
 * Typed errors for better error handling and debugging
 */

/**
 * Base domain error class
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "DomainError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Error when a project is not found
 */
export class ProjectNotFoundError extends DomainError {
  constructor(slug: string) {
    super(`Project with slug "${slug}" not found`, "PROJECT_NOT_FOUND", {
      slug,
    });
    this.name = "ProjectNotFoundError";
  }
}

/**
 * Error when repository operations fail
 */
export class RepositoryError extends DomainError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "REPOSITORY_ERROR", context);
    this.name = "RepositoryError";
  }
}

/**
 * Error when data validation fails
 */
export class ValidationError extends DomainError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", context);
    this.name = "ValidationError";
  }
}

/**
 * Error when external API calls fail
 */
export class ExternalAPIError extends DomainError {
  constructor(
    service: string,
    message: string,
    context?: Record<string, unknown>
  ) {
    super(`${service} API error: ${message}`, "EXTERNAL_API_ERROR", {
      service,
      ...context,
    });
    this.name = "ExternalAPIError";
  }
}

/**
 * Type guard to check if error is a DomainError
 */
export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}
