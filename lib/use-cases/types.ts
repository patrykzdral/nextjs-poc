// Base use case interface
export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput> | TOutput;
}

// Result type for use cases with error handling
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Common error types
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class BusinessRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleError';
  }
}
