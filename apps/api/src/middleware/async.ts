import type { RequestHandler } from 'express';

// Encaminha rejeições de handlers async para o error handler (Express 4 não faz isso sozinho).
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
