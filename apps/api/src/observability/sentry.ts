import * as Sentry from '@sentry/node';
import { env } from '../config/env';

let initialized = false;

/** Inicializa o Sentry no backend, se houver DSN. No-op caso contrário (graceful). */
export function initSentry(): boolean {
  if (initialized || !env.SENTRY_DSN) return false;
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    beforeSend(event) {
      // Scrubbing extra: nunca enviar cookies/headers sensíveis.
      if (event.request?.cookies) delete event.request.cookies;
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      return event;
    },
  });
  initialized = true;
  return true;
}

/** Captura uma exceção no Sentry (no-op se não inicializado). */
export function captureException(err: unknown): void {
  if (initialized) Sentry.captureException(err);
}
