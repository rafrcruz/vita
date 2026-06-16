import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env';
import { AppError } from '../middleware/error';

function oauthConfig() {
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  const redirectUri = env.OAUTH_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new AppError(500, 'oauth_not_configured', 'Autenticação Google não configurada.');
  }
  return { clientId, clientSecret, redirectUri };
}

export function createOAuthClient(): OAuth2Client {
  const { clientId, clientSecret, redirectUri } = oauthConfig();
  return new OAuth2Client({ clientId, clientSecret, redirectUri });
}

/** URL de consentimento do Google (fluxo Authorization Code). */
export function buildAuthUrl(state: string): string {
  return createOAuthClient().generateAuthUrl({
    access_type: 'online',
    scope: ['openid', 'email', 'profile'],
    state,
    prompt: 'select_account',
  });
}

/** Troca o código por tokens, verifica o id_token e retorna o e-mail verificado. */
export async function exchangeCodeForEmail(
  code: string
): Promise<{ email: string; emailVerified: boolean }> {
  const { clientId } = oauthConfig();
  const client = createOAuthClient();
  const { tokens } = await client.getToken(code);
  if (!tokens.id_token) {
    throw new AppError(401, 'oauth_error', 'Token de identidade ausente.');
  }
  const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: clientId });
  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new AppError(401, 'oauth_error', 'E-mail não retornado pelo Google.');
  }
  return { email: payload.email, emailVerified: payload.email_verified ?? false };
}
