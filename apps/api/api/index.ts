import { initSentry } from '../src/observability/sentry';
import { createApp } from '../src/app';

// Inicializa observabilidade antes de criar a app.
initSentry();

// Handler serverless da Vercel: exporta a app Express. O vercel.json reescreve
// todas as rotas para esta função, que roteia internamente (rotas sob /api).
export default createApp();
