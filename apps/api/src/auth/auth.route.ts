import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import type { CurrentUser } from '@vita/shared';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../middleware/error';
import { isProduction } from '../config/env';
import { getRole } from '../allowlist/allowlist.service';
import { buildAuthUrl, exchangeCodeForEmail } from './google';
import { requireAuth } from './middleware';
import { SESSION_COOKIE_NAME, issueSessionToken, sessionCookieOptions } from './session';

export const authRouter: Router = Router();

const OAUTH_STATE_COOKIE = 'vita_oauth_state';
const stateCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 10 * 60 * 1000, // 10 min
};

// Inicia o fluxo OAuth: gera state (CSRF), guarda em cookie e redireciona ao Google.
authRouter.get(
  '/google',
  asyncHandler(async (_req, res) => {
    const state = randomBytes(16).toString('hex');
    res.cookie(OAUTH_STATE_COOKIE, state, stateCookieOptions);
    res.redirect(buildAuthUrl(state));
  })
);

// Callback do Google: valida state, troca o código, checa a allowlist e emite a sessão.
authRouter.get(
  '/google/callback',
  asyncHandler(async (req, res) => {
    const code = req.query.code as string | undefined;
    const state = req.query.state as string | undefined;
    const cookieState = req.cookies?.[OAUTH_STATE_COOKIE] as string | undefined;

    if (!code || !state || !cookieState || state !== cookieState) {
      throw new AppError(403, 'invalid_state', 'Estado OAuth inválido.');
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: '/' });

    const { email, emailVerified } = await exchangeCodeForEmail(code);
    if (!emailVerified) {
      throw new AppError(403, 'email_unverified', 'E-mail do Google não verificado.');
    }

    const role = await getRole(email);
    if (!role) {
      // Fora da allowlist: acesso negado (FR-011).
      res
        .status(403)
        .type('html')
        .send(
          '<!doctype html><meta charset="utf-8"><p>Acesso não autorizado para este e-mail.</p><a href="/login">Voltar</a>'
        );
      return;
    }

    const token = await issueSessionToken({ sub: email.toLowerCase(), role });
    res.cookie(SESSION_COOKIE_NAME, token, sessionCookieOptions());
    res.redirect('/');
  })
);

// Usuário da sessão atual.
authRouter.get('/me', requireAuth, (req, res) => {
  const user: CurrentUser = req.user!;
  res.json(user);
});

// Logout: limpa o cookie de sessão.
authRouter.post('/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
  res.status(204).end();
});
