import { PostgrestError } from '@supabase/supabase-js';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleSupabaseError(error: PostgrestError): AppError {
  console.error('💿⚠️ Supabase error:', error);

  switch (error.code) {
    case '42501':
      return new AppError(
        'Permission denied. Please check your access rights.',
        error.code,
        'Row Level Security policy violation'
      );
    case '23503':
      return new AppError(
        'Referenced record not found. Please try again.',
        error.code,
        error.details
      );
    case '23505':
      return new AppError(
        'A record with this name already exists.',
        error.code,
        error.details
      );
    default:
      return new AppError(
        'An unexpected error occurred. Please try again.',
        error.code,
        error.details
      );
  }
}

export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const errorDetails = {
    timestamp,
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AppError && {
        code: error.code,
        details: error.details
      })
    } : error
  };

  console.error('🎛️ Application error:', errorDetails);
}