import type { RequestHandler } from 'express';
import { AppError } from './error';
import { env } from '../config/env';

/**
 * Custom CSRF protection middleware.
 * Validates the Origin and Referer headers for state-changing requests.
 */
export const csrfProtection: RequestHandler = (req, res, next) => {
  // Bypass in test environment to allow integration tests (supertest)
  if (env.NODE_ENV === 'test') {
    next();
    return;
  }

  // Safe methods do not require CSRF protection
  if (['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(req.method)) {
    next();
    return;
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // Helper to validate origin string
  const isValidOrigin = (originString: string) => {
    return (
      originString === env.WEB_ORIGIN ||
      originString === 'http://localhost:5173' ||
      /^https:\/\/vita-web.*\.vercel\.app$/.test(originString)
    );
  };

  // 1. Verify Origin header if present
  if (origin) {
    if (!isValidOrigin(origin)) {
      next(new AppError(403, 'forbidden', 'CSRF validation failed: invalid origin.'));
      return;
    }
    next();
    return;
  }

  // 2. Fallback to Referer header if Origin is not present
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (!isValidOrigin(refererUrl.origin)) {
        next(new AppError(403, 'forbidden', 'CSRF validation failed: invalid referer.'));
        return;
      }
      next();
      return;
    } catch {
      next(new AppError(403, 'forbidden', 'CSRF validation failed: malformed referer.'));
      return;
    }
  }

  // If neither Origin nor Referer is present, block the state-changing request
  next(new AppError(403, 'forbidden', 'CSRF validation failed: missing origin/referer headers.'));
};

/**
 * Simple in-memory sliding window rate limiter.
 * Prevents brute force and flooding.
 */
const ipStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter: RequestHandler = (req, res, next) => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 100; // max 100 requests per minute

  const record = ipStore.get(ip);

  if (!record || now > record.resetTime) {
    ipStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    next();
    return;
  }

  record.count += 1;
  if (record.count > maxRequests) {
    next(new AppError(429, 'too-many-requests', 'Muitas requisições. Tente novamente mais tarde.'));
    return;
  }

  next();
};
