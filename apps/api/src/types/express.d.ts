import type { CurrentUser } from '@vita/shared';

// Anexa o usuário autenticado à requisição (preenchido por requireAuth).
declare global {
  namespace Express {
    interface Request {
      user?: CurrentUser;
    }
  }
}

export {};
