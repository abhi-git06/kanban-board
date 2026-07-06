import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/response';

interface ValidationSchema {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validateRequest(schema: ValidationSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        const result = schema.body.safeParse(req.body);
        if (!result.success) {
          throw new ZodError(result.error.issues);
        }
      }
      if (schema.query) {
        const result = schema.query.safeParse(req.query);
        if (!result.success) {
          throw new ZodError(result.error.issues);
        }
      }
      if (schema.params) {
        const result = schema.params.safeParse(req.params);
        if (!result.success) {
          throw new ZodError(result.error.issues);
        }
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        next(new ApiError('Validation failed', 400, 'VALIDATION_ERROR', issues));
      } else {
        next(error);
      }
    }
  };
}