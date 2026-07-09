import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/response';

/**
 * Validates a request against a single Zod schema shaped like:
 *   z.object({ body: z.object({...}), params: z.object({...}), query: z.object({...}) })
 * Every entry in validators/* follows this shape, so validation is one
 * combined parse against { body, params, query } rather than three separate ones.
 */
export function validateRequest(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        throw result.error;
      }

      // Apply any coercion/defaults Zod produced back onto the request.
      const parsed = result.data as { body?: unknown; query?: unknown; params?: unknown };
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query as typeof req.query;
      if (parsed.params !== undefined) req.params = parsed.params as typeof req.params;

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