import type { RequestHandler } from 'express';
import { AppError } from '../middleware/error';
import { SESSION_COOKIE_NAME, verifySessionToken } from './session';

/** Exige uma sessão válida; popula req.user ou responde 401. */
export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME] as string | undefined;
  if (!token) {
    next(new AppError(401, 'unauthenticated', 'Autenticação necessária.'));
    return;
  }
  try {
    const claims = await verifySessionToken(token);
    req.user = { email: claims.sub, role: claims.role };
    next();
  } catch {
    next(new AppError(401, 'unauthenticated', 'Sessão inválida ou expirada.'));
  }
};

/** Exige sessão válida E papel de administrador; senão 401/403. */
export const requireAdmin: RequestHandler = (req, res, next) => {
  requireAuth(req, res, (err?: unknown) => {
    if (err) {
      next(err);
      return;
    }
    if (req.user?.role !== 'admin') {
      next(new AppError(403, 'forbidden', 'Acesso restrito a administradores.'));
      return;
    }
    next();
  });
};
