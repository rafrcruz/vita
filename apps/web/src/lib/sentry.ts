import * as Sentry from '@sentry/react';

/** Inicializa o Sentry no frontend, se houver DSN (graceful no-op caso contrário). */
export function initWebSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}
