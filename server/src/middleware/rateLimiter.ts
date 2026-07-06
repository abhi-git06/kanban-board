import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/response';
import { logger } from '../utils/logger';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

interface ClientRecord {
  count: number;
  resetTime: number;
}

const clients = new Map<string, ClientRecord>();

function getClientKey(req: Request): string {
  return req.ip || 'unknown';
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, record] of clients.entries()) {
    if (now > record.resetTime) {
      clients.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

export function createRateLimiter(config: RateLimitConfig) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const key = getClientKey(req);
    const now = Date.now();

    let record = clients.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      clients.set(key, record);
      return next();
    }

    record.count++;

    if (record.count > config.maxRequests) {
      logger.warn('Rate limit exceeded', { ip: key, path: req.path, count: record.count });
      throw new ApiError(
        config.message || 'Too many requests, please try again later.',
        429,
        'RATE_LIMIT_EXCEEDED'
      );
    }

    next();
  };
}

// Pre-configured limiters
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  message: 'Too many requests. Please slow down.',
});