import type { CookieOptions } from 'express';
import { SignJWT, jwtVerify } from 'jose';
import type { Role } from '@vita/shared';
import { env, isProduction } from '../config/env';

const secret = new TextEncoder().encode(env.JWT_SECRET);
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12h

export const SESSION_COOKIE_NAME = env.SESSION_COOKIE_NAME;

export type SessionClaims = { sub: string; role: Role };

/** Emite um JWT de sessão assinado (stateless). */
export async function issueSessionToken(claims: SessionClaims): Promise<string> {
  return new SignJWT({ role: claims.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret);
}

/** Verifica o JWT de sessão; lança se inválido/expirado. */
export async function verifySessionToken(token: string): Promise<SessionClaims> {
  const { payload } = await jwtVerify(token, secret);
  return { sub: String(payload.sub), role: payload.role as Role };
}

/** Opções do cookie de sessão (httpOnly/Secure/SameSite=Lax). */
export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS * 1000,
  };
}
