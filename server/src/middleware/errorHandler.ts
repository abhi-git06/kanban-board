import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { ApiError } from '../utils/response';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response | void {
  // Operational errors we expect (validation, auth, not found)
  if (err instanceof ApiError) {
    logger.warn(err.message, {
      statusCode: err.statusCode,
      code: err.code,
      stack: err.stack,
    });
    return sendError(res, err.message, err.statusCode, err.code, err.details);
  }

  // Prisma errors
  if (err.name?.startsWith('Prisma')) {
    logger.error('Prisma error', { message: err.message, stack: err.stack });

    // Unique constraint violation
    if (err.message.includes('Unique constraint failed')) {
      return sendError(res, 'A record with this value already exists.', 409, 'CONFLICT');
    }

    // Foreign key constraint
    if (err.message.includes('Foreign key constraint failed')) {
      return sendError(res, 'Referenced record does not exist.', 422, 'UNPROCESSABLE_ENTITY');
    }

    // Record not found
    if (err.message.includes('Record to delete does not exist') || err.message.includes('Record to update does not exist')) {
      return sendError(res, 'Record not found.', 404, 'NOT_FOUND');
    }

    return sendError(res, 'Database error occurred.', 500, 'DATABASE_ERROR');
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    logger.warn('Validation error', { message: err.message });
    return sendError(res, 'Invalid request data.', 400, 'VALIDATION_ERROR', (err as any).issues);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    logger.warn('JWT error', { message: err.message });
    return sendError(res, 'Invalid or expired token.', 401, 'UNAUTHORIZED');
  }

  // Unexpected errors — don't leak stack trace in production
  logger.error('Unexpected error', { message: err.message, stack: err.stack });
  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message,
    500,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV !== 'production' ? err.stack : undefined
  );
}